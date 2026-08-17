// Measured ALB voxel analytics: Abe River mouth morphology.
// Paste into https://sandcastle.cesium.com/ (CesiumJS 1.144-style global API).

(async function () {
  "use strict";

  const ION_VOXEL_TILES_URL = "";
  const ALB_ORIGINAL_URL =
    "https://virtual-shizuoka.s3.amazonaws.com/2025/ALB/Original/08/ND/97/08ND9755.zip";
  const ALB_GRID_URL =
    "https://virtual-shizuoka.s3.amazonaws.com/2025/ALB/Grid/08/ND/97/08ND9755.zip";
  const VIRTUAL_SHIZUOKA_REGISTRY_URL =
    "https://registry.opendata.aws/virtual_shizuoka/";
  const VIRTUAL_SHIZUOKA_README_URL =
    "https://github.com/aigidjp/opendata_virtualshizuoka/blob/main/README.md";
  const OSM_RIVER_WAY_URL =
    "https://www.openstreetmap.org/way/59328409";
  const PLATEAU_SURUGA_LOD1 =
    "https://assets.cms.plateau.reearth.io/assets/18/aba17e-da3b-441d-9712-a6db88f3e6c5/22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22102_suruga-ku_lod1/tileset.json";

  const TILE = {
    id: "08ND9755",
    center: {
      longitude: 138.392728582,
      latitude: 34.929705442,
      height: 0.8,
    },
    bounds: {
      west: 138.390540204,
      south: 34.929082499,
      east: 138.394918578,
      north: 34.930328346,
    },
    localBounds: {
      west: -10000,
      south: -118800,
      east: -9600.001,
      north: -118662.229,
    },
    elevationRange: [-0.542, 2.974],
    pointCount: 1682108,
    waterPointCount: 21668,
  };
  const ANALYSIS_WINDOW = {
    tileIds: [
      "08ND9747", "08ND9748", "08ND9754", "08ND9755", "08ND9756",
      "08ND9757", "08ND9758", "08ND9762", "08ND9763", "08ND9764",
      "08ND9765", "08ND9766", "08ND9767",
    ],
    center: {
      longitude: 138.394194419,
      latitude: 34.930437962,
      height: 0.8,
    },
    bounds: {
      west: 138.381787315,
      south: 34.926369848,
      east: 138.406611946,
      north: 34.934504808,
    },
    localBounds: { west: -10800, south: -119100, east: -8532, north: -118200 },
    elevationRange: [-7.2, 9.7],
    widthMeters: 2268,
    heightMeters: 900,
  };
  const REFERENCE_SURFACE_ELEVATION = 0.8;
  const RIVER_ALIGNMENT_CONTEXT = {
    source: "OpenStreetMap way 59328409",
    upstream: { longitude: 138.3596231, latitude: 34.9665213 },
    mouth: { longitude: 138.3924589, latitude: 34.9282139 },
    flowBearingDegrees: 145,
  };
  const FALLBACK_DISPLAY_TRANSFORM_NOTE =
    "Fallback only: ENU footprint shell with vertical display exaggeration; source EPSG:6676 points are never rotated.";
  const CAMERA_TARGETS = {
    center: ANALYSIS_WINDOW.center,
    mouth: { longitude: 138.393806, latitude: 34.929749, height: 0.8 },
    westBank: { longitude: 138.385612644, latitude: 34.930430185, height: 0.8 },
    northChannel: { longitude: 138.393818766, latitude: 34.933142084, height: 0.8 },
    southBay: { longitude: 138.393825734, latitude: 34.927733189, height: 0.8 },
  };
  const SHAPE_HALF_SIZE = new Cesium.Cartesian3(
    ANALYSIS_WINDOW.widthMeters / 2,
    ANALYSIS_WINDOW.heightMeters / 2,
    45
  );
  const DISPLAY_CENTER_HEIGHT =
    REFERENCE_SURFACE_ELEVATION - SHAPE_HALF_SIZE.z;
  const ANALYSIS_RADIUS = Cesium.Cartesian3.magnitude(SHAPE_HALF_SIZE);
  const FALLBACK_VERTICAL_EXAGGERATION =
    (SHAPE_HALF_SIZE.z * 2) /
    (ANALYSIS_WINDOW.elevationRange[1] - ANALYSIS_WINDOW.elevationRange[0]);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let terrainProvider;
  try {
    terrainProvider = await Cesium.createWorldBathymetryAsync({
      requestVertexNormals: true,
    });
  } catch (error) {
    console.error("Cesium World Bathymetry failed to load; using ellipsoid terrain.", error);
    terrainProvider = new Cesium.EllipsoidTerrainProvider();
  }

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider,
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
  viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("2025-07-15T03:00:00Z");
  viewer.clock.shouldAnimate = false;
  viewer.scene.globe.enableLighting = true;
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#07141d");
  viewer.scene.requestRenderMode = true;
  viewer.scene.maximumRenderTimeChange = Infinity;
  viewer.scene.canvas.setAttribute(
    "aria-label",
    "Interactive ALB morphology voxel analysis at the Abe River mouth"
  );
  viewer.scene.canvas.setAttribute("tabindex", "0");

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --alb-bg: rgba(6, 16, 25, .95);
      --alb-panel: #0d2332;
      --alb-panel-2: #091a25;
      --alb-text: #f4f8fb;
      --alb-muted: #b9cad5;
      --alb-accent: #60ddcf;
      --alb-warn: #ffd166;
      --alb-error: #ff8f8f;
      --alb-border: #496779;
      --alb-focus: #fff1a8;
    }
    .alb-ui, .alb-ui * { box-sizing: border-box; }
    .alb-ui {
      position: absolute; inset: 10px auto 10px 10px; z-index: 20;
      width: min(408px, calc(100vw - 20px)); overflow: auto;
      color: var(--alb-text); background: var(--alb-bg);
      border: 1px solid var(--alb-border); border-radius: 14px;
      box-shadow: 0 18px 54px rgba(0,0,0,.46);
      font: 13px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif;
      scrollbar-color: #6f8da2 #102231;
      contain: layout style paint;
    }
    .alb-ui[hidden], .alb-story[hidden], .alb-open[hidden] { display: none; }
    .alb-head {
      position: sticky; top: 0; z-index: 2; padding: 15px 16px 12px;
      background: #0a1b28; border-bottom: 1px solid var(--alb-border);
    }
    .alb-kicker {
      color: var(--alb-accent); font-size: 11px; font-weight: 780;
      letter-spacing: .1em; text-transform: uppercase;
    }
    .alb-title { margin: 3px 42px 2px 0; font-size: 20px; line-height: 1.18; }
    .alb-subtitle, .alb-note { color: var(--alb-muted); }
    .alb-close { position: absolute; top: 11px; right: 11px; }
    .alb-body { padding: 12px 16px 18px; }
    .alb-actions, .alb-badges, .alb-story-controls {
      display: flex; gap: 7px; flex-wrap: wrap;
    }
    .alb-badges { margin: 10px 0; }
    .alb-badge {
      display: inline-flex; align-items: center; min-height: 26px; padding: 3px 8px;
      border: 1px solid #527385; border-radius: 999px; background: #102b3c;
      color: #dceaf2; font-size: 11px; font-weight: 720;
    }
    .alb-badge[data-kind="measured"] { color: #bff8df; border-color: #3d9d75; }
    .alb-badge[data-kind="derived"] { color: #cfe4ff; border-color: #477aaa; }
    .alb-badge[data-kind="fallback"] { color: #ffe6a6; border-color: #a47d29; }
    .alb-ui button, .alb-story button, .alb-open, .alb-ui select, .alb-ui input {
      min-height: 36px; border: 1px solid var(--alb-border); border-radius: 8px;
      color: var(--alb-text); background: #17384c; font: inherit;
    }
    .alb-ui button, .alb-story button, .alb-open { padding: 6px 10px; cursor: pointer; }
    .alb-ui button:hover, .alb-story button:hover, .alb-open:hover { background: #24556e; }
    .alb-ui button[aria-pressed="true"] {
      color: #06151c; background: var(--alb-accent);
      border-color: var(--alb-accent); font-weight: 750;
    }
    .alb-ui :focus-visible, .alb-story :focus-visible, .alb-open:focus-visible {
      outline: 3px solid var(--alb-focus); outline-offset: 2px;
    }
    .alb-field { display: grid; gap: 5px; margin: 10px 0; }
    .alb-field select { width: 100%; padding: 6px 9px; }
    .alb-field input[type="range"] {
      width: 100%; min-height: 28px; accent-color: var(--alb-accent);
    }
    .alb-toggle {
      display: grid; grid-template-columns: 20px 1fr; gap: 2px 8px;
      align-items: center; margin: 11px 0; cursor: pointer;
    }
    .alb-toggle input {
      width: 18px; height: 18px; min-height: 0; margin: 0;
      accent-color: var(--alb-accent);
    }
    .alb-toggle small { grid-column: 2; color: var(--alb-muted); }
    .alb-card {
      margin: 12px 0; padding: 11px; background: var(--alb-panel);
      border: 1px solid #345366; border-radius: 10px;
    }
    .alb-card h2 { margin: 0 0 8px; font-size: 14px; }
    .alb-callout {
      margin: 11px 0; padding: 10px 11px; border: 1px solid #3b7180;
      background: #102b3c; color: #dceaf2; border-radius: 7px;
      box-shadow: inset 0 2px 0 rgba(96, 221, 207, 0.6);
    }
    .alb-callout strong { display: block; color: var(--alb-accent); margin-bottom: 3px; }
    .alb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .alb-metric { padding: 8px; background: var(--alb-panel-2); border-radius: 7px; }
    .alb-metric strong { display: block; color: var(--alb-accent); font-size: 15px; }
    .alb-legend {
      height: 10px; margin: 9px 0 3px; border-radius: 99px;
      background: linear-gradient(90deg,#352a87,#1167a6,#21a585,#a7d84c,#fde725);
    }
    .alb-legend-labels { display: flex; justify-content: space-between; color: var(--alb-muted); }
    .alb-status { color: var(--alb-warn); font-weight: 680; }
    .alb-status[data-error="true"] { color: var(--alb-error); }
    .alb-details { margin-top: 9px; border-top: 1px solid #355469; }
    .alb-details summary { padding: 10px 0; cursor: pointer; font-weight: 740; }
    .alb-details p, .alb-details ul { margin: 4px 0 10px; }
    .alb-details a { color: #8deee5; }
    .alb-readout { margin: 0; white-space: pre-line; color: #dbe8ef; }
    .alb-story {
      position: absolute; z-index: 21; right: 18px; bottom: 26px;
      width: min(500px, calc(100vw - 450px)); padding: 14px 16px;
      color: var(--alb-text); background: rgba(6,16,25,.97);
      border: 1px solid var(--alb-border); border-radius: 12px;
      box-shadow: 0 14px 40px rgba(0,0,0,.45);
      font: 14px/1.5 system-ui, sans-serif;
    }
    .alb-story h2 { margin: 0 0 4px; font-size: 17px; }
    .alb-story p { margin: 0 0 11px; color: #d5e2eb; }
    .alb-open { position: absolute; z-index: 20; top: 10px; left: 10px; }
    .alb-sr {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    @media (max-width: 760px) {
      .alb-ui { bottom: auto; max-height: 48vh; }
      .alb-story {
        right: auto; left: 50%; bottom: 8px; transform: translateX(-50%);
        width: calc(100vw - 28px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .alb-ui *, .alb-story * { scroll-behavior: auto !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);

  const SCALARS = {
    elevation: {
      label: "Elevation",
      unit: "m",
      range: ANALYSIS_WINDOW.elevationRange,
      method: "Measured when sourced from ALB Z; procedural in the fallback",
      ionProperty: "elevation",
      productionProvenance: "Measured",
    },
    depth: {
      label: "Depth below reference surface",
      unit: "m",
      range: [0, REFERENCE_SURFACE_ELEVATION - ANALYSIS_WINDOW.elevationRange[0]],
      method: "Derived from reference elevation minus measured ALB elevation",
      ionProperty: "depth",
      productionProvenance: "Derived",
    },
    density: {
      label: "Measurement occupancy / coverage",
      unit: "points/voxel",
      range: [0, 96],
      method:
        "Derived only by a voxel aggregation stage that counts ALB returns; coverage evidence, not flow, discharge, or water level",
      ionProperty: null,
      productionProvenance: "Derived",
    },
  };

  const state = {
    scalar: "elevation",
    verticalClip: 1,
    reveal: "volume",
    sectionPosition: 0.5,
    providerKind: "fallback",
    providerState: "Fallback active",
    providerError: "",
    providerRequests: 0,
    tileLoads: 0,
    contextState: "PLATEAU context loading",
    storyStep: 0,
    storyOpen: true,
    storyPlaying: !reducedMotion,
    cutawayEnabled: true,
    sample: null,
    loadGeneration: 0,
  };

  const volumeTransform = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(
      ANALYSIS_WINDOW.center.longitude,
      ANALYSIS_WINDOW.center.latitude,
      DISPLAY_CENTER_HEIGHT
    )
  );
  const shapeTransform = Cesium.Matrix4.fromScale(SHAPE_HALF_SIZE);
  const inverseVolumeTransform = Cesium.Matrix4.inverseTransformation(
    volumeTransform,
    new Cesium.Matrix4()
  );
  const cutawayTransform = Cesium.Transforms.eastNorthUpToFixedFrame(
    Cesium.Cartesian3.fromDegrees(
      ANALYSIS_WINDOW.center.longitude,
      ANALYSIS_WINDOW.center.latitude,
      REFERENCE_SURFACE_ELEVATION
    )
  );
  const originalBackFaceCulling = viewer.scene.globe.backFaceCulling;
  const originalShowSkirts = viewer.scene.globe.showSkirts;
  const surfaceCutaway = new Cesium.ClippingPlaneCollection({
    modelMatrix: cutawayTransform,
    unionClippingRegions: false,
    edgeColor: Cesium.Color.fromCssColorString("#60ddcf"),
    edgeWidth: 1,
    planes: [
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(1, 0, 0),
        -SHAPE_HALF_SIZE.x
      ),
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(-1, 0, 0),
        -SHAPE_HALF_SIZE.x
      ),
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(0, 1, 0),
        -SHAPE_HALF_SIZE.y
      ),
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(0, -1, 0),
        -SHAPE_HALF_SIZE.y
      ),
    ],
  });
  viewer.scene.globe.clippingPlanes = surfaceCutaway;

  function applySurfaceCutaway() {
    surfaceCutaway.enabled = state.cutawayEnabled;
    viewer.scene.globe.backFaceCulling = state.cutawayEnabled
      ? false
      : originalBackFaceCulling;
    viewer.scene.globe.showSkirts = state.cutawayEnabled
      ? false
      : originalShowSkirts;
    viewer.scene.requestRender();
  }
  applySurfaceCutaway();

  function morphologyElevation(x, y) {
    const channelAxis = 0.5 + 0.07 * Math.sin((y - 0.15) * Math.PI * 2.2);
    const channel = Math.exp(-Math.pow((x - channelAxis) / 0.13, 2));
    const mouth = 1 - Cesium.Math.clamp(y * 1.25, 0, 1);
    const sandbar = Math.exp(-Math.pow((x - 0.73) / 0.1, 2)) *
      Math.exp(-Math.pow((y - 0.42) / 0.22, 2));
    const bank = Math.pow(Math.abs(x - 0.5) * 2, 1.7);
    return Cesium.Math.clamp(
      1.7 + bank * 4.8 + sandbar * 2.2 - channel * (4.2 + mouth * 2.8) -
        mouth * 1.9,
      ANALYSIS_WINDOW.elevationRange[0],
      ANALYSIS_WINDOW.elevationRange[1]
    );
  }

  function fallbackScalarValue(scalar, x, y, z) {
    const elevation = Cesium.Math.lerp(
      ANALYSIS_WINDOW.elevationRange[0],
      ANALYSIS_WINDOW.elevationRange[1],
      z
    );
    if (scalar === "depth") {
      return Math.max(0, REFERENCE_SURFACE_ELEVATION - elevation);
    }
    if (scalar === "density") {
      const waterEdge = y < 0.66 + 0.04 * Math.sin(x * Math.PI * 3);
      const channelDensity = Math.exp(-Math.pow((x - 0.5) / 0.2, 2));
      const surface = morphologyElevation(x, y);
      const surfaceProximity = 1 - Math.min(1, Math.abs(elevation - surface) / 5);
      return Cesium.Math.clamp(
        12 + 38 * channelDensity + (waterEdge ? 24 : 7) +
          surfaceProximity * 18,
        0,
        96
      );
    }
    return elevation;
  }

  function FallbackAlbVoxelProvider(scalar) {
    this.shape = Cesium.VoxelShapeType.BOX;
    this.dimensions = new Cesium.Cartesian3(18, 16, 14);
    this.paddingBefore = Cesium.Cartesian3.ZERO;
    this.paddingAfter = Cesium.Cartesian3.ZERO;
    this.names = ["value", "visibility"];
    this.types = [Cesium.MetadataType.SCALAR, Cesium.MetadataType.SCALAR];
    this.componentTypes = [
      Cesium.MetadataComponentType.FLOAT32,
      Cesium.MetadataComponentType.FLOAT32,
    ];
    this.minimumValues = [[SCALARS[scalar].range[0]], [0]];
    this.maximumValues = [[SCALARS[scalar].range[1]], [1]];
    this.availableLevels = 1;
    this.maximumTileCount = 1;
    this.globalTransform = volumeTransform;
    this.shapeTransform = shapeTransform;
    this.scalar = scalar;
    this.requests = 0;
  }

  FallbackAlbVoxelProvider.prototype.requestData = function (options) {
    const { tileLevel = 0, tileX = 0, tileY = 0, tileZ = 0 } = options;
    if (tileLevel >= this.availableLevels) {
      return Promise.reject(
        new Error(
          `Illustrative ALB fallback has no voxel tiles beyond level ${
            this.availableLevels - 1
          }.`
        )
      );
    }
    this.requests += 1;
    state.providerRequests = this.requests;
    const dim = this.dimensions;
    const tilesAtLevel = 2 ** tileLevel;
    const values = new Float32Array(dim.x * dim.y * dim.z);
    const visibility = new Float32Array(values.length);
    for (let z = 0; z < dim.z; z += 1) {
      for (let y = 0; y < dim.y; y += 1) {
        for (let x = 0; x < dim.x; x += 1) {
          const gx = (tileX * dim.x + x) / (tilesAtLevel * dim.x - 1);
          const gy = (tileY * dim.y + y) / (tilesAtLevel * dim.y - 1);
          const gz = (tileZ * dim.z + z) / (tilesAtLevel * dim.z - 1);
          const index = z * dim.y * dim.x + y * dim.x + x;
          values[index] = fallbackScalarValue(this.scalar, gx, gy, gz);
          const physicalElevation = Cesium.Math.lerp(
            ANALYSIS_WINDOW.elevationRange[0],
            ANALYSIS_WINDOW.elevationRange[1],
            gz
          );
          const surfaceElevation = morphologyElevation(gx, gy);
          if (physicalElevation <= surfaceElevation) {
            const layerFromSurface = Math.max(0, surfaceElevation - physicalElevation);
            visibility[index] = layerFromSurface < 1.5
              ? 0.96
              : Math.max(0.24, 0.68 - layerFromSurface * 0.035);
          }
        }
      }
    }
    return Promise.resolve(
      Cesium.VoxelContent.fromMetadataArray([values, visibility])
    );
  };

  function scalarRamp(scalar) {
    if (scalar === "depth") {
      return {
        low: "vec3(0.91, 0.96, 0.97)",
        mid: "vec3(0.16, 0.66, 0.73)",
        high: "vec3(0.12, 0.14, 0.45)",
        css: "linear-gradient(90deg,#e8f4f7,#29a9ba,#1e2473)",
      };
    }
    if (scalar === "density") {
      return {
        low: "vec3(0.10, 0.03, 0.20)",
        mid: "vec3(0.72, 0.20, 0.33)",
        high: "vec3(0.99, 0.82, 0.36)",
        css: "linear-gradient(90deg,#1a0833,#b83355,#fcd15b)",
      };
    }
    return {
      low: "vec3(0.21, 0.16, 0.53)",
      mid: "vec3(0.08, 0.57, 0.55)",
      high: "vec3(0.91, 0.88, 0.15)",
      css: "linear-gradient(90deg,#352a87,#15918c,#e8e125)",
    };
  }

  function createShader(metadataName, visibilityName) {
    const scalar = SCALARS[state.scalar];
    const ramp = scalarRamp(state.scalar);
    const alphaExpression = visibilityName
      ? `fsInput.metadata.${visibilityName}`
      : "0.84";
    return new Cesium.CustomShader({
      uniforms: {
        u_minimum: { type: Cesium.UniformType.FLOAT, value: scalar.range[0] },
        u_maximum: { type: Cesium.UniformType.FLOAT, value: scalar.range[1] },
      },
      fragmentShaderText: `
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
        {
          float value = fsInput.metadata.${metadataName};
          float normalized = clamp(
            (value - u_minimum) / max(0.0001, u_maximum - u_minimum),
            0.0,
            1.0
          );
          vec3 low = ${ramp.low};
          vec3 mid = ${ramp.mid};
          vec3 high = ${ramp.high};
          vec3 color = normalized < 0.5
            ? mix(low, mid, normalized * 2.0)
            : mix(mid, high, (normalized - 0.5) * 2.0);
          vec3 normal = fsInput.attributes.normalEC;
          float lighting = 0.62 + 0.38 * max(0.0, dot(normal, czm_lightDirectionEC));
          material.diffuse = color * lighting;
          material.alpha = ${alphaExpression};
        }`,
    });
  }

  const ui = document.createElement("section");
  ui.className = "alb-ui";
  ui.setAttribute("aria-labelledby", "alb-title");
  ui.innerHTML = `
    <header class="alb-head">
      <div class="alb-kicker">Virtual Shizuoka · airborne laser bathymetry</div>
      <h1 class="alb-title" id="alb-title">Abe River mouth ALB morphology</h1>
      <div class="alb-subtitle">Measured bed elevation → voxel aggregation → coverage evidence for Shizuoka decisions</div>
      <button class="alb-close" id="alb-close" type="button" aria-label="Close morphology panel">Close</button>
    </header>
    <div class="alb-body">
      <div class="alb-status" id="alb-status" role="status"></div>
      <div class="alb-badges" aria-label="Data provenance">
        <span class="alb-badge" id="alb-runtime-badge" data-kind="fallback">Illustrative fallback only</span>
        <span class="alb-badge" id="alb-method-badge" data-kind="measured">Measured source / derived analytics</span>
      </div>
      <div class="alb-actions">
        <button type="button" id="alb-focus">Focus source footprint</button>
        <button type="button" id="alb-reset">Reset analysis</button>
        <button type="button" id="alb-open-story">Guided story</button>
      </div>

      <label class="alb-toggle">
        <input id="alb-cutaway" type="checkbox" checked aria-describedby="alb-cutaway-status" />
        <span>Context cutaway</span>
        <small id="alb-cutaway-status">On — terrain and imagery are removed only inside the ALB window.</small>
      </label>

      <div class="alb-callout">
        <strong>How to read this</strong>
        Bed elevation is measured ALB Z. Occupancy / coverage counts returns that support each voxel;
        it is not river flow, discharge, water level, or a forecast.
      </div>

      <label class="alb-field">Analysis field
        <select id="alb-scalar" aria-describedby="alb-scalar-method">
          <option value="elevation">Bed elevation (m, measured Z)</option>
          <option value="depth">Bed depth below reference (m, derived)</option>
          <option value="density">Measurement occupancy / coverage (points/voxel, derived)</option>
        </select>
      </label>
      <p class="alb-note" id="alb-scalar-method"></p>

      <label class="alb-field" for="alb-vertical-clip">
        Vertical clip: <output id="alb-vertical-value">100%</output>
        <input id="alb-vertical-clip" type="range" min="0.08" max="1" step="0.01" value="1"
          aria-label="Vertical clip percentage" />
      </label>
      <label class="alb-field">Section reveal
        <select id="alb-reveal">
          <option value="volume">Full measured volume</option>
          <option value="channel">Channel cross-section (east-west slice)</option>
          <option value="waterEdge">Water-edge section (north-south slice)</option>
        </select>
      </label>
      <label class="alb-field" for="alb-section-position">
        Section position: <output id="alb-section-value">50%</output>
        <input id="alb-section-position" type="range" min="0.08" max="0.92" step="0.01" value="0.5"
          aria-label="Section position through the ALB tile" />
      </label>

      <section class="alb-card" aria-labelledby="alb-legend-title">
        <h2 id="alb-legend-title">Scalar legend</h2>
        <div><strong id="alb-legend-name"></strong> · <span id="alb-legend-provenance"></span></div>
        <div class="alb-legend" id="alb-legend" aria-hidden="true"></div>
        <div class="alb-legend-labels">
          <span id="alb-legend-min"></span><span id="alb-legend-mid"></span><span id="alb-legend-max"></span>
        </div>
      </section>

      <section class="alb-card" aria-labelledby="alb-readout-title">
        <h2 id="alb-readout-title">Voxel sample / profile readout</h2>
        <p class="alb-readout" id="alb-readout">Click the visible field to inspect an explicitly illustrative sample.</p>
      </section>

      <section class="alb-card" aria-labelledby="alb-stream-title">
        <h2 id="alb-stream-title">Voxel aggregation stream</h2>
        <div class="alb-grid">
          <div class="alb-metric">Provider<strong id="alb-provider-kind">—</strong></div>
          <div class="alb-metric">Load state<strong id="alb-provider-state">—</strong></div>
          <div class="alb-metric">Requests<strong id="alb-requests">0</strong></div>
          <div class="alb-metric">Tile loads<strong id="alb-tile-loads">0</strong></div>
        </div>
        <p class="alb-note" id="alb-context-state"></p>
      </section>

      <details class="alb-details">
        <summary>Source &amp; method</summary>
        <p><strong>Observation:</strong> Virtual Shizuoka 2025 airborne laser bathymetry (ALB) original tile
          <a href="${ALB_ORIGINAL_URL}" target="_blank" rel="noopener noreferrer">${TILE.id}.zip</a>
          (<code>${TILE.id}.las</code>) and matching
          <a href="${ALB_GRID_URL}" target="_blank" rel="noopener noreferrer">grid resource</a>.
          The source tile contains approximately ${TILE.pointCount.toLocaleString()} measured returns.
          The reproducible local pipeline preserves XYZ, raw Intensity, Classification and RGB, then duplicates Z
          into an <code>Elevation</code> scalar for voxel tiling.</p>
        <p><strong>License:</strong> CC BY 4.0 and ODbL; attribution required. See the
          <a href="${VIRTUAL_SHIZUOKA_REGISTRY_URL}" target="_blank" rel="noopener noreferrer">AWS registry</a>
          and <a href="${VIRTUAL_SHIZUOKA_README_URL}" target="_blank" rel="noopener noreferrer">official project README</a>.</p>
        <p><strong>CRS disclosure:</strong> the
          <a href="${VIRTUAL_SHIZUOKA_README_URL}" target="_blank" rel="noopener noreferrer">official Virtual Shizuoka project README</a>
          identifies EPSG:6676
          (JGD2011 / Japan Plane Rectangular CS VIII), while the dataset-specific 2025 ALB catalog
          notes JGD2024 / CS VIII. The LAS header embeds no SRS. Treat EPSG:6676 only as a catalog /
          processing assumption; confirm CRS, coordinate epoch and vertical datum with PSS before production.</p>
        <p><strong>Measured tile extent:</strong> the LAS header reports local x −10000…−9600.001 m,
          y −118800…−118662.229 m and z approximately −0.542…2.974 m. Under the EPSG:6676
          processing assumption, tile ${TILE.id} covers approximately
          ${TILE.bounds.west.toFixed(6)}…${TILE.bounds.east.toFixed(6)} E,
          ${TILE.bounds.south.toFixed(6)}…${TILE.bounds.north.toFixed(6)} N
          (about 400 × 138 m), centered at
          ${TILE.center.longitude.toFixed(6)}, ${TILE.center.latitude.toFixed(6)}.</p>
        <p><strong>Abe mouth analysis window:</strong> to cover the channel, banks and bay transition,
          the illustrative volume follows 13 available official catalog tiles:
          ${ANALYSIS_WINDOW.tileIds.join(", ")}. Their combined grid footprint is local
          x −10800…−8532 m and y −119100…−118200 m, approximately
          ${ANALYSIS_WINDOW.bounds.west.toFixed(6)}…${ANALYSIS_WINDOW.bounds.east.toFixed(6)} E,
          ${ANALYSIS_WINDOW.bounds.south.toFixed(6)}…${ANALYSIS_WINDOW.bounds.north.toFixed(6)} N
          (${(ANALYSIS_WINDOW.widthMeters / 1000).toFixed(3)} ×
          ${(ANALYSIS_WINDOW.heightMeters / 1000).toFixed(1)} km). Only ${TILE.id} point
          statistics and LAS bounds were inspected for this demo. The adjacent official tiles
          support the stated footprint, but their measurements are not loaded or aggregated here.</p>
        <p><strong>Classification:</strong> LAS classes include ground (2), high vegetation (5),
          building (6), low point (7), model key point (8), water (9), and overlap (12).
          Roughly ${TILE.waterPointCount.toLocaleString()} returns are class 9 water; this does not make every
          return bathymetry. Production bed elevation uses measured Z, depth is derived from an agreed reference
          surface, and occupancy / coverage is derived from per-voxel return counts. Occupancy is survey support,
          not river flow, discharge, water level or a forecast.</p>
        <p><strong>Runtime:</strong> the source LAS is not itself a voxel tileset.
          <code>ION_VOXEL_TILES_URL</code> is intentionally empty until a validated voxelized asset exists.
          The visible field is therefore an explicitly illustrative morphology fallback, not reconstructed
          measurements. Its top is anchored to an illustrative ${REFERENCE_SURFACE_ELEVATION.toFixed(1)} m
          local reference surface and its display volume extends entirely below that plane. This is not a
          confirmed tide level or vertical datum. To make stacked layers and sections legible, the fallback applies
          ${FALLBACK_VERTICAL_EXAGGERATION.toFixed(1)}× vertical display exaggeration as a footprint-anchored
          subsurface extrusion. ${FALLBACK_DISPLAY_TRANSFORM_NOTE} It is not absolute vertical placement;
          legend and readout values remain in the stated physical units. The cutaway uses four local ENU globe
          clipping planes with intersection semantics, removing terrain and imagery only inside this analysis
          footprint. A future production voxel tileset must carry its own validated georeferenced transform for
          this same Abe-mouth window.</p>
        <p><strong>Alignment:</strong> the cyan outline is the source-derived geographic footprint interpreted
          from the EPSG:6676 bounds; the blue arrow is the OSM Abe River alignment context
          (<a href="${OSM_RIVER_WAY_URL}" target="_blank" rel="noopener noreferrer">way 59328409</a>).
          Neither overlay rotates or reprojects the authentic ALB measurements. The river line is orientation
          context only.</p>
        <p><strong>Use boundary:</strong> this is shallow-water morphology inspection, not a
          hydrodynamic simulation and not an authoritative water-level forecast.</p>
      </details>
      <p class="alb-sr" id="alb-live" aria-live="polite"></p>
    </div>`;
  viewer.container.appendChild(ui);

  const story = document.createElement("aside");
  story.className = "alb-story";
  story.setAttribute("aria-labelledby", "alb-story-title");
  story.innerHTML = `
    <div class="alb-kicker" id="alb-story-progress"></div>
    <h2 id="alb-story-title"></h2>
    <p id="alb-story-body"></p>
    <div class="alb-story-controls">
      <button type="button" id="alb-story-prev">Previous</button>
      <button type="button" id="alb-story-pause">Pause</button>
      <button type="button" id="alb-story-next">Next</button>
      <button type="button" id="alb-story-close">Close story</button>
    </div>`;
  viewer.container.appendChild(story);

  const openButton = document.createElement("button");
  openButton.className = "alb-open";
  openButton.type = "button";
  openButton.textContent = "Open ALB morphology";
  openButton.hidden = true;
  viewer.container.appendChild(openButton);

  const storySteps = [
    {
      title: "1. Start with measured ALB",
      body:
        "Virtual Shizuoka 2025 airborne laser bathymetry tile 08ND9755 contains about 1.68 million measured returns at the Abe River mouth. Its source-derived 400 × 138 m footprint is outlined inside the 13-tile catalog window. The expanded field is explicitly illustrative until a processed voxel asset is connected.",
      scalar: "elevation",
      reveal: "volume",
      verticalClip: 1,
      sectionPosition: 0.5,
      cutawayEnabled: false,
      camera: {
        target: CAMERA_TARGETS.center,
        heading: RIVER_ALIGNMENT_CONTEXT.flowBearingDegrees + 180,
        pitch: -30,
        range: 2800,
        radiusScale: 1,
      },
    },
    {
      title: "2. Aggregate returns into voxels",
      body:
        "The local PDAL pipeline converts each LAS tile separately, preserves XYZ, raw Intensity, Classification and RGB, and duplicates Z into Elevation. A CesiumGS tiler can then aggregate those measured returns into fixed-size voxels without rotating the EPSG:6676 source coordinates.",
      scalar: "elevation",
      reveal: "channel",
      verticalClip: 0.68,
      sectionPosition: 0.48,
      cutawayEnabled: false,
      camera: {
        target: CAMERA_TARGETS.center,
        heading: RIVER_ALIGNMENT_CONTEXT.flowBearingDegrees + 180,
        pitch: -26,
        range: 1900,
        radiusScale: 0.68,
      },
    },
    {
      title: "3. Read the bed",
      body:
        "Bed elevation is the measured ALB Z field. Depth below a declared reference surface is derived for inspection only. A section and vertical clip expose the channel depression and shallow bed transition into Suruga Bay without claiming a tide level or hydrodynamic forecast.",
      scalar: "depth",
      reveal: "waterEdge",
      verticalClip: 0.72,
      sectionPosition: 0.52,
      cutawayEnabled: true,
      camera: {
        target: CAMERA_TARGETS.mouth,
        heading: 292,
        pitch: -28,
        range: 1600,
        radiusScale: 0.55,
      },
    },
    {
      title: "4. Coverage is evidence, not flow",
      body:
        "Measurement occupancy / coverage counts returns in each voxel. It helps show where the survey supports an interpretation and where coverage is sparse. It is not velocity, discharge, water level, or a proxy for river flow.",
      scalar: "density",
      reveal: "channel",
      verticalClip: 0.56,
      sectionPosition: 0.5,
      cutawayEnabled: true,
      camera: {
        target: CAMERA_TARGETS.northChannel,
        heading: 12,
        pitch: -24,
        range: 1500,
        radiusScale: 0.5,
      },
    },
    {
      title: "5. Support Shizuoka decisions",
      body:
        "Repeatable ALB morphology supports Abe-mouth maintenance, shallow-water access screening, sediment and shoreline review, and post-event change comparison. Production decisions still require confirmed CRS, coordinate epoch, vertical datum, aligned survey vintages, and an authoritative flow or gauge source.",
      scalar: "density",
      reveal: "volume",
      verticalClip: 0.84,
      sectionPosition: 0.5,
      cutawayEnabled: true,
      camera: {
        target: CAMERA_TARGETS.southBay,
        heading: RIVER_ALIGNMENT_CONTEXT.flowBearingDegrees,
        pitch: -30,
        range: 2200,
        radiusScale: 0.8,
      },
    },
  ];

  let voxelPrimitive;
  let activeProvider;

  function focusTile(camera) {
    const preset = camera || {
      target: CAMERA_TARGETS.center,
      heading: RIVER_ALIGNMENT_CONTEXT.flowBearingDegrees + 180,
      pitch: -30,
      range: 2800,
      radiusScale: 1,
    };
    const target = preset.target || CAMERA_TARGETS.center;
    viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(
        Cesium.Cartesian3.fromDegrees(
          target.longitude,
          target.latitude,
          target.height
        ),
        ANALYSIS_RADIUS * preset.radiusScale
      ),
      {
        offset: new Cesium.HeadingPitchRange(
          Cesium.Math.toRadians(preset.heading),
          Cesium.Math.toRadians(preset.pitch),
          preset.range
        ),
        duration: reducedMotion ? 0 : 1.3,
      }
    );
  }

  function applyClipping() {
    if (!Cesium.defined(voxelPrimitive)) return;
    const maxZ = -1 + state.verticalClip * 2;
    let minimum = new Cesium.Cartesian3(-1, -1, -1);
    let maximum = new Cesium.Cartesian3(1, 1, maxZ);
    const center = -0.84 + state.sectionPosition * 1.68;
    const halfWidth = 0.08;
    if (state.reveal === "channel") {
      minimum = new Cesium.Cartesian3(center - halfWidth, -1, -1);
      maximum = new Cesium.Cartesian3(center + halfWidth, 1, maxZ);
    } else if (state.reveal === "waterEdge") {
      minimum = new Cesium.Cartesian3(-1, center - halfWidth, -1);
      maximum = new Cesium.Cartesian3(1, center + halfWidth, maxZ);
    }
    voxelPrimitive.minClippingBounds = minimum;
    voxelPrimitive.maxClippingBounds = maximum;
    viewer.scene.requestRender();
  }

  async function loadProvider() {
    const scalar = SCALARS[state.scalar];
    if (!ION_VOXEL_TILES_URL) {
      state.providerKind = "Illustrative fallback";
      state.providerState = "Ion asset pending";
      state.providerError = "";
      state.providerRequests = 0;
      return {
        provider: new FallbackAlbVoxelProvider(state.scalar),
        metadataName: "value",
        visibilityName: "visibility",
      };
    }

    state.providerKind = "Ion 3D Tiles voxel";
    state.providerState = "Loading";
    state.providerError = "";
    renderUi();
    if (!Cesium.Cesium3DTilesVoxelProvider?.fromUrl) {
      throw new Error("Cesium3DTilesVoxelProvider.fromUrl is unavailable in this Cesium build.");
    }
    const provider = await Cesium.Cesium3DTilesVoxelProvider.fromUrl(
      ION_VOXEL_TILES_URL
    );
    if (!scalar.ionProperty) {
      throw new Error(
        "This coverage field is not present in the raw ALB handoff; connect a provider with explicit occupancy metadata."
      );
    }
    const names = Array.isArray(provider.names) ? provider.names : [];
    if (names.length > 0 && !names.includes(scalar.ionProperty)) {
      throw new Error(
        `Voxel asset does not expose the required '${scalar.ionProperty}' metadata property.`
      );
    }
    return { provider, metadataName: scalar.ionProperty };
  }

  async function rebuildVoxelPrimitive(announcement) {
    const generation = ++state.loadGeneration;
    state.tileLoads = 0;
    try {
      const loaded = await loadProvider();
      if (generation !== state.loadGeneration) return;
      const nextPrimitive = new Cesium.VoxelPrimitive({
        provider: loaded.provider,
        customShader: createShader(loaded.metadataName, loaded.visibilityName),
      });
      nextPrimitive.nearestSampling = false;
      nextPrimitive.screenSpaceError = 2.5;
      nextPrimitive.stepSize = 0.55;
      nextPrimitive.tileLoad.addEventListener(() => {
        state.tileLoads += 1;
        if (activeProvider instanceof FallbackAlbVoxelProvider) {
          state.providerRequests = activeProvider.requests;
        }
        renderUi();
      });
      viewer.scene.primitives.add(nextPrimitive);
      if (Cesium.defined(voxelPrimitive)) {
        viewer.scene.primitives.remove(voxelPrimitive);
      }
      voxelPrimitive = nextPrimitive;
      activeProvider = loaded.provider;
      state.providerState = ION_VOXEL_TILES_URL ? "Ready" : "Ion asset pending";
    } catch (error) {
      if (generation !== state.loadGeneration) return;
      state.providerError = error instanceof Error ? error.message : String(error);
      console.error("Voxel provider failed; activating the illustrative fallback.", error);
      state.providerKind = "Illustrative fallback";
      state.providerState = "Ion load failed";
      const fallback = new FallbackAlbVoxelProvider(state.scalar);
      const nextPrimitive = new Cesium.VoxelPrimitive({
        provider: fallback,
        customShader: createShader("value", "visibility"),
      });
      nextPrimitive.nearestSampling = false;
      nextPrimitive.screenSpaceError = 2.5;
      nextPrimitive.stepSize = 0.55;
      nextPrimitive.tileLoad.addEventListener(() => {
        state.tileLoads += 1;
        state.providerRequests = fallback.requests;
        renderUi();
      });
      viewer.scene.primitives.add(nextPrimitive);
      if (Cesium.defined(voxelPrimitive)) {
        viewer.scene.primitives.remove(voxelPrimitive);
      }
      voxelPrimitive = nextPrimitive;
      activeProvider = fallback;
    }
    applyClipping();
    renderUi();
    ui.querySelector("#alb-live").textContent =
      announcement || `${SCALARS[state.scalar].label} voxel field ready.`;
  }

  function renderSample() {
    const element = ui.querySelector("#alb-readout");
    const clipElevation = Cesium.Math.lerp(
      ANALYSIS_WINDOW.elevationRange[0],
      ANALYSIS_WINDOW.elevationRange[1],
      state.verticalClip
    );
    const sectionAxis = state.reveal === "channel" ? "local x" : "local y";
    const sectionCoordinate = state.reveal === "channel"
      ? Cesium.Math.lerp(
          ANALYSIS_WINDOW.localBounds.west,
          ANALYSIS_WINDOW.localBounds.east,
          state.sectionPosition
        )
      : Cesium.Math.lerp(
          ANALYSIS_WINDOW.localBounds.south,
          ANALYSIS_WINDOW.localBounds.north,
          state.sectionPosition
        );
    const analysisWindow = state.reveal === "volume"
      ? `Analysis window: full volume, clipped above ${clipElevation.toFixed(2)} m`
      : `Analysis window: ${state.reveal === "channel" ? "channel cross-section" : "water-edge section"} at ${sectionAxis} ${sectionCoordinate.toFixed(1)} m, clipped above ${clipElevation.toFixed(2)} m`;
    if (!state.sample) {
      element.textContent =
        `${analysisWindow}\nClick the visible voxel field to inspect an illustrative sample.`;
      return;
    }
    const sample = state.sample;
    if (sample.noData) {
      element.textContent =
        `Longitude / latitude: ${sample.longitude.toFixed(6)}, ${sample.latitude.toFixed(6)}\n` +
        "No voxel sample at this position.";
      return;
    }
    const scalar = SCALARS[state.scalar];
    const isFallback = state.providerKind === "Illustrative fallback";
    const displayedValue =
      isFallback
        ? `${sample.value.toFixed(state.scalar === "density" ? 0 : 2)} ${scalar.unit}`
        : "Provider value unavailable from generic scene pick";
    const localReadout = isFallback
      ? `Fallback display x/y under the catalog CRS assumption: ${sample.sourceX.toFixed(1)} / ${sample.sourceY.toFixed(1)} m\n` +
        `Illustrative elevation / derived depth: ${sample.elevation.toFixed(2)} / ${sample.depth.toFixed(2)} m\n`
      : "Local coordinates and elevation/depth: unavailable from generic scene pick\n";
    element.textContent =
      `Longitude / latitude: ${sample.longitude.toFixed(6)}, ${sample.latitude.toFixed(6)}\n` +
      localReadout +
      `${scalar.label}: ${displayedValue}\n` +
      `Source: ${state.providerKind}\n` +
      `Class: ${sample.classLabel}\n${analysisWindow}\nNo-data: no`;
  }

  function renderUi() {
    const scalar = SCALARS[state.scalar];
    const isFallback = state.providerKind === "Illustrative fallback";
    const status = ui.querySelector("#alb-status");
    status.textContent = state.providerError
      ? `Ion voxel load failed: ${state.providerError} Illustrative fallback active.`
      : isFallback
      ? `Illustrative fallback active · source-derived Abe-mouth footprint · ${FALLBACK_VERTICAL_EXAGGERATION.toFixed(1)}× vertical display exaggeration · no authentic ALB points are rotated`
      : "Processed ALB voxel provider connected with its own georeferenced transform";
    status.dataset.error = String(Boolean(state.providerError));

    const runtimeBadge = ui.querySelector("#alb-runtime-badge");
    runtimeBadge.textContent = isFallback ? "Illustrative fallback" : "Processed ALB provider";
    runtimeBadge.dataset.kind = isFallback ? "fallback" : "measured";
    const methodBadge = ui.querySelector("#alb-method-badge");
    methodBadge.textContent = isFallback
      ? `Production provenance: ${scalar.productionProvenance.toLowerCase()}`
      : scalar.productionProvenance;
    methodBadge.dataset.kind =
      scalar.productionProvenance === "Measured" ? "measured" : "derived";

    ui.querySelector("#alb-scalar").value = state.scalar;
    ui.querySelector("#alb-scalar-method").textContent =
      `${scalar.method}. Current display provenance: ${
        isFallback ? "Illustrative fallback" : scalar.productionProvenance
      }.`;
    ui.querySelector("#alb-vertical-value").textContent =
      `${Math.round(state.verticalClip * 100)}%`;
    ui.querySelector("#alb-reveal").value = state.reveal;
    ui.querySelector("#alb-section-value").textContent =
      `${Math.round(state.sectionPosition * 100)}%`;
    ui.querySelector("#alb-section-position").disabled = state.reveal === "volume";
    ui.querySelector("#alb-cutaway").checked = state.cutawayEnabled;
    ui.querySelector("#alb-cutaway-status").textContent = state.cutawayEnabled
      ? "On — terrain and imagery are removed only inside the ALB window."
      : "Off — the globe surface covers the subsurface analysis volume.";

    ui.querySelector("#alb-legend-name").textContent = `${scalar.label} (${scalar.unit})`;
    ui.querySelector("#alb-legend-provenance").textContent =
      isFallback ? "Illustrative fallback" : scalar.productionProvenance;
    ui.querySelector("#alb-legend").style.background = scalarRamp(state.scalar).css;
    ui.querySelector("#alb-legend-min").textContent =
      `${scalar.range[0]} ${scalar.unit}`;
    ui.querySelector("#alb-legend-mid").textContent =
      `${((scalar.range[0] + scalar.range[1]) / 2).toFixed(1)} ${scalar.unit}`;
    ui.querySelector("#alb-legend-max").textContent =
      `${scalar.range[1]} ${scalar.unit}`;
    ui.querySelector("#alb-provider-kind").textContent = state.providerKind;
    ui.querySelector("#alb-provider-state").textContent = state.providerState;
    ui.querySelector("#alb-requests").textContent = String(state.providerRequests);
    ui.querySelector("#alb-tile-loads").textContent = String(state.tileLoads);
    ui.querySelector("#alb-context-state").textContent =
      `${state.contextState}. Source footprint and OSM river line are alignment context; PLATEAU and basemap are orientation context only.`;
    renderSample();
    renderStory();
  }

  function renderStory() {
    const step = storySteps[state.storyStep];
    story.hidden = !state.storyOpen;
    story.querySelector("#alb-story-progress").textContent =
      `Guided story ${state.storyStep + 1} of ${storySteps.length}`;
    story.querySelector("#alb-story-title").textContent = step.title;
    story.querySelector("#alb-story-body").textContent = step.body;
    story.querySelector("#alb-story-prev").disabled = state.storyStep === 0;
    story.querySelector("#alb-story-next").disabled =
      state.storyStep === storySteps.length - 1;
    story.querySelector("#alb-story-pause").textContent =
      state.storyPlaying ? "Pause" : "Resume";
  }

  async function applyStoryStep(index) {
    state.storyStep = Cesium.Math.clamp(index, 0, storySteps.length - 1);
    const step = storySteps[state.storyStep];
    const scalarChanged = state.scalar !== step.scalar;
    state.scalar = step.scalar;
    state.reveal = step.reveal;
    state.verticalClip = step.verticalClip;
    state.sectionPosition = step.sectionPosition;
    state.cutawayEnabled = step.cutawayEnabled;
    ui.querySelector("#alb-vertical-clip").value = String(state.verticalClip);
    ui.querySelector("#alb-section-position").value = String(state.sectionPosition);
    applySurfaceCutaway();
    focusTile(step.camera);
    if (scalarChanged) {
      await rebuildVoxelPrimitive(`${step.title}. ${SCALARS[state.scalar].label} loaded.`);
    } else {
      applyClipping();
      renderUi();
    }
  }

  ui.querySelector("#alb-scalar").addEventListener("change", (event) => {
    state.scalar = event.target.value;
    state.sample = null;
    void rebuildVoxelPrimitive(`${SCALARS[state.scalar].label} loaded.`);
  });
  ui.querySelector("#alb-vertical-clip").addEventListener("input", (event) => {
    state.verticalClip = Number(event.target.value);
    state.sample = null;
    applyClipping();
    renderUi();
  });
  ui.querySelector("#alb-reveal").addEventListener("change", (event) => {
    state.reveal = event.target.value;
    state.sample = null;
    applyClipping();
    renderUi();
  });
  ui.querySelector("#alb-section-position").addEventListener("input", (event) => {
    state.sectionPosition = Number(event.target.value);
    state.sample = null;
    applyClipping();
    renderUi();
  });
  ui.querySelector("#alb-cutaway").addEventListener("change", (event) => {
    state.cutawayEnabled = event.target.checked;
    applySurfaceCutaway();
    renderUi();
    ui.querySelector("#alb-live").textContent = state.cutawayEnabled
      ? "Globe surface cutaway enabled inside the ALB analysis window."
      : "Globe surface cutaway disabled.";
  });
  ui.querySelector("#alb-focus").addEventListener("click", () => focusTile());
  ui.querySelector("#alb-reset").addEventListener("click", () => {
    state.scalar = "elevation";
    state.verticalClip = 1;
    state.reveal = "volume";
    state.sectionPosition = 0.5;
    state.cutawayEnabled = true;
    state.sample = null;
    ui.querySelector("#alb-vertical-clip").value = "1";
    ui.querySelector("#alb-section-position").value = "0.5";
    applySurfaceCutaway();
    focusTile();
    void rebuildVoxelPrimitive("Morphology analysis reset.");
  });
  ui.querySelector("#alb-close").addEventListener("click", () => {
    state.storyOpen = false;
    state.storyPlaying = false;
    ui.hidden = true;
    story.hidden = true;
    openButton.hidden = false;
    openButton.focus();
  });
  openButton.addEventListener("click", () => {
    ui.hidden = false;
    story.hidden = !state.storyOpen;
    openButton.hidden = true;
    ui.querySelector("#alb-close").focus();
  });
  ui.querySelector("#alb-open-story").addEventListener("click", () => {
    state.storyOpen = true;
    state.storyPlaying = !reducedMotion;
    renderStory();
    story.querySelector("#alb-story-pause").focus();
  });
  story.querySelector("#alb-story-prev").addEventListener("click", () => {
    state.storyPlaying = false;
    void applyStoryStep(state.storyStep - 1);
  });
  story.querySelector("#alb-story-next").addEventListener("click", () => {
    state.storyPlaying = false;
    void applyStoryStep(state.storyStep + 1);
  });
  story.querySelector("#alb-story-pause").addEventListener("click", () => {
    state.storyPlaying = !state.storyPlaying;
    renderStory();
  });
  story.querySelector("#alb-story-close").addEventListener("click", () => {
    state.storyOpen = false;
    state.storyPlaying = false;
    story.hidden = true;
    ui.querySelector("#alb-open-story").focus();
  });

  const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  clickHandler.setInputAction((movement) => {
    if (!viewer.scene.pickPositionSupported) {
      ui.querySelector("#alb-live").textContent =
        "Scene position sampling is unavailable in this browser.";
      return;
    }
    const world = viewer.scene.pickPosition(movement.position);
    if (!Cesium.defined(world)) return;
    const local = Cesium.Matrix4.multiplyByPoint(
      inverseVolumeTransform,
      world,
      new Cesium.Cartesian3()
    );
    const nx = local.x / SHAPE_HALF_SIZE.x;
    const ny = local.y / SHAPE_HALF_SIZE.y;
    const nz = local.z / SHAPE_HALF_SIZE.z;
    const cartographic = Cesium.Cartographic.fromCartesian(world);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    const outside =
      Math.abs(nx) > 1.05 || Math.abs(ny) > 1.05 || Math.abs(nz) > 1.2;
    if (outside) {
      state.sample = { longitude, latitude, noData: true };
      renderUi();
      return;
    }
    const x = Cesium.Math.clamp((nx + 1) / 2, 0, 1);
    const y = Cesium.Math.clamp((ny + 1) / 2, 0, 1);
    const z = Cesium.Math.clamp((nz + 1) / 2, 0, 1);
    const elevation = morphologyElevation(x, y);
    const depth = Math.max(0, REFERENCE_SURFACE_ELEVATION - elevation);
    const waterProxy = y < 0.66 + 0.04 * Math.sin(x * Math.PI * 3);
    state.sample = {
      longitude,
      latitude,
      sourceX: ANALYSIS_WINDOW.localBounds.west +
        x * (ANALYSIS_WINDOW.localBounds.east - ANALYSIS_WINDOW.localBounds.west),
      sourceY: ANALYSIS_WINDOW.localBounds.south +
        y * (ANALYSIS_WINDOW.localBounds.north - ANALYSIS_WINDOW.localBounds.south),
      elevation,
      depth,
      value: fallbackScalarValue(state.scalar, x, y, z),
      classLabel: state.providerKind === "Illustrative fallback"
        ? `Illustrative proxy: ${waterProxy ? "class 9 water context" : "class 2 ground context"}`
        : "Use processed voxel class metadata",
      noData: false,
    };
    renderUi();
    ui.querySelector("#alb-live").textContent =
      `${SCALARS[state.scalar].label} sample updated.`;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  viewer.entities.add({
    name: "Illustrative ALB analysis window",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        ANALYSIS_WINDOW.bounds.west, ANALYSIS_WINDOW.bounds.south,
        ANALYSIS_WINDOW.bounds.east, ANALYSIS_WINDOW.bounds.south,
        ANALYSIS_WINDOW.bounds.east, ANALYSIS_WINDOW.bounds.north,
        ANALYSIS_WINDOW.bounds.west, ANALYSIS_WINDOW.bounds.north,
        ANALYSIS_WINDOW.bounds.west, ANALYSIS_WINDOW.bounds.south,
      ]),
      clampToGround: true,
      width: 3,
      material: Cesium.Color.fromCssColorString("#ffd166").withAlpha(0.9),
    },
  });
  viewer.entities.add({
    name: `Measured ALB tile ${TILE.id} footprint`,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        TILE.bounds.west, TILE.bounds.south,
        TILE.bounds.east, TILE.bounds.south,
        TILE.bounds.east, TILE.bounds.north,
        TILE.bounds.west, TILE.bounds.north,
        TILE.bounds.west, TILE.bounds.south,
      ]),
      clampToGround: true,
      width: 2,
      material: Cesium.Color.fromCssColorString("#60ddcf").withAlpha(0.8),
    },
  });
  viewer.entities.add({
    name: `Abe River alignment context (${RIVER_ALIGNMENT_CONTEXT.source})`,
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        RIVER_ALIGNMENT_CONTEXT.upstream.longitude,
        RIVER_ALIGNMENT_CONTEXT.upstream.latitude,
        RIVER_ALIGNMENT_CONTEXT.mouth.longitude,
        RIVER_ALIGNMENT_CONTEXT.mouth.latitude,
      ]),
      clampToGround: true,
      width: 4,
      material: new Cesium.PolylineArrowMaterialProperty(
        Cesium.Color.fromCssColorString("#6ca8ff").withAlpha(0.9)
      ),
    },
  });
  viewer.entities.add({
    name: "Abe River alignment context label",
    position: Cesium.Cartesian3.fromDegrees(
      RIVER_ALIGNMENT_CONTEXT.mouth.longitude,
      RIVER_ALIGNMENT_CONTEXT.mouth.latitude,
      3
    ),
    label: {
      text: "Abe River flow alignment context · not ALB geometry",
      font: "12px system-ui",
      fillColor: Cesium.Color.fromCssColorString("#cfe4ff"),
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 3,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -18),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 12000),
    },
  });

  if (window.__albMorphologyStoryTimer) {
    window.clearInterval(window.__albMorphologyStoryTimer);
  }
  window.__albMorphologyStoryTimer = window.setInterval(() => {
    if (!state.storyOpen || !state.storyPlaying) return;
    if (state.storyStep < storySteps.length - 1) {
      void applyStoryStep(state.storyStep + 1);
    } else {
      state.storyPlaying = false;
      renderStory();
    }
  }, 9000);

  const contextPromise = (async () => {
    try {
      const contextTileset = await Cesium.Cesium3DTileset.fromUrl(
        PLATEAU_SURUGA_LOD1,
        {
          maximumScreenSpaceError: 40,
          cacheBytes: 256 * 1024 * 1024,
          maximumCacheOverflowBytes: 128 * 1024 * 1024,
          cullWithChildrenBounds: false,
          dynamicScreenSpaceError: false,
          foveatedScreenSpaceError: false,
        }
      );
      contextTileset.style = new Cesium.Cesium3DTileStyle({
        color: "color('#a8bec8', 0.58)",
      });
      viewer.scene.primitives.add(contextTileset);
      state.contextState = "PLATEAU Suruga buildings ready";
    } catch (error) {
      state.contextState = "PLATEAU context unavailable";
      console.error("PLATEAU orientation context failed to load.", error);
    }
    renderUi();
  })();
  await rebuildVoxelPrimitive();
  focusTile();
  renderUi();
  await contextPromise;
})();
