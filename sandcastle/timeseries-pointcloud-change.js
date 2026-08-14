/* global Cesium */
(async function () {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MTA5NjcxZS04ZGIwLTQxMGMtYTgzYy1mOTVkYzQ4ZDNiNzUiLCJpZCI6NDIxMzE4LCJzdWIiOiJKYWtlLlN0ZWluZXJtYW4iLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiRGVtbyAxLSBEaXNhc3RlciBSZXNwb25zZSAmIEh5ZHJvZHluYW1pYyBTaW11bGF0aW9uIiwiaWF0IjoxNzg1NDQ1NTkwfQ.f14WW5ROSpSJULiwGF1iWovpqDFbNq-KY5-QJckUDUY";

  const JAPAN_TERRAIN_ASSET_ID = 1;
  const JAPAN_BUILDINGS_ASSET_ID = 96188;
  const ATAMI_2019_ASSET_ID = 5131479;
  const ATAMI_2020_ASSET_ID = 5131486;
  const ION_CENTER = {
    lon: 139.092361402,
    lat: 35.114857176,
  };

  const COPY = {
    en: {
      languageLabel: "Language",
      title: "Atami Izusan — 2019 vs 2020 LiDAR epochs",
      subtitle:
        "Compare two real Virtual Shizuoka LiDAR epochs over the same positioned Atami Izusan coastal slope, then inspect where terrain, vegetation, and exposed building edges differ.",
      tourHeading: "Guided epoch comparison",
      tourHelp:
        "Move from the full strip view to slope detail, then toggle between the 2019 and 2020 scans for the same hillside.",
      tourStart: "Start guided tour",
      tourDialogTitle: "Guided tour",
      tourPreparing: "Preparing the first stop…",
      tourPrevious: "← Previous",
      tourNext: "Next →",
      tourPause: "Pause",
      tourResume: "Resume",
      tourRestart: "Restart",
      tourClose: "Close",
      tourProgressLabel: "Time remaining in this tour stop",
      modeHeading: "Epoch layer",
      modeYear1: "2019 pre-disaster",
      modeYear5: "2020 epoch",
      modeChange: "2019 + 2020 overlay",
      modeCarbon: "Buildings + epoch",
      animate: "Play 2019 → 2020",
      reset: "Reset demo",
      kpiHeading: "Scene layers",
      kpiView: "Mode",
      kpiCells: "Terrain",
      kpiLoss: "Buildings",
      kpiGrowth: "2019 LiDAR",
      kpiMeanDelta: "2020 LiDAR",
      kpiCarbon: "Overlay focus",
      warning:
        "This demo now uses real Cesium ion point-cloud assets for both epochs. The side panel narrative is interpretive; Cesium does not compute a per-point difference surface here.",
      selectionHeading: "Epoch notes",
      selectionEmpty:
        "Use the epoch buttons to swap real point clouds, or play the guided tour to compare the same slope across time.",
      selectionCell: "2019 asset",
      selectionCenter: "2020 asset",
      selectionYear1: "Positioned center",
      selectionYear5: "Coverage",
      selectionChange: "Comparison use",
      selectionCarbon: "Performance profile",
      selectionMode: "Current mode",
      selectionClear: "Restore notes",
      cameraHeading: "Camera",
      cameraInitial: "Epoch close-up",
      cameraOverview: "Full strip",
      cameraFoothills: "Slope detail",
      cameraCity: "Coast + buildings",
      sourceSummary: "Data provenance",
      sourceTerrain:
        "Terrain: Cesium World Terrain (ion asset 1) with Cesium World Imagery basemap.",
      sourceBuildings:
        "Buildings: OSM Buildings 3D Tiles (ion asset 96188).",
      sourceCandidate: "Virtual Shizuoka source:",
      source2019:
        "Atami LP LiDAR 2019 (Cesium ion asset 5131479)",
      source2021:
        "Atami LP LiDAR 2020 (Cesium ion asset 5131486)",
      sourcePublisher:
        "Publisher: Shizuoka Prefecture via GEOSPATIAL.JP / VIRTUAL SHIZUOKA.",
      sourceLicense: "Catalog terms: CC BY 4.0.",
      sourceOverlap:
        "Both epochs were reprojected into a corrected geocentric frame before Cesium ion tiling, then aligned to the same Atami Izusan hillside story cameras in this demo.",
      sourceProduction:
        "The comparison is visual, using two separate real point-cloud tilesets. A derived change product would require external registration / differencing and a separate publication step.",
      legendYear1: "2019 epoch legend",
      legendYear5: "2020 epoch legend",
      legendChange: "Overlay legend",
      legendCarbon: "Buildings + epoch legend",
      legendSourceRgb: "Source RGB point colors",
      legendYear1Tint: "2019 epoch tint",
      legendYear5Tint: "2020 epoch tint",
      loadingTerrain: "Loading terrain and context…",
      loadingGrid: "Loading 2019 and 2020 ion point clouds…",
      ready:
        "Ready. 2019 and 2020 LiDAR epochs are available; use the epoch buttons to compare the same slope.",
      terrainError: "Terrain failed to load: {message}",
      gridError: "Point cloud failed to load: {message}",
      selectedMode: "{mode} mode selected.",
      clearedSelection: "Notes restored.",
      animationRunning: "Animating from the 2019 scan to the 2020 scan.",
      animationReduced:
        "Reduced motion is enabled. The 2020 epoch is shown without animation.",
      animationComplete: "Animation complete. 2020 epoch shown.",
      cameraSelected: "{camera} camera selected.",
      resetComplete: "Demo reset to the 2019 close-up.",
      tourStarted: "Guided tour started.",
      tourReduced:
        "Reduced motion is enabled. The tour is paused; use Previous or Next to step through the comparison.",
      tourStop: "Tour stop {current} of {total}: {title}.",
      tourPaused: "Tour paused at stop {current}.",
      tourResumed: "Tour resumed at stop {current}.",
      tourManualReduced:
        "Reduced motion keeps the tour static. Use Previous or Next to move between stops.",
      tourComplete: "Tour complete",
      tourCompleteDescription:
        "The tour finishes on the full strip overview. Restart it or close the controls.",
      tourCompleteStatus:
        "Tour complete on the full strip overview.",
      tourClosed: "Guided tour closed.",
      progressRemaining: "{percent}% remaining",
      stepFujiTitle: "Epoch overview",
      stepFujiDescription:
        "Start on the full strip to confirm both corrected ion assets cover the same Atami Izusan slope above the shoreline.",
      stepBaselineTitle: "2019 pre-disaster scan",
      stepBaselineDescription:
        "The 2019 LiDAR asset shows the pre-disaster hillside surface, with steep ravines, vegetation, and exposed building edges facing the coast.",
      stepScenarioTitle: "2020 epoch scan",
      stepScenarioDescription:
        "Switch to the 2020 epoch to inspect differences in texture, vegetation cover, and the relationship between the slope and structures.",
      stepChangeTitle: "Overlay comparison",
      stepChangeDescription:
        "Display both epochs together to visually inspect where the two point clouds agree and where they separate.",
      stepCarbonTitle: "Buildings + epoch",
      stepCarbonDescription:
        "Add OSM Buildings back over the point cloud to compare the surveyed slope with contextual building massing.",
      stepCityTitle: "Coastal edge",
      stepCityDescription:
        "This oblique coastal angle makes the relationship between the shoreline, retaining edges, and the slope easier to read.",
      stepOverviewTitle: "Full strip recap",
      stepOverviewDescription:
        "Finish with the entire LiDAR corridor in view so the audience understands the spatial footprint of both positioned epoch assets.",
    },
    ja: {
      languageLabel: "言語",
      title: "熱海伊豆山 — 2019年と2020年のLiDAR比較",
      subtitle:
        "同じ位置に配置したAtami Izusan沿岸斜面の2時点LiDARを比較し、地形・植生・建物際の違いを確認します。",
      tourHeading: "時点比較ツアー",
      tourHelp:
        "全体ストリップから斜面詳細へ移動し、同じ斜面で2019年と2020年のスキャンを切り替えます。",
      tourStart: "ガイドツアー開始",
      tourDialogTitle: "ガイドツアー",
      tourPreparing: "最初の停止点を準備しています…",
      tourPrevious: "← 前へ",
      tourNext: "次へ →",
      tourPause: "一時停止",
      tourResume: "再開",
      tourRestart: "最初から",
      tourClose: "閉じる",
      tourProgressLabel: "この停止点の残り時間",
      modeHeading: "時点レイヤー",
      modeYear1: "2019年 事前災害",
      modeYear5: "2020年 エポック",
      modeChange: "2019年 + 2020年 重ね合わせ",
      modeCarbon: "建物 + エポック",
      animate: "2019年 → 2020年 を再生",
      reset: "デモをリセット",
      kpiHeading: "シーンレイヤー",
      kpiView: "モード",
      kpiCells: "地形",
      kpiLoss: "建物",
      kpiGrowth: "2019 LiDAR",
      kpiMeanDelta: "2020 LiDAR",
      kpiCarbon: "比較の焦点",
      warning:
        "このデモは2時点とも実際のCesium ion点群を使用します。差分サーフェス自体は計算しておらず、比較は視覚的に行います。",
      selectionHeading: "時点メモ",
      selectionEmpty:
        "時点ボタンで実データを切り替えるか、ガイドツアーで同じ斜面を比較してください。",
      selectionCell: "2019年アセット",
      selectionCenter: "2020年アセット",
      selectionYear1: "配置中心",
      selectionYear5: "カバー範囲",
      selectionChange: "比較方法",
      selectionCarbon: "パフォーマンス",
      selectionMode: "現在のモード",
      selectionClear: "メモを元に戻す",
      cameraHeading: "カメラ",
      cameraInitial: "近接表示",
      cameraOverview: "全体ストリップ",
      cameraFoothills: "斜面詳細",
      cameraCity: "海岸 + 建物",
      sourceSummary: "データ出典",
      sourceTerrain: "地形: Cesium World Terrain（ion asset 1）＋ Cesium World Imagery ベースマップ。",
      sourceBuildings: "建物: OSM Buildings 3D Tiles（ion asset 96188）。",
      sourceCandidate: "Virtual Shizuoka ソース:",
      source2019: "熱海LP LiDAR 2019（Cesium ion asset 5131479）",
      source2021: "熱海LP LiDAR 2020（Cesium ion asset 5131486）",
      sourcePublisher:
        "公開者: 静岡県（GEOSPATIAL.JP / VIRTUAL SHIZUOKA経由）。",
      sourceLicense: "カタログ利用条件: CC BY 4.0。",
      sourceOverlap:
        "両時点はCesium ionタイル化前に正しい地心座標系へ再投影してあり、このデモでは同じ熱海伊豆山カメラを共有します。",
      sourceProduction:
        "比較は2つの実点群タイルセットを視覚的に切り替えて行います。厳密な差分生成には外部での登録・差分計算が必要です。",
      legendYear1: "2019年エポック凡例",
      legendYear5: "2020年エポック凡例",
      legendChange: "重ね合わせ凡例",
      legendCarbon: "建物 + エポック凡例",
      legendSourceRgb: "点群ソースのRGBカラー",
      legendYear1Tint: "2019年エポックの色",
      legendYear5Tint: "2020年エポックの色",
      loadingTerrain: "地形とコンテキストを読み込み中…",
      loadingGrid: "2019年・2020年のion点群を読み込み中…",
      ready:
        "準備完了。2019年と2020年のLiDARが利用可能です。ボタンで同じ斜面を比較できます。",
      terrainError: "地形を読み込めませんでした: {message}",
      gridError: "点群を読み込めませんでした: {message}",
      selectedMode: "{mode} モードを選択しました。",
      clearedSelection: "メモを元に戻しました。",
      animationRunning: "2019年スキャンから2020年スキャンへ再生中です。",
      animationReduced:
        "視覚効果を減らす設定のため、アニメーションなしで2020年を表示します。",
      animationComplete: "再生完了。2020年エポックを表示しています。",
      cameraSelected: "{camera} カメラに移動しました。",
      resetComplete: "2019年の近接表示にリセットしました。",
      tourStarted: "ガイドツアーを開始しました。",
      tourReduced:
        "視覚効果を減らす設定のため、ツアーは停止しています。前後ボタンで進めてください。",
      tourStop: "ツアー {current} / {total}: {title}",
      tourPaused: "ツアーを停止点 {current} で一時停止しました。",
      tourResumed: "ツアーを停止点 {current} から再開しました。",
      tourManualReduced:
        "視覚効果を減らす設定では静止表示を維持します。前後ボタンで移動してください。",
      tourComplete: "ツアー完了",
      tourCompleteDescription:
        "全体ストリップ表示で終了します。再開するか操作を閉じてください。",
      tourCompleteStatus: "全体ストリップ表示でツアーが完了しました。",
      tourClosed: "ガイドツアーを閉じました。",
      progressRemaining: "残り {percent}%",
      stepFujiTitle: "エポック全景",
      stepFujiDescription:
        "まず全体ストリップで、補正済みの2つのionアセットが同じ熱海伊豆山斜面をカバーしていることを確認します。",
      stepBaselineTitle: "2019年 事前災害スキャン",
      stepBaselineDescription:
        "2019年LiDARは、海岸に面した急斜面、植生、建物際の事前災害状態を示します。",
      stepScenarioTitle: "2020年 エポックスキャン",
      stepScenarioDescription:
        "2020年エポックへ切り替え、斜面テクスチャや植生、建物際との関係の違いを確認します。",
      stepChangeTitle: "重ね合わせ比較",
      stepChangeDescription:
        "両時点を同時表示して、2つの点群が一致する場所と離れる場所を視覚的に確認します。",
      stepCarbonTitle: "建物 + エポック",
      stepCarbonDescription:
        "OSM Buildingsを再び重ね、実測斜面と建物コンテキストの関係を確認します。",
      stepCityTitle: "海岸際",
      stepCityDescription:
        "この斜めの海岸視点では、海岸線・擁壁際・斜面の関係が読みやすくなります。",
      stepOverviewTitle: "全体ストリップの再確認",
      stepOverviewDescription:
        "最後に2時点のLiDAR回廊全体を表示し、比較対象の空間範囲を再確認します。",
    },
  };

  let currentLanguage = "en";
  const translate = (key, replacements = {}) => {
    const template = COPY[currentLanguage][key] ?? COPY.en[key] ?? key;
    return Object.entries(replacements).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template,
    );
  };

  function injectDemoShell() {
    document.documentElement.lang = "en";
    document.title = COPY.en.title;
    document.getElementById("change-demo-shell")?.remove();
    document.getElementById("change-demo-styles")?.remove();
    document.getElementById("toolbar")?.remove();

    let map = document.getElementById("cesiumContainer");
    if (!map) {
      map = document.createElement("div");
      map.id = "cesiumContainer";
      document.body.append(map);
    }

    const styles = document.createElement("style");
    styles.id = "change-demo-styles";
    styles.textContent = `
      :root { color-scheme: dark; --panel-bg: rgba(12,21,30,.96); --panel-border:#496274; --text:#f4f8fb; --muted:#bed0dc; --accent:#78e0f6; --accent-ink:#07141b; --button:#203746; --button-hover:#2d4c5f; --warning-bg:#3f300b; --warning-border:#d4a72c; --focus:#ffd75e; }
      html, body, #cesiumContainer { width:100%; height:100%; margin:0; overflow:hidden; }
      body { background:#071018; color:var(--text); font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }
      #cesiumContainer { position:absolute; inset:0; }
      .change-demo-shell { position:fixed; inset:0; z-index:10; pointer-events:none; }
      .change-demo-panel { position:absolute; inset:12px auto 12px 12px; width:min(390px,calc(100vw - 24px)); overflow:auto; border:1px solid var(--panel-border); border-radius:14px; background:var(--panel-bg); box-shadow:0 16px 48px rgba(0,0,0,.45); backdrop-filter:blur(10px); pointer-events:auto; }
      .change-demo-header, .change-demo-section { padding:14px 16px; }
      .change-demo-header { border-bottom:1px solid var(--panel-border); }
      .change-demo-context, .change-demo-subtitle, .change-demo-help, .change-demo-status, .change-demo-source-list { color:var(--muted); font-size:.82rem; line-height:1.45; }
      .change-demo-context { margin:0 0 6px; color:var(--accent); font-size:.76rem; font-weight:700; letter-spacing:.03em; }
      .change-demo-title { margin:0; font-size:clamp(1.15rem,3vw,1.45rem); line-height:1.15; }
      .change-demo-subtitle { margin:6px 0 0; }
      .change-demo-language { display:grid; grid-template-columns:1fr auto; align-items:center; gap:10px; margin-top:12px; }
      .change-demo-language label, .change-demo-heading, .change-demo-legend-title { font-size:.86rem; font-weight:800; letter-spacing:.025em; }
      .change-demo-select, .change-demo-button { min-height:44px; border:1px solid #688399; border-radius:8px; background:#162a37; color:var(--text); font:inherit; }
      .change-demo-select { padding:8px 34px 8px 10px; font-weight:700; }
      .change-demo-section { border-bottom:1px solid rgba(73,98,116,.65); }
      .change-demo-section:last-child { border-bottom:0; }
      .change-demo-button-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
      .change-demo-button-row, .change-demo-tour-nav, .change-demo-tour-actions { display:flex; flex-wrap:wrap; gap:8px; }
      .change-demo-button { padding:8px 10px; background:var(--button); font-size:.82rem; font-weight:700; line-height:1.2; cursor:pointer; }
      .change-demo-button:hover { background:var(--button-hover); }
      .change-demo-panel button.change-demo-button[aria-pressed="true"], .change-demo-panel button.change-demo-button.change-demo-button--primary { border-color:var(--accent)!important; background-color:var(--accent)!important; color:var(--accent-ink)!important; }
      .change-demo-button:focus-visible, .change-demo-select:focus-visible, .change-demo-panel a:focus-visible, .change-demo-panel summary:focus-visible { outline:3px solid var(--focus); outline-offset:3px; }
      .change-demo-kpis { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin:0; }
      .change-demo-kpi { min-width:0; padding:9px; border:1px solid #40586a; border-radius:8px; background:rgba(23,40,52,.85); }
      .change-demo-kpi dt { color:var(--muted); font-size:.74rem; font-weight:700; }
      .change-demo-kpi dd { margin:4px 0 0; font-size:.95rem; font-weight:800; }
      .change-demo-kpi--wide { grid-column:1 / -1; }
      .change-demo-warning { margin:12px 0 0; padding:10px 12px; border:1px solid var(--warning-border); border-radius:10px; background:var(--warning-bg); font-size:.78rem; line-height:1.45; }
      .change-demo-tour-card { margin-top:12px; padding:12px; border:1px solid #587185; border-radius:12px; background:rgba(17,31,41,.92); }
      .change-demo-tour-title { margin:0; font-size:1rem; }
      .change-demo-tour-subtitle { margin:8px 0 0; font-size:.82rem; }
      .change-demo-progress { position:relative; height:6px; margin:12px 0; border-radius:999px; background:rgba(113,145,165,.24); overflow:hidden; }
      .change-demo-progress-bar { position:absolute; inset:0; transform-origin:left center; background:linear-gradient(90deg,#75e7f6,#5ea7ff); }
      .change-demo-selection { display:grid; gap:8px; }
      .change-demo-selection-row { display:grid; grid-template-columns:minmax(0,124px) minmax(0,1fr); gap:10px; padding:8px 0; border-bottom:1px solid rgba(73,98,116,.5); }
      .change-demo-selection-row:last-child { border-bottom:0; }
      .change-demo-selection dt { color:var(--muted); font-weight:700; }
      .change-demo-selection dd { margin:0; font-weight:700; }
      .change-demo-selection-empty { margin:0; color:var(--muted); }
      .change-demo-legend { display:grid; gap:8px; margin:0; padding:0; list-style:none; }
      .change-demo-legend li { display:flex; align-items:center; gap:10px; color:var(--muted); }
      .change-demo-swatch { width:14px; height:14px; border-radius:999px; flex:none; }
      .change-demo-source-list { margin:10px 0 0; padding-left:18px; }
      .change-demo-panel a { color:var(--accent); }
      @media (max-width: 760px) { .change-demo-panel { inset:auto 12px 12px; max-height:62vh; width:auto; } }
    `;
    document.head.append(styles);

    const shell = document.createElement("div");
    shell.id = "change-demo-shell";
    shell.className = "change-demo-shell";
    shell.innerHTML = `
      <aside class="change-demo-panel" aria-labelledby="change-demo-title">
        <header class="change-demo-header">
          <p class="change-demo-context">Virtual Shizuoka real epoch comparison</p>
          <h1 class="change-demo-title" id="change-demo-title" data-i18n="title">${COPY.en.title}</h1>
          <p class="change-demo-subtitle" data-i18n="subtitle">${COPY.en.subtitle}</p>
          <div class="change-demo-language">
            <label for="language-select" data-i18n="languageLabel">${COPY.en.languageLabel}</label>
            <select class="change-demo-select" id="language-select">
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </header>

        <section class="change-demo-section" aria-labelledby="tour-heading">
          <h2 class="change-demo-heading" id="tour-heading" data-i18n="tourHeading">${COPY.en.tourHeading}</h2>
          <p class="change-demo-help" data-i18n="tourHelp">${COPY.en.tourHelp}</p>
          <button class="change-demo-button change-demo-button--primary" id="autotour-btn" type="button" data-i18n="tourStart">${COPY.en.tourStart}</button>
          <div class="change-demo-tour-card" id="autotour-card" role="dialog" aria-labelledby="autotour-title" aria-describedby="autotour-subtitle" hidden>
            <h3 class="change-demo-tour-title" id="autotour-title" data-i18n="tourDialogTitle">${COPY.en.tourDialogTitle}</h3>
            <p class="change-demo-tour-subtitle" id="autotour-subtitle" data-i18n="tourPreparing">${COPY.en.tourPreparing}</p>
            <div class="change-demo-progress" id="autotour-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
              <div class="change-demo-progress-bar" id="autotour-progress-bar"></div>
            </div>
            <div class="change-demo-tour-nav">
              <button class="change-demo-button" id="autotour-previous" type="button" data-i18n="tourPrevious">${COPY.en.tourPrevious}</button>
              <button class="change-demo-button" id="autotour-next" type="button" data-i18n="tourNext">${COPY.en.tourNext}</button>
            </div>
            <div class="change-demo-tour-actions" style="margin-top:8px">
              <button class="change-demo-button" id="autotour-pause" type="button" data-i18n="tourPause">${COPY.en.tourPause}</button>
              <button class="change-demo-button" id="autotour-resume" type="button" data-i18n="tourResume" hidden>${COPY.en.tourResume}</button>
              <button class="change-demo-button" id="autotour-restart" type="button" data-i18n="tourRestart">${COPY.en.tourRestart}</button>
              <button class="change-demo-button" id="autotour-close" type="button" data-i18n="tourClose">${COPY.en.tourClose}</button>
            </div>
          </div>
        </section>

        <section class="change-demo-section" aria-labelledby="mode-heading">
          <fieldset style="border:0;padding:0;margin:0">
            <legend class="change-demo-heading" id="mode-heading" data-i18n="modeHeading">${COPY.en.modeHeading}</legend>
            <div class="change-demo-button-grid">
              <button class="change-demo-button" type="button" data-mode-button data-mode="year1" data-i18n="modeYear1" aria-pressed="true">${COPY.en.modeYear1}</button>
              <button class="change-demo-button" type="button" data-mode-button data-mode="year5" data-i18n="modeYear5" aria-pressed="false">${COPY.en.modeYear5}</button>
              <button class="change-demo-button" type="button" data-mode-button data-mode="change" data-i18n="modeChange" aria-pressed="false">${COPY.en.modeChange}</button>
              <button class="change-demo-button" type="button" data-mode-button data-mode="carbon" data-i18n="modeCarbon" aria-pressed="false">${COPY.en.modeCarbon}</button>
            </div>
          </fieldset>
          <div class="change-demo-button-row" style="margin-top:8px">
            <button class="change-demo-button change-demo-button--primary" id="animate-btn" type="button" data-i18n="animate">${COPY.en.animate}</button>
            <button class="change-demo-button" id="reset-btn" type="button" data-i18n="reset">${COPY.en.reset}</button>
          </div>
          <output class="change-demo-status" id="app-status" aria-live="polite">${COPY.en.loadingTerrain}</output>
        </section>

        <section class="change-demo-section" aria-labelledby="kpi-heading">
          <h2 class="change-demo-heading" id="kpi-heading" data-i18n="kpiHeading">${COPY.en.kpiHeading}</h2>
          <dl class="change-demo-kpis">
            <div class="change-demo-kpi change-demo-kpi--wide"><dt data-i18n="kpiView">${COPY.en.kpiView}</dt><dd id="kpi-timestamp">2019 pre-disaster</dd></div>
            <div class="change-demo-kpi"><dt data-i18n="kpiCells">${COPY.en.kpiCells}</dt><dd id="kpi-total">Streaming</dd></div>
            <div class="change-demo-kpi"><dt data-i18n="kpiLoss">${COPY.en.kpiLoss}</dt><dd id="kpi-loss">Context</dd></div>
            <div class="change-demo-kpi"><dt data-i18n="kpiGrowth">${COPY.en.kpiGrowth}</dt><dd id="kpi-growth">Loading</dd></div>
            <div class="change-demo-kpi"><dt data-i18n="kpiMeanDelta">${COPY.en.kpiMeanDelta}</dt><dd id="kpi-delta">Loading</dd></div>
            <div class="change-demo-kpi change-demo-kpi--wide"><dt data-i18n="kpiCarbon">${COPY.en.kpiCarbon}</dt><dd id="kpi-carbon">Visual comparison</dd></div>
          </dl>
          <p class="change-demo-warning" data-i18n="warning">${COPY.en.warning}</p>
        </section>

        <section class="change-demo-section" aria-labelledby="selection-heading">
          <h2 class="change-demo-heading" id="selection-heading" data-i18n="selectionHeading">${COPY.en.selectionHeading}</h2>
          <p class="change-demo-selection-empty" id="selection-empty" data-i18n="selectionEmpty">${COPY.en.selectionEmpty}</p>
          <dl class="change-demo-selection" id="selection-details">
            <div class="change-demo-selection-row"><dt data-i18n="selectionCell">${COPY.en.selectionCell}</dt><dd id="selection-cell">5131479</dd></div>
            <div class="change-demo-selection-row"><dt data-i18n="selectionCenter">${COPY.en.selectionCenter}</dt><dd id="selection-center">5131486</dd></div>
            <div class="change-demo-selection-row"><dt data-i18n="selectionYear1">${COPY.en.selectionYear1}</dt><dd id="selection-year1">${ION_CENTER.lat.toFixed(6)}° N, ${ION_CENTER.lon.toFixed(6)}° E</dd></div>
            <div class="change-demo-selection-row"><dt data-i18n="selectionYear5">${COPY.en.selectionYear5}</dt><dd id="selection-year5">Same positioned Atami Izusan slope</dd></div>
            <div class="change-demo-selection-row"><dt data-i18n="selectionChange">${COPY.en.selectionChange}</dt><dd id="selection-change">Swap epochs or overlay both in one camera</dd></div>
            <div class="change-demo-selection-row"><dt data-i18n="selectionCarbon">${COPY.en.selectionCarbon}</dt><dd id="selection-carbon">Balanced mode keeps one epoch visible to reduce GPU load</dd></div>
            <div class="change-demo-selection-row"><dt data-i18n="selectionMode">${COPY.en.selectionMode}</dt><dd id="selection-mode">2019 pre-disaster</dd></div>
          </dl>
          <button class="change-demo-button" id="selection-clear" type="button" data-i18n="selectionClear">${COPY.en.selectionClear}</button>
        </section>

        <section class="change-demo-section" aria-labelledby="camera-heading">
          <h2 class="change-demo-heading" id="camera-heading" data-i18n="cameraHeading">${COPY.en.cameraHeading}</h2>
          <div class="change-demo-button-row">
            <button class="change-demo-button" id="camera-initial" type="button" data-i18n="cameraInitial">${COPY.en.cameraInitial}</button>
            <button class="change-demo-button" id="camera-overview" type="button" data-i18n="cameraOverview">${COPY.en.cameraOverview}</button>
            <button class="change-demo-button" id="camera-foothills" type="button" data-i18n="cameraFoothills">${COPY.en.cameraFoothills}</button>
            <button class="change-demo-button" id="camera-city" type="button" data-i18n="cameraCity">${COPY.en.cameraCity}</button>
          </div>
        </section>

        <section class="change-demo-section" aria-labelledby="legend-heading">
          <h2 class="change-demo-legend-title" id="legend-heading">${COPY.en.legendYear1}</h2>
          <ul class="change-demo-legend" id="legend-list"></ul>
        </section>

        <section class="change-demo-section">
          <details>
            <summary data-i18n="sourceSummary">${COPY.en.sourceSummary}</summary>
            <ul class="change-demo-source-list">
              <li data-i18n="sourceTerrain">${COPY.en.sourceTerrain}</li>
              <li data-i18n="sourceBuildings">${COPY.en.sourceBuildings}</li>
              <li><span data-i18n="sourceCandidate">${COPY.en.sourceCandidate}</span> <span data-i18n="source2019">${COPY.en.source2019}</span></li>
              <li><span data-i18n="sourceCandidate">${COPY.en.sourceCandidate}</span> <span data-i18n="source2021">${COPY.en.source2021}</span></li>
              <li data-i18n="sourcePublisher">${COPY.en.sourcePublisher}</li>
              <li data-i18n="sourceLicense">${COPY.en.sourceLicense}</li>
              <li data-i18n="sourceOverlap">${COPY.en.sourceOverlap}</li>
              <li data-i18n="sourceProduction">${COPY.en.sourceProduction}</li>
            </ul>
          </details>
        </section>
      </aside>
    `;
    document.body.append(shell);
  }

  injectDemoShell();

  const requireElement = (id) => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing required element: #${id}`);
    return element;
  };

  const STATE = {
    mode: "year1",
    animationFrame: null,
    animationProgress: 0,
    isAnimating: false,
    autotourActive: false,
    autotourPaused: false,
    autotourStep: 0,
    autotourRunId: 0,
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    buildings: null,
    epoch2019: null,
    epoch2020: null,
  };

  const CONFIG = {
    cameraPresets: {
      initial: { x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 80, range: 1100, heading: 320, pitch: -28 },
      overview: { x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 110, range: 3400, heading: 328, pitch: -36 },
      foothills: { x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 95, range: 1600, heading: 286, pitch: -24 },
      city: { x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 100, range: 1900, heading: 305, pitch: -18 },
    },
    tourWaypoints: [
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 110, range: 3400, heading: 328, pitch: -36 }, titleKey: "stepFujiTitle", descriptionKey: "stepFujiDescription", duration: 2.4, holdMs: 5000, mode: "year1" },
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 80, range: 1100, heading: 320, pitch: -28 }, titleKey: "stepBaselineTitle", descriptionKey: "stepBaselineDescription", duration: 2.2, holdMs: 5200, mode: "year1" },
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 80, range: 1100, heading: 320, pitch: -28 }, titleKey: "stepScenarioTitle", descriptionKey: "stepScenarioDescription", duration: 2.2, holdMs: 5200, mode: "year5" },
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 90, range: 1500, heading: 300, pitch: -24 }, titleKey: "stepChangeTitle", descriptionKey: "stepChangeDescription", duration: 2.2, holdMs: 5600, mode: "change" },
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 95, range: 1700, heading: 286, pitch: -24 }, titleKey: "stepCarbonTitle", descriptionKey: "stepCarbonDescription", duration: 2.2, holdMs: 5600, mode: "carbon" },
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 100, range: 1900, heading: 305, pitch: -18 }, titleKey: "stepCityTitle", descriptionKey: "stepCityDescription", duration: 2.2, holdMs: 5000, mode: "carbon" },
      { ...{ x: ION_CENTER.lon, y: ION_CENTER.lat, targetHeight: 110, range: 3400, heading: 328, pitch: -36 }, titleKey: "stepOverviewTitle", descriptionKey: "stepOverviewDescription", duration: 2.4, holdMs: 5200, mode: "change" },
    ],
  };

  function updateStatus(message, isError = false) {
    const status = requireElement("app-status");
    status.textContent = message;
    status.setAttribute("role", isError ? "alert" : "status");
  }

  function setTourProgress(percentRemaining) {
    const percent = Math.max(0, Math.min(100, Math.round(percentRemaining)));
    requireElement("autotour-progress-bar").style.transform = `scaleX(${percent / 100})`;
    requireElement("autotour-progress").setAttribute("aria-valuenow", String(percent));
  }

  async function initViewer() {
    updateStatus(translate("loadingTerrain"));
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
      JAPAN_TERRAIN_ASSET_ID,
      { requestVertexNormals: true },
    );

    const viewer = new Cesium.Viewer("cesiumContainer", {
      terrainProvider,
    baseLayer: Cesium.ImageryLayer.fromWorldImagery(),
      baseLayerPicker: false,
      fullscreenButton: false,
      homeButton: false,
      infoBox: false,
      selectionIndicator: false,
      navigationInstructionsInitiallyVisible: false,
      scene3DOnly: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      shadows: false,
      timeline: false,
      animation: false,
    });

    // The source elevations are orthometric while the terrain surface is
    // ellipsoidal, so terrain depth testing would hide much of the point cloud.
    viewer.scene.globe.depthTestAgainstTerrain = false;
    viewer.scene.requestRenderMode = true;
    viewer.scene.fxaa = true;
    viewer.scene.postProcessStages.fxaa.enabled = true;
    viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.25);
    viewer.canvas.tabIndex = 0;
    viewer.canvas.setAttribute("aria-label", "Atami Izusan epoch comparison scene");

    const buildings = await Cesium.Cesium3DTileset.fromIonAssetId(JAPAN_BUILDINGS_ASSET_ID, {
      maximumScreenSpaceError: 18,
      cacheBytes: 256 * 1024 * 1024,
      maximumCacheOverflowBytes: 128 * 1024 * 1024,
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 2.0e-4,
      dynamicScreenSpaceErrorFactor: 12,
      foveatedScreenSpaceError: true,
      foveatedTimeDelay: 0.2,
      preloadFlightDestinations: false,
    });
    buildings.style = new Cesium.Cesium3DTileStyle({ color: "color('#d8ccb8', 0.55)" });
    buildings.show = false;
    viewer.scene.primitives.add(buildings);
    STATE.buildings = buildings;
    return viewer;
  }

  const viewer = await initViewer();

  function applySourceStyle(tileset) {
    tileset.style = new Cesium.Cesium3DTileStyle({
      pointSize: "2.5",
    });
  }

  function applyEpochTint(tileset, color, alpha) {
    tileset.style = new Cesium.Cesium3DTileStyle({
      pointSize: "2.5",
      color: `color('${color}', ${alpha})`,
    });
  }

  async function loadEpochAsset(assetId) {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId, {
      maximumScreenSpaceError: 8,
      cacheBytes: 256 * 1024 * 1024,
      maximumCacheOverflowBytes: 96 * 1024 * 1024,
      skipLevelOfDetail: true,
      baseScreenSpaceError: 1024,
      immediatelyLoadDesiredLevelOfDetail: false,
      loadSiblings: false,
      cullWithChildrenBounds: true,
      dynamicScreenSpaceError: true,
      dynamicScreenSpaceErrorDensity: 2.0e-4,
      dynamicScreenSpaceErrorFactor: 16,
      foveatedScreenSpaceError: true,
      foveatedTimeDelay: 0.2,
      preloadFlightDestinations: false,
      preferLeaves: true,
    });
    applySourceStyle(tileset);
    tileset.pointCloudShading = new Cesium.PointCloudShading({
      attenuation: true,
      maximumAttenuation: 4,
      geometricErrorScale: 0.75,
      eyeDomeLighting: true,
      eyeDomeLightingStrength: 0.8,
      eyeDomeLightingRadius: 1.2,
      normalShading: false,
    });
    tileset.show = false;
    viewer.scene.primitives.add(tileset);
    tileset.tileLoad.addEventListener(() => viewer.scene.requestRender());
    tileset.tileUnload.addEventListener(() => viewer.scene.requestRender());
    tileset.loadProgress.addEventListener(() => viewer.scene.requestRender());
    return tileset;
  }

  function renderLegend() {
    const titleKeys = {
      year1: "legendYear1",
      year5: "legendYear5",
      change: "legendChange",
      carbon: "legendCarbon",
    };
    const items = STATE.mode === "change"
      ? [["#ff9f43", "legendYear1Tint"], ["#48b8f0", "legendYear5Tint"]]
      : [["#9aa78f", "legendSourceRgb"]];
    requireElement("legend-heading").textContent = translate(titleKeys[STATE.mode]);
    requireElement("legend-list").replaceChildren(
      ...items.map(([color, labelKey]) => {
        const item = document.createElement("li");
        const swatch = document.createElement("span");
        swatch.className = "change-demo-swatch";
        swatch.style.background = color;
        item.append(swatch, translate(labelKey));
        return item;
      }),
    );
  }

  function updateNotes() {
    requireElement("selection-mode").textContent =
      STATE.mode === "year1" ? translate("modeYear1")
      : STATE.mode === "year5" ? translate("modeYear5")
      : STATE.mode === "change" ? translate("modeChange")
      : translate("modeCarbon");
  }

  function updateKPIs() {
    requireElement("kpi-timestamp").textContent = requireElement("selection-mode").textContent;
    requireElement("kpi-total").textContent = "Streaming";
    requireElement("kpi-loss").textContent = STATE.buildings?.show ? "Visible" : "Hidden";
    requireElement("kpi-growth").textContent = STATE.epoch2019?.show ? "Visible" : "Hidden";
    requireElement("kpi-delta").textContent = STATE.epoch2020?.show ? "Visible" : "Hidden";
    requireElement("kpi-carbon").textContent =
      STATE.mode === "change" ? "Two-epoch overlay"
      : STATE.mode === "carbon" ? "Buildings + active epoch"
      : "Single epoch";
  }

  function switchMode(newMode, announce = true) {
    STATE.mode = newMode;
    const show2019 = newMode === "year1" || newMode === "change" || newMode === "carbon";
    const show2020 = newMode === "year5" || newMode === "change";
    const showBuildings = newMode === "carbon";

    if (STATE.epoch2019) {
      STATE.epoch2019.show = show2019;
      if (newMode === "change") {
        applyEpochTint(STATE.epoch2019, "#ff9f43", 0.65);
      } else {
        applySourceStyle(STATE.epoch2019);
      }
      STATE.epoch2019.maximumScreenSpaceError = newMode === "change" ? 12 : 8;
    }
    if (STATE.epoch2020) {
      STATE.epoch2020.show = show2020;
      if (newMode === "change") {
        applyEpochTint(STATE.epoch2020, "#48b8f0", 0.65);
      } else {
        applySourceStyle(STATE.epoch2020);
      }
      STATE.epoch2020.maximumScreenSpaceError = newMode === "change" ? 12 : 8;
    }
    if (STATE.buildings) {
      STATE.buildings.show = showBuildings;
    }

    document.querySelectorAll("[data-mode-button]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.mode === newMode ? "true" : "false");
    });

    updateNotes();
    updateKPIs();
    renderLegend();
    viewer.scene.requestRender();
    if (announce) {
      updateStatus(translate("selectedMode", { mode: requireElement("selection-mode").textContent }));
    }
  }

  function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.title = translate("title");
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = translate(element.dataset.i18n);
    });
    requireElement("autotour-progress").setAttribute("aria-label", translate("tourProgressLabel"));
    renderLegend();
    updateNotes();
    updateKPIs();
  }

  function setCameraView(waypoint, duration) {
    const target = new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(waypoint.x, waypoint.y, waypoint.targetHeight),
      50,
    );
    const offset = new Cesium.HeadingPitchRange(
      Cesium.Math.toRadians(waypoint.heading),
      Cesium.Math.toRadians(waypoint.pitch),
      waypoint.range,
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

  function useCameraPreset(waypoint, labelKey, immediate = false) {
    if (STATE.autotourActive) stopAutoplayTour();
    updateStatus(translate("cameraSelected", { camera: translate(labelKey) }));
    return setCameraView(waypoint, immediate || STATE.prefersReducedMotion ? 0 : 2);
  }

  function renderTourControls(showCard = STATE.autotourActive) {
    requireElement("autotour-card").hidden = !showCard;
    requireElement("autotour-btn").disabled = STATE.autotourActive;
    requireElement("autotour-pause").hidden = !STATE.autotourActive || STATE.autotourPaused;
    requireElement("autotour-resume").hidden = !STATE.autotourActive || !STATE.autotourPaused;
    requireElement("autotour-previous").disabled = STATE.autotourStep === 0;
    requireElement("autotour-next").disabled = STATE.autotourStep === CONFIG.tourWaypoints.length - 1;
  }

  function renderCurrentTourCopy() {
    if (requireElement("autotour-card").hidden) return;
    const waypoint = CONFIG.tourWaypoints[STATE.autotourStep];
    requireElement("autotour-title").textContent = `${STATE.autotourStep + 1} / ${CONFIG.tourWaypoints.length} · ${translate(waypoint.titleKey)}`;
    requireElement("autotour-subtitle").textContent = translate(waypoint.descriptionKey);
  }

  function stopAutoplayTour({ hideCard = true, focusStart = false } = {}) {
    STATE.autotourRunId++;
    STATE.autotourActive = false;
    STATE.autotourPaused = false;
    viewer.camera.cancelFlight();
    renderTourControls(!hideCard);
    setTourProgress(100);
    if (hideCard) {
      requireElement("autotour-title").textContent = translate("tourDialogTitle");
      requireElement("autotour-subtitle").textContent = translate("tourPreparing");
    }
    if (focusStart) requireElement("autotour-btn").focus();
  }

  async function waitForTour(milliseconds, runId) {
    let elapsed = 0;
    setTourProgress(100);
    while (elapsed < milliseconds && STATE.autotourActive && STATE.autotourRunId === runId) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (!STATE.autotourPaused) {
        elapsed += 50;
        setTourProgress(100 * (1 - elapsed / milliseconds));
      }
    }
  }

  function renderTourStep(index) {
    STATE.autotourStep = index;
    const waypoint = CONFIG.tourWaypoints[index];
    switchMode(waypoint.mode, false);
    renderCurrentTourCopy();
    renderTourControls(true);
    updateStatus(translate("tourStop", { current: index + 1, total: CONFIG.tourWaypoints.length, title: translate(waypoint.titleKey) }));
    return waypoint;
  }

  async function runAutoplayTour(runId) {
    for (let i = STATE.autotourStep; i < CONFIG.tourWaypoints.length; i++) {
      if (!STATE.autotourActive || STATE.autotourRunId !== runId) return;
      const waypoint = renderTourStep(i);
      setTourProgress(100);
      if (STATE.prefersReducedMotion) {
        await setCameraView(waypoint, 0);
        return;
      }
      while (STATE.autotourPaused && STATE.autotourActive && STATE.autotourRunId === runId) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!STATE.autotourActive || STATE.autotourRunId !== runId) return;
      await setCameraView(waypoint, waypoint.duration);
      await waitForTour(waypoint.holdMs, runId);
    }
    STATE.autotourActive = false;
    STATE.autotourPaused = false;
    requireElement("autotour-title").textContent = translate("tourComplete");
    requireElement("autotour-subtitle").textContent = translate("tourCompleteDescription");
    renderTourControls(true);
    updateStatus(translate("tourCompleteStatus"));
  }

  function launchTourAt(index, paused = false) {
    viewer.camera.cancelFlight();
    const runId = ++STATE.autotourRunId;
    STATE.autotourActive = true;
    STATE.autotourPaused = paused;
    STATE.autotourStep = Math.max(0, Math.min(CONFIG.tourWaypoints.length - 1, index));
    renderTourControls(true);
    void runAutoplayTour(runId);
  }

  function animateEpochChange() {
    if (STATE.prefersReducedMotion) {
      switchMode("year5", false);
      updateStatus(translate("animationReduced"));
      return;
    }
    if (STATE.animationFrame !== null) cancelAnimationFrame(STATE.animationFrame);
    switchMode("change", false);
    STATE.isAnimating = true;
    STATE.animationProgress = 0;
    requireElement("animate-btn").disabled = true;
    updateStatus(translate("animationRunning"));
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 1800);
      STATE.animationProgress = progress;
      if (STATE.epoch2019) applyEpochTint(STATE.epoch2019, "#ff9f43", 1 - progress * 0.7);
      if (STATE.epoch2020) applyEpochTint(STATE.epoch2020, "#48b8f0", 0.3 + progress * 0.7);
      viewer.scene.requestRender();
      if (progress >= 1) {
        STATE.isAnimating = false;
        STATE.animationFrame = null;
        requireElement("animate-btn").disabled = false;
        switchMode("year5", false);
        updateStatus(translate("animationComplete"));
        return;
      }
      STATE.animationFrame = requestAnimationFrame(step);
    };
    STATE.animationFrame = requestAnimationFrame(step);
  }

  updateStatus(translate("loadingGrid"));
  try {
    const [epoch2019, epoch2020] = await Promise.all([
      loadEpochAsset(ATAMI_2019_ASSET_ID),
      loadEpochAsset(ATAMI_2020_ASSET_ID),
    ]);
    STATE.epoch2019 = epoch2019;
    STATE.epoch2020 = epoch2020;
  } catch (error) {
    updateStatus(translate("gridError", { message: error.message }), true);
    throw error;
  }

  applyTranslations();
  switchMode("year1", false);
  await useCameraPreset(CONFIG.cameraPresets.initial, "cameraInitial", true);
  updateStatus(translate("ready"));

  requireElement("language-select").addEventListener("change", (event) => {
    currentLanguage = event.target.value === "ja" ? "ja" : "en";
    applyTranslations();
    updateStatus(translate("ready"));
  });
  document.querySelectorAll("[data-mode-button]").forEach((button) => {
    button.addEventListener("click", () => switchMode(button.dataset.mode));
  });
  requireElement("animate-btn").addEventListener("click", animateEpochChange);
  requireElement("selection-clear").addEventListener("click", () => {
    updateNotes();
    updateStatus(translate("clearedSelection"));
  });
  requireElement("camera-initial").addEventListener("click", () => { void useCameraPreset(CONFIG.cameraPresets.initial, "cameraInitial"); });
  requireElement("camera-overview").addEventListener("click", () => { void useCameraPreset(CONFIG.cameraPresets.overview, "cameraOverview"); });
  requireElement("camera-foothills").addEventListener("click", () => { void useCameraPreset(CONFIG.cameraPresets.foothills, "cameraFoothills"); });
  requireElement("camera-city").addEventListener("click", () => { void useCameraPreset(CONFIG.cameraPresets.city, "cameraCity"); });
  requireElement("autotour-btn").addEventListener("click", () => {
    launchTourAt(0, STATE.prefersReducedMotion);
    updateStatus(translate(STATE.prefersReducedMotion ? "tourReduced" : "tourStarted"));
  });
  requireElement("autotour-pause").addEventListener("click", () => {
    STATE.autotourPaused = true;
    viewer.camera.cancelFlight();
    renderTourControls(true);
    updateStatus(translate("tourPaused", { current: STATE.autotourStep + 1 }));
  });
  requireElement("autotour-resume").addEventListener("click", () => {
    if (STATE.prefersReducedMotion) {
      updateStatus(translate("tourManualReduced"));
      return;
    }
    STATE.autotourPaused = false;
    renderTourControls(true);
    updateStatus(translate("tourResumed", { current: STATE.autotourStep + 1 }));
  });
  requireElement("autotour-previous").addEventListener("click", () => {
    launchTourAt(Math.max(0, STATE.autotourStep - 1), STATE.prefersReducedMotion || STATE.autotourPaused);
  });
  requireElement("autotour-next").addEventListener("click", () => {
    launchTourAt(Math.min(CONFIG.tourWaypoints.length - 1, STATE.autotourStep + 1), STATE.prefersReducedMotion || STATE.autotourPaused);
  });
  requireElement("autotour-restart").addEventListener("click", () => {
    launchTourAt(0, STATE.prefersReducedMotion);
  });
  requireElement("autotour-close").addEventListener("click", () => {
    stopAutoplayTour({ focusStart: true });
    updateStatus(translate("tourClosed"));
  });
  requireElement("reset-btn").addEventListener("click", () => {
    if (STATE.animationFrame !== null) cancelAnimationFrame(STATE.animationFrame);
    STATE.animationFrame = null;
    STATE.isAnimating = false;
    stopAutoplayTour();
    switchMode("year1", false);
    void useCameraPreset(CONFIG.cameraPresets.initial, "cameraInitial");
    updateStatus(translate("resetComplete"));
  });
})();
