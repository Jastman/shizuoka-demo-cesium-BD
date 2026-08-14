// Voxel Analytics: Shizuoka watershed-to-coast decision chapter.
// Paste into https://sandcastle.cesium.com/ (CesiumJS 1.144).

(async function () {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MTA5NjcxZS04ZGIwLTQxMGMtYTgzYy1mOTVkYzQ4ZDNiNzUiLCJpZCI6NDIxMzE4LCJzdWIiOiJKYWtlLlN0ZWluZXJtYW4iLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiRGVtbyAxLSBEaXNhc3RlciBSZXNwb25zZSAmIEh5ZHJvZHluYW1pYyBTaW11bGF0aW9uIiwiaWF0IjoxNzg1NDQ1NTkwfQ.f14WW5ROSpSJULiwGF1iWovpqDFbNq-KY5-QJckUDUY";

  const DATA_CATALOG =
    "https://www.geospatial.jp/ckan/dataset?q=VIRTUAL+SHIZUOKA&organization=shizuokapref&sort=metadata_modified+desc";
  const PLATEAU_AOI_LOD2 =
    "https://assets.cms.plateau.reearth.io/assets/16/f01621-f72d-4c64-9c40-67c97cee7c5f/22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22101_aoi-ku_lod2/tileset.json";
  const BATHYMETRY_ASSET_BASE =
    "https://jastman.github.io/shizuoka-demo-cesium-BD/assets";
  const BATHYMETRY_DEPTH_IMAGE =
    `${BATHYMETRY_ASSET_BASE}/shimizu-bathymetry-depth.png`;
  const BATHYMETRY_CONTOURS =
    `${BATHYMETRY_ASSET_BASE}/shimizu-bathymetry-contours.geojson`;
  const BATHYMETRY_RECTANGLE = Cesium.Rectangle.fromDegrees(
    138.5880566,
    35.1129536,
    138.6316566,
    35.1179036
  );
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const worldTerrainProvider = await Cesium.createWorldTerrainAsync({
    requestVertexNormals: true,
  });
  const baseProvider = new Cesium.OpenStreetMapImageryProvider({
    url: "https://tile.openstreetmap.org/",
    credit: "© OpenStreetMap contributors",
  });

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: worldTerrainProvider,
    baseLayer: new Cesium.ImageryLayer(baseProvider),
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    selectionIndicator: false,
    infoBox: false,
  });
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.depthTestAgainstTerrain = false;
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#08131d");
  viewer.scene.requestRenderMode = true;
  viewer.scene.maximumRenderTimeChange = Infinity;
  // Fix clock to noon JST (03:00 UTC) so the scene renders in daytime
  viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2026-08-12T03:00:00Z");
  viewer.clock.shouldAnimate = false;

  let bathymetryOverlay = null;
  let bathymetryExtent = null;
  let bathymetryContours = null;
  try {
    bathymetryOverlay = viewer.entities.add({
      show: false,
      rectangle: {
        coordinates: BATHYMETRY_RECTANGLE,
        height: 120,
        material: new Cesium.ImageMaterialProperty({
          image: BATHYMETRY_DEPTH_IMAGE,
          transparent: true,
        }),
      },
    });
    bathymetryExtent = viewer.entities.add({
      show: false,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights([
          138.5880566, 35.1129536, 121,
          138.6316566, 35.1129536, 121,
          138.6316566, 35.1179036, 121,
          138.5880566, 35.1179036, 121,
          138.5880566, 35.1129536, 121,
        ]),
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.fromCssColorString("#f8fafc").withAlpha(0.9),
          dashLength: 12,
        }),
      },
    });

    bathymetryContours = await Cesium.GeoJsonDataSource.load(
      BATHYMETRY_CONTOURS,
      {
        stroke: Cesium.Color.WHITE.withAlpha(0.96),
        strokeWidth: 3,
        clampToGround: true,
        credit: "Virtual Shizuoka 2025 ALB (CC BY 4.0)",
      }
    );
    for (const entity of bathymetryContours.entities.values) {
      const positions = entity.polyline?.positions?.getValue(
        viewer.clock.currentTime
      );
      if (!positions) {
        continue;
      }
      entity.polyline.clampToGround = false;
      entity.polyline.positions = positions.map((position) => {
        const cartographic = Cesium.Cartographic.fromCartesian(position);
        return Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          121
        );
      });
      entity.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.fromCssColorString("#081d58"),
        outlineWidth: 2,
      });
    }
    bathymetryContours.show = false;
    await viewer.dataSources.add(bathymetryContours);
  } catch (error) {
    console.warn("Shimizu bathymetry overlay unavailable:", error);
  }

  viewer.scene.canvas.setAttribute(
    "aria-label",
    "Interactive 3D voxel analytics scene for the Shizuoka watershed"
  );
  viewer.scene.canvas.setAttribute("tabindex", "0");

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --vx-bg: rgba(7, 17, 28, 0.94);
      --vx-panel: #0e2233;
      --vx-text: #f4f8fb;
      --vx-muted: #b9cbd9;
      --vx-accent: #56d6c9;
      --vx-warn: #ffd166;
      --vx-border: #496477;
      --vx-focus: #fff3a3;
    }
    .vx-ui, .vx-ui * { box-sizing: border-box; }
    .vx-ui {
      position: absolute; inset: 10px auto 10px 10px; z-index: 20;
      width: min(390px, calc(100vw - 20px)); overflow: auto;
      color: var(--vx-text); background: var(--vx-bg);
      border: 1px solid var(--vx-border); border-radius: 14px;
      box-shadow: 0 16px 48px rgba(0,0,0,.42);
      font: 13px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif;
      scrollbar-color: #6f8da2 #102231;
    }
    .vx-ui[hidden], .vx-story[hidden], .vx-open[hidden] { display: none; }
    .vx-head { position: sticky; top: 0; z-index: 2; padding: 15px 16px 12px;
      background: #0b1b29; border-bottom: 1px solid var(--vx-border); }
    .vx-kicker { color: var(--vx-accent); font-size: 11px; font-weight: 750;
      letter-spacing: .1em; text-transform: uppercase; }
    .vx-title { margin: 3px 34px 2px 0; font-size: 19px; line-height: 1.2; }
    .vx-subtitle, .vx-note { color: var(--vx-muted); }
    .vx-close { position: absolute; top: 11px; right: 11px; }
    .vx-body { padding: 12px 16px 18px; }
    .vx-chapters, .vx-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .vx-chapters { margin-bottom: 12px; }
    .vx-ui button, .vx-story button, .vx-open, .vx-ui select, .vx-ui input {
      min-height: 36px; border: 1px solid var(--vx-border); border-radius: 8px;
      color: var(--vx-text); background: #183449; font: inherit;
    }
    .vx-ui button, .vx-story button, .vx-open { padding: 6px 10px; cursor: pointer; }
    .vx-ui button:hover, .vx-story button:hover, .vx-open:hover { background: #24506a; }
    .vx-ui button[aria-pressed="true"] { color: #07151e; background: var(--vx-accent);
      border-color: var(--vx-accent); font-weight: 700; }
    .vx-ui :focus-visible, .vx-story :focus-visible, .vx-open:focus-visible {
      outline: 3px solid var(--vx-focus); outline-offset: 2px;
    }
    .vx-field { display: grid; gap: 5px; margin: 10px 0; }
    .vx-field select { width: 100%; padding: 6px 9px; }
    .vx-field input[type="range"] { width: 100%; min-height: 28px; accent-color: var(--vx-accent); }
    .vx-card { margin: 12px 0; padding: 11px; background: var(--vx-panel);
      border: 1px solid #344f62; border-radius: 10px; }
    .vx-card h2 { margin: 0 0 8px; font-size: 14px; }
    .vx-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .vx-metric { padding: 8px; background: #0a1a27; border-radius: 7px; }
    .vx-metric strong { display: block; color: var(--vx-accent); font-size: 16px; }
    .vx-legend { height: 9px; margin: 7px 0 3px; border-radius: 99px;
      background: linear-gradient(90deg,#2a68b8,#39b7b1,#f4d35e,#ee6c4d); }
    .vx-status { color: var(--vx-warn); font-weight: 650; }
    .vx-details { margin-top: 8px; border-top: 1px solid #355166; }
    .vx-details summary { padding: 10px 0; cursor: pointer; font-weight: 700; }
    .vx-details p, .vx-details ol, .vx-details ul { margin: 4px 0 10px; }
    .vx-details a { color: #8deee5; }
    .vx-story {
      position: absolute; z-index: 21; right: 18px; bottom: 26px;
      width: min(560px, calc(100vw - 430px));
      padding: 14px 16px; color: var(--vx-text); background: rgba(7,17,28,.96);
      border: 1px solid var(--vx-border); border-radius: 12px;
      box-shadow: 0 12px 36px rgba(0,0,0,.42);
      font: 14px/1.5 system-ui, sans-serif;
    }
    .vx-story h2 { margin: 0 0 4px; font-size: 17px; }
    .vx-story p { margin: 0 0 11px; color: #d5e2eb; }
    .vx-story-controls { display: flex; gap: 7px; flex-wrap: wrap; }
    .vx-open { position: absolute; z-index: 20; top: 10px; left: 10px; }
    .vx-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
    /* Voxel inspect popup */
    .vx-inspect {
      position: absolute; z-index: 30; pointer-events: none;
      padding: 10px 13px; background: rgba(7,17,28,.97);
      border: 1px solid var(--vx-accent); border-radius: 10px;
      box-shadow: 0 8px 28px rgba(0,0,0,.5);
      font: 12px/1.5 system-ui, sans-serif; color: var(--vx-text);
      min-width: 200px; max-width: 260px;
      transform: translate(-50%, calc(-100% - 14px));
    }
    .vx-inspect[hidden] { display: none; }
    .vx-inspect-title { color: var(--vx-accent); font-size: 10px; font-weight: 750;
      letter-spacing: .1em; text-transform: uppercase; margin-bottom: 5px; }
    .vx-inspect-row { display: flex; justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,.07); padding: 3px 0; }
    .vx-inspect-row:last-child { border-bottom: none; }
    .vx-inspect-key { color: var(--vx-muted); }
    .vx-inspect-val { font-weight: 700; font-variant-numeric: tabular-nums; }
    .vx-inspect-crosshair {
      position: absolute; z-index: 29; pointer-events: none;
      width: 18px; height: 18px; transform: translate(-50%, -50%);
    }
    @media (max-width: 680px) {
      .vx-ui { bottom: auto; max-height: 40vh; }
      .vx-story { right: auto; left: 50%; bottom: 8px;
        transform: translateX(-50%); width: calc(100vw - 28px); }
    }
    @media (prefers-reduced-motion: reduce) {
      .vx-ui *, .vx-story * { scroll-behavior: auto !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);

  const state = {
    chapter: 0,
    view: "saturation",
    aggregation: "average",
    threshold: 0.15,
    clip: 1,
    scenarioHour: 18,
    revision: 0,
    selected: null,
    overrideBoost: 0,
    tourOpen: false,
    tourPlaying: false,
  };

  const cameras = [
    {
      label: "Abe River watershed",
      target: [138.383, 35.05, 200],
      heading: 185,
      pitch: -28,
      range: 22000,
    },
    {
      label: "Voxel analytics volume",
      target: [138.383, 34.972, 300],
      heading: 205,
      pitch: -35,
      range: 12000,
    },
    {
      label: "Urban core + LiDAR",
      target: [138.383, 34.972, 40],
      heading: 200,
      pitch: -22,
      range: 7000,
    },
    {
      label: "Shimizu coastal survey",
      target: [138.597, 35.114, 0],
      heading: 0,
      pitch: -88,
      range: 2600,
    },
  ];
  const tourCopy = [
    {
      title: "1. Abe River watershed",
      body:
        "Water intelligence begins in the mountains. The Abe River drains ~167 km² of the Akaishi range before entering Shizuoka city. The voxel analytics volume covers this full watershed corridor — mountains to coast.",
    },
    {
      title: "2. Watershed voxelization",
      body:
        "Each voxel cell aggregates water saturation, topographic wetness, and runoff risk across the 5 km × 6 km × 600 m urban corridor volume. Switch analytical views, adjust the visibility threshold, or scrub through the 24-hour storm simulation below.",
    },
    {
      title: "3. Urban buildings + voxel overlap",
      body:
        "PLATEAU 3D buildings mark every structure in the Abe delta. The voxel volume sits beneath them — showing subsurface water saturation under the city's foundations. High saturation under dense urban areas signals elevated flood and liquefaction risk.",
    },
    {
      title: "4. Shimizu coastal bathymetry",
      body:
        "This regional coastal case study maps measured Virtual Shizuoka Airborne Laser Bathymetry along the Shimizu coast. Color appears only where the DEM records depths below mean sea level; white contours mark 2 m intervals down to 10 m. Transparent areas are no-data, not assumed seabed. This coverage is separate from the Abe River mouth.",
    },
  ];

  function flyToChapter(index) {
    if (Cesium.defined(voxelPrimitive)) {
      voxelPrimitive.show = index !== 3;
    }
    if (bathymetryOverlay) {
      bathymetryOverlay.show = index === 3;
    }
    if (bathymetryExtent) {
      bathymetryExtent.show = index === 3;
    }
    if (bathymetryContours) {
      bathymetryContours.show = index === 3;
    }
    viewer.terrainProvider = worldTerrainProvider;
    viewer.scene.globe.material = undefined;
    viewer.scene.verticalExaggeration = 1.0;
    viewer.scene.verticalExaggerationRelativeHeight = 0.0;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    if (index === 3) {
      const camera = cameras[index];
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(
          Cesium.Cartesian3.fromDegrees(...camera.target),
          1
        ),
        {
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(camera.heading),
            Cesium.Math.toRadians(camera.pitch),
            camera.range
          ),
          duration: reducedMotion ? 0 : 1.4,
        }
      );
      return;
    }
    const camera = cameras[index];
    viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(...camera.target), 1),
      {
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(camera.heading),
          Cesium.Math.toRadians(camera.pitch),
          camera.range
        ),
        duration: reducedMotion ? 0 : 1.4,
      }
    );
  }

  function hashNoise(x, y, z, seed) {
    const value = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 19.19) * 43758.5453;
    return value - Math.floor(value);
  }

  function median(values) {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  function mode(values) {
    const counts = new Map();
    let winner = values[0];
    let winnerCount = 0;
    for (const value of values) {
      const bucket = Math.round(value / 0.025) * 0.025;
      const count = (counts.get(bucket) || 0) + 1;
      counts.set(bucket, count);
      if (count > winnerCount) {
        winner = bucket;
        winnerCount = count;
      }
    }
    return winner;
  }

  function aggregate(values, method) {
    if (method === "minimum") return Math.min(...values);
    if (method === "maximum") return Math.max(...values);
    if (method === "median") return median(values);
    if (method === "mode") return mode(values);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function analyticalValue(x, y, z, scenarioHour, view, method) {
    const xn = x;
    const yn = y;
    const zn = z;
    const river = Math.exp(-Math.pow((xn - (0.48 + 0.12 * Math.sin(yn * 5))) / 0.16, 2));
    const lowland = 1 - zn;
    const mountainRecharge = Math.max(0, yn - 0.45) * (0.55 + 0.45 * zn);
    const storm = Cesium.Math.clamp((scenarioHour - 6) / 18, 0, 1);
    const samples = [];
    for (let sample = 0; sample < 7; sample += 1) {
      const noise = (hashNoise(x * 97, y * 89, z * 83, sample) - 0.5) * 0.06;
      const baseline = 0.1 + 0.12 * lowland + 0.06 * river + 0.06 * mountainRecharge + noise;
      const saturation = Cesium.Math.clamp(
        baseline + storm * (0.21 * river + 0.1 * lowland + 0.08 * mountainRecharge),
        0.04,
        0.62
      );
      if (view === "change") samples.push(saturation - baseline);
      else if (view === "wetness") samples.push(Cesium.Math.clamp((river * 0.55 + lowland * 0.3 + saturation) / 1.85, 0, 1));
      else if (view === "runoff") samples.push(Cesium.Math.clamp(storm * (0.55 * saturation + 0.35 * river + 0.1 * (1 - mountainRecharge)), 0, 1));
      else if (view === "simulation") samples.push(Cesium.Math.clamp(saturation + 0.08 * Math.sin((xn + yn) * 10 - storm * 4), 0, 0.7));
      else samples.push(saturation);
    }
    return aggregate(samples, method);
  }

  function ShizuokaVoxelProvider(options) {
    this.shape = Cesium.VoxelShapeType.BOX;
    this.dimensions = new Cesium.Cartesian3(8, 8, 8);
    this.paddingBefore = Cesium.Cartesian3.ZERO;
    this.paddingAfter = Cesium.Cartesian3.ZERO;
    this.names = ["value"];
    this.types = [Cesium.MetadataType.SCALAR];
    this.componentTypes = [Cesium.MetadataComponentType.FLOAT32];
    this.minimumValues = [[0]];
    this.maximumValues = [[options.view === "change" ? 0.35 : 1]];
    this.availableLevels = 3;
    this.maximumTileCount = 73;
    this.globalTransform = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(138.383, 34.972, 300)
    );
    this.shapeTransform = Cesium.Matrix4.fromScale(
      new Cesium.Cartesian3(5000, 6000, 600)
    );
    this.view = options.view;
    this.aggregation = options.aggregation;
    this.scenarioHour = options.scenarioHour;
    this.overrideBoost = options.overrideBoost;
    this.requests = 0;
  }

  ShizuokaVoxelProvider.prototype.requestData = function (options) {
    const { tileLevel = 0, tileX = 0, tileY = 0, tileZ = 0 } = options;
    if (tileLevel >= this.availableLevels) {
      return Promise.reject(new Error(`No voxel tiles beyond level ${this.availableLevels - 1}`));
    }
    this.requests += 1;
    const dim = this.dimensions;
    const tilesAtLevel = 2 ** tileLevel;
    const values = new Float32Array(dim.x * dim.y * dim.z);
    for (let z = 0; z < dim.z; z += 1) {
      for (let y = 0; y < dim.y; y += 1) {
        for (let x = 0; x < dim.x; x += 1) {
          const gx = (tileX * dim.x + x) / (tilesAtLevel * dim.x - 1);
          const gy = (tileY * dim.y + y) / (tilesAtLevel * dim.y - 1);
          const gz = (tileZ * dim.z + z) / (tilesAtLevel * dim.z - 1);
          const index = z * dim.y * dim.x + y * dim.x + x;
          let value = analyticalValue(
            gx,
            gy,
            gz,
            this.scenarioHour,
            this.view,
            this.aggregation
          );
          if (
            tileLevel === 2 &&
            tileX === 1 &&
            tileY === 2 &&
            tileZ === 1 &&
            x === 4 &&
            y === 4 &&
            z === 4
          ) {
            value += this.overrideBoost;
          }
          values[index] = value;
        }
      }
    }
    return Promise.resolve(Cesium.VoxelContent.fromMetadataArray([values]));
  };

  function createShader() {
    return new Cesium.CustomShader({
      uniforms: {
        u_threshold: { type: Cesium.UniformType.FLOAT, value: state.threshold },
        u_opacity: { type: Cesium.UniformType.FLOAT, value: 0.78 },
        u_view: {
          type: Cesium.UniformType.INT,
          value: ["saturation", "change", "wetness", "runoff", "simulation"].indexOf(state.view),
        },
      },
      fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
        {
          float value = fsInput.metadata.value;
          float normalized = u_view == 1 ? clamp(value / 0.35, 0.0, 1.0) : clamp(value, 0.0, 1.0);
          // Hydrological convention: dry=amber, moderate=teal, saturated=deep blue
          vec3 low = u_view == 1 ? vec3(0.88, 0.62, 0.08) : vec3(0.95, 0.72, 0.25);
          vec3 mid = u_view == 3 ? vec3(0.98, 0.68, 0.16) : vec3(0.18, 0.72, 0.66);
          vec3 high = u_view == 4 ? vec3(0.95, 0.30, 0.38) : vec3(0.10, 0.38, 0.80);
          vec3 ramp = normalized < 0.5
            ? mix(low, mid, normalized * 2.0)
            : mix(mid, high, (normalized - 0.5) * 2.0);
          vec3 normal = fsInput.attributes.normalEC;
          float lighting = 0.58 + 0.42 * max(0.0, dot(normal, czm_lightDirectionEC));
          material.diffuse = ramp * lighting;
          material.alpha = value >= u_threshold ? u_opacity : 0.0;
        }`,
    });
  }

  let voxelPrimitive;
  let provider;
  function rebuildVoxelPrimitive() {
    if (Cesium.defined(voxelPrimitive)) {
      viewer.scene.primitives.remove(voxelPrimitive);
    }
    provider = new ShizuokaVoxelProvider(state);
    voxelPrimitive = viewer.scene.primitives.add(
      new Cesium.VoxelPrimitive({
        provider,
        customShader: createShader(),
      })
    );
    voxelPrimitive.nearestSampling = false;
    voxelPrimitive.screenSpaceError = 3;
    voxelPrimitive.stepSize = 0.65;
    voxelPrimitive.maxClippingBounds = new Cesium.Cartesian3(1, 1, state.clip);
    voxelPrimitive.tileLoad.addEventListener(() => {
      const revision = ui.querySelector("#vx-revision");
      if (revision) {
        revision.textContent =
          `Revision ${state.revision} · ${provider.requests} voxel tiles streamed`;
      }
    });
    state.revision += 1;
    viewer.scene.requestRender();
  }

  const ui = document.createElement("section");
  ui.className = "vx-ui";
  ui.setAttribute("aria-labelledby", "vx-title");
  ui.innerHTML = `
    <header class="vx-head">
      <div class="vx-kicker">Voxel analytics · CRS confirmation required</div>
      <h1 class="vx-title" id="vx-title">Shizuoka water intelligence</h1>
      <div class="vx-subtitle">Mountains → watershed → city → coast</div>
      <button class="vx-close" id="vx-close" type="button" aria-label="Close analytics panel">Close</button>
    </header>
    <div class="vx-body">
      <nav class="vx-chapters" aria-label="Geographic chapters"></nav>
      <div class="vx-actions">
        <button type="button" id="vx-open-tour">Open guided tour</button>
      </div>
      <div class="vx-status" id="vx-source-status" role="status">Illustrative derived voxels · public source context only</div>
      <section class="vx-card" id="vx-bathymetry-summary" aria-labelledby="vx-bathymetry-title" hidden>
        <h2 id="vx-bathymetry-title">Measured depth overlay</h2>
        <div aria-hidden="true" style="height:8px;border-radius:999px;background:linear-gradient(90deg,#081d58,#253494,#225ea8,#1d91c0,#41b6c4,#a1dab4,#ffffcc);margin:7px 0 3px;"></div>
        <div class="vx-note" style="display:flex;justify-content:space-between;"><span>−10.3 m</span><span>0 m MSL</span></div>
        <p class="vx-note" style="margin-top:7px;">White contours: 2 m intervals. Dashed outline: source raster extent. Transparent areas: no measured underwater depth.</p>
      </section>
      <div id="vx-voxel-controls">
        <p style="color:#b9cbd9;font-size:11px;margin:4px 0 10px">💡 Click any voxel in the scene to inspect its analytical value and metadata.</p>

        <label class="vx-field">Analytical view
          <select id="vx-view">
            <option value="saturation">Water saturation</option>
            <option value="change">Change from baseline</option>
            <option value="wetness">Topographic wetness index</option>
            <option value="runoff">Runoff risk index</option>
            <option value="simulation">Infiltration simulation</option>
          </select>
        </label>
        <label class="vx-field">Point-to-voxel aggregation
          <select id="vx-aggregation">
            <option value="average">Average</option>
            <option value="minimum">Minimum</option>
            <option value="maximum">Maximum</option>
            <option value="median">Median</option>
            <option value="mode">Mode (0.025 bins)</option>
          </select>
        </label>
        <label class="vx-field" for="vx-threshold">
          Visibility threshold: <output id="vx-threshold-value">0.15</output>
          <input id="vx-threshold" type="range" min="0" max="0.7" step="0.01" value="0.15" />
        </label>
        <label class="vx-field" for="vx-clip">
          Vertical reveal: <output id="vx-clip-value">100%</output>
          <input id="vx-clip" type="range" min="0.08" max="1" step="0.01" value="1" />
        </label>
        <label class="vx-field" for="vx-time">
          Storm simulation: <output id="vx-time-value">18 h</output>
          <input id="vx-time" type="range" min="0" max="24" step="1" value="18" />
        </label>

        <section class="vx-card" aria-labelledby="vx-kpis-title">
          <h2 id="vx-kpis-title">Active analytical tile</h2>
          <div class="vx-grid">
            <div class="vx-metric">Minimum<strong id="vx-min">—</strong></div>
            <div class="vx-metric">Maximum<strong id="vx-max">—</strong></div>
            <div class="vx-metric">Average<strong id="vx-avg">—</strong></div>
            <div class="vx-metric">Median / mode<strong id="vx-med">—</strong></div>
          </div>
          <div class="vx-legend" aria-hidden="true"></div>
          <div class="vx-note">Low <span style="float:right">High</span></div>
        </section>

        <section class="vx-card" aria-labelledby="vx-update-title">
          <h2 id="vx-update-title">Individual voxel update</h2>
          <p class="vx-note" id="vx-selection">Target: L2 tile (1,2,1), sample (4,4,4)</p>
          <div class="vx-actions">
            <button type="button" id="vx-update">Add +0.08 recharge</button>
            <button type="button" id="vx-clear">Clear update</button>
          </div>
          <p class="vx-note" id="vx-revision">Revision 0</p>
        </section>
      </div>

      <details class="vx-details">
        <summary>LAS/LAZ → voxel/tiling pipeline</summary>
        <ol>
          <li>Validate LP/ALB/MMS provenance, vertical datum and class codes.</li>
          <li>Confirm source CRS, epoch and plane-rectangular zone, then transform to the PSS-requested <strong>EPSG:6677</strong> target; normalize XYZ and retain source IDs.</li>
          <li>Bin points by level, tile coordinate and voxel index; define no-data separately from zero.</li>
          <li>Aggregate with min, max, average, median or an explicitly binned mode.</li>
          <li>Write <strong>FLOAT32</strong> scalar attributes and hierarchy metadata; validate ranges and units.</li>
          <li>Upload the voxelized analytical product to Cesium ion and stream it with a voxel provider.</li>
        </ol>
      </details>
      <details class="vx-details">
        <summary>Large-data streaming architecture</summary>
        <p>This demo exposes 3 LODs and up to 73 octree tiles. Cesium requests visible tiles on demand; each request returns <code>Cesium.VoxelContent.fromMetadataArray([Float32Array])</code>. Production uses implicit hierarchy, spatially coherent tile payloads, request throttling, cache budgets and server-side pre-aggregation.</p>
      </details>
      <details class="vx-details">
        <summary>Indices, change and simulation</summary>
        <p>Change compares aligned baseline/current volumes. Wetness and runoff are dimensionless screening indices. Infiltration is a scenario result. All derived/procedural outputs here are illustrative and require calibration before operational use.</p>
      </details>
      <details class="vx-details">
        <summary>Individual update architecture</summary>
        <p>A write targets <code>dataset/version/level/x/y/z/sample</code>, validates the FLOAT32 attribute, increments the dataset revision, invalidates that tile and its affected ancestors, and publishes an atomic manifest. The client refreshes only the analytical primitive; production providers should use immutable version URLs and cache validators.</p>
      </details>
      <details class="vx-details">
        <summary>Sources and data</summary>
        <p><strong>Coastal bathymetry:</strong> <a href="${DATA_CATALOG}" target="_blank" rel="noopener noreferrer">Virtual Shizuoka</a> 2025 Airborne Laser Bathymetry (CC BY 4.0), tiles 08NE2263–08NE2272. Reprojected directly from the original EPSG:6676 LAS tiles to WGS84, rasterized with PDAL, and shown as a transparent depth overlay with 2 m contours. No-data remains transparent. The source coverage is on the Shimizu coast, separate from the Abe River mouth.</p>
        <p><strong>Voxel analytics:</strong> Illustrative derived voxels over the Abe River corridor. Procedural model only — not a measured product. Requires calibration before operational use.</p>
        <p>Terrain: Cesium World Terrain. City context: PLATEAU 2023 MLIT. Imagery: © OpenStreetMap contributors.</p>
      </details>
      <p class="vx-sr" id="vx-live" aria-live="polite"></p>
    </div>`;
  viewer.container.appendChild(ui);

  const openButton = document.createElement("button");
  openButton.className = "vx-open";
  openButton.type = "button";
  openButton.textContent = "Open voxel analytics";
  openButton.hidden = true;
  viewer.container.appendChild(openButton);

  const story = document.createElement("aside");
  story.className = "vx-story";
  story.hidden = true;
  story.setAttribute("aria-labelledby", "vx-story-title");
  story.innerHTML = `
    <div class="vx-kicker" id="vx-story-step">Guided chapter</div>
    <h2 id="vx-story-title"></h2>
    <p id="vx-story-body"></p>
    <div id="vx-alb-legend" hidden style="margin:0 0 10px;font-size:11px;line-height:1.5;color:#a8c8d8;">
      <strong style="color:#d5e2eb;display:block;margin-bottom:4px;">Measured ALB depth overlay</strong>
      <div aria-hidden="true" style="height:8px;border-radius:999px;background:linear-gradient(90deg,#081d58,#253494,#225ea8,#1d91c0,#41b6c4,#a1dab4,#ffffcc);margin:5px 0 3px;"></div>
      <span style="display:flex;justify-content:space-between;"><span>−10.3 m</span><span>0 m MSL</span></span>
      <span style="display:block;margin-top:3px;">White contours: 2 m · dashed: raster extent · transparent: no measured depth</span>
    </div>
    <div class="vx-story-controls">
      <button type="button" id="vx-prev">Previous</button>
      <button type="button" id="vx-pause">Pause</button>
      <button type="button" id="vx-next">Next</button>
      <button type="button" id="vx-restart">Restart</button>
      <button type="button" id="vx-story-close">Close tour</button>
    </div>`;
  viewer.container.appendChild(story);

  const chapterNav = ui.querySelector(".vx-chapters");
  cameras.forEach((camera, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = camera.label;
    button.addEventListener("click", () => {
      state.chapter = index;
      state.tourPlaying = false;
      flyToChapter(index);
      renderUi();
    });
    chapterNav.appendChild(button);
  });

  function rootStatistics() {
    const values = [];
    for (let z = 0; z < 8; z += 1) {
      for (let y = 0; y < 8; y += 1) {
        for (let x = 0; x < 8; x += 1) {
          values.push(
            analyticalValue(
              x / 7,
              y / 7,
              z / 7,
              state.scenarioHour,
              state.view,
              state.aggregation
            )
          );
        }
      }
    }
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((sum, value) => sum + value, 0) / values.length,
      median: median(values),
      mode: mode(values),
    };
  }

  function renderUi() {
    const stats = rootStatistics();
    [...chapterNav.children].forEach((button, index) => {
      button.setAttribute("aria-pressed", String(index === state.chapter));
    });
    ui.querySelector("#vx-min").textContent = stats.min.toFixed(3);
    ui.querySelector("#vx-max").textContent = stats.max.toFixed(3);
    ui.querySelector("#vx-avg").textContent = stats.average.toFixed(3);
    ui.querySelector("#vx-med").textContent = `${stats.median.toFixed(3)} / ${stats.mode.toFixed(3)}`;
    ui.querySelector("#vx-threshold-value").textContent = state.threshold.toFixed(2);
    ui.querySelector("#vx-clip-value").textContent = `${Math.round(state.clip * 100)}%`;
    ui.querySelector("#vx-time-value").textContent = `${state.scenarioHour} h`;
    ui.querySelector("#vx-revision").textContent =
      `Revision ${state.revision} · ${provider ? provider.requests : 0} tile requests observed`;
    const bathymetryVisible =
      state.chapter === 3 && bathymetryOverlay !== null;
    ui.querySelector("#vx-live").textContent = bathymetryVisible
      ? "Shimizu coastal survey. Measured depths below mean sea level with two-meter contours."
      : `${cameras[state.chapter].label}. ${state.view}, ${state.aggregation} aggregation.`;
    ui.querySelector("#vx-bathymetry-summary").hidden = !bathymetryVisible;
    ui.querySelector("#vx-voxel-controls").hidden = state.chapter === 3;
    ui.querySelector("#vx-source-status").textContent = bathymetryVisible
      ? "Measured Virtual Shizuoka ALB · Shimizu coast"
      : "Illustrative derived voxels · public source context only";
    story.querySelector("#vx-story-step").textContent =
      `Guided chapter ${state.chapter + 1} of ${tourCopy.length}`;
    story.querySelector("#vx-story-title").textContent = tourCopy[state.chapter].title;
    story.querySelector("#vx-story-body").textContent = tourCopy[state.chapter].body;
    story.querySelector("#vx-prev").disabled = state.chapter === 0;
    story.querySelector("#vx-next").disabled = state.chapter === tourCopy.length - 1;
    story.querySelector("#vx-pause").textContent = state.tourPlaying ? "Pause" : "Resume";
    story.querySelector("#vx-alb-legend").hidden =
      !bathymetryVisible;
    story.hidden = !state.tourOpen;
  }

  function rebuildAndRender(message) {
    rebuildVoxelPrimitive();
    renderUi();
    ui.querySelector("#vx-live").textContent = message;
  }

  ui.querySelector("#vx-view").addEventListener("change", (event) => {
    state.view = event.target.value;
    state.threshold = state.view === "change" ? 0.08 : 0.15;
    ui.querySelector("#vx-threshold").value = String(state.threshold);
    rebuildAndRender(`${event.target.selectedOptions[0].text} view loaded.`);
  });
  ui.querySelector("#vx-aggregation").addEventListener("change", (event) => {
    state.aggregation = event.target.value;
    rebuildAndRender(`${event.target.selectedOptions[0].text} aggregation loaded.`);
  });
  ui.querySelector("#vx-threshold").addEventListener("input", (event) => {
    state.threshold = Number(event.target.value);
    voxelPrimitive.customShader.setUniform("u_threshold", state.threshold);
    renderUi();
    viewer.scene.requestRender();
  });
  ui.querySelector("#vx-clip").addEventListener("input", (event) => {
    state.clip = Number(event.target.value);
    voxelPrimitive.maxClippingBounds = new Cesium.Cartesian3(1, 1, state.clip);
    renderUi();
    viewer.scene.requestRender();
  });
  ui.querySelector("#vx-time").addEventListener("change", (event) => {
    state.scenarioHour = Number(event.target.value);
    rebuildAndRender(`Storm simulation advanced to ${state.scenarioHour} hours.`);
  });
  ui.querySelector("#vx-time").addEventListener("input", (event) => {
    state.scenarioHour = Number(event.target.value);
    ui.querySelector("#vx-time-value").textContent = `${state.scenarioHour} h`;
  });
  ui.querySelector("#vx-update").addEventListener("click", () => {
    state.overrideBoost = Math.min(0.32, state.overrideBoost + 0.08);
    rebuildAndRender(
      `Voxel update committed at revision ${state.revision}; recharge boost is ${state.overrideBoost.toFixed(2)}.`
    );
  });
  ui.querySelector("#vx-clear").addEventListener("click", () => {
    state.overrideBoost = 0;
    rebuildAndRender(`Individual voxel update cleared at revision ${state.revision}.`);
  });
  ui.querySelector("#vx-close").addEventListener("click", () => {
    ui.hidden = true;
    story.hidden = true;
    openButton.hidden = false;
    openButton.focus();
  });
  openButton.addEventListener("click", () => {
    ui.hidden = false;
    story.hidden = !state.tourOpen;
    openButton.hidden = true;
    ui.querySelector("#vx-close").focus();
  });
  ui.querySelector("#vx-open-tour").addEventListener("click", () => {
    state.tourOpen = true;
    state.tourPlaying = !reducedMotion;
    state.chapter = 0;
    flyToChapter(0);
    story.hidden = false;
    // Reset interval so the first chapter gets the full 9s
    if (window.__shizuokaVoxelTourTimer) {
      window.clearInterval(window.__shizuokaVoxelTourTimer);
    }
    window.__shizuokaVoxelTourTimer = window.setInterval(() => {
      if (!state.tourPlaying || !state.tourOpen) return;
      if (state.chapter < tourCopy.length - 1) {
        setTourChapter(state.chapter + 1);
      } else {
        state.tourPlaying = false;
        renderUi();
      }
    }, 9000);
    renderUi();
    story.querySelector("#vx-pause").focus();
  });

  function setTourChapter(index) {
    state.chapter = Cesium.Math.clamp(index, 0, tourCopy.length - 1);
    flyToChapter(state.chapter);
    renderUi();
  }
  story.querySelector("#vx-prev").addEventListener("click", () => {
    state.tourPlaying = false;
    setTourChapter(state.chapter - 1);
  });
  story.querySelector("#vx-next").addEventListener("click", () => {
    state.tourPlaying = false;
    setTourChapter(state.chapter + 1);
  });
  story.querySelector("#vx-pause").addEventListener("click", () => {
    state.tourPlaying = !state.tourPlaying;
    renderUi();
  });
  story.querySelector("#vx-restart").addEventListener("click", () => {
    state.tourOpen = true;
    state.tourPlaying = !reducedMotion;
    setTourChapter(0);
  });
  story.querySelector("#vx-story-close").addEventListener("click", () => {
    state.tourOpen = false;
    state.tourPlaying = false;
    story.hidden = true;
    ui.querySelector(".vx-chapters button").focus();
  });

  // Tour timer is initialized when the user clicks "Open guided tour"
  // to ensure chapter 0 always gets the full 9s window.
  if (window.__shizuokaVoxelTourTimer) {
    window.clearInterval(window.__shizuokaVoxelTourTimer);
  }

  try {
    const cityTileset = await Cesium.Cesium3DTileset.fromUrl(PLATEAU_AOI_LOD2, {
      maximumScreenSpaceError: 32,
      cacheBytes: 512 * 1024 * 1024,
      maximumCacheOverflowBytes: 256 * 1024 * 1024,
      cullWithChildrenBounds: false,
      dynamicScreenSpaceError: false,
      foveatedScreenSpaceError: false,
    });
    cityTileset.style = new Cesium.Cesium3DTileStyle({
      color: "color('#b7cbd5')",
    });
    viewer.scene.primitives.add(cityTileset);
  } catch (error) {
    ui.querySelector("#vx-source-status").textContent =
      "Illustrative derived voxels · PLATEAU city context unavailable";
  }

  rebuildVoxelPrimitive();
  flyToChapter(0);
  renderUi();

  // ── Voxel click-to-inspect ───────────────────────────────────────────────
  // Crosshair SVG
  const crosshair = document.createElement("div");
  crosshair.className = "vx-inspect-crosshair";
  crosshair.innerHTML = `<svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="7" stroke="#56d6c9" stroke-width="1.5" opacity="0.9"/>
    <line x1="9" y1="2" x2="9" y2="6" stroke="#56d6c9" stroke-width="1.5"/>
    <line x1="9" y1="12" x2="9" y2="16" stroke="#56d6c9" stroke-width="1.5"/>
    <line x1="2" y1="9" x2="6" y2="9" stroke="#56d6c9" stroke-width="1.5"/>
    <line x1="12" y1="9" x2="16" y2="9" stroke="#56d6c9" stroke-width="1.5"/>
  </svg>`;
  crosshair.hidden = true;
  viewer.container.appendChild(crosshair);

  const inspectPopup = document.createElement("div");
  inspectPopup.className = "vx-inspect";
  inspectPopup.setAttribute("role", "tooltip");
  inspectPopup.hidden = true;
  viewer.container.appendChild(inspectPopup);

  const labelForView = {
    saturation: "Water saturation",
    change: "Change from baseline",
    wetness: "Topographic wetness",
    runoff: "Runoff risk index",
    simulation: "Infiltration sim",
  };

  viewer.screenSpaceEventHandler.setInputAction((event) => {
    const pick = viewer.scene.pick(event.position);

    // Dismiss if clicking off a voxel
    if (!Cesium.defined(pick) || pick.primitive !== voxelPrimitive) {
      inspectPopup.hidden = true;
      crosshair.hidden = true;
      return;
    }

    // Get voxel coordinates from the pick result
    const tileCoords = pick.voxelCoordinates;
    const tileLevel = pick.voxelLevel ?? 0;

    // Reconstruct normalized position within the voxel volume
    // from the pick ray intersection
    const cartesian = viewer.scene.pickPosition(event.position);
    if (!Cesium.defined(cartesian)) return;

    // Transform pick position into the voxel's local ENU frame
    const invTransform = Cesium.Matrix4.inverseTransformation(
      voxelPrimitive.modelMatrix, new Cesium.Matrix4()
    );
    const localPos = Cesium.Matrix4.multiplyByPoint(invTransform, cartesian, new Cesium.Cartesian3());
    // shapeTransform maps [-1,1]^3 → ENU meters; invert to get normalized [0,1] coords
    const halfExtents = new Cesium.Cartesian3(5000 / 2, 6000 / 2, 600 / 2);
    const nx = Cesium.Math.clamp((localPos.x / halfExtents.x + 1) / 2, 0, 1);
    const ny = Cesium.Math.clamp((localPos.y / halfExtents.y + 1) / 2, 0, 1);
    const nz = Cesium.Math.clamp((localPos.z / halfExtents.z + 1) / 2, 0, 1);

    const value = analyticalValue(nx, ny, nz, state.scenarioHour, state.view, state.aggregation);
    const r = risk => {
      if (risk >= 0.55) return "HIGH";
      if (risk >= 0.35) return "MODERATE";
      if (risk >= 0.15) return "LOW";
      return "MINIMAL";
    };

    // Convert normalized to approximate geographic coords
    // Voxel center: 138.383°E, 34.972°N; extents 5km E-W, 6km N-S, 600m Z
    const lon = (138.383 - 0.0225) + nx * (5000 / 111320 * (1 / Math.cos(34.972 * Math.PI / 180)));
    const lat = (34.972 - 0.027) + ny * (6000 / 111320);
    const elev = Math.round(300 + (nz - 0.5) * 600);

    const viewLabel = labelForView[state.view] || state.view;
    inspectPopup.innerHTML = `
      <div class="vx-inspect-title">Voxel Inspector</div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">View</span><span class="vx-inspect-val">${viewLabel}</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Value</span><span class="vx-inspect-val">${value.toFixed(4)}</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Risk class</span><span class="vx-inspect-val">${r(value)}</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Elev (approx)</span><span class="vx-inspect-val">${elev} m</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Lon / Lat</span><span class="vx-inspect-val">${lon.toFixed(4)}° / ${lat.toFixed(4)}°</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Normalized XYZ</span><span class="vx-inspect-val">${nx.toFixed(2)}, ${ny.toFixed(2)}, ${nz.toFixed(2)}</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Storm hour</span><span class="vx-inspect-val">${state.scenarioHour} h</span></div>
      <div class="vx-inspect-row"><span class="vx-inspect-key">Aggregation</span><span class="vx-inspect-val">${state.aggregation}</span></div>
      <div class="vx-inspect-row" style="color:rgba(185,203,217,.55);font-size:10px;padding-top:4px">
        <span>Illustrative · not a field measurement</span>
      </div>`;

    // Position popup and crosshair at click pixel
    const px = event.position.x;
    const py = event.position.y;
    inspectPopup.style.left = px + "px";
    inspectPopup.style.top = py + "px";
    crosshair.style.left = px + "px";
    crosshair.style.top = py + "px";
    inspectPopup.hidden = false;
    crosshair.hidden = false;
    viewer.scene.requestRender();
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // Dismiss popup on right-click or Escape
  viewer.screenSpaceEventHandler.setInputAction(() => {
    inspectPopup.hidden = true;
    crosshair.hidden = true;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { inspectPopup.hidden = true; crosshair.hidden = true; }
  });
})();
