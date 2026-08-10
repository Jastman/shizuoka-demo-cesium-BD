// ==============================================================================
// Demo 5: Time-Series Point Cloud Change Detection – Shizuoka Foothills
// Production-quality architecture with verified real data + illustrative change
// ==============================================================================
// VERIFIED DATA SOURCES (Official Cesium Ion Assets & Public Services):
// Terrain: Cesium Ion Asset #2767062 (Japan Regional Terrain, 10m resolution)
// Buildings: Cesium Ion Asset #2602291 (Japan Buildings 3D Tiles)
// Basemap: Sandcastle's current default base layer
//
// REAL PUBLIC POINT CLOUD DATASETS (Virtual Shizuoka / GEOSPATIAL.JP):
// https://www.geospatial.jp/ckan/dataset?q=VIRTUAL+SHIZUOKA
// - shizuoka-2019-pointcloud: Shizuoka Prefecture LAS archives
// - shizuoka-2021-pointcloud: Shizuoka Prefecture LAS archives
// - Publisher: Shizuoka Prefecture; catalog terms: CC BY 4.0 / ODbL
// CURRENT LIMITATION: Catalog extents overlap, but usable 2019/2021 epoch overlap
//   remains a candidate requiring tile-level validation. The archives are not yet
//   converted to streamable Cesium 3D Tiles.
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

function injectDemoShell() {
  document.documentElement.lang = "en";
  document.title = "Shizuoka Canopy Change Explorer";
  document.getElementById("change-demo-shell")?.remove();
  document.getElementById("change-demo-styles")?.remove();
  document.getElementById("toolbar")?.remove();

  let map = document.getElementById("cesiumContainer");
  if (!map) {
    map = document.createElement("div");
    map.id = "cesiumContainer";
    document.body.append(map);
  }
  map.classList.add("change-demo-map");

  const styles = document.createElement("style");
  styles.id = "change-demo-styles";
  styles.textContent = `
    :root {
      color-scheme: dark;
      --panel-bg: rgba(12, 21, 30, 0.96);
      --panel-border: #496274;
      --text: #f4f8fb;
      --muted: #bed0dc;
      --accent: #78e0f6;
      --accent-ink: #07141b;
      --button: #203746;
      --button-hover: #2d4c5f;
      --warning-bg: #3f300b;
      --warning-border: #d4a72c;
      --focus: #ffd75e;
    }

    html,
    body,
    .change-demo-map {
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
    }

    body {
      background: #071018;
      color: var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }

    .change-demo-map {
      position: absolute;
      inset: 0;
    }

    .change-demo-shell {
      position: fixed;
      inset: 0;
      z-index: 10;
      pointer-events: none;
    }

    .change-demo-panel {
      position: absolute;
      inset: 12px auto 12px 12px;
      width: min(370px, calc(100vw - 24px));
      overflow: auto;
      overscroll-behavior: contain;
      scrollbar-color: #587185 transparent;
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      background: var(--panel-bg);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(10px);
      pointer-events: auto;
    }

    .change-demo-header,
    .change-demo-section {
      padding: 14px 16px;
    }

    .change-demo-header {
      border-bottom: 1px solid var(--panel-border);
    }

    .change-demo-eyebrow {
      margin: 0 0 4px;
      color: var(--accent);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .change-demo-title {
      margin: 0;
      font-size: clamp(1.15rem, 3vw, 1.45rem);
      line-height: 1.15;
    }

    .change-demo-subtitle,
    .change-demo-help,
    .change-demo-status,
    .change-demo-source-list {
      color: var(--muted);
      font-size: 0.82rem;
      line-height: 1.45;
    }

    .change-demo-subtitle {
      margin: 6px 0 0;
    }

    .change-demo-section {
      border-bottom: 1px solid rgba(73, 98, 116, 0.65);
    }

    .change-demo-section:last-child {
      border-bottom: 0;
    }

    .change-demo-heading,
    .change-demo-legend-title {
      margin: 0 0 10px;
      font-size: 0.86rem;
      font-weight: 800;
      letter-spacing: 0.025em;
    }

    .change-demo-fieldset {
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .change-demo-button-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .change-demo-button-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .change-demo-button {
      min-height: 42px;
      padding: 8px 10px;
      border: 1px solid #688399;
      border-radius: 8px;
      background: var(--button);
      color: var(--text);
      font: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      line-height: 1.2;
      cursor: pointer;
    }

    .change-demo-button:hover {
      background: var(--button-hover);
    }

    .change-demo-button[aria-pressed="true"],
    .change-demo-button--primary {
      border-color: var(--accent);
      background: var(--accent);
      color: var(--accent-ink);
    }

    .change-demo-button:focus-visible,
    .change-demo-panel a:focus-visible,
    .change-demo-panel summary:focus-visible {
      outline: 3px solid var(--focus);
      outline-offset: 3px;
    }

    .change-demo-button[disabled] {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .change-demo-kpis {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin: 0;
    }

    .change-demo-kpi {
      min-width: 0;
      padding: 9px;
      border: 1px solid #40586a;
      border-radius: 8px;
      background: rgba(23, 40, 52, 0.85);
    }

    .change-demo-kpi dt {
      color: var(--muted);
      font-size: 0.7rem;
      line-height: 1.2;
    }

    .change-demo-kpi dd {
      margin: 4px 0 0;
      overflow-wrap: anywhere;
      font-size: 0.94rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .change-demo-kpi--wide {
      grid-column: 1 / -1;
    }

    .change-demo-warning {
      margin: 10px 0 0;
      padding: 9px 10px;
      border: 1px solid var(--warning-border);
      border-radius: 8px;
      background: var(--warning-bg);
      color: #fff2bd;
      font-size: 0.78rem;
      line-height: 1.4;
    }

    .change-demo-status {
      display: block;
      min-height: 2.5em;
      margin-top: 10px;
    }

    .change-demo-tour-card {
      margin-top: 10px;
      padding: 10px;
      border: 1px solid #40586a;
      border-radius: 8px;
      background: rgba(23, 40, 52, 0.85);
    }

    .change-demo-tour-title {
      margin: 0;
      font-size: 0.9rem;
    }

    .change-demo-tour-subtitle {
      min-height: 2.4em;
      margin: 4px 0 9px;
      color: var(--muted);
      font-size: 0.78rem;
      line-height: 1.4;
    }

    .change-demo-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.76rem;
    }

    .change-demo-legend li {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .change-demo-swatch {
      width: 12px;
      height: 12px;
      border: 1px solid rgba(255, 255, 255, 0.7);
      border-radius: 3px;
    }

    .change-demo-source-list {
      margin: 8px 0 0;
      padding-left: 20px;
    }

    .change-demo-panel a {
      color: #9cecff;
      text-underline-offset: 3px;
    }

    .change-demo-details summary {
      cursor: pointer;
      font-weight: 800;
    }

    .change-demo-visually-hidden:where(:not(:focus, :active)) {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip-path: inset(50%) !important;
      border: 0 !important;
      white-space: nowrap !important;
    }

    @media (max-width: 760px), (max-height: 680px) {
      .change-demo-panel {
        inset: auto 8px 8px;
        width: calc(100vw - 16px);
        max-height: min(42vh, 380px);
        border-radius: 12px;
      }

      .change-demo-header,
      .change-demo-section {
        padding: 11px 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
      }
    }

    @media (prefers-contrast: more) {
      :root {
        --panel-bg: #081018;
        --panel-border: #d8e6ee;
        --muted: #e0ebf1;
      }
    }
  `;
  document.head.append(styles);

  const shell = document.createElement("div");
  shell.id = "change-demo-shell";
  shell.className = "change-demo-shell";
  shell.innerHTML = `
    <aside class="change-demo-panel" aria-labelledby="change-demo-title">
      <header class="change-demo-header">
        <p class="change-demo-eyebrow">Virtual Shizuoka workflow</p>
        <h1 class="change-demo-title" id="change-demo-title">Canopy Change Explorer</h1>
        <p class="change-demo-subtitle">
          An illustrative two-epoch monitoring workflow from Mt. Fuji to Shizuoka's coast.
        </p>
      </header>

      <section class="change-demo-section" aria-labelledby="mode-heading">
        <fieldset class="change-demo-fieldset">
          <legend class="change-demo-heading" id="mode-heading">Analysis mode</legend>
          <div class="change-demo-button-grid">
            <button class="change-demo-button" type="button" data-mode-button data-mode="year1" aria-pressed="true">2020 baseline</button>
            <button class="change-demo-button" type="button" data-mode-button data-mode="year5" aria-pressed="false">2025 scenario</button>
            <button class="change-demo-button" type="button" data-mode-button data-mode="change" aria-pressed="false">Height change</button>
            <button class="change-demo-button" type="button" data-mode-button data-mode="carbon" aria-pressed="false">Carbon estimate</button>
          </div>
        </fieldset>
        <div class="change-demo-button-row" style="margin-top: 8px">
          <button class="change-demo-button change-demo-button--primary" id="animate-btn" type="button">Animate 2020 to 2025</button>
          <button class="change-demo-button" id="reset-btn" type="button">Reset demo</button>
        </div>
        <output class="change-demo-status" id="app-status" aria-live="polite">Loading the 3D scene…</output>
      </section>

      <section class="change-demo-section" aria-labelledby="kpi-heading">
        <h2 class="change-demo-heading" id="kpi-heading">Illustrative indicators</h2>
        <dl class="change-demo-kpis">
          <div class="change-demo-kpi change-demo-kpi--wide"><dt>View</dt><dd id="kpi-timestamp">2020 Baseline</dd></div>
          <div class="change-demo-kpi"><dt>Grid cells</dt><dd id="kpi-total">0</dd></div>
          <div class="change-demo-kpi"><dt>Significant loss</dt><dd id="kpi-loss">0</dd></div>
          <div class="change-demo-kpi"><dt>Significant growth</dt><dd id="kpi-growth">0</dd></div>
          <div class="change-demo-kpi"><dt>Mean height delta</dt><dd id="kpi-delta">0 m</dd></div>
          <div class="change-demo-kpi change-demo-kpi--wide"><dt>Modeled carbon delta</dt><dd id="kpi-carbon">0 Mg CO₂e</dd></div>
        </dl>
        <p class="change-demo-warning">
          Synthetic 12 × 10 canopy grid. Height change and carbon outputs are illustrative,
          not measured observations or decision-grade estimates.
        </p>
      </section>

      <section class="change-demo-section" aria-labelledby="camera-heading">
        <h2 class="change-demo-heading" id="camera-heading">Camera</h2>
        <div class="change-demo-button-row">
          <button class="change-demo-button" id="camera-overview" type="button">Regional overview</button>
          <button class="change-demo-button" id="camera-foothills" type="button">Foothills</button>
          <button class="change-demo-button" id="camera-city" type="button">Shizuoka city</button>
        </div>
      </section>

      <section class="change-demo-section" aria-labelledby="tour-heading">
        <h2 class="change-demo-heading" id="tour-heading">Guided mountain-to-coast tour</h2>
        <button class="change-demo-button change-demo-button--primary" id="autotour-btn" type="button">Start autoplay tour</button>
        <div class="change-demo-tour-card" id="autotour-card" hidden>
          <h3 class="change-demo-tour-title" id="autotour-title">Autoplay tour</h3>
          <p class="change-demo-tour-subtitle" id="autotour-subtitle">Preparing the first stop…</p>
          <div class="change-demo-button-row">
            <button class="change-demo-button" id="autotour-pause" type="button">Pause</button>
            <button class="change-demo-button" id="autotour-resume" type="button" hidden>Resume</button>
            <button class="change-demo-button" id="autotour-restart" type="button">Restart</button>
            <button class="change-demo-button" id="autotour-close" type="button">Close</button>
          </div>
        </div>
      </section>

      <section class="change-demo-section" aria-labelledby="legend-heading">
        <h2 class="change-demo-legend-title" id="legend-heading">Height-change legend</h2>
        <ul class="change-demo-legend" role="list">
          <li><span class="change-demo-swatch" style="background:#ff4444"></span>Loss</li>
          <li><span class="change-demo-swatch" style="background:#8b8b8b"></span>Stable</li>
          <li><span class="change-demo-swatch" style="background:#228b22"></span>Growth</li>
        </ul>
      </section>

      <section class="change-demo-section">
        <details class="change-demo-details">
          <summary>Data provenance and limitations</summary>
          <ul class="change-demo-source-list">
            <li>Terrain: Cesium ion asset 2767062, Japan regional terrain.</li>
            <li>Buildings: Cesium ion asset 2602291, Japan Buildings 3D Tiles.</li>
            <li>
              Source candidate:
              <a href="https://www.geospatial.jp/ckan/dataset/shizuoka-2019-pointcloud" target="_blank" rel="noopener noreferrer">Shizuoka 2019 point cloud</a>.
            </li>
            <li>
              Source candidate:
              <a href="https://www.geospatial.jp/ckan/dataset/shizuoka-2021-pointcloud" target="_blank" rel="noopener noreferrer">Shizuoka 2021 point cloud</a>.
            </li>
            <li>Publisher: Shizuoka Prefecture via GEOSPATIAL.JP / VIRTUAL SHIZUOKA.</li>
            <li>Catalog terms: dual licensed CC BY 4.0 / ODbL.</li>
            <li>Both catalogs use JGD2011 / Japan Plane Rectangular CS VIII. Their catalog extents overlap, but usable epoch overlap remains a candidate requiring tile-level validation.</li>
            <li>The public LAS archives are not loaded here. Production use requires validated overlapping tiles converted to streamable 3D Tiles and uploaded as two ion assets.</li>
          </ul>
        </details>
      </section>
    </aside>
  `;
  document.body.append(shell);
}

injectDemoShell();

function requireElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Required Demo 5 control is missing: #${id}`);
  }
  return element;
}

function updateStatus(message, isError = false) {
  const status = requireElement("app-status");
  status.textContent = message;
  status.setAttribute("role", isError ? "alert" : "status");
}

const STATE = {
  mode: "year1", // 'year1', 'year5', 'change', 'carbon'
  isAnimating: false,
  animationProgress: 0,
  animationFrame: null,
  autotourActive: false,
  autotourPaused: false,
  autotourStep: 0,
  autotourRunId: 0,
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
      lon: 138.7274,
      lat: 35.3606,
      targetHeight: 3776,
      range: 18000,
      heading: 210,
      pitch: -25,
      duration: 3,
      mode: "year1",
    },
    {
      name: "Abe River Foothills (2020)",
      subtitle: "Baseline forest canopy digital twin zone",
      lon: 138.42,
      lat: 35.06,
      targetHeight: "grid",
      range: 2600,
      heading: 45,
      pitch: -28,
      duration: 4,
      mode: "year1",
    },
    {
      name: "Foothills Change (2025)",
      subtitle: "5-year forest growth and loss patterns",
      lon: 138.42,
      lat: 35.06,
      targetHeight: "grid",
      range: 2400,
      heading: 115,
      pitch: -26,
      duration: 4,
      mode: "year5",
    },
    {
      name: "Change Detection",
      subtitle: "Red=Loss | Green=Growth | Gray=Stable",
      lon: 138.42,
      lat: 35.06,
      targetHeight: "grid",
      range: 2200,
      heading: 135,
      pitch: -24,
      duration: 4,
      mode: "change",
    },
    {
      name: "Carbon Impact",
      subtitle: "Sequestration estimate (simplified model)",
      lon: 138.42,
      lat: 35.06,
      targetHeight: "grid",
      range: 2800,
      heading: 225,
      pitch: -26,
      duration: 4,
      mode: "carbon",
    },
    {
      name: "Shizuoka City",
      subtitle: "Urban context (PLATEAU LOD2 buildings)",
      lon: 138.383,
      lat: 34.976,
      targetHeight: 60,
      range: 4500,
      heading: 315,
      pitch: -24,
      duration: 3,
      mode: "year5",
    },
    {
      name: "Coastal View",
      subtitle: "Mountain-to-ocean watershed monitoring extent",
      lon: 138.5,
      lat: 34.72,
      targetHeight: 0,
      range: 14000,
      heading: 180,
      pitch: -18,
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
  let seed = 0x5a17c0de;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  for (let row = 0; row < CONFIG.gridRows; row++) {
    for (let col = 0; col < CONFIG.gridCols; col++) {
      const lon = CONFIG.centerLon + (col - halfCols) * spacingDeg;
      const lat = CONFIG.centerLat + (row - halfRows) * spacingDeg;

      // Year 1 (2020): forest canopy 25–45m (edges higher = mountain foothills)
      const distFromCenter = Math.sqrt(
        Math.pow((col - halfCols + 0.5) / halfCols, 2) +
          Math.pow((row - halfRows + 0.5) / halfRows, 2)
      );
      const baseHeight = 25 + distFromCenter * 15 + random() * 5;

      // Year 5 (2025): realistic forest dynamics
      // 70% growth, 20% stable, 10% disturbance/loss
      const scenario = random();
      let delta;
      if (scenario < 0.7) {
        delta = 0.5 + random() * 4; // Illustrative growth: +0.5 to +4.5m
      } else if (scenario < 0.9) {
        delta = (random() - 0.5) * 1; // Illustrative stable range: ±0.5m
      } else {
        delta = -(2 + random() * 6); // Illustrative disturbance: -2 to -8m
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
        terrainHeight: 0,
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
  updateStatus("Loading Japan regional terrain…");
  let terrainProvider;
  try {
    terrainProvider =
      await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062);
  } catch (error) {
    updateStatus(`Terrain failed to load: ${error.message}`, true);
    throw error;
  }

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider,
    baseLayerPicker: false,
    fullscreenButton: false,
    homeButton: false,
    infoBox: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    scene3DOnly: true,
  });

  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.canvas.tabIndex = 0;
  viewer.canvas.setAttribute(
    "aria-label",
    "Interactive 3D map of Shizuoka. Use the camera preset buttons for keyboard navigation."
  );

  // Load verified Japan Buildings tileset (Ion asset #2602291)
  try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2602291, {
      maximumScreenSpaceError: 16,
      skipLevelOfDetail: false,
      cullWithChildrenBounds: false,
      dynamicScreenSpaceError: false,
      foveatedScreenSpaceError: false,
      foveatedTimeDelay: 0,
      preloadFlightDestinations: true,
      cacheBytes: 512 * 1024 * 1024,
      maximumCacheOverflowBytes: 256 * 1024 * 1024,
    });
    viewer.scene.primitives.add(tileset);
    console.info("Japan Buildings (ion asset 2602291) loaded.");
  } catch (error) {
    console.info(`Optional buildings layer unavailable: ${error.message}`);
  }

  return viewer;
}

const viewer = await initViewer();

async function sampleGridTerrainHeights() {
  updateStatus("Placing the illustrative grid on terrain…");
  const positions = STATE.cells.map((cell) =>
    Cesium.Cartographic.fromDegrees(cell.lon, cell.lat)
  );

  try {
    const sampled = await Cesium.sampleTerrainMostDetailed(
      viewer.terrainProvider,
      positions
    );
    sampled.forEach((position, index) => {
      if (!Number.isFinite(position.height)) {
        throw new Error(`Terrain height unavailable for grid cell ${index}.`);
      }
      STATE.cells[index].terrainHeight = position.height;
    });
  } catch (error) {
    updateStatus(`Grid placement failed: ${error.message}`, true);
    throw error;
  }
}

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
    const position = Cesium.Cartesian3.fromDegrees(
      cell.lon,
      cell.lat,
      cell.terrainHeight + height / 2
    );
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

function switchMode(newMode, announce = true) {
  const validModes = ["year1", "year5", "change", "carbon"];
  if (!validModes.includes(newMode)) {
    throw new Error(`Unsupported analysis mode: ${newMode}`);
  }

  STATE.mode = newMode;
  STATE.isAnimating = false;
  STATE.animationProgress = 0;
  if (STATE.animationFrame !== null) {
    cancelAnimationFrame(STATE.animationFrame);
    STATE.animationFrame = null;
  }
  requireElement("animate-btn").disabled = false;

  document.querySelectorAll("[data-mode-button]").forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      btn.dataset.mode === newMode ? "true" : "false"
    );
  });

  visualizePointClouds();
  updateKPIs();
  if (announce) {
    updateStatus(`${requireElement("kpi-timestamp").textContent} mode selected.`);
  }
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
    requireElement(id).textContent = val;
  };

  set("kpi-total", stats.total);
  set("kpi-loss", `${stats.sigLoss} (${pctLoss}%)`);
  set("kpi-growth", `${stats.sigGrowth} (${pctGrowth}%)`);
  set("kpi-delta", `${meanDelta} m`);
  set("kpi-carbon", `${stats.totalCarbon.toFixed(1)} Mg CO₂e`);

  const modeLabel = {
    year1: "2020 Baseline",
    year5: "2025 Forecast",
    change: "2020–2025 Change",
    carbon: "Carbon Impact",
  };
  set("kpi-timestamp", modeLabel[STATE.mode]);
}

// ============================================================================
// AUTOPLAY TOUR
// ============================================================================

function renderTourControls(showCard = STATE.autotourActive) {
  requireElement("autotour-card").hidden = !showCard;
  requireElement("autotour-btn").disabled = STATE.autotourActive;
  requireElement("autotour-pause").hidden =
    !STATE.autotourActive || STATE.autotourPaused;
  requireElement("autotour-resume").hidden =
    !STATE.autotourActive || !STATE.autotourPaused;
}

function stopAutoplayTour({ hideCard = true, focusStart = false } = {}) {
  STATE.autotourRunId++;
  STATE.autotourActive = false;
  STATE.autotourPaused = false;
  viewer.camera.cancelFlight();
  renderTourControls(!hideCard);
  if (hideCard) {
    requireElement("autotour-title").textContent = "Autoplay tour";
    requireElement("autotour-subtitle").textContent =
      "Preparing the first stop…";
  }
  if (focusStart) {
    requireElement("autotour-btn").focus();
  }
}

function setCameraView(waypoint, duration) {
  const targetHeight =
    waypoint.targetHeight === "grid"
      ? STATE.cells.reduce((sum, cell) => sum + cell.terrainHeight, 0) /
          STATE.cells.length +
        25
      : waypoint.targetHeight;
  const target = new Cesium.BoundingSphere(
    Cesium.Cartesian3.fromDegrees(waypoint.lon, waypoint.lat, targetHeight),
    50
  );
  const offset = new Cesium.HeadingPitchRange(
    Cesium.Math.toRadians(waypoint.heading),
    Cesium.Math.toRadians(waypoint.pitch),
    waypoint.range
  );

  if (duration === 0) {
    viewer.camera.viewBoundingSphere(target, offset);
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    return Promise.resolve("complete");
  }

  return new Promise((resolve) => {
    viewer.camera.flyToBoundingSphere(target, {
      offset,
      duration,
      complete: () => resolve("complete"),
      cancel: () => resolve("cancel"),
    });
  });
}

async function waitForTour(milliseconds, runId) {
  let elapsed = 0;
  while (
    elapsed < milliseconds &&
    STATE.autotourActive &&
    STATE.autotourRunId === runId
  ) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!STATE.autotourPaused) {
      elapsed += 100;
    }
  }
}

async function autoplayTour() {
  if (STATE.autotourActive) {
    stopAutoplayTour({ hideCard: false });
  }

  const runId = ++STATE.autotourRunId;
  STATE.autotourActive = true;
  STATE.autotourPaused = STATE.prefersReducedMotion;
  STATE.autotourStep = 0;
  renderTourControls(true);

  if (STATE.prefersReducedMotion) {
    updateStatus(
      "Autoplay is paused because reduced motion is enabled. Select Resume for instant camera changes."
    );
  } else {
    updateStatus("Autoplay tour started.");
  }

  for (let i = 0; i < CONFIG.tourWaypoints.length; i++) {
    if (!STATE.autotourActive || STATE.autotourRunId !== runId) {
      return;
    }

    while (
      STATE.autotourPaused &&
      STATE.autotourActive &&
      STATE.autotourRunId === runId
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!STATE.autotourActive || STATE.autotourRunId !== runId) {
      return;
    }

    const waypoint = CONFIG.tourWaypoints[i];
    STATE.autotourStep = i;
    switchMode(waypoint.mode, false);
    requireElement("autotour-title").textContent =
      `${i + 1} of ${CONFIG.tourWaypoints.length}: ${waypoint.name}`;
    requireElement("autotour-subtitle").textContent = waypoint.subtitle;
    updateStatus(`Tour stop ${i + 1}: ${waypoint.name}.`);

    let flightResult = "cancel";
    while (
      flightResult === "cancel" &&
      STATE.autotourActive &&
      STATE.autotourRunId === runId
    ) {
      while (STATE.autotourPaused && STATE.autotourActive) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!STATE.autotourActive || STATE.autotourRunId !== runId) {
        return;
      }
      flightResult = await setCameraView(
        waypoint,
        STATE.prefersReducedMotion ? 0 : waypoint.duration
      );
    }

    await waitForTour(STATE.prefersReducedMotion ? 500 : 1000, runId);
  }

  if (STATE.autotourRunId !== runId) {
    return;
  }
  STATE.autotourActive = false;
  STATE.autotourPaused = false;
  requireElement("autotour-title").textContent = "Tour complete";
  requireElement("autotour-subtitle").textContent =
    "Restart the tour or close these controls.";
  renderTourControls(true);
  updateStatus("Autoplay tour complete.");
}

function pauseAutoplayTour() {
  if (!STATE.autotourActive || STATE.autotourPaused) {
    return;
  }
  STATE.autotourPaused = true;
  viewer.camera.cancelFlight();
  renderTourControls(true);
  updateStatus(
    `Autoplay paused at stop ${STATE.autotourStep + 1}. Select Resume to continue.`
  );
  requireElement("autotour-resume").focus();
}

function resumeAutoplayTour() {
  if (!STATE.autotourActive || !STATE.autotourPaused) {
    return;
  }
  STATE.autotourPaused = false;
  renderTourControls(true);
  updateStatus(`Autoplay resumed at stop ${STATE.autotourStep + 1}.`);
  requireElement("autotour-pause").focus();
}

function restartAutoplayTour() {
  stopAutoplayTour({ hideCard: false });
  STATE.autotourStep = 0;
  void autoplayTour();
}

// ============================================================================
// CAMERA PRESETS
// ============================================================================

function useCameraPreset(waypoint, label, immediate = false) {
  if (STATE.autotourActive) {
    stopAutoplayTour();
  }
  updateStatus(`${label} camera selected.`);
  return setCameraView(
    waypoint,
    immediate || STATE.prefersReducedMotion ? 0 : 2
  );
}

function cameraOverview(immediate = false) {
  return useCameraPreset(
    {
      lon: 138.42,
      lat: 35.06,
      targetHeight: "grid",
      range: 30000,
      heading: 180,
      pitch: -35,
    },
    "Regional overview",
    immediate
  );
}

function cameraFoothills() {
  return useCameraPreset(
    {
      lon: 138.42,
      lat: 35.06,
      targetHeight: "grid",
      range: 2600,
      heading: 45,
      pitch: -28,
    },
    "Foothills"
  );
}

function cameraCity() {
  return useCameraPreset(
    {
      lon: 138.383,
      lat: 34.976,
      targetHeight: 60,
      range: 4500,
      heading: 315,
      pitch: -24,
    },
    "Shizuoka city"
  );
}

// ============================================================================
// DOM & INITIALIZATION
// ============================================================================

function animateEpochChange() {
  if (STATE.animationFrame !== null) {
    cancelAnimationFrame(STATE.animationFrame);
  }

  STATE.isAnimating = true;
  STATE.animationProgress = 0;
  STATE.mode = "year5";
  requireElement("animate-btn").disabled = true;
  document.querySelectorAll("[data-mode-button]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      button.dataset.mode === "year5" ? "true" : "false"
    );
  });

  if (STATE.prefersReducedMotion) {
    STATE.animationProgress = 1;
    STATE.isAnimating = false;
    visualizePointClouds();
    updateKPIs();
    requireElement("animate-btn").disabled = false;
    updateStatus("2025 scenario shown without animation due to reduced motion.");
    return;
  }

  updateStatus("Animating the illustrative canopy from 2020 to 2025.");
  const start = performance.now();
  let lastRender = 0;
  const step = (now) => {
    if (!STATE.isAnimating) {
      STATE.animationFrame = null;
      requireElement("animate-btn").disabled = false;
      return;
    }

    STATE.animationProgress = Math.min(1, (now - start) / 1800);
    if (now - lastRender >= 33 || STATE.animationProgress === 1) {
      visualizePointClouds();
      lastRender = now;
    }

    if (STATE.animationProgress === 1) {
      STATE.isAnimating = false;
      STATE.animationFrame = null;
      requireElement("animate-btn").disabled = false;
      updateKPIs();
      updateStatus("Animation complete. 2025 scenario shown.");
      return;
    }
    STATE.animationFrame = requestAnimationFrame(step);
  };
  STATE.animationFrame = requestAnimationFrame(step);
}

STATE.cells = generateSyntheticGrid();
STATE.prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
await sampleGridTerrainHeights();
visualizePointClouds();
updateKPIs();
await cameraOverview(true);
updateStatus(
  "Ready. Synthetic change outputs are illustrative; source epochs remain candidates."
);

document.querySelectorAll("[data-mode-button]").forEach((button) => {
  button.addEventListener("click", () => switchMode(button.dataset.mode));
});
requireElement("animate-btn").addEventListener("click", animateEpochChange);
requireElement("camera-overview").addEventListener("click", () => {
  void cameraOverview();
});
requireElement("camera-foothills").addEventListener("click", () => {
  void cameraFoothills();
});
requireElement("camera-city").addEventListener("click", () => {
  void cameraCity();
});
requireElement("autotour-btn").addEventListener("click", () => {
  void autoplayTour();
});
requireElement("autotour-pause").addEventListener("click", pauseAutoplayTour);
requireElement("autotour-resume").addEventListener("click", resumeAutoplayTour);
requireElement("autotour-restart").addEventListener(
  "click",
  restartAutoplayTour
);
requireElement("autotour-close").addEventListener("click", () => {
  stopAutoplayTour({ focusStart: true });
  updateStatus("Autoplay tour closed.");
});
requireElement("reset-btn").addEventListener("click", () => {
  STATE.isAnimating = false;
  STATE.animationProgress = 0;
  if (STATE.animationFrame !== null) {
    cancelAnimationFrame(STATE.animationFrame);
    STATE.animationFrame = null;
  }
  stopAutoplayTour();
  switchMode("year1", false);
  void cameraOverview();
  updateStatus("Demo reset to the 2020 baseline and regional overview.");
});

console.info(
  `Demo 5 ready with ${STATE.cells.length} deterministic illustrative grid cells.`
);
console.info(
  "Virtual Shizuoka candidate epochs: shizuoka-2019-pointcloud and shizuoka-2021-pointcloud; catalog terms CC BY 4.0 / ODbL."
);
