// Abe River Flood Response — Shizuoka Prefecture
// Paste into https://sandcastle.cesium.com/ and select Run (F8).
//
// REAL DATA: MLIT Project PLATEAU FY2023 Shizuoka City 3D Tiles, embedded
// shelter locations and emergency-route excerpts, and GSI standard map tiles.
// ILLUSTRATIVE MODEL: hydrograph, thresholds, operational impacts, animated
// water, and response timeline. Never use this demo for public safety decisions.

(async function shizuokaFloodResponse() {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MTA5NjcxZS04ZGIwLTQxMGMtYTgzYy1mOTVkYzQ4ZDNiNzUiLCJpZCI6NDIxMzE4LCJzdWIiOiJKYWtlLlN0ZWluZXJtYW4iLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiRGVtbyAxLSBEaXNhc3RlciBSZXNwb25zZSAmIEh5ZHJvZHluYW1pYyBTaW11bGF0aW9uIiwiaWF0IjoxNzg1NDQ1NTkwfQ.f14WW5ROSpSJULiwGF1iWovpqDFbNq-KY5-QJckUDUY";

  // ── i18n ─────────────────────────────────────────────────────────────────
  const T = {
    en: {
      eyebrow: "Shizuoka Prefecture · Flood Risk Analysis",
      title: "Abe River Flood Response",
      subtitle: "3D situational awareness from watershed headwaters to Suruga Bay",
      description: "This dashboard visualizes flood planning data and emergency response layers for the Abe River corridor, enabling prefectural staff to assess risk exposure, route impacts, and shelter capacity across a simulated high-water event.",
      warning: "Planning demo: PLATEAU/GSI geography is real. The animated six-hour event and impacts are illustrative, not a forecast or evacuation instruction.",
      labelLevel: "Water Level",
      labelPhase: "Phase",
      labelRoutes: "Route State",
      btnRun: "Run Scenario",
      btnPause: "Pause Scenario",
      btnRestart: "Restart",
      btnTour: "Start Guided Tour",
      labelFlood: "Official Planning Surface",
      labelBuildings: "PLATEAU Buildings",
      optL2: "L2 Maximum Scenario",
      optL1: "L1 Planned Scale",
      optOff: "Hidden",
      dataSrc: "Data, Provenance & Pipeline",
      tourPause: "Pause",
      tourResume: "Resume",
      tourRestart: "Restart Tour",
      tourClose: "Close Tour",
      tourPrev: "← Previous",
      tourNext: "Next →",
      tourStep: (n, total) => `Stop ${n} of ${total}`,
      legendTitle: "Map Legend",
      legendRiver: "Abe River channel",
      legendShelter: "Emergency shelter",
      legendRoute: "Emergency route (risk-colored)",
      legendFlood: "Flood planning surface",
      legendGauge: "Illustrative water-level gauge",
      legendFuji: "Mt. Fuji (regional landmark)",
      legendAkaishi: "Akaishi Mountains (headwaters)",
      stop1title: "1 · Watershed Context",
      stop1copy: "The Abe River descends from the Akaishi Mountains through Shizuoka City to Suruga Bay. Mt. Fuji anchors the regional landscape to the northeast — visible context, but outside the watershed.",
      stop2title: "2 · Official Flood Planning Data",
      stop2copy: "MLIT PLATEAU L2 depth-ranked 3D Tiles stream directly into CesiumJS. Each color band reflects an official inundation depth category. The animated translucent overlay represents an illustrative six-hour rising event.",
      stop3title: "3 · Emergency Routes & Shelters",
      stop3copy: "Emergency route segments pulse to indicate current risk status. Shelter markers show verified PLATEAU locations. Route color shifts from cyan (open) through gold and orange to red as water levels rise.",
      stop4title: "4 · Floodplain to Suruga Bay",
      stop4copy: "The camera traces the floodplain route through the city toward the coast, making downstream exposure and response dependencies visible in a single continuous view.",
      statusInit: "Initializing terrain and official PLATEAU layers…",
      statusReady: "Official PLATEAU layers loaded · illustrative scenario paused",
      statusDegraded: "Demo ready with degraded PLATEAU coverage",
      statusRunning: "Illustrative six-hour scenario running",
      statusPaused: "Illustrative scenario paused",
      statusComplete: "Illustrative scenario complete",
    },
    ja: {
      eyebrow: "静岡県 · 洪水リスク分析",
      title: "安倍川洪水対応",
      subtitle: "流域源流から駿河湾までの3D状況認識",
      description: "このダッシュボードは、安倍川流域の洪水計画データと緊急対応レイヤーを可視化し、県職員が模擬高水位イベントにおけるリスク、経路影響、避難所容量を評価できます。",
      warning: "計画デモ: PLATEAUおよびGSIの地形データは実データです。6時間のアニメーションと影響は説明用であり、予測や避難指示ではありません。",
      labelLevel: "水位",
      labelPhase: "フェーズ",
      labelRoutes: "経路状態",
      btnRun: "シナリオ開始",
      btnPause: "一時停止",
      btnRestart: "リセット",
      btnTour: "ガイドツアー開始",
      labelFlood: "公式計画浸水面",
      labelBuildings: "PLATEAUビル",
      optL2: "L2最大想定",
      optL1: "L1計画規模",
      optOff: "非表示",
      dataSrc: "データ・出典・パイプライン",
      tourPause: "一時停止",
      tourResume: "再開",
      tourRestart: "ツアー再開",
      tourClose: "ツアーを閉じる",
      tourPrev: "← 前へ",
      tourNext: "次へ →",
      tourStep: (n, total) => `${n} / ${total} 番目`,
      legendTitle: "凡例",
      legendRiver: "安倍川流路",
      legendShelter: "緊急避難所",
      legendRoute: "緊急経路（リスク色分け）",
      legendFlood: "洪水計画浸水面",
      legendGauge: "水位ゲージ（説明用）",
      legendFuji: "富士山（地域ランドマーク）",
      legendAkaishi: "赤石山脈（源流域）",
      stop1title: "1 · 流域コンテキスト",
      stop1copy: "安倍川は赤石山脈から静岡市を流れ、駿河湾に注ぎます。富士山は北東の地域景観を形作りますが、安倍川の流域外です。",
      stop2title: "2 · 公式洪水計画データ",
      stop2copy: "MLIT PLATEAU L2 浸水深ランク3DタイルがCesiumJSにストリーミングされます。各色帯は公式の浸水深カテゴリを示します。",
      stop3title: "3 · 緊急経路と避難所",
      stop3copy: "緊急経路セグメントは現在のリスク状態に応じて点滅します。避難所マーカーはPLATEAUの確認済み位置を示します。",
      stop4title: "4 · 氾濫原から駿河湾へ",
      stop4copy: "カメラは市街地を通る氾濫原経路を沿岸に向かってトレースし、下流の曝露と対応依存性を一望できます。",
      statusInit: "地形とPLATEAUレイヤーを初期化中…",
      statusReady: "PLATEAUレイヤー読み込み完了 · シナリオ一時停止中",
      statusDegraded: "PLATEAUの一部が利用不可ですがデモは継続可能です",
      statusRunning: "6時間シナリオ実行中",
      statusPaused: "シナリオ一時停止中",
      statusComplete: "シナリオ完了",
    },
  };
  let lang = "en";
  const t = (key, ...args) => typeof T[lang][key] === "function" ? T[lang][key](...args) : T[lang][key];

  const SOURCES = {
    plateau: "https://www.geospatial.jp/ckan/dataset/plateau-22100-shizuoka-shi-2023",
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
  const start = Cesium.JulianDate.fromIso8601("2026-08-10T03:00:00Z"); // noon JST
  const stop = Cesium.JulianDate.addHours(start, 6, new Cesium.JulianDate());
  const state = {
    running: false,
    tourRunning: false,
    tourStep: 0,
    tourPaused: false,
    destroyed: false,
    floodMode: "L2",
    tourDuration: 9000, // ms per stop
  };

  // ── Styles ────────────────────────────────────────────────────────────────
  const styles = document.createElement("style");
  styles.textContent = `
    :root {
      --bg: rgba(9,17,28,.95); --line: rgba(255,255,255,.14);
      --text: #f4f8fb; --muted: #b8c7d5; --cyan: #41d9ff;
      --warn: #ffc857; --danger: #ff5d68; --green: #4ade80;
    }
    .ui, .ui * { box-sizing: border-box; }
    .ui { position: fixed; z-index: 10; color: var(--text);
      font: 14px/1.45 Inter, ui-sans-serif, system-ui, sans-serif; }
    .panel { top: 12px; right: 12px; width: min(360px, calc(100vw - 24px));
      max-height: calc(100vh - 88px); overflow: auto; padding: 16px;
      border: 1px solid var(--line); border-radius: 14px;
      background: var(--bg); box-shadow: 0 16px 44px rgba(0,0,0,.45);
      backdrop-filter: blur(14px); }
    .eyebrow { margin: 0 0 4px; color: var(--cyan); font-size: 11px;
      font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
    .panel h1 { margin: 0 0 6px; font-size: 20px; line-height: 1.2; }
    .subtitle { margin: 0 0 8px; color: var(--muted); font-size: 12px; font-style: italic; }
    .description { margin: 0 0 12px; color: var(--muted); font-size: 12px; line-height: 1.5; }
    .warning { margin: 0 0 12px; padding: 9px 10px;
      border: 1px solid rgba(255,200,87,.42); border-radius: 8px;
      background: rgba(255,200,87,.1); font-size: 12px; }
    .lang-row { display: flex; justify-content: flex-end; margin-bottom: 8px; gap: 4px; }
    .lang-btn { padding: 3px 8px; border: 1px solid var(--line); border-radius: 6px;
      background: transparent; color: var(--muted); font-size: 11px; cursor: pointer; }
    .lang-btn.active { background: var(--cyan); color: #000; font-weight: 700; }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
    .metric { min-width: 0; padding: 9px; border: 1px solid var(--line);
      border-radius: 9px; background: rgba(255,255,255,.04); }
    .metric span { display: block; color: var(--muted); font-size: 10px; text-transform: uppercase; }
    .metric strong { display: block; margin-top: 2px; font-size: 16px; }
    .controls { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; }
    .ui button, .ui select { min-height: 36px; border: 1px solid var(--line);
      border-radius: 8px; color: var(--text); background: rgba(255,255,255,.08); font: inherit; }
    .ui button { padding: 6px 11px; cursor: pointer; transition: background .15s; }
    .ui button:hover { background: rgba(255,255,255,.16); }
    .ui button:focus-visible, .ui select:focus-visible,
    .ui summary:focus-visible { outline: 3px solid var(--cyan); outline-offset: 2px; }
    .primary { background: #087f9c !important; font-weight: 700 !important; }
    .row { display: grid; grid-template-columns: 1fr auto; align-items: center;
      gap: 10px; margin-top: 9px; }
    .row label { color: var(--muted); font-size: 12px; }
    .row select { padding: 5px 28px 5px 8px; }
    .ui details { margin-top: 11px; border-top: 1px solid var(--line); padding-top: 10px; }
    .ui summary { cursor: pointer; font-weight: 700; }
    .ui details p, .ui details li { color: var(--muted); font-size: 12px; }
    .ui a { color: #75e6ff; }
    /* Status badge */
    .status-badge { right: 12px; top: auto; bottom: 140px;
      max-width: min(280px, calc(100vw - 24px));
      padding: 8px 12px; border: 1px solid var(--line); border-radius: 9px;
      background: var(--bg); font-size: 12px; }
    /* Tour panel */
    .tour { left: 50%; bottom: 28px; width: min(600px, calc(100vw - 24px));
      transform: translateX(-50%); padding: 0; border: 1px solid rgba(65,217,255,.45);
      border-radius: 14px; background: var(--bg);
      box-shadow: 0 12px 40px rgba(0,0,0,.55); overflow: hidden; }
    .tour[hidden] { display: none; }
    /* Timeline progress bar */
    .tour-progress { height: 3px; background: rgba(255,255,255,.12); }
    .tour-progress-fill { height: 100%; background: var(--cyan);
      width: 0%; transition: width .1s linear; }
    .tour-body { padding: 14px 16px 12px; }
    .tour-meta { display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6px; }
    .tour-step-label { color: var(--cyan); font-size: 11px; font-weight: 700;
      letter-spacing: .1em; text-transform: uppercase; }
    .tour h2 { margin: 0 0 6px; font-size: 16px; }
    .tour p { margin: 0 0 10px; color: var(--muted); font-size: 13px; line-height: 1.5; }
    .tour-actions { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
    .tour-nav { display: flex; gap: 5px; }
    .tour-nav button { min-height: 32px; padding: 4px 10px; font-size: 13px; }
    .tour-spacer { flex: 1; }
    /* Legend panel */
    .legend { left: 12px; bottom: 28px; width: 200px;
      padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px;
      background: var(--bg); }
    .legend[hidden] { display: none; }
    .legend h3 { margin: 0 0 8px; font-size: 13px; color: var(--cyan); }
    .legend-item { display: flex; align-items: center; gap: 7px;
      margin-bottom: 6px; font-size: 11px; color: var(--muted); }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .legend-line { width: 18px; height: 4px; border-radius: 2px; flex-shrink: 0; }
    .legend-box { width: 14px; height: 10px; border-radius: 2px; flex-shrink: 0; opacity: .7; }
    /* Water level gauge bar */
    .gauge-wrap { margin: 10px 0 4px; }
    .gauge-track { position: relative; height: 40px; border-radius: 8px;
      background: rgba(255,255,255,.08); border: 2px solid var(--line); overflow: hidden; }
    .gauge-fill { position: absolute; inset: 0 auto 0 0; height: 100%;
      background: linear-gradient(90deg, #4575b4, #74add1, #fdae61, #f46d43, #a50026);
      background-size: 500% 100%; background-position: 0% 50%;
      transition: width 0.6s ease, background-position 0.6s ease;
      border-radius: 0; }
    .gauge-level-text { position: absolute; inset: 0; display: flex;
      align-items: center; justify-content: center;
      font-size: 14px; font-weight: 800; color: #fff;
      text-shadow: 0 1px 4px rgba(0,0,0,.8); pointer-events: none; }
    .gauge-ticks { position: absolute; inset: 0; display: flex;
      justify-content: space-between; align-items: flex-end;
      padding: 0 6px 3px; pointer-events: none; }
    .gauge-ticks span { font-size: 9px; color: rgba(255,255,255,.45); font-weight: 600; }
    .gauge-label { display: block; margin-top: 4px; font-size: 10px;
      color: var(--muted); letter-spacing: .06em; }
    @media (max-width: 700px) {
      .panel { max-height: 45vh; top: 8px; right: 8px; left: 8px; width: auto; }
      .status-badge { bottom: 190px; }
      .tour { bottom: 8px; }
      .legend { left: 8px; bottom: 8px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .ui *, .ui *::before, .ui *::after {
        scroll-behavior: auto !important; transition: none !important;
        animation: none !important;
      }
    }
    @keyframes pulse-glow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.35; }
    }`;
  document.head.append(styles);

  // ── Panel HTML ────────────────────────────────────────────────────────────
  const panel = document.createElement("section");
  panel.className = "ui panel";
  panel.setAttribute("aria-labelledby", "fl-title");
  panel.innerHTML = `
    <div class="lang-row">
      <button class="lang-btn active" id="btn-en" aria-pressed="true">EN</button>
      <button class="lang-btn" id="btn-ja" aria-pressed="false">日本語</button>
    </div>
    <p class="eyebrow" id="fl-eyebrow"></p>
    <h1 id="fl-title"></h1>
    <p class="subtitle" id="fl-subtitle"></p>
    <p class="description" id="fl-description"></p>
    <p class="warning" id="fl-warning"></p>
    <div class="metrics" aria-live="polite" aria-atomic="true">
      <div class="metric"><span id="lbl-level"></span><strong id="fl-level">—</strong></div>
      <div class="metric"><span id="lbl-phase"></span><strong id="fl-phase">—</strong></div>
      <div class="metric"><span id="lbl-routes"></span><strong id="fl-routes">—</strong></div>
    </div>
    <div class="gauge-wrap" aria-label="Water level gauge" title="Illustrative water level (max 5 m)">
      <div class="gauge-track" id="gauge-track">
        <div class="gauge-fill" id="gauge-fill"></div>
        <div class="gauge-level-text" id="gauge-level-text" aria-live="polite">— m</div>
        <div class="gauge-ticks">
          <span>0</span><span>1 m</span><span>2 m</span><span>3 m</span><span>4 m</span><span>5 m</span>
        </div>
      </div>
      <span class="gauge-label">▲ Abe River Level (illustrative)</span>
    </div>
    <div class="controls" aria-label="Scenario controls">
      <button id="fl-play" class="primary" type="button"></button>
      <button id="fl-restart" type="button"></button>
      <button id="fl-tour-start" type="button"></button>
    </div>
    <div class="row">
      <label for="fl-flood" id="lbl-flood"></label>
      <select id="fl-flood">
        <option value="L2" id="opt-l2"></option>
        <option value="L1" id="opt-l1"></option>
        <option value="off" id="opt-off"></option>
      </select>
    </div>
    <div class="row">
      <label for="fl-buildings" id="lbl-buildings"></label>
      <input id="fl-buildings" type="checkbox" checked />
    </div>
    <details>
      <summary id="fl-data-src"></summary>
      <p><strong>Verified public data:</strong> MLIT Project PLATEAU FY2023
        Shizuoka City buildings, flood-planning surfaces, shelter locations, and
        emergency-route excerpts; GSI standard map. Catalog checked 2026-08-10.</p>
      <p><strong>Illustrative:</strong> hydrograph, thresholds, impact states,
        counts, and animated water. Static L1/L2 tiles remain official planning data.</p>
      <p>Geographic note: the Abe River descends from the Akaishi mountains.
        Mt. Fuji is regional context to the northeast, not the Abe watershed.</p>
      <ul>
        <li><a href="${SOURCES.plateau}" target="_blank" rel="noreferrer">PLATEAU dataset</a></li>
        <li><a href="${SOURCES.gsi}" target="_blank" rel="noreferrer">GSI tile catalog</a></li>
        <li><a href="${SOURCES.gsiTerms}" target="_blank" rel="noreferrer">GSI terms</a></li>
      </ul>
    </details>`;

  const statusEl = document.createElement("div");
  statusEl.className = "ui status-badge";
  statusEl.setAttribute("role", "status");

  // ── Tour panel ────────────────────────────────────────────────────────────
  const tour = document.createElement("section");
  tour.className = "ui tour";
  tour.hidden = true;
  tour.setAttribute("aria-labelledby", "tour-title");
  tour.innerHTML = `
    <div class="tour-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div class="tour-progress-fill" id="tour-fill"></div>
    </div>
    <div class="tour-body">
      <div class="tour-meta">
        <span class="tour-step-label" id="tour-step-label"></span>
      </div>
      <h2 id="tour-title" tabindex="-1"></h2>
      <p id="tour-copy"></p>
      <div class="tour-actions">
        <div class="tour-nav">
          <button id="tour-prev" type="button"></button>
          <button id="tour-next" type="button"></button>
        </div>
        <div class="tour-spacer"></div>
        <button id="tour-toggle" type="button"></button>
        <button id="tour-close" type="button"></button>
      </div>
    </div>`;

  // ── Legend panel ──────────────────────────────────────────────────────────
  const legend = document.createElement("aside");
  legend.className = "ui legend";
  legend.hidden = true;
  legend.innerHTML = `
    <h3 id="legend-title"></h3>
    <div class="legend-item"><div class="legend-line" style="background:#41d9ff"></div><span id="leg-river"></span></div>
    <div class="legend-item"><div class="legend-dot" style="background:#4ade80;border:2px solid #000"></div><span id="leg-shelter"></span></div>
    <div class="legend-item"><div class="legend-line" style="background:linear-gradient(to right,cyan,gold,orange,red)"></div><span id="leg-route"></span></div>
    <div class="legend-item"><div class="legend-box" style="background:#4575b4"></div><span id="leg-flood"></span></div>
    <div class="legend-item"><div class="legend-dot" style="background:var(--cyan);opacity:.7"></div><span id="leg-gauge"></span></div>
    <div class="legend-item"><div class="legend-dot" style="background:#fff;border:2px solid #aaa"></div><span id="leg-fuji"></span></div>
    <div class="legend-item"><div class="legend-line" style="background:rgba(255,255,255,.4);border-top:2px dashed #aaa"></div><span id="leg-akaishi"></span></div>`;

  document.body.append(panel, statusEl, tour, legend);

  // ── i18n render ───────────────────────────────────────────────────────────
  function applyTranslations() {
    panel.querySelector("#fl-eyebrow").textContent = t("eyebrow");
    panel.querySelector("#fl-title").textContent = t("title");
    panel.querySelector("#fl-subtitle").textContent = t("subtitle");
    panel.querySelector("#fl-description").textContent = t("description");
    panel.querySelector("#fl-warning").innerHTML = `<strong>⚠</strong> ${t("warning")}`;
    panel.querySelector("#lbl-level").textContent = t("labelLevel");
    panel.querySelector("#lbl-phase").textContent = t("labelPhase");
    panel.querySelector("#lbl-routes").textContent = t("labelRoutes");
    panel.querySelector("#fl-play").textContent = state.running ? t("btnPause") : t("btnRun");
    panel.querySelector("#fl-restart").textContent = t("btnRestart");
    panel.querySelector("#fl-tour-start").textContent = t("btnTour");
    panel.querySelector("#lbl-flood").textContent = t("labelFlood");
    panel.querySelector("#lbl-buildings").textContent = t("labelBuildings");
    panel.querySelector("#opt-l2").textContent = t("optL2");
    panel.querySelector("#opt-l1").textContent = t("optL1");
    panel.querySelector("#opt-off").textContent = t("optOff");
    panel.querySelector("#fl-data-src").textContent = t("dataSrc");
    tour.querySelector("#tour-prev").textContent = t("tourPrev");
    tour.querySelector("#tour-next").textContent = t("tourNext");
    tour.querySelector("#tour-toggle").textContent = state.tourPaused ? t("tourResume") : t("tourPause");
    tour.querySelector("#tour-close").textContent = t("tourClose");
    legend.querySelector("#legend-title").textContent = t("legendTitle");
    legend.querySelector("#leg-river").textContent = t("legendRiver");
    legend.querySelector("#leg-shelter").textContent = t("legendShelter");
    legend.querySelector("#leg-route").textContent = t("legendRoute");
    legend.querySelector("#leg-flood").textContent = t("legendFlood");
    legend.querySelector("#leg-gauge").textContent = t("legendGauge");
    legend.querySelector("#leg-fuji").textContent = t("legendFuji");
    legend.querySelector("#leg-akaishi").textContent = t("legendAkaishi");
    // Refresh tour if open
    if (!tour.hidden) renderTourStep(state.tourStep, false);
  }

  // ── Viewer ────────────────────────────────────────────────────────────────
  let terrain;
  try {
    terrain = Cesium.Terrain.fromWorldTerrain();
  } catch {
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

  // Set to daytime (noon JST = 03:00 UTC)
  viewer.scene.skyAtmosphere.show = true;

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

  // ── Hydrograph model ──────────────────────────────────────────────────────
  const samples = [[0,1.5],[1,2.1],[2,2.9],[3,3.9],[4,3.3],[5,2.5],[6,1.8]];
  function modelLevel(time) {
    const hour = Cesium.Math.clamp(
      Cesium.JulianDate.secondsDifference(time, start) / 3600, 0, 6
    );
    for (let i = 0; i < samples.length - 1; i++) {
      const a = samples[i], b = samples[i + 1];
      if (hour >= a[0] && hour <= b[0])
        return Cesium.Math.lerp(a[1], b[1], (hour - a[0]) / (b[0] - a[0]));
    }
    return samples.at(-1)[1];
  }
  function risk(level) {
    if (level >= 3.5) return { phase: "Respond",  route: "Closed",     color: Cesium.Color.RED };
    if (level >= 2.8) return { phase: "Mobilize", route: "Restricted", color: Cesium.Color.ORANGE };
    if (level >= 2.1) return { phase: "Prepare",  route: "Watch",      color: Cesium.Color.GOLD };
    return              { phase: "Monitor",  route: "Open",       color: Cesium.Color.CYAN };
  }

  // ── Static geographic annotations (stop 1) ────────────────────────────────
  // Abe River channel highlight
  viewer.entities.add({
    name: "Abe River channel",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        138.2850, 35.1150,  138.3050, 35.0700,  138.3200, 35.0300,
        138.3400, 35.0050,  138.3600, 34.9900,  138.3720, 34.9750,
        138.3840, 34.9560,  138.3900, 34.9380,  138.3930, 34.9180,
      ]),
      width: 5,
      clampToGround: true,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.25,
        color: Cesium.Color.fromCssColorString("#41d9ff").withAlpha(0.85),
      }),
    },
  });

  // River flow direction arrow at midpoint
  viewer.entities.add({
    name: "Abe River flow direction",
    position: Cesium.Cartesian3.fromDegrees(138.365, 34.990, 80),
    label: {
      text: "▼ Abe River",
      font: "bold 13px sans-serif",
      fillColor: Cesium.Color.fromCssColorString("#41d9ff"),
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
      pixelOffset: new Cesium.Cartesian2(0, 0),
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 35000),
    },
  });

  // Mt. Fuji landmark marker
  viewer.entities.add({
    name: "Mt. Fuji (regional landmark)",
    position: Cesium.Cartesian3.fromDegrees(138.7274, 35.3606, 3776),
    point: {
      pixelSize: 10,
      color: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString("#aaaaaa"),
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.NONE,
    },
    label: {
      text: "🗻 Mt. Fuji",
      font: "bold 13px sans-serif",
      fillColor: Cesium.Color.WHITE,
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.72),
      pixelOffset: new Cesium.Cartesian2(0, -24),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 80000),
    },
  });

  // Akaishi Mountains label (headwaters region)
  viewer.entities.add({
    name: "Akaishi Mountains (headwaters)",
    position: Cesium.Cartesian3.fromDegrees(138.22, 35.22, 2500),
    label: {
      text: "Akaishi Mountains\n(Abe River headwaters)",
      font: "12px sans-serif",
      fillColor: Cesium.Color.fromCssColorString("#d4c5a9"),
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.65),
      pixelOffset: new Cesium.Cartesian2(0, 0),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 60000),
    },
  });

  // ── Shelters ──────────────────────────────────────────────────────────────
  const shelterDefs = [
    ["Anzai Elementary",     138.37406, 34.98125],
    ["Nakada Elementary",    138.39313, 34.96377],
    ["Toyota Junior High",   138.40888, 34.97105],
    ["Imiya Elementary",     138.36686, 34.98843],
  ];
  const shelterEntities = [];
  for (const [name, lon, lat] of shelterDefs) {
    const e = viewer.entities.add({
      name: `${name} · official PLATEAU shelter`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat),
      point: {
        pixelSize: 12,
        color: Cesium.Color.fromCssColorString("#4ade80"),
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
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 14000),
      },
    });
    shelterEntities.push(e);
  }

  // ── Emergency routes ──────────────────────────────────────────────────────
  const routeDefs = [
    ["Route 362", [138.33022,34.98407, 138.34461,34.97981, 138.36093,34.97597, 138.3773,34.97366, 138.38461,34.97059]],
    ["Nakajima–Minami-Abe", [138.3748,34.96173, 138.3828,34.95479, 138.38813,34.95007, 138.39616,34.94034]],
  ];
  const routeEntities = [];
  for (const [name, coords] of routeDefs) {
    const e = viewer.entities.add({
      name: `${name} · PLATEAU emergency-route excerpt`,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(coords),
        width: 9,
        clampToGround: true,
        material: new Cesium.ColorMaterialProperty(
          new Cesium.CallbackProperty(
            (time) => risk(modelLevel(time)).color.withAlpha(0.92), false
          )
        ),
      },
    });
    routeEntities.push(e);
  }

  // ── Flood polygon (illustrative) ──────────────────────────────────────────
  viewer.entities.add({
    name: "Illustrative flood extent",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        138.352,34.995, 138.371,34.988, 138.389,34.982, 138.397,34.967,
        138.396,34.948, 138.385,34.933, 138.371,34.945, 138.360,34.965,
      ]),
      height: 2,
      // Extrude height grows with water level — clearly shows inundation depth
      extrudedHeight: new Cesium.CallbackProperty((time) => {
        const level = modelLevel(time);
        return 2 + level * 4; // 2m base + up to ~20m at peak
      }, false),
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty((time) => {
          const level = modelLevel(time);
          const r = risk(level);
          // Alpha ramps dramatically: 0.08 at minimum, 0.65 at peak
          const alpha = 0.08 + (level - 1.5) / (3.9 - 1.5) * 0.57;
          return r.color.withAlpha(Math.max(0.08, Math.min(0.65, alpha)));
        }, false)
      ),
      outline: true,
      outlineColor: new Cesium.CallbackProperty((time) => {
        return risk(modelLevel(time)).color.withAlpha(0.9);
      }, false),
      outlineWidth: 2,
    },
  });

  // ── Water-level gauge (illustrative cylinder) ─────────────────────────────
  viewer.entities.add({
    name: "Water-level gauge (illustrative)",
    position: Cesium.Cartesian3.fromDegrees(138.365, 34.978, 40),
    cylinder: {
      length: new Cesium.CallbackProperty((time) => 4 + modelLevel(time) * 20, false),
      topRadius: 25,
      bottomRadius: 25,
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(
          (time) => risk(modelLevel(time)).color.withAlpha(0.85), false
        )
      ),
      outline: true,
      outlineColor: Cesium.Color.WHITE.withAlpha(0.4),
    },
    label: {
      text: new Cesium.CallbackProperty(
        (time) => `⚠ Abe River\n${modelLevel(time).toFixed(2)} m\n(illustrative)`,
        false
      ),
      font: "bold 13px sans-serif",
      showBackground: true,
      backgroundColor: Cesium.Color.BLACK.withAlpha(0.85),
      backgroundPadding: new Cesium.Cartesian2(8, 6),
      pixelOffset: new Cesium.Cartesian2(0, -70),
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 18000),
      fillColor: new Cesium.CallbackProperty(
        (time) => risk(modelLevel(time)).color, false
      ),
    },
  });

  // ── Tour stop 1: animated highlight overlays ──────────────────────────────
  // Abe watershed polygon shown only during stop 1
  const watershedEntity = viewer.entities.add({
    name: "Abe River watershed (stop 1 context)",
    show: false,
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        138.20, 35.18,  138.28, 35.24,  138.38, 35.22,  138.46, 35.12,
        138.44, 34.92,  138.40, 34.89,  138.36, 34.90,  138.30, 34.95,
        138.22, 35.05,  138.18, 35.12,
      ]),
      material: Cesium.Color.fromCssColorString("#41d9ff").withAlpha(0.07),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#41d9ff").withAlpha(0.35),
      outlineWidth: 2,
    },
  });

  // ── Tileset loading ───────────────────────────────────────────────────────
  const tilesets = { buildings: null, L1: null, L2: null };
  function configureTileset(tileset, maxSSE) {
    tileset.maximumScreenSpaceError = maxSSE;
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
  async function addTileset(key, url, maxSSE) {
    try {
      const ts = await Cesium.Cesium3DTileset.fromUrl(url);
      configureTileset(ts, maxSSE);
      viewer.scene.primitives.add(ts);
      tilesets[key] = ts;
      return true;
    } catch (err) {
      console.error(`PLATEAU ${key} failed:`, err);
      statusEl.textContent = `PLATEAU ${key} unavailable; remaining layers still usable.`;
      return false;
    }
  }

  statusEl.textContent = t("statusInit");
  applyTranslations();

  const results = await Promise.all([
    addTileset("buildings", ASSETS.buildings, 48),
    addTileset("L1", ASSETS.floodL1, 36),
    addTileset("L2", ASSETS.floodL2, 36),
  ]);
  if (tilesets.L1) { tilesets.L1.style = floodStyle(0.67); tilesets.L1.show = false; }
  if (tilesets.L2) tilesets.L2.style = floodStyle(0.67);
  statusEl.textContent = results.every(Boolean) ? t("statusReady") : t("statusDegraded");

  // ── Tour cameras ──────────────────────────────────────────────────────────
  const tourDefs = [
    {
      titleKey: "stop1title", copyKey: "stop1copy",
      target: [138.34, 35.02, 350], offset: [155, -30, 32000],
      onEnter: () => { watershedEntity.show = true; legend.hidden = false; },
      onExit:  () => { watershedEntity.show = false; },
    },
    {
      titleKey: "stop2title", copyKey: "stop2copy",
      target: [138.372, 34.98, 100], offset: [155, -32, 9000],
      onEnter: () => { legend.hidden = false; },
      onExit:  () => {},
    },
    {
      titleKey: "stop3title", copyKey: "stop3copy",
      target: [138.381, 34.97, 100], offset: [160, -27, 5000],
      onEnter: () => {
        legend.hidden = false;
        // Pulse shelters and routes via CSS animation
        shelterEntities.forEach(e => {
          if (e.point) e.point.pixelSize = new Cesium.CallbackProperty(() => {
            return 12 + 5 * Math.abs(Math.sin(Date.now() / 400));
          }, false);
        });
      },
      onExit: () => {
        shelterEntities.forEach(e => {
          if (e.point) e.point.pixelSize = 12;
        });
      },
    },
    {
      titleKey: "stop4title", copyKey: "stop4copy",
      duration: 34000, // ~3.5 + 5×5s flight segments
      target: [138.390, 34.940, 50], offset: [330, -18, 15000],
      onEnter: () => {
        // Cinematic low-altitude sweep: upstream foothills → city floodplain → Suruga Bay
        // Heights are meters above ellipsoid; the Shizuoka plain sits ~10–50 m ASL
        // so 300–600 m gives a "treetop" perspective with the city clearly below.
        if (!reducedMotion) {
          const waypoints = [
            // 1. Start: Abe River upstream gorge, low altitude looking south toward city
            { lon: 138.355, lat: 35.055, h: 420, heading: 178, pitch: -8,  dur: 3.5 },
            // 2. Descend into central Shizuoka — city grid below, river visible left
            { lon: 138.362, lat: 35.020, h: 280,  heading: 175, pitch: -6, dur: 5.0 },
            // 3. Skim across the urban floodplain at rooftop level (~180m ASL)
            { lon: 138.370, lat: 34.998, h: 180,  heading: 172, pitch: -5, dur: 5.0 },
            // 4. Over the lower floodplain — flood extent clearly visible below
            { lon: 138.378, lat: 34.974, h: 120,  heading: 174, pitch: -4, dur: 5.0 },
            // 5. Coastal lowland — sea level approach, Suruga Bay ahead
            { lon: 138.385, lat: 34.950, h: 80,   heading: 176, pitch: -4, dur: 5.0 },
            // 6. Pull up for bay context — look back inland at the full corridor
            { lon: 138.390, lat: 34.922, h: 2600, heading: 355, pitch: -22, dur: 5.0 },
          ];
          let idx = 0;
          function flyNext() {
            if (idx >= waypoints.length || state.tourStep !== 3) return;
            const wp = waypoints[idx++];
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(wp.lon, wp.lat, wp.h),
              orientation: {
                heading: Cesium.Math.toRadians(wp.heading),
                pitch: Cesium.Math.toRadians(wp.pitch),
                roll: 0,
              },
              duration: wp.dur,
              complete: flyNext,
            });
          }
          flyNext();
        }
      },
      onExit: () => {},
    },
  ];

  // ── Tour progress animation ───────────────────────────────────────────────
  let tourProgressRaf = 0;
  let tourStepStart = 0;
  const fillEl = tour.querySelector("#tour-fill");
  function animateTourProgress() {
    if (state.tourPaused || tour.hidden) return;
    const def = tourDefs[state.tourStep];
    const stepDuration = def?.duration || state.tourDuration;
    const elapsed = Date.now() - tourStepStart;
    const pct = Math.min(100, (elapsed / stepDuration) * 100);
    fillEl.style.width = pct + "%";
    tour.querySelector(".tour-progress").setAttribute("aria-valuenow", Math.round(pct));
    tourProgressRaf = requestAnimationFrame(animateTourProgress);
  }

  let tourAutoTimer = 0;
  function clearTourAuto() {
    clearTimeout(tourAutoTimer);
    cancelAnimationFrame(tourProgressRaf);
  }

  function renderTourStep(index, moveCamera = true) {
    const def = tourDefs[index];
    tour.querySelector("#tour-step-label").textContent = t("tourStep", index + 1, tourDefs.length);
    tour.querySelector("#tour-title").textContent = t(def.titleKey);
    tour.querySelector("#tour-copy").textContent = t(def.copyKey);
    tour.querySelector("#tour-prev").disabled = index === 0;
    tour.querySelector("#tour-toggle").textContent = state.tourPaused ? t("tourResume") : t("tourPause");
  }

  function goToStep(index, moveCamera = true) {
    clearTourAuto();
    // Exit old step (guard: only if we have a valid previous step AND it's different)
    const prevDef = tourDefs[state.tourStep];
    if (prevDef && state.tourStep !== index && prevDef.onExit) {
      prevDef.onExit();
    }
    state.tourStep = ((index % tourDefs.length) + tourDefs.length) % tourDefs.length;
    const def = tourDefs[state.tourStep];

    renderTourStep(state.tourStep, moveCamera);

    if (moveCamera && def.titleKey !== "stop4title") {
      viewer.camera.flyToBoundingSphere(
        new Cesium.BoundingSphere(
          Cesium.Cartesian3.fromDegrees(...def.target), 300
        ),
        {
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(def.offset[0]),
            Cesium.Math.toRadians(def.offset[1]),
            def.offset[2]
          ),
          duration: reducedMotion ? 0 : 2.5,
        }
      );
    }

    if (def.onEnter) def.onEnter();

    // Reset and animate progress bar
    fillEl.style.width = "0%";
    tourStepStart = Date.now();
    const stepDuration = def.duration || state.tourDuration;
    if (!state.tourPaused) {
      cancelAnimationFrame(tourProgressRaf);
      tourProgressRaf = requestAnimationFrame(animateTourProgress);
      // Auto-advance
      tourAutoTimer = setTimeout(() => {
        if (!state.tourPaused && !tour.hidden) {
          goToStep(state.tourStep + 1);
        }
      }, stepDuration);
    }
  }

  function startTour() {
    state.tourPaused = false;
    tour.hidden = false;
    legend.hidden = false;
    // Reset to step 0 — skip onExit guard since we're initializing
    state.tourStep = 0;
    goToStep(0, true);
    tour.querySelector("#tour-title").focus({ preventScroll: true });
  }

  function closeTour() {
    clearTourAuto();
    tourDefs[state.tourStep]?.onExit?.();
    state.tourPaused = false;
    tour.hidden = true;
    legend.hidden = true;
    watershedEntity.show = false;
    shelterEntities.forEach(e => { if (e.point) e.point.pixelSize = 12; });
    panel.querySelector("#fl-tour-start").focus({ preventScroll: true });
  }

  // ── Event listeners ───────────────────────────────────────────────────────
  panel.querySelector("#fl-play").addEventListener("click", (e) => {
    state.running = !state.running;
    viewer.clock.shouldAnimate = state.running;
    e.currentTarget.textContent = state.running ? t("btnPause") : t("btnRun");
    statusEl.textContent = state.running ? t("statusRunning") : t("statusPaused");
  });
  panel.querySelector("#fl-restart").addEventListener("click", () => {
    viewer.clock.currentTime = start.clone();
    viewer.clock.shouldAnimate = false;
    state.running = false;
    panel.querySelector("#fl-play").textContent = t("btnRun");
  });
  panel.querySelector("#fl-tour-start").addEventListener("click", startTour);
  panel.querySelector("#fl-flood").addEventListener("change", (e) => {
    state.floodMode = e.target.value;
    if (tilesets.L1) tilesets.L1.show = state.floodMode === "L1";
    if (tilesets.L2) tilesets.L2.show = state.floodMode === "L2";
  });
  panel.querySelector("#fl-buildings").addEventListener("change", (e) => {
    if (tilesets.buildings) tilesets.buildings.show = e.target.checked;
  });

  // Language buttons
  ["en", "ja"].forEach((l) => {
    panel.querySelector(`#btn-${l}`).addEventListener("click", () => {
      lang = l;
      panel.querySelector("#btn-en").classList.toggle("active", l === "en");
      panel.querySelector("#btn-en").setAttribute("aria-pressed", l === "en");
      panel.querySelector("#btn-ja").classList.toggle("active", l === "ja");
      panel.querySelector("#btn-ja").setAttribute("aria-pressed", l === "ja");
      applyTranslations();
    });
  });

  // Tour navigation
  tour.querySelector("#tour-prev").addEventListener("click", () => goToStep(state.tourStep - 1));
  tour.querySelector("#tour-next").addEventListener("click", () => goToStep(state.tourStep + 1));
  tour.querySelector("#tour-toggle").addEventListener("click", () => {
    state.tourPaused = !state.tourPaused;
    if (state.tourPaused) {
      clearTourAuto();
      cancelAnimationFrame(tourProgressRaf);
    } else {
      const stepDuration = tourDefs[state.tourStep]?.duration || state.tourDuration;
      tourStepStart = Date.now() - (parseFloat(fillEl.style.width) / 100) * stepDuration;
      tourProgressRaf = requestAnimationFrame(animateTourProgress);
      tourAutoTimer = setTimeout(() => {
        if (!state.tourPaused) goToStep(state.tourStep + 1);
      }, stepDuration * (1 - parseFloat(fillEl.style.width) / 100));
    }
    tour.querySelector("#tour-toggle").textContent = state.tourPaused ? t("tourResume") : t("tourPause");
  });
  tour.querySelector("#tour-close").addEventListener("click", closeTour);
  tour.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeTour();
    if (e.key === "ArrowRight") goToStep(state.tourStep + 1);
    if (e.key === "ArrowLeft") goToStep(state.tourStep - 1);
  });

  // ── Clock tick ────────────────────────────────────────────────────────────
  const gaugeFill = panel.querySelector("#gauge-fill");
  const MAX_LEVEL = 5; // meters (gauge scale max)
  viewer.clock.onTick.addEventListener((clock) => {
    const level = modelLevel(clock.currentTime);
    const r = risk(level);
    panel.querySelector("#fl-level").textContent = `${level.toFixed(2)} m`;
    panel.querySelector("#fl-phase").textContent = r.phase;
    panel.querySelector("#fl-routes").textContent = r.route;
    // Drive gauge bar fill (0–5 m scale) and color ramp position
    const pct = Math.min(100, (level / MAX_LEVEL) * 100);
    gaugeFill.style.width = pct + "%";
    // background-position drives the color ramp: 0% = blue (low), 100% = red (high)
    gaugeFill.style.backgroundPosition = pct + "% 50%";
    // Show level value inside gauge bar
    const levelTextEl = panel.querySelector("#gauge-level-text");
    if (levelTextEl) levelTextEl.textContent = `${level.toFixed(2)} m`;
    // Update gauge track border color to match risk
    const rgbMap = {
      Monitor: "rgba(65,217,255,.5)",
      Prepare: "rgba(253,174,97,.6)",
      Mobilize: "rgba(244,109,67,.7)",
      Respond: "rgba(165,0,38,.8)"
    };
    panel.querySelector("#gauge-track").style.borderColor = rgbMap[r.phase] || "rgba(255,255,255,.14)";
    if (state.running && Cesium.JulianDate.secondsDifference(stop, clock.currentTime) <= 0) {
      state.running = false;
      clock.shouldAnimate = false;
      panel.querySelector("#fl-play").textContent = t("btnRun");
      statusEl.textContent = t("statusComplete");
    }
  });

  // ── Initial camera ────────────────────────────────────────────────────────
  viewer.camera.flyToBoundingSphere(
    new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(138.372, 34.975, 100), 300
    ),
    {
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(155),
        Cesium.Math.toRadians(-30),
        14000
      ),
      duration: 0,
    }
  );

  applyTranslations();
})();
