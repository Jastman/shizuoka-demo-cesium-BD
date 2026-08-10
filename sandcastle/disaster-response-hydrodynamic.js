// Shizuoka / PSS Flood Response
// Paste into https://sandcastle.cesium.com/ and select Run (F8).
//
// REAL DATA: MLIT Project PLATEAU FY2023 Shizuoka City 3D Tiles, embedded
// shelter locations and emergency-route excerpts, and GSI standard map tiles.
// ILLUSTRATIVE MODEL: hydrograph, thresholds, operational impacts, animated
// water, and response timeline. Never use this demo for public safety decisions.

(async function shizuokaFloodResponse() {
  "use strict";

  const SOURCES = {
    plateau:
      "https://www.geospatial.jp/ckan/dataset/plateau-22100-shizuoka-shi-2023",
    gsi: "https://maps.gsi.go.jp/development/ichiran.html",
    gsiTerms: "https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html",
  };

  const ASSETS = {
    buildings:
      "https://assets.cms.plateau.reearth.io/assets/16/f01621-f72d-4c64-9c40-67c97cee7c5f/22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22101_aoi-ku_lod2/tileset.json",
    floodL1:
      "https://assets.cms.plateau.reearth.io/assets/41/edaf1e-f484-4ed4-9084-dbcede6352d5/22100_shizuoka-shi_city_2023_citygml_3_op_fld_natl_abegawa_abegawa-warasinagawa_3dtiles_l1_no_texture/tileset.json",
    floodL2:
      "https://assets.cms.plateau.reearth.io/assets/23/720679-10c9-46e4-9ab6-4a76ada7566c/22100_shizuoka-shi_city_2023_citygml_3_op_fld_natl_abegawa_abegawa-warasinagawa_3dtiles_l2_no_texture/tileset.json",
  };

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = Cesium.JulianDate.fromIso8601("2026-08-10T00:00:00Z");
  const stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());
  const state = {
    running: false,
    tourRunning: false,
    tourStep: 0,
    destroyed: false,
    floodMode: "L2",
  };

  const styles = document.createElement("style");
  styles.textContent = `
    :root { --pss-bg: rgba(9, 17, 28, .94); --pss-line: rgba(255,255,255,.16);
      --pss-text: #f4f8fb; --pss-muted: #b8c7d5; --pss-cyan: #41d9ff;
      --pss-warn: #ffc857; --pss-danger: #ff5d68; }
    .pss-ui, .pss-ui * { box-sizing: border-box; }
    .pss-ui { position: fixed; z-index: 10; color: var(--pss-text);
      font: 14px/1.45 Inter, ui-sans-serif, system-ui, sans-serif; }
    .pss-panel { top: 12px; left: 12px; width: min(390px, calc(100vw - 24px));
      max-height: calc(100vh - 88px); overflow: auto; padding: 16px;
      border: 1px solid var(--pss-line); border-radius: 14px;
      background: var(--pss-bg); box-shadow: 0 16px 44px rgba(0,0,0,.42);
      backdrop-filter: blur(14px); }
    .pss-eyebrow { margin: 0 0 4px; color: var(--pss-cyan); font-size: 11px;
      font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .pss-panel h1 { margin: 0; font-size: 21px; line-height: 1.15; }
    .pss-subtitle { margin: 7px 0 14px; color: var(--pss-muted); font-size: 12px; }
    .pss-warning { margin: 0 0 12px; padding: 9px 10px; border: 1px solid
      rgba(255,200,87,.42); border-radius: 8px; background: rgba(255,200,87,.1);
      font-size: 12px; }
    .pss-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
    .pss-metric { min-width: 0; padding: 9px; border: 1px solid var(--pss-line);
      border-radius: 9px; background: rgba(255,255,255,.04); }
    .pss-metric span { display: block; color: var(--pss-muted); font-size: 10px;
      text-transform: uppercase; }
    .pss-metric strong { display: block; margin-top: 2px; font-size: 16px; }
    .pss-controls { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; }
    .pss-ui button, .pss-ui select { min-height: 38px; border: 1px solid
      var(--pss-line); border-radius: 8px; color: var(--pss-text);
      background: rgba(255,255,255,.08); font: inherit; }
    .pss-ui button { padding: 7px 11px; cursor: pointer; }
    .pss-ui button:hover { background: rgba(255,255,255,.15); }
    .pss-ui button:focus-visible, .pss-ui select:focus-visible,
    .pss-ui summary:focus-visible { outline: 3px solid var(--pss-cyan);
      outline-offset: 2px; }
    .pss-primary { background: #087f9c !important; font-weight: 750 !important; }
    .pss-row { display: grid; grid-template-columns: 1fr auto; align-items: center;
      gap: 10px; margin-top: 9px; }
    .pss-row label { color: var(--pss-muted); font-size: 12px; }
    .pss-row select { padding: 6px 30px 6px 9px; }
    .pss-ui details { margin-top: 11px; border-top: 1px solid var(--pss-line);
      padding-top: 10px; }
    .pss-ui summary { cursor: pointer; font-weight: 700; }
    .pss-ui details p, .pss-ui details li { color: var(--pss-muted); font-size: 12px; }
    .pss-ui a { color: #75e6ff; }
    .pss-status { right: 12px; top: 12px; max-width: min(320px, calc(100vw - 24px));
      padding: 9px 12px; border: 1px solid var(--pss-line); border-radius: 9px;
      background: var(--pss-bg); }
    .pss-tour { left: 50%; bottom: 72px; width: min(570px, calc(100vw - 24px));
      transform: translateX(-50%); padding: 14px 16px; border: 1px solid
      rgba(65,217,255,.5); border-radius: 12px; background: var(--pss-bg);
      box-shadow: 0 12px 38px rgba(0,0,0,.5); }
    .pss-tour[hidden] { display: none; }
    .pss-tour h2 { margin: 0 0 4px; font-size: 16px; }
    .pss-tour p { margin: 0; color: var(--pss-muted); }
    .pss-tour-actions { display: flex; gap: 7px; margin-top: 10px; }
    @media (max-width: 700px) {
      .pss-panel { max-height: 42vh; }
      .pss-status { top: auto; bottom: 70px; }
      .pss-tour { bottom: 120px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .pss-ui *, .pss-ui *::before, .pss-ui *::after {
        scroll-behavior: auto !important; transition: none !important;
      }
    }`;
  document.head.append(styles);

  const panel = document.createElement("section");
  panel.className = "pss-ui pss-panel";
  panel.setAttribute("aria-labelledby", "pss-title");
  panel.innerHTML = `
    <p class="pss-eyebrow">PSS operational concept · Shizuoka</p>
    <h1 id="pss-title">Abe River flood response</h1>
    <p class="pss-subtitle">Foothills → floodplain → Shizuoka City → Suruga Bay</p>
    <p class="pss-warning"><strong>Planning demo:</strong> PLATEAU/GSI geography is
      real. The animated six-hour event and impacts are illustrative, not a
      forecast or evacuation instruction.</p>
    <div class="pss-metrics" aria-live="polite" aria-atomic="true">
      <div class="pss-metric"><span>Model level</span><strong id="pss-level">1.5 m</strong></div>
      <div class="pss-metric"><span>Phase</span><strong id="pss-phase">Monitor</strong></div>
      <div class="pss-metric"><span>Route state</span><strong id="pss-routes">Open</strong></div>
    </div>
    <div class="pss-controls" aria-label="Scenario controls">
      <button id="pss-play" class="pss-primary" type="button">Run scenario</button>
      <button id="pss-restart" type="button">Restart</button>
      <button id="pss-tour-start" type="button">Start guided tour</button>
    </div>
    <div class="pss-row">
      <label for="pss-flood">Official planning surface</label>
      <select id="pss-flood">
        <option value="L2">L2 maximum scenario</option>
        <option value="L1">L1 planned scale</option>
        <option value="off">Hidden</option>
      </select>
    </div>
    <div class="pss-row">
      <label for="pss-buildings">PLATEAU Aoi-ku buildings</label>
      <input id="pss-buildings" type="checkbox" checked />
    </div>
    <details>
      <summary>Data, provenance, and pipeline</summary>
      <p><strong>Verified public data:</strong> MLIT Project PLATEAU FY2023
        Shizuoka City buildings, flood-planning surfaces, shelter locations, and
        emergency-route excerpts; GSI standard map. Catalog checked 2026-08-10.</p>
      <p><strong>Illustrative:</strong> hydrograph, thresholds, impact states,
        counts, and animated water. Static L1/L2 tiles remain official planning
        data.</p>
      <p><strong>Production PSS flow:</strong> validate authoritative source →
        convert/version in private Cesium ion where appropriate → issue
        short-lived server credentials → stream to CesiumJS → analyze against
        roads, shelters, and population. This public demo streams published
        PLATEAU tiles directly and contains no private token.</p>
      <ul>
        <li><a href="${SOURCES.plateau}" target="_blank" rel="noreferrer">PLATEAU dataset</a></li>
        <li><a href="${SOURCES.gsi}" target="_blank" rel="noreferrer">GSI tile catalog</a></li>
        <li><a href="${SOURCES.gsiTerms}" target="_blank" rel="noreferrer">GSI terms</a></li>
      </ul>
      <p>Geographic note: the Abe River descends from the Akaishi mountains.
        Mt. Fuji is regional context to the northeast, not the Abe watershed.</p>
    </details>`;

  const status = document.createElement("div");
  status.className = "pss-ui pss-status";
  status.setAttribute("role", "status");
  status.textContent = "Initializing terrain and official PLATEAU layers…";

  const tour = document.createElement("section");
  tour.className = "pss-ui pss-tour";
  tour.hidden = true;
  tour.setAttribute("aria-labelledby", "pss-tour-title");
  tour.innerHTML = `
    <h2 id="pss-tour-title" tabindex="-1">Guided tour</h2>
    <p id="pss-tour-copy"></p>
    <div class="pss-tour-actions">
      <button id="pss-tour-toggle" type="button">Pause</button>
      <button id="pss-tour-restart" type="button">Restart tour</button>
      <button id="pss-tour-close" type="button">Close tour</button>
    </div>`;
  document.body.append(panel, status, tour);

  let terrain;
  try {
    terrain = Cesium.Terrain.fromWorldTerrain();
  } catch (error) {
    console.info("World Terrain unavailable; using ellipsoid.", error);
    terrain = new Cesium.EllipsoidTerrainProvider();
  }

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrain,
    animation: true,
    timeline: true,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    selectionIndicator: true,
    infoBox: true,
    shouldAnimate: false,
  });
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#132130");
  viewer.scene.fog.enabled = true;
  viewer.scene.requestRenderMode = false;

  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
      minimumLevel: 5,
      maximumLevel: 18,
      rectangle: Cesium.Rectangle.fromDegrees(122.9, 20.4, 154.0, 45.6),
      credit: new Cesium.Credit(
        `<a href="${SOURCES.gsi}" target="_blank">GSI standard map</a>`,
        true
      ),
    })
  );

  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED;
  viewer.clock.multiplier = 180;
  viewer.timeline.zoomTo(start, stop);

  const samples = [
    [0, 1.5], [1, 2.1], [2, 2.9], [3, 3.9], [4, 3.3], [5, 2.5], [6, 1.8],
  ];
  function modelLevel(time) {
    const hour = Cesium.Math.clamp(
      Cesium.JulianDate.secondsDifference(time, start) / 3600,
      0,
      6
    );
    for (let index = 0; index < samples.length - 1; index += 1) {
      const a = samples[index];
      const b = samples[index + 1];
      if (hour >= a[0] && hour <= b[0]) {
        return Cesium.Math.lerp(a[1], b[1], (hour - a[0]) / (b[0] - a[0]));
      }
    }
    return samples.at(-1)[1];
  }

  function risk(level) {
    if (level >= 3.5) return { phase: "Respond", route: "Closed", color: Cesium.Color.RED };
    if (level >= 2.8) return { phase: "Mobilize", route: "Restricted", color: Cesium.Color.ORANGE };
    if (level >= 2.1) return { phase: "Prepare", route: "Watch", color: Cesium.Color.GOLD };
    return { phase: "Monitor", route: "Open", color: Cesium.Color.CYAN };
  }

  const shelters = [
    ["Anzai Elementary", 138.37406, 34.98125],
    ["Nakada Elementary", 138.39313, 34.96377],
    ["Toyota Junior High", 138.40888, 34.97105],
    ["Imiya Elementary", 138.36686, 34.98843],
  ];
  for (const [name, lon, lat] of shelters) {
    viewer.entities.add({
      name: `${name} · official PLATEAU shelter location`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      point: {
        pixelSize: 11,
        color: Cesium.Color.LIME,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
      label: {
        text: name,
        font: "12px sans-serif",
        fillColor: Cesium.Color.WHITE,
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.72),
        pixelOffset: new Cesium.Cartesian2(0, -22),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 17000),
      },
    });
  }

  const routes = [
    [
      "Route 362 · PLATEAU emergency-route excerpt",
      [138.33022,34.98407, 138.34461,34.97981, 138.36093,34.97597,
        138.3773,34.97366, 138.38461,34.97059],
    ],
    [
      "Nakajima–Minami-Abe · PLATEAU emergency-route excerpt",
      [138.3748,34.96173, 138.3828,34.95479, 138.38813,34.95007,
        138.39616,34.94034],
    ],
  ];
  for (const [name, coordinates] of routes) {
    viewer.entities.add({
      name,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(coordinates),
        width: 9,
        clampToGround: true,
        material: new Cesium.ColorMaterialProperty(
          new Cesium.CallbackProperty(
            (time) => risk(modelLevel(time)).color.withAlpha(0.95),
            false
          )
        ),
      },
    });
  }

  viewer.entities.add({
    name: "Illustrative modeled water surface",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        138.352,34.995, 138.371,34.988, 138.389,34.982, 138.397,34.967,
        138.396,34.948, 138.385,34.933, 138.371,34.945, 138.360,34.965,
      ]),
      height: 10,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty((time) => {
          const level = modelLevel(time);
          return risk(level).color.withAlpha(0.18 + level * 0.035);
        }, false)
      ),
      outline: true,
      outlineColor: Cesium.Color.CYAN.withAlpha(0.65),
    },
  });

  viewer.entities.add({
    name: "Illustrative model gauge",
    position: Cesium.Cartesian3.fromDegrees(138.365, 34.978),
    cylinder: {
      length: new Cesium.CallbackProperty((time) => 20 + modelLevel(time) * 18, false),
      topRadius: 8,
      bottomRadius: 8,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(
          (time) => risk(modelLevel(time)).color.withAlpha(0.9),
          false
        )
      ),
    },
    label: {
      text: new Cesium.CallbackProperty(
        (time) => `ILLUSTRATIVE MODEL\n${modelLevel(time).toFixed(2)} m`,
        false
      ),
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.78),
      pixelOffset: new Cesium.Cartesian2(0, -52),
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    },
  });

  const tilesets = { buildings: null, L1: null, L2: null };
  function configureTileset(tileset, maximumScreenSpaceError) {
    tileset.maximumScreenSpaceError = maximumScreenSpaceError;
    // Normal refinement keeps replacement ancestors visible until their
    // selected children are ready, preventing holes in external PLATEAU tiles.
    tileset.dynamicScreenSpaceError = false;
    tileset.skipLevelOfDetail = false;
    tileset.preferLeaves = false;
    tileset.cullWithChildrenBounds = false;
    tileset.foveatedScreenSpaceError = false;
    tileset.preloadFlightDestinations = true;
    tileset.cacheBytes = 1024 * 1024 * 1024;
    tileset.maximumCacheOverflowBytes = 512 * 1024 * 1024;
  }

  function floodStyle(alpha) {
    return new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ["${feature['uro:rank_code']} === 4", `color('#a50026', ${alpha})`],
          ["${feature['uro:rank_code']} === 3", `color('#f46d43', ${alpha})`],
          ["${feature['uro:rank_code']} === 2", `color('#fdae61', ${alpha})`],
          ["${feature['uro:rank_code']} === 1", `color('#74add1', ${alpha})`],
          ["true", `color('#4575b4', ${alpha * 0.7})`],
        ],
      },
    });
  }

  async function addTileset(key, url, maximumScreenSpaceError) {
    try {
      const tileset = await Cesium.Cesium3DTileset.fromUrl(url);
      configureTileset(tileset, maximumScreenSpaceError);
      viewer.scene.primitives.add(tileset);
      tilesets[key] = tileset;
      return true;
    } catch (error) {
      console.error(`Required PLATEAU ${key} layer failed to load.`, error);
      status.textContent = `PLATEAU ${key} unavailable; remaining layers are still usable.`;
      return false;
    }
  }

  const results = await Promise.all([
    addTileset("buildings", ASSETS.buildings, 48),
    addTileset("L1", ASSETS.floodL1, 36),
    addTileset("L2", ASSETS.floodL2, 36),
  ]);
  if (tilesets.L1) {
    tilesets.L1.style = floodStyle(0.67);
    tilesets.L1.show = false;
  }
  if (tilesets.L2) tilesets.L2.style = floodStyle(0.67);
  status.textContent = results.every(Boolean)
    ? "Official PLATEAU layers loaded · illustrative scenario paused"
    : "Demo ready with degraded PLATEAU coverage";

  const cameras = [
    {
      title: "1 · Watershed context",
      copy: "The Abe River descends from the Akaishi mountains through Shizuoka. Mt. Fuji is visible regional context to the northeast, not this watershed.",
      target: [138.34, 35.02, 350],
      offset: [155, -30, 28000],
    },
    {
      title: "2 · Verified flood planning data",
      copy: "Official PLATEAU L2 depth-ranked 3D Tiles stream into CesiumJS. The colored static surface is planning data; the translucent pulse is illustrative.",
      target: [138.372, 34.98, 100],
      offset: [155, -32, 9000],
    },
    {
      title: "3 · Operational intersection",
      copy: "Emergency-route excerpts and shelter locations provide the operational joins. Their time-varying status is modeled until PSS supplies live authoritative feeds.",
      target: [138.381, 34.97, 100],
      offset: [160, -27, 5000],
    },
    {
      title: "4 · Downstream to Suruga Bay",
      copy: "The chapter follows the floodplain through the city toward Suruga Bay, making downstream exposure and response dependencies legible in one view.",
      target: [138.385, 34.948, 100],
      offset: [340, -32, 11500],
    },
  ];

  function headingPitchRange(offset) {
    return new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(offset[0]),
      Cesium.Math.toRadians(offset[1]),
      offset[2]
    );
  }

  let tourTimer = 0;
  function clearTourTimer() {
    if (tourTimer) window.clearTimeout(tourTimer);
    tourTimer = 0;
  }
  function showTourStep(index, moveCamera = true) {
    clearTourTimer();
    state.tourStep = index % cameras.length;
    const step = cameras[state.tourStep];
    tour.querySelector("h2").textContent = step.title;
    tour.querySelector("#pss-tour-copy").textContent = step.copy;
    if (moveCamera) {
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(
          Cesium.Cartesian3.fromDegrees(...step.target),
          250
        ),
        {
          offset: headingPitchRange(step.offset),
          duration: reducedMotion ? 0 : 2.2,
        }
      );
    }
    if (state.tourRunning) {
      tourTimer = window.setTimeout(() => {
        showTourStep(state.tourStep + 1);
      }, reducedMotion ? 9000 : 7000);
    }
  }
  function startTour() {
    state.tourRunning = true;
    tour.hidden = false;
    tour.querySelector("#pss-tour-toggle").textContent = "Pause";
    showTourStep(0);
    tour.querySelector("h2").focus({ preventScroll: true });
  }
  function closeTour() {
    clearTourTimer();
    state.tourRunning = false;
    tour.hidden = true;
    panel.querySelector("#pss-tour-start").focus({ preventScroll: true });
  }

  panel.querySelector("#pss-play").addEventListener("click", (event) => {
    state.running = !state.running;
    viewer.clock.shouldAnimate = state.running;
    event.currentTarget.textContent = state.running ? "Pause scenario" : "Run scenario";
    status.textContent = state.running
      ? "Illustrative six-hour scenario running"
      : "Illustrative scenario paused";
  });
  panel.querySelector("#pss-restart").addEventListener("click", () => {
    viewer.clock.currentTime = start.clone();
    viewer.clock.shouldAnimate = false;
    state.running = false;
    panel.querySelector("#pss-play").textContent = "Run scenario";
  });
  panel.querySelector("#pss-tour-start").addEventListener("click", startTour);
  panel.querySelector("#pss-flood").addEventListener("change", (event) => {
    state.floodMode = event.target.value;
    if (tilesets.L1) tilesets.L1.show = state.floodMode === "L1";
    if (tilesets.L2) tilesets.L2.show = state.floodMode === "L2";
  });
  panel.querySelector("#pss-buildings").addEventListener("change", (event) => {
    if (tilesets.buildings) tilesets.buildings.show = event.target.checked;
  });
  tour.querySelector("#pss-tour-toggle").addEventListener("click", (event) => {
    state.tourRunning = !state.tourRunning;
    event.currentTarget.textContent = state.tourRunning ? "Pause" : "Resume";
    if (state.tourRunning) showTourStep(state.tourStep + 1);
    else clearTourTimer();
  });
  tour.querySelector("#pss-tour-restart").addEventListener("click", () => {
    state.tourRunning = true;
    tour.querySelector("#pss-tour-toggle").textContent = "Pause";
    showTourStep(0);
  });
  tour.querySelector("#pss-tour-close").addEventListener("click", closeTour);
  tour.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTour();
  });

  viewer.clock.onTick.addEventListener((clock) => {
    const level = modelLevel(clock.currentTime);
    const currentRisk = risk(level);
    panel.querySelector("#pss-level").textContent = `${level.toFixed(2)} m`;
    panel.querySelector("#pss-phase").textContent = currentRisk.phase;
    panel.querySelector("#pss-routes").textContent = currentRisk.route;
    if (
      state.running &&
      Cesium.JulianDate.secondsDifference(stop, clock.currentTime) <= 0
    ) {
      state.running = false;
      clock.shouldAnimate = false;
      panel.querySelector("#pss-play").textContent = "Run scenario";
      status.textContent = "Illustrative scenario complete";
    }
  });

  const initialTarget = Cesium.Cartesian3.fromDegrees(138.372, 34.975, 100);
  viewer.camera.lookAt(
    initialTarget,
    headingPitchRange([155, -30, 12000])
  );
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
})();
