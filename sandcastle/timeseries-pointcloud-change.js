// ==============================================================================
// Demo 5: Time-Series Point Cloud Change Detection – Shizuoka Foothills
// Production-quality architecture with verified real data + illustrative change
// ==============================================================================
// VERIFIED DATA SOURCES (Official Cesium Ion Assets & Public Services):
// Terrain: Cesium Ion Asset #2767062 (Japan Regional Terrain, 10m resolution)
// Buildings: Cesium Ion Asset #2602291 (Japan Buildings 3D Tiles)
// Imagery: GSI Seamless Photo (https://cyberjapandata.gsi.go.jp, CC0 Public Domain)
//
// REAL PUBLIC POINT CLOUD DATASETS (Virtual Shizuoka / GEOSPATIAL.JP):
// https://www.geospatial.jp/ckan/dataset?q=VIRTUAL+SHIZUOKA
// - shizuoka-2019-pointcloud: Fuji southeast, Izu east region (CC BY 4.0)
//   PBF format (LP/ALB original + ground classification), measurement dates in CSV
// - shizuoka-2021-pointcloud: Fuji + Shizuoka east region (CC BY 4.0)
//   PBF format, candidate geographic overlap with 2019 dataset
// - atami-3d: 2019 LAS point clouds (300 MB+ each, CC BY 4.0)
// CURRENT LIMITATION: Geographic overlap is candidate between 2019/2021 datasets
//   (requires spatial validation); NOT yet tiled to Cesium 3D Tiles format for streaming
//
// ILLUSTRATIVE ELEMENTS (Clearly Labeled):
// Forest Point Cloud Grid: Synthetic 12×10 grid 2020→2025 (based on realistic patterns)
// HEIGHT CHANGE: Illustrative delta patterns until real PSS epochs are tiled
//
// GEOGRAPHIC NARRATIVE:
// Mt. Fuji (3,776m) → Abe River foothills → Shizuoka city urban transition → Coast
// Demonstrates mountain-to-ocean digital twin workflow for climate monitoring
//
// NEXT PHASE (for Jake/PSS):
// 1. Validate geographic overlap between shizuoka-2019 & shizuoka-2021 datasets
// 2. Convert overlapping regions to Cesium 3D Tiles (.pnts format)
// 3. Upload to Cesium Ion as two separate assets (one per epoch)
// 4. Update Demo 5 code with Ion asset IDs
// 5. Demo will stream real point clouds and compute measured Δheight
// ==============================================================================

const STATE = {
  mode: "year1", // 'year1', 'year5', 'change', 'carbon'
  isAnimating: false,
  animationProgress: 0,
  autotourActive: false,
  autotourPaused: false,
  autotourStep: 0,
  hoveredCell: null,
  prefersReducedMotion: false,
  primitive: null,
  cells: [],
};

const CONFIG = {
  centerLon: 138.42,
  centerLat: 35.06,
  gridCols: 12,
  gridRows: 10,
  cellSpacingM: 100,
  heightScale: 1,
  // Autoplay tour: Geographic story Mt. Fuji → Foothills → City → Coast
  tourWaypoints: [
    {
      name: "Mt. Fuji Overview",
      subtitle: "Shizuoka's highest elevation (3,776m)",
      lon: 138.73,
      lat: 35.36,
      height: 3500,
      heading: 0,
      pitch: -45,
      duration: 3,
      mode: "year1",
    },
    {
      name: "Abe River Foothills (2020)",
      subtitle: "Baseline forest canopy digital twin zone",
      lon: 138.42,
      lat: 35.06,
      height: 1200,
      heading: 45,
      pitch: -40,
      duration: 4,
      mode: "year1",
    },
    {
      name: "Foothills Change (2025)",
      subtitle: "5-year forest growth and loss patterns",
      lon: 138.42,
      lat: 35.06,
      height: 1200,
      heading: 45,
      pitch: -40,
      duration: 4,
      mode: "year5",
    },
    {
      name: "Change Detection",
      subtitle: "Red=Loss | Green=Growth | Gray=Stable",
      lon: 138.42,
      lat: 35.06,
      height: 1200,
      heading: 135,
      pitch: -35,
      duration: 4,
      mode: "change",
    },
    {
      name: "Carbon Impact",
      subtitle: "Sequestration estimate (simplified model)",
      lon: 138.42,
      lat: 35.06,
      height: 1500,
      heading: 225,
      pitch: -30,
      duration: 4,
      mode: "carbon",
    },
    {
      name: "Shizuoka City",
      subtitle: "Urban context (PLATEAU LOD2 buildings)",
      lon: 138.37,
      lat: 34.98,
      height: 2000,
      heading: 315,
      pitch: -35,
      duration: 3,
      mode: "year5",
    },
    {
      name: "Coastal View",
      subtitle: "Mountain-to-ocean watershed monitoring extent",
      lon: 138.5,
      lat: 34.65,
      height: 5000,
      heading: 180,
      pitch: -20,
      duration: 3,
      mode: "year1",
    },
  ],
};

// ============================================================================
// GRID & SYNTHETIC DATA GENERATION
// ============================================================================

function generateSyntheticGrid() {
  const cells = [];
  const halfCols = CONFIG.gridCols / 2;
  const halfRows = CONFIG.gridRows / 2;
  const spacingDeg = CONFIG.cellSpacingM / 111000;

  for (let row = 0; row < CONFIG.gridRows; row++) {
    for (let col = 0; col < CONFIG.gridCols; col++) {
      const lon = CONFIG.centerLon + (col - halfCols) * spacingDeg;
      const lat = CONFIG.centerLat + (row - halfRows) * spacingDeg;

      // Year 1 (2020): forest canopy 25–45m (edges higher = mountain foothills)
      const distFromCenter = Math.sqrt(
        Math.pow((col - halfCols + 0.5) / halfCols, 2) +
          Math.pow((row - halfRows + 0.5) / halfRows, 2)
      );
      const baseHeight = 25 + distFromCenter * 15 + Math.random() * 5;

      // Year 5 (2025): realistic forest dynamics
      // 70% growth, 20% stable, 10% disturbance/loss
      const scenario = Math.random();
      let delta;
      if (scenario < 0.7) {
        delta = Math.abs((Math.random() + Math.random() + Math.random() - 1.5) * 3) * 0.8; // Growth 0 to +6m
      } else if (scenario < 0.9) {
        delta = (Math.random() - 0.5) * 1; // Stable ±0.5m
      } else {
        delta = -Math.abs((Math.random() + Math.random() + Math.random() - 1.5) * 3) * 0.5; // Loss -3 to 0m
      }

      const year2Height = baseHeight + delta;
      const cellAreaHa = (CONFIG.cellSpacingM * CONFIG.cellSpacingM) / 10000;
      const carbonDelta = delta * cellAreaHa * 0.5; // Simplified: Mg CO2e/ha/year

      cells.push({
        id: row * CONFIG.gridCols + col,
        lon,
        lat,
        year1Height: baseHeight,
        year2Height,
        delta,
        carbonDelta,
        row,
        col,
      });
    }
  }
  return cells;
}

// ============================================================================
// COLOR FUNCTIONS (Mode-dependent)
// ============================================================================

function getColorForCell(cell, mode) {
  const alpha = 1.0;

  if (mode === "year1") {
    // Green gradient: 20m (light) → 45m (dark)
    const normalized = (cell.year1Height - 20) / 25;
    const n = Math.max(0, Math.min(1, normalized));
    const r = Math.round(144 * (1 - n * 0.5));
    const g = Math.round(238 - 100 * n);
    const b = Math.round(144 * (1 - n * 0.7));
    return Cesium.Color.fromBytes(r, g, b, 255 * alpha);
  } else if (mode === "year5") {
    // Green gradient for year 2 heights
    const normalized = (cell.year2Height - 20) / 25;
    const n = Math.max(0, Math.min(1, normalized));
    const r = Math.round(144 * (1 - n * 0.5));
    const g = Math.round(238 - 100 * n);
    const b = Math.round(144 * (1 - n * 0.7));
    return Cesium.Color.fromBytes(r, g, b, 255 * alpha);
  } else if (mode === "change") {
    // Color by delta: red (loss) → green (growth)
    const delta = cell.delta;
    if (delta < -3) return Cesium.Color.fromCssColorString("#ff4444"); // Significant loss
    if (delta < -0.5) return Cesium.Color.fromCssColorString("#ff9944"); // Minor loss
    if (delta < 0.5) return Cesium.Color.fromCssColorString("#888888"); // No change
    if (delta < 3) return Cesium.Color.fromCssColorString("#88cc44"); // Minor growth
    return Cesium.Color.fromCssColorString("#228b22"); // Significant growth
  } else if (mode === "carbon") {
    // Color by carbon delta
    const c = cell.carbonDelta;
    if (c < -0.5) return Cesium.Color.fromCssColorString("#ff4444");
    if (c < 0) return Cesium.Color.fromCssColorString("#ff9944");
    if (c < 0.5) return Cesium.Color.fromCssColorString("#888888");
    if (c < 2) return Cesium.Color.fromCssColorString("#88cc44");
    return Cesium.Color.fromCssColorString("#228b22");
  }
  return Cesium.Color.WHITE.withAlpha(alpha);
}

// ============================================================================
// CESIUM VIEWER SETUP (with verified Ion assets)
// ============================================================================

async function initViewer() {
  // Use verified Cesium Ion assets: Japan terrain (#2767062)
  // Note: Sandcastle provides its own Cesium.Ion token; do not override
  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062),
    baseLayerPicker: false,
    fullscreenButton: false,
    homeButton: false,
    infoBox: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
  });

  viewer.scene.globe.depthTestAgainstTerrain = true;

  // Load verified Japan Buildings tileset (Ion asset #2602291)
  try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2602291);
    viewer.scene.primitives.add(tileset);
    console.log("✓ Japan Buildings (Ion #2602291) loaded");
  } catch (error) {
    console.warn("⚠ Buildings not available:", error.message);
  }

  return viewer;
}

const viewer = await initViewer();

// ============================================================================
// POINT CLOUD VISUALIZATION
// ============================================================================

function visualizePointClouds() {
  if (STATE.primitive) {
    viewer.scene.primitives.remove(STATE.primitive);
    STATE.primitive = null;
  }

  const instances = [];

  const getHeight = (cell) => {
    if (STATE.isAnimating) {
      return (
        cell.year1Height +
        (cell.year2Height - cell.year1Height) * STATE.animationProgress
      );
    }
    if (STATE.mode === "year1") return cell.year1Height;
    if (STATE.mode === "year5") return cell.year2Height;
    if (STATE.mode === "change") return Math.abs(cell.delta) * 5 + 30; // Scale for visibility
    if (STATE.mode === "carbon") return Math.max(0, cell.carbonDelta) * 10 + 30;
    return cell.year1Height;
  };

  for (const cell of STATE.cells) {
    const height = getHeight(cell);
    const position = Cesium.Cartesian3.fromDegrees(cell.lon, cell.lat, height / 2);
    const matrix = Cesium.Transforms.headingPitchRollToFixedFrame(
      position,
      new Cesium.HeadingPitchRoll(0, 0, 0)
    );

    const geometry = Cesium.BoxGeometry.fromDimensions({
      dimensions: new Cesium.Cartesian3(100, 100, height),
    });

    const instance = new Cesium.GeometryInstance({
      geometry,
      modelMatrix: matrix,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          getColorForCell(cell, STATE.mode)
        ),
      },
    });
    instances.push(instance);
  }

  if (instances.length > 0) {
    STATE.primitive = viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: instances,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: false,
          translucent: false,
        }),
        asynchronous: false,
      })
    );
  }
}

// ============================================================================
// MODE SWITCHING & KPIs
// ============================================================================

function switchMode(newMode) {
  STATE.mode = newMode;
  STATE.isAnimating = false;
  STATE.animationProgress = 0;

  document.querySelectorAll("[data-mode-button]").forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      btn.dataset.mode === newMode ? "true" : "false"
    );
  });

  visualizePointClouds();
  updateKPIs();
}

function updateKPIs() {
  const stats = {
    total: STATE.cells.length,
    sigLoss: 0,
    sigGrowth: 0,
    totalDelta: 0,
    totalCarbon: 0,
  };

  for (const cell of STATE.cells) {
    if (cell.delta < -3) stats.sigLoss++;
    if (cell.delta > 3) stats.sigGrowth++;
    stats.totalDelta += cell.delta;
    stats.totalCarbon += cell.carbonDelta;
  }

  const meanDelta = (stats.totalDelta / stats.total).toFixed(2);
  const pctLoss = ((stats.sigLoss / stats.total) * 100).toFixed(1);
  const pctGrowth = ((stats.sigGrowth / stats.total) * 100).toFixed(1);

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("kpi-total", stats.total);
  set("kpi-loss", `${stats.sigLoss} (${pctLoss}%)`);
  set("kpi-growth", `${stats.sigGrowth} (${pctGrowth}%)`);
  set("kpi-delta", `${meanDelta}m`);
  set("kpi-carbon", `${stats.totalCarbon.toFixed(1)} Mg CO₂e`);

  const modeLabel = {
    year1: "2020 Baseline",
    year5: "2025 Forecast",
    change: "2020–2025 Change",
    carbon: "Carbon Impact",
  };
  const ts = document.getElementById("kpi-timestamp");
  if (ts) ts.textContent = modeLabel[STATE.mode];
}

// ============================================================================
// AUTOPLAY TOUR
// ============================================================================

async function autoplayTour() {
  STATE.autotourActive = true;
  STATE.autotourPaused = false;

  const pauseBtn = document.getElementById("autotour-pause");
  const resumeBtn = document.getElementById("autotour-resume");
  const closeBtn = document.getElementById("autotour-close");
  const titleEl = document.getElementById("autotour-title");
  const subtitleEl = document.getElementById("autotour-subtitle");

  if (pauseBtn) pauseBtn.style.display = "inline-block";
  if (resumeBtn) resumeBtn.style.display = "none";
  if (closeBtn) closeBtn.style.display = "inline-block";

  for (let i = 0; i < CONFIG.tourWaypoints.length; i++) {
    if (!STATE.autotourActive) break;

    while (STATE.autotourPaused && STATE.autotourActive) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const wp = CONFIG.tourWaypoints[i];
    STATE.autotourStep = i;

    switchMode(wp.mode);

    if (titleEl) titleEl.textContent = wp.name;
    if (subtitleEl) subtitleEl.textContent = wp.subtitle;

    await viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(wp.lon, wp.lat, wp.height),
      orientation: {
        heading: Cesium.Math.toRadians(wp.heading),
        pitch: Cesium.Math.toRadians(wp.pitch),
      },
      duration: STATE.prefersReducedMotion ? wp.duration * 0.5 : wp.duration,
    });

    if (STATE.autotourActive && !STATE.autotourPaused) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  STATE.autotourActive = false;
  if (pauseBtn) pauseBtn.style.display = "none";
  if (resumeBtn) resumeBtn.style.display = "none";
  if (closeBtn) closeBtn.style.display = "none";
  if (titleEl) titleEl.textContent = "Tour Complete";
}

// ============================================================================
// CAMERA PRESETS
// ============================================================================

async function cameraOverview() {
  await viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(138.42, 35.06, 25000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
    },
    duration: 2,
  });
}

async function cameraFoothills() {
  await viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(138.42, 35.06, 1200),
    orientation: {
      heading: Cesium.Math.toRadians(45),
      pitch: Cesium.Math.toRadians(-40),
    },
    duration: 2,
  });
}

async function cameraCity() {
  await viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(138.37, 34.98, 2000),
    orientation: {
      heading: Cesium.Math.toRadians(315),
      pitch: Cesium.Math.toRadians(-35),
    },
    duration: 2,
  });
}

// ============================================================================
// DOM & INITIALIZATION
// ============================================================================

STATE.cells = generateSyntheticGrid();
STATE.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

visualizePointClouds();
updateKPIs();

// Wire controls
document.querySelectorAll("[data-mode-button]").forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

document.getElementById("animate-btn")?.addEventListener("click", () => {
  STATE.isAnimating = !STATE.isAnimating;
  if (STATE.isAnimating) STATE.animationProgress = 0;
  const interval = setInterval(() => {
    if (!STATE.isAnimating) {
      clearInterval(interval);
      return;
    }
    STATE.animationProgress += 0.02;
    if (STATE.animationProgress >= 1) {
      STATE.animationProgress = 1;
      STATE.isAnimating = false;
      clearInterval(interval);
    }
    visualizePointClouds();
  }, 30);
});

document.getElementById("camera-overview")?.addEventListener("click", cameraOverview);
document.getElementById("camera-foothills")?.addEventListener("click", cameraFoothills);
document.getElementById("camera-city")?.addEventListener("click", cameraCity);

document.getElementById("autotour-btn")?.addEventListener("click", autoplayTour);

document.getElementById("autotour-pause")?.addEventListener("click", () => {
  STATE.autotourPaused = true;
  const pauseBtn = document.getElementById("autotour-pause");
  const resumeBtn = document.getElementById("autotour-resume");
  if (pauseBtn) pauseBtn.style.display = "none";
  if (resumeBtn) resumeBtn.style.display = "inline-block";
});

document.getElementById("autotour-resume")?.addEventListener("click", () => {
  STATE.autotourPaused = false;
  const pauseBtn = document.getElementById("autotour-pause");
  const resumeBtn = document.getElementById("autotour-resume");
  if (pauseBtn) pauseBtn.style.display = "inline-block";
  if (resumeBtn) resumeBtn.style.display = "none";
});

document.getElementById("autotour-close")?.addEventListener("click", () => {
  STATE.autotourActive = false;
  const pauseBtn = document.getElementById("autotour-pause");
  const resumeBtn = document.getElementById("autotour-resume");
  const closeBtn = document.getElementById("autotour-close");
  const titleEl = document.getElementById("autotour-title");
  if (pauseBtn) pauseBtn.style.display = "none";
  if (resumeBtn) resumeBtn.style.display = "none";
  if (closeBtn) closeBtn.style.display = "none";
  if (titleEl) titleEl.textContent = "Autoplay Tour";
});

document.getElementById("reset-btn")?.addEventListener("click", () => {
  STATE.isAnimating = false;
  STATE.animationProgress = 0;
  STATE.autotourActive = false;
  switchMode("year1");
  cameraOverview();
});

// Set initial focus
setTimeout(() => {
  document.querySelector("[data-mode-button]")?.focus();
}, 500);

console.log("✓ Demo 5 initialized: Time-Series Point Cloud Change Detection");
console.log("✓ Grid cells:", STATE.cells.length);
console.log("✓ 2020 avg height:", (STATE.cells.reduce((s, c) => s + c.year1Height, 0) / STATE.cells.length).toFixed(2), "m");
console.log("✓ 2025 avg height:", (STATE.cells.reduce((s, c) => s + c.year2Height, 0) / STATE.cells.length).toFixed(2), "m");
console.log("⚠ Point clouds: Illustrative synthetic data");
console.log("ℹ REAL DATA AVAILABLE (Virtual Shizuoka / GEOSPATIAL.JP):");
console.log("  - shizuoka-2019-pointcloud (Fuji SE/Izu E, CC BY 4.0)");
console.log("  - shizuoka-2021-pointcloud (Fuji/Shizuoka E, CC BY 4.0, candidate overlap)");
console.log("  - Catalog: https://www.geospatial.jp/ckan/dataset?q=VIRTUAL+SHIZUOKA");
console.log("ℹ NEXT STEP FOR PSS: Validate overlap, convert to Cesium 3D Tiles (.pnts),");
console.log("  upload to Cesium Ion, and provide asset IDs to swap in real measured Δheight.");
