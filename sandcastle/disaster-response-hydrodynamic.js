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
  const TILESET_CACHE_BYTES = 256 * 1024 * 1024;
  const TILESET_CACHE_OVERFLOW_BYTES = 128 * 1024 * 1024;

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    timeline: true,
    animation: true,
    baseLayerPicker: true,
    shadows: true,
    sceneModePicker: false,
    geocoder: false,
  });

  // Keep false: depth-testing hides our flood-zone polygons (height=0 clips under terrain).
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.showGroundAtmosphere = true;
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#0e131e");

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

  function configureTileset(ts) {
    ts.maximumScreenSpaceError = 24;
    ts.cacheBytes = TILESET_CACHE_BYTES;
    ts.maximumCacheOverflowBytes = TILESET_CACHE_OVERFLOW_BYTES;
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
      configureTileset(ts);
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
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
  viewer.clock.canAnimate = true;
  viewer.clock.multiplier = 120;   // 120x = 6-hour scenario plays in ~3 minutes real time
  viewer.clock.shouldAnimate = false; // User presses Start Scenario to begin

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
          ["true", "color('#ffffff', 0.0)"],
        ],
      },
    });
  }

  let plateauFloodL1 = null;
  let plateauFloodL2 = null;
  let activeFloodTileset = null;

  try {
    plateauFloodL2 = await Cesium.Cesium3DTileset.fromUrl(PLATEAU_FLOOD_L2_URL);
    configureTileset(plateauFloodL2);
    viewer.scene.primitives.add(plateauFloodL2);
    plateauFloodL2.style = makeFloodStyle(0.75);
    activeFloodTileset = plateauFloodL2;
  } catch (e) {
    console.warn("PLATEAU flood L2 failed:", e);
  }

  try {
    plateauFloodL1 = await Cesium.Cesium3DTileset.fromUrl(PLATEAU_FLOOD_L1_URL);
    configureTileset(plateauFloodL1);
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

  const shelters = [
    { name: "Aoi Ward School Shelter", lon: 138.3778, lat: 34.9856 },
    { name: "Shimizu Gym Shelter", lon: 138.3926, lat: 34.9832 },
    { name: "Suruga Community Shelter", lon: 138.4017, lat: 34.9744 },
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
        text: shelter.name,
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

  // Driving routes generated with geolocation_route (2026-08-03), then sampled for readability.
  const evacuationRoutes = [
    {
      name: "Evacuation route 1 (road-routed)",
      source: "Driving route (OSM-based) from 138.36140,34.97085 to 138.38315,34.98401",
      positions: [
        [138.3614, 34.97085],
        [138.36261, 34.96827],
        [138.36357, 34.96918],
        [138.36276, 34.97155],
        [138.3615, 34.97467],
        [138.36268, 34.97633],
        [138.36546, 34.97636],
        [138.36864, 34.97739],
        [138.37191, 34.97897],
        [138.37452, 34.98024],
        [138.3768, 34.98136],
        [138.37904, 34.98286],
        [138.38023, 34.9835],
        [138.38176, 34.98326],
        [138.38319, 34.98294],
        [138.38315, 34.98401],
      ],
    },
    {
      name: "Evacuation route 2 (road-routed)",
      source: "Driving route (OSM-based) from 138.40098,34.96799 to 138.39096,34.98297",
      positions: [
        [138.40098, 34.96799],
        [138.39971, 34.96903],
        [138.39811, 34.97007],
        [138.39682, 34.97123],
        [138.39487, 34.97299],
        [138.39336, 34.97479],
        [138.39218, 34.97662],
        [138.39162, 34.97747],
        [138.39097, 34.97821],
        [138.38979, 34.97939],
        [138.38856, 34.98041],
        [138.38972, 34.98183],
        [138.39096, 34.98297],
      ],
    },
  ];

  const routeEntities = evacuationRoutes.map((route) =>
    viewer.entities.add({
      name: route.name,
      description: route.source,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(route.positions.flat()),
        width: 9,
        material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.95)),
        clampToGround: true,
        zIndex: 10,
      },
    })
  );

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
    "<span style='color:#66ff66'>●</span> Shelter location<br/>" +
    "<span style='color:#ffffff'>━</span> Evacuation route (color = danger level)<br/>" +
    "<small style='color:#aaa'>Flood data: MLIT PLATEAU 2023 安倍川水系</small>";
  viewer.container.appendChild(legend);

  viewer.scene.preRender.addEventListener(function () {
    const level = getHydroLevel(viewer.clock.currentTime);
    const danger = getDangerState(level);
    const impactedPopulation = Math.round(1200 + level * 640);
    const routeStress = level > 3.2 ? "Closed segments likely" : level > 2.4 ? "Congested" : "Open";

    routeEntities.forEach((entity) => {
      entity.polyline.material = new Cesium.ColorMaterialProperty(
        danger.routeColor.withAlpha(0.97)
      );
    });

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
    // Always reset to beginning so the button works even after clock reaches stopTime.
    viewer.clock.currentTime = start.clone();
    viewer.clock.canAnimate = true;
    viewer.clock.shouldAnimate = true;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.canAnimate = true;
      viewer.clockViewModel.shouldAnimate = true;
    }
    viewer.scene.requestRender();
  });

  addButton("Pause Scenario", function () {
    viewer.clock.shouldAnimate = false;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.shouldAnimate = false;
    }
    viewer.scene.requestRender();
  });

  addButton("Resume", function () {
    viewer.clock.canAnimate = true;
    viewer.clock.shouldAnimate = true;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.canAnimate = true;
      viewer.clockViewModel.shouldAnimate = true;
    }
    viewer.scene.requestRender();
  });

  addButton("Reset Time", function () {
    viewer.clock.currentTime = start.clone();
    viewer.clock.shouldAnimate = false;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.shouldAnimate = false;
    }
  });

  addButton("Focus Flood Zone", function () {
    const target = activeFloodTileset || floodEntity;
    viewer.flyTo(target, { duration: 1.8 });
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

  addButton("Focus Routes", function () {
    viewer.flyTo(routeEntities, { duration: 1.8 });
  });
})();
