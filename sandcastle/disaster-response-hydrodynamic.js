// Shizuoka Disaster Response + Hydrodynamic Simulation
// Paste into https://sandcastle.cesium.com/ JS panel.

(async function () {
  const SHIZUOKA_CENTER = { lon: 138.3831, lat: 34.9769, height: 1800.0 };
  const WATER_GAUGE_LON = 138.3852;
  const WATER_GAUGE_LAT = 34.9811;
  // PLATEAU 2023 official Shizuoka City 3D Tiles (MLIT — no auth required)
  const PLATEAU_BLDG_AOI_LOD2 =
    "https://assets.cms.plateau.reearth.io/assets/16/f01621-f72d-4c64-9c40-67c97cee7c5f/22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22101_aoi-ku_lod2/tileset.json";
  const PLATEAU_BLDG_SURUGA_LOD1 =
    "https://assets.cms.plateau.reearth.io/assets/18/aba17e-da3b-441d-9712-a6db88f3e6c5/22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22102_suruga-ku_lod1/tileset.json";
  const PLATEAU_BLDG_SHIMIZU_LOD1 =
    "https://assets.cms.plateau.reearth.io/assets/db/4e7d98-7baf-4fae-bf13-3c98fd53cf32/22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22103_shimizu-ku_lod1/tileset.json";
  // Abe River flood inundation area: L1 = 100-yr flood, L2 = worst-case maximum scenario
  const PLATEAU_FLOOD_L1_URL =
    "https://assets.cms.plateau.reearth.io/assets/41/edaf1e-f484-4ed4-9084-dbcede6352d5/22100_shizuoka-shi_city_2023_citygml_3_op_fld_natl_abegawa_abegawa-warasinagawa_3dtiles_l1_no_texture/tileset.json";
  const PLATEAU_FLOOD_L2_URL =
    "https://assets.cms.plateau.reearth.io/assets/23/720679-10c9-46e4-9ab6-4a76ada7566c/22100_shizuoka-shi_city_2023_citygml_3_op_fld_natl_abegawa_abegawa-warasinagawa_3dtiles_l2_no_texture/tileset.json";
  const GSI_SEAMLESS_PHOTO_URL =
    "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";
  const GSI_STD_MAP_URL = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
  const GSI_FLOOD_DEPTH_URL =
    "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png";
  // Keep off by default in Sandcastle to avoid noisy 404s from sparse/partial GSI coverage.
  const ENABLE_GSI_RASTER_OVERLAYS = false;
  // Higher cache budget avoids repeated "memoryAdjustedScreenSpaceError" warnings
  // when multiple PLATEAU tilesets are visible at once.
  const TILESET_CACHE_BYTES = 768 * 1024 * 1024;
  const TILESET_CACHE_OVERFLOW_BYTES = 512 * 1024 * 1024;

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    timeline: true,
    animation: true,
    baseLayerPicker: true,
    shadows: false,
    sceneModePicker: false,
    geocoder: false,
  });

  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.showGroundAtmosphere = true;
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0e131e");
  viewer.shadows = false;
  if (viewer.scene.shadowMap) {
    viewer.scene.shadowMap.enabled = false;
  }

  // Japan bounding box — GSI tiles only exist within this region
  const JAPAN_RECT = Cesium.Rectangle.fromDegrees(122.93, 20.4, 154.0, 45.6);

  viewer.imageryLayers.removeAll();
  const osmBase = viewer.imageryLayers.addImageryProvider(
    new Cesium.OpenStreetMapImageryProvider({
      url: "https://tile.openstreetmap.org/",
      credit: "© OpenStreetMap contributors",
    })
  );
  osmBase.alpha = 1.0;

  let floodDepth = null;
  if (ENABLE_GSI_RASTER_OVERLAYS) {
    const stdMap = viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: GSI_STD_MAP_URL,
        credit: "地理院タイル",
        minimumLevel: 5,
        maximumLevel: 18,
        rectangle: JAPAN_RECT,
      })
    );
    stdMap.alpha = 0.35;
    viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: GSI_SEAMLESS_PHOTO_URL,
        credit: "国土地理院 シームレス写真",
        minimumLevel: 5,
        maximumLevel: 18,
        rectangle: JAPAN_RECT,
      })
    );
    floodDepth = viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: GSI_FLOOD_DEPTH_URL,
        credit: "国土地理院 重ねるハザードマップ",
        minimumLevel: 5,
        maximumLevel: 14,
        rectangle: JAPAN_RECT,
      })
    );
    floodDepth.alpha = 0.42;
  }

  function configureTileset(ts, options) {
    const opts = options || {};
    ts.maximumScreenSpaceError = opts.maximumScreenSpaceError || 32;
    ts.cacheBytes = TILESET_CACHE_BYTES;
    ts.maximumCacheOverflowBytes = TILESET_CACHE_OVERFLOW_BYTES;
    ts.skipLevelOfDetail = true;
    ts.preferLeaves = true;
    ts.cullWithChildrenBounds = true;
  }

  // Load official PLATEAU building models — replaces generic OSM buildings
  const plateauBuildingTilesets = [];
  for (const [label, url] of [
    ["Aoi LOD2", PLATEAU_BLDG_AOI_LOD2],
    ["Suruga LOD1", PLATEAU_BLDG_SURUGA_LOD1],
    ["Shimizu LOD1", PLATEAU_BLDG_SHIMIZU_LOD1],
  ]) {
    try {
      const ts = await Cesium.Cesium3DTileset.fromUrl(url);
      configureTileset(ts, { maximumScreenSpaceError: 36 });
      viewer.scene.primitives.add(ts);
      plateauBuildingTilesets.push(ts);
    } catch (e) {
      console.warn("PLATEAU building tileset failed (" + label + "):", e);
    }
  }

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      SHIZUOKA_CENTER.lon,
      SHIZUOKA_CENTER.lat,
      SHIZUOKA_CENTER.height
    ),
    orientation: {
      heading: Cesium.Math.toRadians(25),
      pitch: Cesium.Math.toRadians(-38),
      roll: 0.0,
    },
  });

  if (false) { /* SHIZUOKA_3D_TILES_URL block removed — superseded by PLATEAU tilesets above */ }

  const start = Cesium.JulianDate.now();
  const stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
  viewer.clock.shouldAnimate = false;

  // Manual scenario ticker — bypasses Sandcastle's clock widget entirely.
  // 120 scenario-seconds per real second → 6 h plays in ~3 min real time.
  const SCENARIO_SPEED = 120;
  let scenarioRunning = false;
  let lastTickMs = null;

  viewer.scene.preUpdate.addEventListener(function () {
    if (!scenarioRunning) { lastTickMs = null; return; }
    const nowMs = performance.now();
    if (lastTickMs !== null) {
      const dtSec = (nowMs - lastTickMs) / 1000;
      const next = Cesium.JulianDate.addSeconds(
        viewer.clock.currentTime, dtSec * SCENARIO_SPEED, new Cesium.JulianDate()
      );
      if (Cesium.JulianDate.compare(next, stop) >= 0) {
        viewer.clock.currentTime = stop.clone();
        scenarioRunning = false;
      } else {
        viewer.clock.currentTime = next;
      }
    }
    lastTickMs = nowMs;
  });

  const waterSamples = [
    { tHours: 0, level: 1.5 },
    { tHours: 1, level: 2.2 },
    { tHours: 2, level: 3.0 },
    { tHours: 3, level: 3.9 },
    { tHours: 4, level: 3.1 },
    { tHours: 5, level: 2.6 },
    { tHours: 6, level: 1.9 },
  ];

  function getHydroLevel(currentTime) {
    const elapsedHours = Cesium.JulianDate.secondsDifference(currentTime, start) / 3600.0;
    for (let i = 0; i < waterSamples.length - 1; i += 1) {
      const a = waterSamples[i];
      const b = waterSamples[i + 1];
      if (elapsedHours >= a.tHours && elapsedHours <= b.tHours) {
        const alpha = (elapsedHours - a.tHours) / (b.tHours - a.tHours);
        return Cesium.Math.lerp(a.level, b.level, alpha);
      }
    }
    return waterSamples[waterSamples.length - 1].level;
  }

  function getDangerState(levelMeters) {
    if (levelMeters >= 3.5) {
      return { label: "Severe", color: Cesium.Color.RED, routeColor: Cesium.Color.RED };
    }
    if (levelMeters >= 2.8) {
      return { label: "High", color: Cesium.Color.ORANGE, routeColor: Cesium.Color.ORANGE };
    }
    if (levelMeters >= 2.1) {
      return { label: "Guarded", color: Cesium.Color.GOLD, routeColor: Cesium.Color.YELLOW };
    }
    return { label: "Low", color: Cesium.Color.LIME, routeColor: Cesium.Color.WHITE };
  }

  // PLATEAU flood inundation depth-rank style
  // uro:rank_code: 1=0-0.5 m, 2=0.5-3 m, 3=3-5 m, 4=5 m+
  function makeFloodStyle(baseAlpha) {
    return new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["${feature['uro:rank_code']} === 4", "color('#cc0000', " + baseAlpha + ")"],
          ["${feature['uro:rank_code']} === 3", "color('#ff4500', " + (baseAlpha * 0.9).toFixed(2) + ")"],
          ["${feature['uro:rank_code']} === 2", "color('#ff8c00', " + (baseAlpha * 0.85).toFixed(2) + ")"],
          ["${feature['uro:rank_code']} === 1", "color('#ffd700', " + (baseAlpha * 0.75).toFixed(2) + ")"],
          ["true", "color('#99ccff', " + (baseAlpha * 0.5).toFixed(2) + ")"],
        ],
      },
    });
  }

  let plateauFloodL1 = null;
  let plateauFloodL2 = null;
  let activeFloodTileset = null;

  try {
    plateauFloodL2 = await Cesium.Cesium3DTileset.fromUrl(PLATEAU_FLOOD_L2_URL);
    configureTileset(plateauFloodL2, { maximumScreenSpaceError: 20 });
    viewer.scene.primitives.add(plateauFloodL2);
    plateauFloodL2.style = makeFloodStyle(0.75);
    activeFloodTileset = plateauFloodL2;
  } catch (e) {
    console.warn("PLATEAU flood L2 failed:", e);
  }

  try {
    plateauFloodL1 = await Cesium.Cesium3DTileset.fromUrl(PLATEAU_FLOOD_L1_URL);
    configureTileset(plateauFloodL1, { maximumScreenSpaceError: 20 });
    viewer.scene.primitives.add(plateauFloodL1);
    plateauFloodL1.style = makeFloodStyle(0.75);
    plateauFloodL1.show = false;
  } catch (e) {
    console.warn("PLATEAU flood L1 failed:", e);
  }

  // Proxy flood entity used only for camera-fly focus (replaced by PLATEAU tilesets above)
  const floodEntity = viewer.entities.add({
    name: "_flood_proxy",
    position: Cesium.Cartesian3.fromDegrees(138.383, 34.977, 50),
    point: { show: false },
  });

  const waterGauge = viewer.entities.add({
    name: "Water gauge",
    position: Cesium.Cartesian3.fromDegrees(WATER_GAUGE_LON, WATER_GAUGE_LAT, 0),
    cylinder: {
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      length: new Cesium.CallbackProperty(function (time) {
        return 6 + getHydroLevel(time) * 12;
      }, false),
      topRadius: 10,
      bottomRadius: 10,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function (time) {
          return getDangerState(getHydroLevel(time)).color.withAlpha(0.85);
        }, false)
      ),
      outline: true,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
    },
    label: {
      text: new Cesium.CallbackProperty(function (time) {
        const level = getHydroLevel(time);
        const danger = getDangerState(level);
        return `Hydro: ${level.toFixed(2)} m  |  ${danger.label}`;
      }, false),
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.65),
      fillColor: Cesium.Color.WHITE,
      font: "13px sans-serif",
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      pixelOffset: new Cesium.Cartesian2(0, -60),
      scaleByDistance: new Cesium.NearFarScalar(200, 1.4, 8000, 0.5),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 6000),
    },
  });

  // Real designated shelters from PLATEAU 2023 Shizuoka City shelter dataset
  // (22100_shizuoka-shi_city_2023_shelter.geojson, sourced 2026-08-03)
  const shelters = [
    { name: "安西小学校 (Anzai Elem.)", lon: 138.37406, lat: 34.98125, capacity: 705 },
    { name: "中田小学校 (Nakada Elem.)", lon: 138.39313, lat: 34.96377, capacity: 1219 },
    { name: "豊田中学校 (Toyota Jr. High)", lon: 138.40888, lat: 34.97105, capacity: 1106 },
    { name: "井宮小学校 (Imiya Elem.)", lon: 138.36686, lat: 34.98843, capacity: 1001 },
  ];

  shelters.forEach((shelter) => {
    viewer.entities.add({
      name: shelter.name,
      position: Cesium.Cartesian3.fromDegrees(shelter.lon, shelter.lat, 30),
      point: {
        pixelSize: 12,
        color: Cesium.Color.LIME,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
      },
      label: {
        text: shelter.name + (shelter.capacity > 0 ? "\n定員 " + shelter.capacity + "名" : ""),
        fillColor: Cesium.Color.WHITE,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.6),
        pixelOffset: new Cesium.Cartesian2(0, -24),
        font: "13px sans-serif",
        scaleByDistance: new Cesium.NearFarScalar(1000, 1.4, 30000, 0.3),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 25000),
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      },
    });
  });

  // Official emergency transport routes from PLATEAU 2023 Shizuoka City dataset
  // Source: 22100_shizuoka-shi_city_2023_emergency_route.geojson
  // 静岡県緊急輸送路図 (2019-07) — clipped to Abe River flood zone area
  const evacuationRoutes = [
    {
      name: "国道362号 (Route 362, 2nd class emergency road)",
      source: "静岡県緊急輸送路図 第２次緊急輸送道路 — PLATEAU 2023",
      positions: [
        [138.33022, 34.98407], [138.33239, 34.98377], [138.33354, 34.98362],
        [138.33469, 34.98332], [138.33634, 34.98235], [138.33711, 34.98193],
        [138.33852, 34.98143], [138.34224, 34.98049], [138.34461, 34.97981],
        [138.34566, 34.9794],  [138.34803, 34.97794], [138.34866, 34.97768],
        [138.35541, 34.97673], [138.35587, 34.97664], [138.36093, 34.97597],
        [138.36178, 34.97596], [138.3643,  34.97625], [138.36689, 34.97655],
        [138.36943, 34.9769],  [138.3773,  34.97366], [138.38461, 34.97059],
      ],
    },
    {
      name: "中島南安倍線 (Nakajima-Minami-Abe, 1st class emergency road)",
      source: "静岡県緊急輸送路図 第１次緊急輸送道路 — PLATEAU 2023",
      positions: [
        [138.3748,  34.96173], [138.37624, 34.96097], [138.3788,  34.95942],
        [138.3791,  34.95922], [138.38024, 34.95799], [138.38135, 34.95655],
        [138.38205, 34.9557],  [138.38242, 34.95522], [138.3828,  34.95479],
        [138.38313, 34.95448], [138.38357, 34.95408], [138.38451, 34.95324],
        [138.38813, 34.95007], [138.38917, 34.94901], [138.38979, 34.94824],
        [138.39031, 34.94759], [138.3916,  34.94598], [138.39214, 34.9453],
        [138.39422, 34.94274], [138.39616, 34.94034],
      ],
    },
    {
      name: "中野小鹿線 (Nakano-Ojika, 2nd class emergency road)",
      source: "静岡県緊急輸送路図 第２次緊急輸送道路 — PLATEAU 2023",
      positions: [
        [138.38813, 34.95007], [138.38981, 34.9511],  [138.39118, 34.95191],
        [138.39396, 34.95349], [138.3945,  34.95387], [138.39823, 34.95639],
        [138.39946, 34.95726], [138.40122, 34.95843], [138.40355, 34.95989],
        [138.40504, 34.96075], [138.40892, 34.96309],
      ],
    },
  ];

  // Route material: one persistent object with a CallbackProperty inside.
  // CRITICAL: never reassign entity.polyline.material per-frame for clampToGround
  // polylines — it forces GroundPolylinePrimitive to destroy/rebuild every frame
  // and the primitive is perpetually "rebuilding" and never actually renders.
  const routeMaterial = new Cesium.ColorMaterialProperty(
    new Cesium.CallbackProperty(function (time) {
      const level = getHydroLevel(time);
      const danger = getDangerState(level);
      const base = danger.routeColor === Cesium.Color.WHITE
        ? Cesium.Color.CYAN : danger.routeColor;
      return base.withAlpha(0.97);
    }, false)
  );

  const routeEntities = evacuationRoutes.map((route) =>
    viewer.entities.add({
      name: route.name,
      description: route.source,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(route.positions.flat()),
        width: 14,
        material: routeMaterial,
        clampToGround: true,
      },
    })
  );

  // ─── Animated 3D flood water body ─────────────────────────────────────────
  // Covers the Abe River floodplain (安倍川洪水浸水想定区域) as a rising 3D slab.
  // Polygon coordinates follow the PLATEAU L2 flood tile footprint.
  // Color lerps blue→red and height rises with the water gauge.
  const FLOOD_WATER_FOOTPRINT = [
    138.3680, 34.9900,
    138.3755, 34.9868,
    138.3830, 34.9845,
    138.3890, 34.9823,
    138.3935, 34.9778,
    138.3925, 34.9703,
    138.3875, 34.9653,
    138.3792, 34.9638,
    138.3710, 34.9652,
    138.3642, 34.9708,
    138.3615, 34.9786,
    138.3632, 34.9856,
  ];
  // Flood water body: height:0 with depthTestAgainstTerrain=false means
  // the polygon renders visibly ON TOP of the terrain surface regardless of
  // actual terrain elevation. extrudedHeight scales dramatically with level.
  const FLOOD_BASE_M = 0;

  const floodWaterBody = viewer.entities.add({
    name: "Flood simulation water body",
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(FLOOD_WATER_FOOTPRINT)
      ),
      height: FLOOD_BASE_M,
      extrudedHeight: new Cesium.CallbackProperty(function (time) {
        const level = getHydroLevel(time);
        // 7x scale: 1.5m level → 10.5m tall, 3.9m level → 27.3m tall
        return Math.max(4, level * 7.0);
      }, false),
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function (time) {
          const level = getHydroLevel(time);
          const t = Cesium.Math.clamp((level - 1.5) / 2.5, 0.0, 1.0);
          return new Cesium.Color(
            0.05 + t * 0.70,   // R: blue → red
            0.42 - t * 0.28,   // G
            0.92 - t * 0.68,   // B
            Cesium.Math.clamp(0.50 + level * 0.06, 0.50, 0.78)  // more opaque
          );
        }, false)
      ),
      outline: true,
      outlineColor: new Cesium.CallbackProperty(function (time) {
        return getDangerState(getHydroLevel(time)).color.withAlpha(0.9);
      }, false),
      outlineWidth: 3,
    },
  });

  // Depth band labels — thin horizontal slabs at fixed danger thresholds
  // so viewers can see which "floor" the rising water is at.
  const depthBands = [
    { label: "0.5 m", elev: FLOOD_BASE_M + 1.5, color: Cesium.Color.YELLOW },
    { label: "2.0 m", elev: FLOOD_BASE_M + 6.0, color: Cesium.Color.ORANGE },
    { label: "3.5 m", elev: FLOOD_BASE_M + 10.5, color: Cesium.Color.RED },
  ];
  depthBands.forEach(function (band) {
    viewer.entities.add({
      name: "Depth marker " + band.label,
      position: Cesium.Cartesian3.fromDegrees(138.380, 34.975, band.elev),
      label: {
        text: "── " + band.label + " flood threshold",
        font: "11px monospace",
        fillColor: band.color,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.55),
        pixelOffset: new Cesium.Cartesian2(12, 0),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 12000),
        scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 8000, 0.5),
      },
      show: true,
    });
  });


  const incidentPoints = [
    { name: "Abe River gauge alarm", lon: 138.3895, lat: 34.9768, severity: "high" },
    { name: "Route 1 closure report", lon: 138.3712, lat: 34.9798, severity: "medium" },
    { name: "Hospital backup power active", lon: 138.3963, lat: 34.9887, severity: "low" },
  ];

  incidentPoints.forEach((incident) => {
    const colorBySeverity =
      incident.severity === "high"
        ? Cesium.Color.RED
        : incident.severity === "medium"
        ? Cesium.Color.GOLD
        : Cesium.Color.AQUA;

    viewer.entities.add({
      name: incident.name,
      position: Cesium.Cartesian3.fromDegrees(incident.lon, incident.lat, 15),
      billboard: {
        image:
          "data:image/svg+xml;base64," +
          btoa(
            `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'>
               <circle cx='18' cy='18' r='14' fill='${colorBySeverity.toCssColorString()}' stroke='black' stroke-width='2'/>
             </svg>`
          ),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    });
  });

  const panel = document.createElement("div");
  panel.style.position = "absolute";
  // Keep clear of Sandcastle toolbar at the top.
  panel.style.top = "100px";
  panel.style.left = "8px";
  panel.style.padding = "10px 12px";
  panel.style.background = "rgba(20, 24, 35, 0.82)";
  panel.style.color = "white";
  panel.style.fontFamily = "sans-serif";
  panel.style.fontSize = "13px";
  panel.style.border = "1px solid rgba(255,255,255,0.25)";
  panel.style.borderRadius = "6px";
  panel.style.zIndex = "1";
  panel.innerHTML = "<b>Shizuoka Response Dashboard</b><br/>Initializing...";
  viewer.container.appendChild(panel);

  const legend = document.createElement("div");
  legend.style.position = "absolute";
  legend.style.bottom = "55px";
  legend.style.right = "8px";
  legend.style.left = "auto";
  legend.style.padding = "10px 12px";
  legend.style.background = "rgba(20, 24, 35, 0.82)";
  legend.style.color = "white";
  legend.style.fontFamily = "sans-serif";
  legend.style.fontSize = "12px";
  legend.style.border = "1px solid rgba(255,255,255,0.25)";
  legend.style.borderRadius = "6px";
  legend.style.zIndex = "1";
  legend.innerHTML =
    "<b>Legend — PLATEAU 2023 Shizuoka</b><br/>" +
    "<span style='color:#ffd700'>▬</span> Flood 0–0.5 m depth<br/>" +
    "<span style='color:#ff8c00'>▬</span> Flood 0.5–3 m depth<br/>" +
    "<span style='color:#ff4500'>▬</span> Flood 3–5 m depth<br/>" +
    "<span style='color:#cc0000'>▬</span> Flood 5 m+ depth<br/>" +
    "<span style='color:#ff4d4d'>●</span> High-severity incident<br/>" +
    "<span style='color:#ffd24d'>●</span> Medium-severity incident<br/>" +
    "<span style='color:#66e0ff'>●</span> Low-severity incident<br/>" +
    "<span style='color:#0d6bcf'>■</span> Flood water body (rises with level)<br/><span style='color:#66ff66'>●</span> Shelter location<br/>" +
    "<span style='color:#00ffff'>━</span> Evacuation route (cyan → orange → red)<br/>" +
    "<small style='color:#aaa'>Flood &amp; route data: PLATEAU 2023 静岡市 (MLIT)</small>";
  viewer.container.appendChild(legend);

  let lastFloodStyleAlpha = -1;
  viewer.scene.preRender.addEventListener(function () {
    const level = getHydroLevel(viewer.clock.currentTime);
    // Update PLATEAU flood tileset opacity based on current water level (throttled)
    const floodAlpha = Math.round(Cesium.Math.clamp(0.15 + level * 0.18, 0.15, 0.85) * 20) / 20;
    if (floodAlpha !== lastFloodStyleAlpha) {
      lastFloodStyleAlpha = floodAlpha;
      if (plateauFloodL2 && plateauFloodL2.show) plateauFloodL2.style = makeFloodStyle(floodAlpha);
      if (plateauFloodL1 && plateauFloodL1.show) plateauFloodL1.style = makeFloodStyle(floodAlpha);
    }
    const danger = getDangerState(level);
    const impactedPopulation = Math.round(1200 + level * 640);
    const routeStress = level > 3.2 ? "Closed segments likely" : level > 2.4 ? "Congested" : "Open";

    panel.innerHTML =
      `<b>Shizuoka Response Dashboard</b><br/>` +
      `Water level: <b>${level.toFixed(2)} m</b><br/>` +
      `Danger level: <b style="color:${danger.color.toCssColorString()}">${danger.label}</b><br/>` +
      `Estimated impacted population: <b>${impactedPopulation.toLocaleString()}</b><br/>` +
      `Route status: <b>${routeStress}</b><br/>` +
      `Clock: ${Cesium.JulianDate.toDate(viewer.clock.currentTime).toLocaleTimeString()}`;
  });

  function addButton(label, action) {
    if (typeof Sandcastle !== "undefined" && Sandcastle.addToolbarButton) {
      Sandcastle.addToolbarButton(label, action);
      return;
    }
    const button = document.createElement("button");
    button.textContent = label;
    button.style.marginRight = "8px";
    button.onclick = action;
    viewer.container.appendChild(button);
  }

  addButton("Start Scenario", function () {
    viewer.clock.currentTime = start.clone();
    scenarioRunning = true;
  });

  addButton("Pause Scenario", function () {
    scenarioRunning = false;
  });

  addButton("Resume", function () {
    scenarioRunning = true;
  });

  addButton("Reset Time", function () {
    scenarioRunning = false;
    viewer.clock.currentTime = start.clone();
  });

  addButton("Focus Flood Zone", function () {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(138.378, 34.975, 2800),
      orientation: {
        heading: Cesium.Math.toRadians(10),
        pitch: Cesium.Math.toRadians(-42),
        roll: 0,
      },
      duration: 2.0,
    });
  });

  addButton("Focus Water Gauge", function () {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(WATER_GAUGE_LON, WATER_GAUGE_LAT, 420),
      orientation: {
        heading: Cesium.Math.toRadians(15),
        pitch: Cesium.Math.toRadians(-35),
        roll: 0.0,
      },
      duration: 1.8,
    });
  });

  addButton("Flood: L1 / L2", function () {
    if (!plateauFloodL1 || !plateauFloodL2) return;
    if (plateauFloodL2.show) {
      plateauFloodL2.show = false;
      plateauFloodL1.show = true;
      activeFloodTileset = plateauFloodL1;
    } else {
      plateauFloodL1.show = false;
      plateauFloodL2.show = true;
      activeFloodTileset = plateauFloodL2;
    }
  });

  addButton("Toggle Flood Raster", function () {
    if (!floodDepth) return;
    floodDepth.show = !floodDepth.show;
  });

  addButton("Toggle Shadows", function () {
    const next = !viewer.shadows;
    viewer.shadows = next;
    if (viewer.scene.shadowMap) {
      viewer.scene.shadowMap.enabled = next;
    }
  });

  addButton("Focus Routes", function () {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(138.381, 34.977, 800),
      orientation: { heading: Cesium.Math.toRadians(340), pitch: Cesium.Math.toRadians(-40), roll: 0 },
      duration: 1.8,
    });
  });
})();
