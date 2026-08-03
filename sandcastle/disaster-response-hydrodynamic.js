// Shizuoka Disaster Response + Hydrodynamic Simulation
// Paste into https://sandcastle.cesium.com/ JS panel.

(async function () {
  const SHIZUOKA_CENTER = { lon: 138.3831, lat: 34.9769, height: 1800.0 };
  const WATER_GAUGE_LON = 138.3852;
  const WATER_GAUGE_LAT = 34.9811;
  const SHIZUOKA_3D_TILES_URL = ""; // Optional: drop in project-specific tileset URL
  const GSI_SEAMLESS_PHOTO_URL =
    "https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg";
  const GSI_STD_MAP_URL = "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png";
  const GSI_FLOOD_DEPTH_URL =
    "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png";

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

  viewer.imageryLayers.removeAll();
  const stdMap = viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: GSI_STD_MAP_URL,
      credit: "地理院タイル",
    })
  );
  stdMap.alpha = 0.35;
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: GSI_SEAMLESS_PHOTO_URL,
      credit: "国土地理院 シームレス写真",
      maximumLevel: 18,
    })
  );
  const floodDepth = viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: GSI_FLOOD_DEPTH_URL,
      credit: "国土地理院 重ねるハザードマップ",
    })
  );
  floodDepth.alpha = 0.42;

  try {
    const osmBuildings = await Cesium.createOsmBuildingsAsync();
    viewer.scene.primitives.add(osmBuildings);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("OSM Buildings failed to load:", error);
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

  if (SHIZUOKA_3D_TILES_URL) {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(SHIZUOKA_3D_TILES_URL);
      viewer.scene.primitives.add(tileset);
      viewer.zoomTo(tileset);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("3D Tiles failed to load:", error);
    }
  }

  const start = Cesium.JulianDate.now();
  const stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
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

  // Four concentric depth zones. Outer = shallowest, inner = deepest.
  // Each zone has its own fixed footprint (manually contracted inward), a depth band,
  // and a dynamic extruded height that only appears once the water level reaches that band.
  const floodZones = [
    {
      name: "Flood zone: 0-1 m (watch)",
      color: Cesium.Color.YELLOW,
      depthThreshold: 0.5,
      heightScale: 8,
      coords: [138.362, 34.966, 138.39, 34.967, 138.406, 34.977, 138.401, 34.993,
               138.384, 35.001, 138.360, 34.991, 138.352, 34.974],
    },
    {
      name: "Flood zone: 1-2 m (warning)",
      color: Cesium.Color.ORANGE,
      depthThreshold: 1.2,
      heightScale: 10,
      coords: [138.365, 34.968, 138.387, 34.969, 138.401, 34.978, 138.397, 34.991,
               138.383, 34.998, 138.364, 34.989, 138.357, 34.976],
    },
    {
      name: "Flood zone: 2-3 m (danger)",
      color: Cesium.Color.ORANGERED,
      depthThreshold: 2.0,
      heightScale: 13,
      coords: [138.368, 34.970, 138.385, 34.970, 138.397, 34.979, 138.394, 34.989,
               138.381, 34.995, 138.367, 34.988, 138.360, 34.977],
    },
    {
      name: "Flood zone: 3 m+ (severe)",
      color: Cesium.Color.RED,
      depthThreshold: 3.0,
      heightScale: 18,
      coords: [138.371, 34.972, 138.382, 34.972, 138.391, 34.980, 138.388, 34.987,
               138.377, 34.991, 138.370, 34.985, 138.364, 34.978],
    },
  ];

  const floodEntities = floodZones.map((zone) => {
    const positions = Cesium.Cartesian3.fromDegreesArray(zone.coords);
    return viewer.entities.add({
      name: zone.name,
      polygon: {
        hierarchy: positions,
        material: new Cesium.ColorMaterialProperty(
          new Cesium.CallbackProperty(function (time) {
            const level = getHydroLevel(time);
            const visible = level >= zone.depthThreshold;
            const alpha = visible
              ? Cesium.Math.clamp(0.28 + (level - zone.depthThreshold) * 0.14, 0.28, 0.78)
              : 0.0;
            return zone.color.withAlpha(alpha);
          }, false)
        ),
        extrudedHeight: new Cesium.CallbackProperty(function (time) {
          const level = getHydroLevel(time);
          if (level < zone.depthThreshold) return 0;
          return (level - zone.depthThreshold + 0.5) * zone.heightScale;
        }, false),
        outline: true,
        outlineColor: zone.color.withAlpha(0.9),
      },
    });
  });

  // Use the outermost zone as the focus target
  const floodEntity = floodEntities[0];

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
        width: 5,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
        }),
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
    "<b>Legend</b><br/>" +
    "<span style='color:#ffd700'>▬</span> Watch: 0–1 m inundation<br/>" +
    "<span style='color:#ff8c00'>▬</span> Warning: 1–2 m inundation<br/>" +
    "<span style='color:#ff4500'>▬</span> Danger: 2–3 m inundation<br/>" +
    "<span style='color:#ff0000'>▬</span> Severe: 3 m+ inundation<br/>" +
    "<span style='color:#ff4d4d'>●</span> High-severity incident<br/>" +
    "<span style='color:#ffd24d'>●</span> Medium-severity incident<br/>" +
    "<span style='color:#66e0ff'>●</span> Low-severity incident<br/>" +
    "<span style='color:#66ff66'>●</span> Shelter location<br/>" +
    "<span style='color:#ffffff'>━</span> Evacuation route (road-routed, color = danger level)";
  viewer.container.appendChild(legend);

  viewer.scene.preRender.addEventListener(function () {
    const level = getHydroLevel(viewer.clock.currentTime);
    const danger = getDangerState(level);
    const impactedPopulation = Math.round(1200 + level * 640);
    const routeStress = level > 3.2 ? "Closed segments likely" : level > 2.4 ? "Congested" : "Open";

    routeEntities.forEach((entity) => {
      entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
        color: danger.routeColor.withAlpha(0.98),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
      });
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
    viewer.clock.shouldAnimate = true;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.shouldAnimate = true;
    }
  });

  addButton("Pause Scenario", function () {
    viewer.clock.shouldAnimate = false;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.shouldAnimate = false;
    }
  });

  addButton("Resume", function () {
    viewer.clock.shouldAnimate = true;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.shouldAnimate = true;
    }
  });

  addButton("Reset Time", function () {
    viewer.clock.currentTime = start.clone();
    viewer.clock.shouldAnimate = false;
    if (viewer.clockViewModel) {
      viewer.clockViewModel.shouldAnimate = false;
    }
  });

  addButton("Focus Flood Zone", function () {
    viewer.flyTo(floodEntities, { duration: 1.8 });
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

  addButton("Toggle Flood Raster", function () {
    floodDepth.show = !floodDepth.show;
  });

  addButton("Focus Routes", function () {
    viewer.flyTo(routeEntities, { duration: 1.8 });
  });
})();
