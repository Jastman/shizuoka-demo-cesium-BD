// Time-Series Canopy Change — Shizuoka Prefecture
// Verified context: Japan regional terrain (ion 2767062) and Japan Buildings
// (ion 2602291). The analytical grid and its 2020–2025 values are illustrative.


Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OWYyMTY3OS05ZWEzLTRlN2MtYjhkMC03YWE0MmU4ZDZhODEiLCJpZCI6MjUzMzg1LCJzdWIiOiJDZXNpdW1CRCIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJWaXJ0dWFsIFNoaXpvdWthIERlbW9zIiwiaWF0IjoxNzg2Mzk5NjcyfQ.N5gdB7U145m_8SqF0QDcE73DtbZ2FHe3TtMU500BGhA";
const TRANSLATIONS = {
  en: {
    documentTitle: "Shizuoka Canopy Change Explorer",
    context: "Shizuoka Prefecture planning workflow",
    title: "Canopy Change Explorer",
    subtitle:
      "Explore an illustrative two-epoch canopy assessment in the Abe River foothills, then follow its regional planning context.",
    mapAria:
      "Interactive 3D map of Shizuoka Prefecture. Select a canopy cell for details or use the camera presets for keyboard navigation.",
    languageLabel: "Language",
    tourHeading: "Guided mountain-to-coast tour",
    tourHelp:
      "Follow seven stops linking the canopy cells to Shizuoka Prefecture's terrain, city, and watershed context.",
    tourStart: "Start autoplay tour",
    tourDialogTitle: "Guided tour",
    tourPreparing: "Preparing the first stop…",
    tourPrevious: "← Previous",
    tourNext: "Next →",
    tourPause: "Pause",
    tourResume: "Resume",
    tourRestart: "Restart",
    tourClose: "Close",
    tourProgressLabel: "Time remaining in this tour stop",
    modeHeading: "Analysis mode",
    modeYear1: "2020 baseline",
    modeYear5: "2025 scenario",
    modeChange: "Height change",
    modeCarbon: "Carbon estimate",
    animate: "Animate 2020 to 2025",
    reset: "Reset demo",
    kpiHeading: "Illustrative indicators",
    kpiView: "View",
    kpiCells: "Grid cells",
    kpiLoss: "Significant loss",
    kpiGrowth: "Significant growth",
    kpiMeanDelta: "Mean height delta",
    kpiCarbon: "Modeled carbon delta",
    warning:
      "Each 100 × 100 m cell is an illustrative spatial aggregation of canopy height over its footprint. Height change and carbon outputs are synthetic, not measured observations or decision-grade estimates.",
    selectionHeading: "Selected canopy cell",
    selectionEmpty:
      "Select a cell on the map to inspect its illustrative values.",
    selectionCell: "Cell",
    selectionCenter: "Center",
    selectionYear1: "2020 height",
    selectionYear5: "2025 height",
    selectionChange: "Delta classification",
    selectionCarbon: "Modeled carbon delta",
    selectionMode: "Current mode value",
    selectionClear: "Clear selection",
    cameraHeading: "Camera",
    cameraInitial: "Canopy close-up",
    cameraOverview: "Regional overview",
    cameraFoothills: "Foothills",
    cameraCity: "Shizuoka city",
    sourceSummary: "Data provenance and limitations",
    sourceTerrain:
      "Terrain: Cesium ion asset 2767062, Japan regional terrain.",
    sourceBuildings:
      "Buildings: Cesium ion asset 2602291, Japan Buildings 3D Tiles.",
    sourceCandidate: "LiDAR source:",
    source2019: "Atami LP LiDAR 2019 (Virtual Shizuoka, Cesium Ion asset 5126345)",
    source2021: "Atami LP LiDAR 2020 (Virtual Shizuoka, Cesium Ion asset 5126355)",
    sourcePublisher:
      "Publisher: Shizuoka Prefecture via GEOSPATIAL.JP / VIRTUAL SHIZUOKA.",
    sourceLicense: "Catalog terms: CC BY 4.0.",
    sourceOverlap:
      "Both epochs use JGD2011 / Japan Plane Rectangular CS VIII. Tiles 08NF2354–2365 cover the Atami Izusan area.",
    sourceProduction:
      "Canopy change values are illustrative. Real epoch point clouds (Cesium Ion assets 5126345, 5126355) available for production integration.",
    legendYear1: "2020 canopy-height legend",
    legendYear5: "2025 canopy-height legend",
    legendChange: "Height-change legend",
    legendCarbon: "Modeled carbon legend",
    legendLow: "Lower",
    legendMedium: "Medium",
    legendHigh: "Higher",
    legendLoss: "Loss",
    legendStable: "Stable",
    legendGrowth: "Growth",
    classificationLoss: "Loss",
    classificationStable: "Stable",
    classificationGrowth: "Growth",
    modeLabelYear1: "2020 Baseline",
    modeLabelYear5: "2025 Scenario",
    modeLabelChange: "2020–2025 Change",
    modeLabelCarbon: "Carbon Estimate",
    loadingTerrain: "Loading Japan regional terrain…",
    loadingGrid: "Placing the illustrative grid on terrain…",
    ready:
      "Ready. Select a canopy cell or choose an analysis mode; all change outputs are illustrative.",
    terrainError: "Terrain failed to load: {message}",
    gridError: "Grid placement failed: {message}",
    selectedMode: "{mode} mode selected.",
    selectedCell: "Selected {cell}.",
    clearedSelection: "Cell selection cleared.",
    animationRunning:
      "Animating the illustrative canopy from 2020 to 2025.",
    animationReduced:
      "2025 scenario shown without animation because reduced motion is enabled.",
    animationComplete: "Animation complete. 2025 scenario shown.",
    cameraSelected: "{camera} camera selected.",
    resetComplete: "Demo reset to the 2020 baseline and canopy close-up.",
    tourStarted: "Autoplay tour started.",
    tourReduced:
      "Reduced motion is enabled. The tour is paused and static; use Previous or Next to change stops.",
    tourStop: "Tour stop {current} of {total}: {title}.",
    tourPaused:
      "Autoplay paused at stop {current}. Select Resume to continue.",
    tourResumed: "Autoplay resumed at stop {current}.",
    tourManualReduced:
      "Reduced motion keeps the tour static. Use Previous or Next to change stops.",
    tourComplete: "Tour complete",
    tourCompleteDescription:
      "The tour finishes at the regional overview. Restart it or close these controls.",
    tourCompleteStatus:
      "Tour complete at the Shizuoka regional overview.",
    tourClosed: "Guided tour closed.",
    progressRemaining: "{percent}% remaining",
    stepFujiTitle: "Mt. Fuji headwaters",
    stepFujiDescription:
      "Begin at Shizuoka Prefecture's highest terrain. This broad view establishes the elevation and watershed context that connects mountain forests to downstream communities.",
    stepBaselineTitle: "Abe River foothills — 2020",
    stepBaselineDescription:
      "The close-up reveals 120 Entity API cells. Each cell aggregates an illustrative canopy-height value over a 100 × 100 m footprint rather than representing an individual tree or native voxel.",
    stepScenarioTitle: "Abe River foothills — 2025",
    stepScenarioDescription:
      "The scenario applies deterministic growth, stable, and disturbance patterns to the same footprints, allowing direct comparison without changing the analytical grid.",
    stepChangeTitle: "Change detection",
    stepChangeDescription:
      "The diverging classification emphasizes loss in red, stable cells in neutral gray, and growth in green. Select any cell to inspect its exact modeled delta.",
    stepCarbonTitle: "Modeled carbon response",
    stepCarbonDescription:
      "A sequential blue ramp shows the relative modeled carbon delta derived from canopy-height change and cell area. It is an illustrative planning signal, not an inventory.",
    stepCityTitle: "Shizuoka city context",
    stepCityDescription:
      "Japan Buildings places the foothill analysis within the urban system downstream. This connects environmental monitoring to infrastructure and land-management decisions.",
    stepOverviewTitle: "Regional overview",
    stepOverviewDescription:
      "Finish with the complete mountain-to-coast planning extent. The canopy grid remains one local analytical layer within Shizuoka Prefecture's wider terrain, settlement, and watershed context.",
  },
  ja: {
    documentTitle: "静岡県 樹冠変化エクスプローラー",
    context: "静岡県の計画検討ワークフロー",
    title: "樹冠変化エクスプローラー",
    subtitle:
      "安倍川上流域の2時点の樹冠評価（説明用）を確認し、静岡県全体の計画背景へ展開します。",
    mapAria:
      "静岡県のインタラクティブ3D地図。樹冠セルを選択して詳細を確認するか、カメラプリセットを使用してください。",
    languageLabel: "言語",
    tourHeading: "山地から海岸までのガイドツアー",
    tourHelp:
      "樹冠セルと静岡県の地形・市街地・流域の関係を7つの地点で確認します。",
    tourStart: "自動ツアーを開始",
    tourDialogTitle: "ガイドツアー",
    tourPreparing: "最初の地点を準備しています…",
    tourPrevious: "← 前へ",
    tourNext: "次へ →",
    tourPause: "一時停止",
    tourResume: "再開",
    tourRestart: "最初から",
    tourClose: "閉じる",
    tourProgressLabel: "この地点の残り時間",
    modeHeading: "解析モード",
    modeYear1: "2020年 基準",
    modeYear5: "2025年 シナリオ",
    modeChange: "樹高変化",
    modeCarbon: "炭素推定",
    animate: "2020年から2025年を再生",
    reset: "デモをリセット",
    kpiHeading: "説明用指標",
    kpiView: "表示",
    kpiCells: "グリッドセル",
    kpiLoss: "顕著な減少",
    kpiGrowth: "顕著な増加",
    kpiMeanDelta: "平均樹高変化",
    kpiCarbon: "モデル炭素変化",
    warning:
      "各100 × 100 mセルは、その範囲内の樹冠高を空間集約した説明用データです。樹高変化と炭素量は合成値であり、実測値や意思決定用の推定値ではありません。",
    selectionHeading: "選択した樹冠セル",
    selectionEmpty: "地図上のセルを選択すると説明用の値を確認できます。",
    selectionCell: "セル",
    selectionCenter: "中心位置",
    selectionYear1: "2020年の高さ",
    selectionYear5: "2025年の高さ",
    selectionChange: "変化区分",
    selectionCarbon: "モデル炭素変化",
    selectionMode: "現在のモード値",
    selectionClear: "選択を解除",
    cameraHeading: "カメラ",
    cameraInitial: "樹冠の近接表示",
    cameraOverview: "地域全体",
    cameraFoothills: "山麓",
    cameraCity: "静岡市",
    sourceSummary: "データ出典と制約",
    sourceTerrain:
      "地形：Cesium ionアセット2767062（日本地域地形）。",
    sourceBuildings:
      "建物：Cesium ionアセット2602291（Japan Buildings 3D Tiles）。",
    sourceCandidate: "LiDARデータ出典：",
    source2019: "熱海LP LiDAR 2019（Virtual Shizuoka、Cesium Ionアセット5126345）",
    source2021: "熱海LP LiDAR 2020（Virtual Shizuoka、Cesium Ionアセット5126355）",
    sourcePublisher:
      "公開者：静岡県（GEOSPATIAL.JP / VIRTUAL SHIZUOKA経由）。",
    sourceLicense: "カタログ利用条件：CC BY 4.0。",
    sourceOverlap:
      "両時点はJGD2011／平面直角座標系VIII系を使用。タイル08NF2354–2365が熱海伊豆山エリアをカバーしています。",
    sourceProduction:
      "樹冠変化値はイラスト的な値です。実時点の点群（Cesium Ionアセット5126345、5126355）は本番統合に利用可能です。",
    legendYear1: "2020年 樹冠高凡例",
    legendYear5: "2025年 樹冠高凡例",
    legendChange: "樹高変化凡例",
    legendCarbon: "モデル炭素量凡例",
    legendLow: "低",
    legendMedium: "中",
    legendHigh: "高",
    legendLoss: "減少",
    legendStable: "安定",
    legendGrowth: "増加",
    classificationLoss: "減少",
    classificationStable: "安定",
    classificationGrowth: "増加",
    modeLabelYear1: "2020年 基準",
    modeLabelYear5: "2025年 シナリオ",
    modeLabelChange: "2020–2025年 変化",
    modeLabelCarbon: "炭素推定",
    loadingTerrain: "日本地域地形を読み込んでいます…",
    loadingGrid: "説明用グリッドを地形上に配置しています…",
    ready:
      "準備完了。樹冠セルまたは解析モードを選択してください。変化量はすべて説明用です。",
    terrainError: "地形を読み込めませんでした：{message}",
    gridError: "グリッドを配置できませんでした：{message}",
    selectedMode: "{mode}モードを選択しました。",
    selectedCell: "{cell}を選択しました。",
    clearedSelection: "セルの選択を解除しました。",
    animationRunning: "2020年から2025年までの説明用樹冠変化を再生中です。",
    animationReduced:
      "視覚効果を減らす設定のため、アニメーションなしで2025年シナリオを表示しました。",
    animationComplete: "再生が完了し、2025年シナリオを表示しています。",
    cameraSelected: "カメラを「{camera}」に移動しました。",
    resetComplete: "2020年基準と樹冠の近接表示にリセットしました。",
    tourStarted: "自動ツアーを開始しました。",
    tourReduced:
      "視覚効果を減らす設定のため、ツアーは停止した静止状態です。「前へ」または「次へ」で地点を変更してください。",
    tourStop: "ツアー {current}/{total}：{title}。",
    tourPaused: "ツアーを地点{current}で一時停止しました。「再開」で続行します。",
    tourResumed: "ツアーを地点{current}から再開しました。",
    tourManualReduced:
      "視覚効果を減らす設定では静止状態を維持します。「前へ」または「次へ」で地点を変更してください。",
    tourComplete: "ツアー完了",
    tourCompleteDescription:
      "地域全体の表示で終了しました。最初から再開するか、この操作パネルを閉じてください。",
    tourCompleteStatus: "静岡県の地域全体表示でツアーが完了しました。",
    tourClosed: "ガイドツアーを閉じました。",
    progressRemaining: "残り{percent}%",
    stepFujiTitle: "富士山の源流域",
    stepFujiDescription:
      "静岡県で最も標高の高い地形から開始します。山地の森林と下流域の地域をつなぐ標高・流域の背景を広域で確認します。",
    stepBaselineTitle: "安倍川山麓 — 2020年",
    stepBaselineDescription:
      "近接表示ではEntity APIで構成した120セルを確認できます。各セルは個々の樹木やネイティブVoxelではなく、100 × 100 m範囲の説明用樹冠高を集約したものです。",
    stepScenarioTitle: "安倍川山麓 — 2025年",
    stepScenarioDescription:
      "同じ範囲に決定論的な成長・安定・撹乱パターンを適用し、解析グリッドを変えずに2時点を直接比較します。",
    stepChangeTitle: "変化検出",
    stepChangeDescription:
      "発散型の区分で減少を赤、安定を中立グレー、増加を緑で表示します。セルを選択するとモデル化された変化量を確認できます。",
    stepCarbonTitle: "モデル炭素応答",
    stepCarbonDescription:
      "連続する青色ランプで、樹冠高変化とセル面積から算出した相対的なモデル炭素変化を表示します。森林簿ではなく説明用の計画指標です。",
    stepCityTitle: "静岡市の都市背景",
    stepCityDescription:
      "Japan Buildingsにより山麓解析を下流の都市システムの中に位置づけ、環境モニタリングとインフラ・土地管理の判断を結び付けます。",
    stepOverviewTitle: "地域全体",
    stepOverviewDescription:
      "山地から海岸までの計画範囲全体で終了します。樹冠グリッドは、静岡県の地形・集落・流域という広い背景に含まれる局所解析レイヤーです。",
  },
};

let currentLanguage = "en";

function translate(key, replacements = {}) {
  const template =
    TRANSLATIONS[currentLanguage][key] ?? TRANSLATIONS.en[key] ?? key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template
  );
}

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
      --danger: #ff6b64;
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
      width: min(390px, calc(100vw - 24px));
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

    .change-demo-context {
      margin: 0 0 6px;
      color: var(--accent);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.03em;
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

    .change-demo-language {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
    }

    .change-demo-language label {
      color: var(--muted);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .change-demo-select {
      min-height: 44px;
      padding: 8px 34px 8px 10px;
      border: 1px solid #688399;
      border-radius: 8px;
      background: #162a37;
      color: var(--text);
      font: inherit;
      font-weight: 700;
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
      min-height: 44px;
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

    .change-demo-panel button.change-demo-button[aria-pressed="true"],
    .change-demo-panel button.change-demo-button.change-demo-button--primary {
      border-color: var(--accent) !important;
      background-color: var(--accent) !important;
      color: var(--accent-ink) !important;
    }

    .change-demo-button:focus-visible,
    .change-demo-select:focus-visible,
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
      padding: 12px;
      border: 1px solid #567185;
      border-radius: 10px;
      background: #162834;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
    }

    .change-demo-tour-title {
      margin: 0;
      font-size: 0.9rem;
    }

    .change-demo-tour-subtitle {
      margin: 6px 0 12px;
      color: var(--muted);
      font-size: 0.8rem;
      line-height: 1.5;
    }

    .change-demo-tour-launch {
      width: 100%;
      margin-top: 10px;
      box-shadow: 0 6px 18px rgba(120, 224, 246, 0.2);
    }

    .change-demo-progress {
      height: 8px;
      margin: 0 0 12px;
      overflow: hidden;
      border: 1px solid #506b7d;
      border-radius: 999px;
      background: #07141b;
    }

    .change-demo-progress-bar {
      width: 100%;
      height: 100%;
      background: var(--accent);
      transform: scaleX(1);
      transform-origin: left center;
    }

    .change-demo-tour-nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }

    .change-demo-tour-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .change-demo-selection {
      display: grid;
      gap: 7px;
      margin: 0;
    }

    .change-demo-selection-row {
      display: grid;
      grid-template-columns: minmax(105px, 0.8fr) minmax(0, 1.2fr);
      gap: 10px;
      padding-bottom: 7px;
      border-bottom: 1px solid rgba(73, 98, 116, 0.5);
    }

    .change-demo-selection-row:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    .change-demo-selection dt {
      color: var(--muted);
      font-size: 0.72rem;
    }

    .change-demo-selection dd {
      margin: 0;
      overflow-wrap: anywhere;
      font-size: 0.8rem;
      font-weight: 750;
      text-align: end;
    }

    .change-demo-selection-empty {
      margin: 0;
      color: var(--muted);
      font-size: 0.8rem;
      line-height: 1.45;
    }

    .change-demo-clear {
      width: 100%;
      margin-top: 10px;
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

    .change-demo-swatch--gradient {
      width: 42px;
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

      .change-demo-panel {
        font-size: 0.98rem;
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

      .change-demo-progress-bar {
        transition: none !important;
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
        <p class="change-demo-context" data-i18n="context">Shizuoka Prefecture planning workflow</p>
        <h1 class="change-demo-title" id="change-demo-title" data-i18n="title">Canopy Change Explorer</h1>
        <p class="change-demo-subtitle" data-i18n="subtitle">
          Explore an illustrative two-epoch canopy assessment in the Abe River foothills, then follow its regional planning context.
        </p>
        <div class="change-demo-language">
          <label for="language-select" data-i18n="languageLabel">Language</label>
          <select class="change-demo-select" id="language-select">
            <option value="en">English</option>
            <option value="ja">日本語</option>
          </select>
        </div>
      </header>

      <section class="change-demo-section" aria-labelledby="tour-heading">
        <h2 class="change-demo-heading" id="tour-heading" data-i18n="tourHeading">Guided mountain-to-coast tour</h2>
        <p class="change-demo-help" data-i18n="tourHelp">Follow seven stops linking the canopy cells to Shizuoka Prefecture's terrain, city, and watershed context.</p>
        <button class="change-demo-button change-demo-button--primary change-demo-tour-launch" id="autotour-btn" type="button" data-i18n="tourStart">Start autoplay tour</button>
        <div class="change-demo-tour-card" id="autotour-card" role="dialog" aria-labelledby="autotour-title" aria-describedby="autotour-subtitle" hidden>
          <h3 class="change-demo-tour-title" id="autotour-title" data-i18n="tourDialogTitle">Guided tour</h3>
          <p class="change-demo-tour-subtitle" id="autotour-subtitle" data-i18n="tourPreparing">Preparing the first stop…</p>
          <div class="change-demo-progress" id="autotour-progress" role="progressbar" aria-label="Time remaining in this tour stop" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100">
            <div class="change-demo-progress-bar" id="autotour-progress-bar"></div>
          </div>
          <div class="change-demo-tour-nav">
            <button class="change-demo-button" id="autotour-previous" type="button" data-i18n="tourPrevious">← Previous</button>
            <button class="change-demo-button" id="autotour-next" type="button" data-i18n="tourNext">Next →</button>
          </div>
          <div class="change-demo-tour-actions">
            <button class="change-demo-button" id="autotour-pause" type="button" data-i18n="tourPause">Pause</button>
            <button class="change-demo-button" id="autotour-resume" type="button" data-i18n="tourResume" hidden>Resume</button>
            <button class="change-demo-button" id="autotour-restart" type="button" data-i18n="tourRestart">Restart</button>
            <button class="change-demo-button" id="autotour-close" type="button" data-i18n="tourClose">Close</button>
          </div>
        </div>
      </section>

      <section class="change-demo-section" aria-labelledby="mode-heading">
        <fieldset class="change-demo-fieldset">
          <legend class="change-demo-heading" id="mode-heading" data-i18n="modeHeading">Analysis mode</legend>
          <div class="change-demo-button-grid">
            <button class="change-demo-button" type="button" data-mode-button data-mode="year1" data-i18n="modeYear1" aria-pressed="true">2020 baseline</button>
            <button class="change-demo-button" type="button" data-mode-button data-mode="year5" data-i18n="modeYear5" aria-pressed="false">2025 scenario</button>
            <button class="change-demo-button" type="button" data-mode-button data-mode="change" data-i18n="modeChange" aria-pressed="false">Height change</button>
            <button class="change-demo-button" type="button" data-mode-button data-mode="carbon" data-i18n="modeCarbon" aria-pressed="false">Carbon estimate</button>
          </div>
        </fieldset>
        <div class="change-demo-button-row" style="margin-top: 8px">
          <button class="change-demo-button change-demo-button--primary" id="animate-btn" type="button" data-i18n="animate">Animate 2020 to 2025</button>
          <button class="change-demo-button" id="reset-btn" type="button" data-i18n="reset">Reset demo</button>
        </div>
        <output class="change-demo-status" id="app-status" aria-live="polite">Loading the 3D scene…</output>
      </section>

      <section class="change-demo-section" aria-labelledby="kpi-heading">
        <h2 class="change-demo-heading" id="kpi-heading" data-i18n="kpiHeading">Illustrative indicators</h2>
        <dl class="change-demo-kpis">
          <div class="change-demo-kpi change-demo-kpi--wide"><dt data-i18n="kpiView">View</dt><dd id="kpi-timestamp">2020 Baseline</dd></div>
          <div class="change-demo-kpi"><dt data-i18n="kpiCells">Grid cells</dt><dd id="kpi-total">0</dd></div>
          <div class="change-demo-kpi"><dt data-i18n="kpiLoss">Significant loss</dt><dd id="kpi-loss">0</dd></div>
          <div class="change-demo-kpi"><dt data-i18n="kpiGrowth">Significant growth</dt><dd id="kpi-growth">0</dd></div>
          <div class="change-demo-kpi"><dt data-i18n="kpiMeanDelta">Mean height delta</dt><dd id="kpi-delta">0 m</dd></div>
          <div class="change-demo-kpi change-demo-kpi--wide"><dt data-i18n="kpiCarbon">Modeled carbon delta</dt><dd id="kpi-carbon">0 Mg CO₂e</dd></div>
        </dl>
        <p class="change-demo-warning" data-i18n="warning">Each 100 × 100 m cell is an illustrative spatial aggregation of canopy height over its footprint. Height change and carbon outputs are synthetic, not measured observations or decision-grade estimates.</p>
      </section>

      <section class="change-demo-section" aria-labelledby="selection-heading">
        <h2 class="change-demo-heading" id="selection-heading" data-i18n="selectionHeading">Selected canopy cell</h2>
        <p class="change-demo-selection-empty" id="selection-empty" data-i18n="selectionEmpty">Select a cell on the map to inspect its illustrative values.</p>
        <dl class="change-demo-selection" id="selection-details" hidden>
          <div class="change-demo-selection-row"><dt data-i18n="selectionCell">Cell</dt><dd id="selection-cell"></dd></div>
          <div class="change-demo-selection-row"><dt data-i18n="selectionCenter">Center</dt><dd id="selection-center"></dd></div>
          <div class="change-demo-selection-row"><dt data-i18n="selectionYear1">2020 height</dt><dd id="selection-year1"></dd></div>
          <div class="change-demo-selection-row"><dt data-i18n="selectionYear5">2025 height</dt><dd id="selection-year5"></dd></div>
          <div class="change-demo-selection-row"><dt data-i18n="selectionChange">Delta classification</dt><dd id="selection-change"></dd></div>
          <div class="change-demo-selection-row"><dt data-i18n="selectionCarbon">Modeled carbon delta</dt><dd id="selection-carbon"></dd></div>
          <div class="change-demo-selection-row"><dt data-i18n="selectionMode">Current mode value</dt><dd id="selection-mode"></dd></div>
        </dl>
        <button class="change-demo-button change-demo-clear" id="selection-clear" type="button" data-i18n="selectionClear" hidden>Clear selection</button>
      </section>

      <section class="change-demo-section" aria-labelledby="camera-heading">
        <h2 class="change-demo-heading" id="camera-heading" data-i18n="cameraHeading">Camera</h2>
        <div class="change-demo-button-row">
          <button class="change-demo-button" id="camera-initial" type="button" data-i18n="cameraInitial">Canopy close-up</button>
          <button class="change-demo-button" id="camera-overview" type="button" data-i18n="cameraOverview">Regional overview</button>
          <button class="change-demo-button" id="camera-foothills" type="button" data-i18n="cameraFoothills">Foothills</button>
          <button class="change-demo-button" id="camera-city" type="button" data-i18n="cameraCity">Shizuoka city</button>
        </div>
      </section>

      <section class="change-demo-section" aria-labelledby="legend-heading">
        <h2 class="change-demo-legend-title" id="legend-heading">2020 canopy-height legend</h2>
        <ul class="change-demo-legend" id="legend-list" role="list"></ul>
      </section>

      <section class="change-demo-section">
        <details class="change-demo-details">
          <summary data-i18n="sourceSummary">Data provenance and limitations</summary>
          <ul class="change-demo-source-list">
            <li data-i18n="sourceTerrain">Terrain: Cesium ion asset 2767062, Japan regional terrain.</li>
            <li data-i18n="sourceBuildings">Buildings: Cesium ion asset 2602291, Japan Buildings 3D Tiles.</li>
            <li>
              <span data-i18n="sourceCandidate">Public source candidate:</span>
              <a href="https://www.geospatial.jp/ckan/dataset/shizuoka-2019-pointcloud" target="_blank" rel="noopener noreferrer" data-i18n="source2019">Shizuoka 2019 point cloud</a>.
            </li>
            <li>
              <span data-i18n="sourceCandidate">Public source candidate:</span>
              <a href="https://www.geospatial.jp/ckan/dataset/shizuoka-2021-pointcloud" target="_blank" rel="noopener noreferrer" data-i18n="source2021">Shizuoka 2021 point cloud</a>.
            </li>
            <li data-i18n="sourcePublisher">Publisher: Shizuoka Prefecture via GEOSPATIAL.JP / VIRTUAL SHIZUOKA.</li>
            <li data-i18n="sourceLicense">Catalog terms: dual licensed CC BY 4.0 / ODbL.</li>
            <li data-i18n="sourceOverlap">Both catalogs use JGD2011 / Japan Plane Rectangular CS VIII. Their catalog extents overlap, but usable epoch overlap still requires tile-level validation.</li>
            <li data-i18n="sourceProduction">The public LAS archives are not loaded here. Production use requires validated overlapping tiles converted to streamable 3D Tiles and uploaded as separate epoch assets.</li>
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
  mode: "year1",
  isAnimating: false,
  animationProgress: 0,
  animationFrame: null,
  autotourActive: false,
  autotourPaused: false,
  autotourStep: 0,
  autotourRunId: 0,
  prefersReducedMotion: false,
  cells: [],
  cellEntities: [],
  cellByEntityId: new Map(),
  selectedCell: null,
};

const CONFIG = {
  centerLon: 138.42,
  centerLat: 35.06,
  gridCols: 12,
  gridRows: 10,
  cellSpacingM: 100,
  heightScale: 1,
  cameraPresets: {
    initial: {
      x: 138.42,
      y: 35.06,
      targetHeight: "grid",
      range: 1850,
      heading: 38,
      pitch: -31,
    },
    overview: {
      x: 138.42,
      y: 35.06,
      targetHeight: "grid",
      range: 30000,
      heading: 180,
      pitch: -35,
    },
    foothills: {
      x: 138.42,
      y: 35.06,
      targetHeight: "grid",
      range: 2600,
      heading: 45,
      pitch: -28,
    },
    city: {
      x: 138.383,
      y: 34.976,
      targetHeight: 60,
      range: 4500,
      heading: 315,
      pitch: -24,
    },
  },
  tourWaypoints: [
    {
      x: 138.7274,
      y: 35.3606,
      titleKey: "stepFujiTitle",
      descriptionKey: "stepFujiDescription",
      targetHeight: 3776,
      range: 18000,
      heading: 210,
      pitch: -25,
      duration: 2.5,
      holdMs: 5200,
      mode: "year1",
    },
    {
      x: 138.42,
      y: 35.06,
      titleKey: "stepBaselineTitle",
      descriptionKey: "stepBaselineDescription",
      targetHeight: "grid",
      range: 1850,
      heading: 38,
      pitch: -31,
      duration: 2.2,
      holdMs: 6000,
      mode: "year1",
    },
    {
      x: 138.42,
      y: 35.06,
      titleKey: "stepScenarioTitle",
      descriptionKey: "stepScenarioDescription",
      targetHeight: "grid",
      range: 1900,
      heading: 112,
      pitch: -29,
      duration: 2.2,
      holdMs: 6000,
      mode: "year5",
    },
    {
      x: 138.42,
      y: 35.06,
      titleKey: "stepChangeTitle",
      descriptionKey: "stepChangeDescription",
      targetHeight: "grid",
      range: 1750,
      heading: 138,
      pitch: -28,
      duration: 2,
      holdMs: 6500,
      mode: "change",
    },
    {
      x: 138.42,
      y: 35.06,
      titleKey: "stepCarbonTitle",
      descriptionKey: "stepCarbonDescription",
      targetHeight: "grid",
      range: 2000,
      heading: 224,
      pitch: -30,
      duration: 2.2,
      holdMs: 6500,
      mode: "carbon",
    },
    {
      x: 138.383,
      y: 34.976,
      titleKey: "stepCityTitle",
      descriptionKey: "stepCityDescription",
      targetHeight: 60,
      range: 4500,
      heading: 315,
      pitch: -24,
      duration: 2.5,
      holdMs: 5600,
      mode: "year5",
    },
    {
      x: 138.42,
      y: 35.06,
      titleKey: "stepOverviewTitle",
      descriptionKey: "stepOverviewDescription",
      targetHeight: "grid",
      range: 30000,
      heading: 180,
      pitch: -35,
      duration: 3,
      holdMs: 6500,
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

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function interpolateColor(startCss, endCss, amount) {
  return Cesium.Color.lerp(
    Cesium.Color.fromCssColorString(startCss),
    Cesium.Color.fromCssColorString(endCss),
    clamp01(amount),
    new Cesium.Color()
  );
}

function getDisplayedHeight(cell) {
  if (STATE.isAnimating) {
    return (
      cell.year1Height +
      (cell.year2Height - cell.year1Height) * STATE.animationProgress
    );
  }
  if (STATE.mode === "year1") return cell.year1Height;
  if (STATE.mode === "year5") return cell.year2Height;
  if (STATE.mode === "change") return Math.abs(cell.delta) * 5 + 30;
  if (STATE.mode === "carbon") return Math.abs(cell.carbonDelta) * 10 + 30;
  return cell.year1Height;
}

function getColorForCell(cell, mode) {
  if (mode === "year1" || mode === "year5") {
    const height = STATE.isAnimating
      ? getDisplayedHeight(cell)
      : mode === "year1"
        ? cell.year1Height
        : cell.year2Height;
    return interpolateColor("#b9f58b", "#146b47", (height - 20) / 30);
  }

  if (mode === "change") {
    if (cell.delta < -0.5) {
      return Cesium.Color.fromCssColorString("#d94b45");
    }
    if (cell.delta > 0.5) {
      return Cesium.Color.fromCssColorString("#3d9b57");
    }
    return Cesium.Color.fromCssColorString("#8d969c");
  }

  if (mode === "carbon") {
    return interpolateColor(
      "#d8eff8",
      "#174f8a",
      (cell.carbonDelta + 4) / 7
    );
  }

  return Cesium.Color.WHITE;
}

// ============================================================================
// CESIUM VIEWER SETUP (with verified Ion assets)
// ============================================================================

async function initViewer() {
  // Use verified Cesium Ion assets: Japan terrain (#2767062)
  // Note: Sandcastle provides its own Cesium.Ion token; do not override
  updateStatus(translate("loadingTerrain"));
  let terrainProvider;
  try {
    terrainProvider =
      await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062);
  } catch (error) {
    updateStatus(translate("terrainError", { message: error.message }), true);
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
    translate("mapAria")
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
  updateStatus(translate("loadingGrid"));
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
    updateStatus(translate("gridError", { message: error.message }), true);
    throw error;
  }
}

// ============================================================================
// ENTITY API ANALYTICAL GRID
// ============================================================================

function visualizePointClouds() {
  for (const cell of STATE.cells) {
    const height = getDisplayedHeight(cell);
    const position = Cesium.Cartesian3.fromDegrees(
      cell.lon,
      cell.lat,
      cell.terrainHeight + height / 2
    );
    const dimensions = new Cesium.Cartesian3(
      CONFIG.cellSpacingM - 4,
      CONFIG.cellSpacingM - 4,
      height
    );
    const color = getColorForCell(cell, STATE.mode);
    let entity = STATE.cellEntities[cell.id];

    if (!entity) {
      const entityId = `canopy-cell-${cell.row + 1}-${cell.col + 1}`;
      entity = viewer.entities.add({
        id: entityId,
        name: entityId,
        position,
        box: {
          dimensions,
          material: color,
          outline: false,
          outlineColor: Cesium.Color.WHITE,
        },
      });
      STATE.cellEntities[cell.id] = entity;
      STATE.cellByEntityId.set(entityId, cell);
    } else {
      entity.position = position;
      entity.box.dimensions = dimensions;
      entity.box.material = color;
    }

    const selected = STATE.selectedCell?.id === cell.id;
    entity.box.outline = selected;
    entity.box.outlineColor = selected
      ? Cesium.Color.WHITE
      : Cesium.Color.TRANSPARENT;
  }
}

function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(currentLanguage === "ja" ? "ja-JP" : "en-US", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
    ...options,
  }).format(value);
}

function signedNumber(value) {
  return `${value > 0 ? "+" : ""}${formatNumber(value)}`;
}

function getClassificationKey(cell) {
  if (cell.delta < -0.5) return "classificationLoss";
  if (cell.delta > 0.5) return "classificationGrowth";
  return "classificationStable";
}

function getCurrentModeValue(cell) {
  if (STATE.isAnimating) {
    return `${formatNumber(getDisplayedHeight(cell))} m (${Math.round(
      STATE.animationProgress * 100
    )}%)`;
  }
  if (STATE.mode === "year1") {
    return `${formatNumber(cell.year1Height)} m`;
  }
  if (STATE.mode === "year5") {
    return `${formatNumber(cell.year2Height)} m`;
  }
  if (STATE.mode === "change") {
    return `${signedNumber(cell.delta)} m · ${translate(
      getClassificationKey(cell)
    )}`;
  }
  return `${signedNumber(cell.carbonDelta)} Mg CO₂e`;
}

function updateSelectedCellDetails() {
  const cell = STATE.selectedCell;
  requireElement("selection-empty").hidden = Boolean(cell);
  requireElement("selection-details").hidden = !cell;
  requireElement("selection-clear").hidden = !cell;

  if (!cell) return;

  requireElement("selection-cell").textContent =
    `CELL-${String(cell.row + 1).padStart(2, "0")}-${String(
      cell.col + 1
    ).padStart(2, "0")} · R${cell.row + 1} / C${cell.col + 1}`;
  requireElement("selection-center").textContent =
    `${cell.lat.toFixed(5)}° N, ${cell.lon.toFixed(5)}° E`;
  requireElement("selection-year1").textContent =
    `${formatNumber(cell.year1Height)} m`;
  requireElement("selection-year5").textContent =
    `${formatNumber(cell.year2Height)} m`;
  requireElement("selection-change").textContent =
    `${signedNumber(cell.delta)} m · ${translate(getClassificationKey(cell))}`;
  requireElement("selection-carbon").textContent =
    `${signedNumber(cell.carbonDelta)} Mg CO₂e`;
  requireElement("selection-mode").textContent = getCurrentModeValue(cell);
}

function renderLegend() {
  const titleKeys = {
    year1: "legendYear1",
    year5: "legendYear5",
    change: "legendChange",
    carbon: "legendCarbon",
  };
  requireElement("legend-heading").textContent = translate(
    titleKeys[STATE.mode]
  );

  const items =
    STATE.mode === "change"
      ? [
          ["#d94b45", "legendLoss"],
          ["#8d969c", "legendStable"],
          ["#3d9b57", "legendGrowth"],
        ]
      : STATE.mode === "carbon"
        ? [
            ["#d8eff8", "legendLow"],
            ["#6ca5cc", "legendMedium"],
            ["#174f8a", "legendHigh"],
          ]
        : [
            ["#b9f58b", "legendLow"],
            ["#58b66c", "legendMedium"],
            ["#146b47", "legendHigh"],
          ];

  const legend = requireElement("legend-list");
  legend.replaceChildren(
    ...items.map(([color, labelKey]) => {
      const item = document.createElement("li");
      const swatch = document.createElement("span");
      swatch.className = "change-demo-swatch";
      swatch.style.background = color;
      swatch.setAttribute("aria-hidden", "true");
      item.append(swatch, translate(labelKey));
      return item;
    })
  );
}

function renderCurrentTourCopy() {
  if (requireElement("autotour-card").hidden) return;
  const waypoint = CONFIG.tourWaypoints[STATE.autotourStep];
  if (!waypoint) return;
  requireElement("autotour-title").textContent =
    `${STATE.autotourStep + 1} / ${CONFIG.tourWaypoints.length} · ${translate(
      waypoint.titleKey
    )}`;
  requireElement("autotour-subtitle").textContent = translate(
    waypoint.descriptionKey
  );
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = translate("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });
  viewer.canvas.setAttribute("aria-label", translate("mapAria"));
  requireElement("autotour-progress").setAttribute(
    "aria-label",
    translate("tourProgressLabel")
  );
  updateKPIs();
  renderLegend();
  updateSelectedCellDetails();
  renderCurrentTourCopy();
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
  renderLegend();
  updateSelectedCellDetails();
  if (announce) {
    updateStatus(
      translate("selectedMode", {
        mode: requireElement("kpi-timestamp").textContent,
      })
    );
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

  const meanDelta = stats.total ? stats.totalDelta / stats.total : 0;
  const pctLoss = stats.total ? (stats.sigLoss / stats.total) * 100 : 0;
  const pctGrowth = stats.total ? (stats.sigGrowth / stats.total) * 100 : 0;

  const set = (id, val) => {
    requireElement(id).textContent = val;
  };

  set("kpi-total", stats.total);
  set("kpi-loss", `${stats.sigLoss} (${formatNumber(pctLoss)}%)`);
  set("kpi-growth", `${stats.sigGrowth} (${formatNumber(pctGrowth)}%)`);
  set("kpi-delta", `${formatNumber(meanDelta)} m`);
  set("kpi-carbon", `${formatNumber(stats.totalCarbon)} Mg CO₂e`);

  const modeLabelKeys = {
    year1: "modeLabelYear1",
    year5: "modeLabelYear5",
    change: "modeLabelChange",
    carbon: "modeLabelCarbon",
  };
  set("kpi-timestamp", translate(modeLabelKeys[STATE.mode]));
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
  requireElement("autotour-previous").disabled = STATE.autotourStep === 0;
  requireElement("autotour-next").disabled =
    STATE.autotourStep === CONFIG.tourWaypoints.length - 1;
}

function setTourProgress(percentRemaining) {
  const percent = Math.max(0, Math.min(100, Math.round(percentRemaining)));
  requireElement("autotour-progress-bar").style.transform =
    `scaleX(${percent / 100})`;
  const progress = requireElement("autotour-progress");
  progress.setAttribute("aria-valuenow", String(percent));
  progress.setAttribute(
    "aria-valuetext",
    translate("progressRemaining", { percent })
  );
}

function stopAutoplayTour({ hideCard = true, focusStart = false } = {}) {
  STATE.autotourRunId++;
  STATE.autotourActive = false;
  STATE.autotourPaused = false;
  viewer.camera.cancelFlight();
  renderTourControls(!hideCard);
  setTourProgress(100);
  if (hideCard) {
    requireElement("autotour-title").textContent =
      translate("tourDialogTitle");
    requireElement("autotour-subtitle").textContent =
      translate("tourPreparing");
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
    Cesium.Cartesian3.fromDegrees(waypoint.x, waypoint.y, targetHeight),
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
  setTourProgress(100);
  while (
    elapsed < milliseconds &&
    STATE.autotourActive &&
    STATE.autotourRunId === runId
  ) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    if (!STATE.autotourPaused) {
      elapsed += 50;
      setTourProgress(100 * (1 - elapsed / milliseconds));
    }
  }
  if (elapsed >= milliseconds) {
    setTourProgress(0);
  }
}

function renderTourStep(index) {
  STATE.autotourStep = index;
  const waypoint = CONFIG.tourWaypoints[index];
  switchMode(waypoint.mode, false);
  renderCurrentTourCopy();
  renderTourControls(true);
  updateStatus(
    translate("tourStop", {
      current: index + 1,
      total: CONFIG.tourWaypoints.length,
      title: translate(waypoint.titleKey),
    })
  );
  return waypoint;
}

async function runAutoplayTour(runId) {
  for (
    let i = STATE.autotourStep;
    i < CONFIG.tourWaypoints.length;
    i++
  ) {
    if (!STATE.autotourActive || STATE.autotourRunId !== runId) {
      return;
    }

    const waypoint = renderTourStep(i);
    setTourProgress(100);

    if (STATE.prefersReducedMotion) {
      await setCameraView(waypoint, 0);
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
        waypoint.duration
      );
    }

    await waitForTour(waypoint.holdMs, runId);
  }

  if (STATE.autotourRunId !== runId) {
    return;
  }
  STATE.autotourActive = false;
  STATE.autotourPaused = false;
  requireElement("autotour-title").textContent = translate("tourComplete");
  requireElement("autotour-subtitle").textContent =
    translate("tourCompleteDescription");
  renderTourControls(true);
  updateStatus(translate("tourCompleteStatus"));
}

function launchTourAt(index, paused = false) {
  viewer.camera.cancelFlight();
  const runId = ++STATE.autotourRunId;
  STATE.autotourActive = true;
  STATE.autotourPaused = paused;
  STATE.autotourStep = Math.max(
    0,
    Math.min(CONFIG.tourWaypoints.length - 1, index)
  );
  renderTourControls(true);
  void runAutoplayTour(runId);
}

function autoplayTour() {
  launchTourAt(0, STATE.prefersReducedMotion);
  updateStatus(
    translate(STATE.prefersReducedMotion ? "tourReduced" : "tourStarted")
  );
  requireElement(
    STATE.prefersReducedMotion ? "autotour-resume" : "autotour-pause"
  ).focus();
}

function pauseAutoplayTour() {
  if (!STATE.autotourActive || STATE.autotourPaused) {
    return;
  }
  STATE.autotourPaused = true;
  viewer.camera.cancelFlight();
  renderTourControls(true);
  updateStatus(
    translate("tourPaused", { current: STATE.autotourStep + 1 })
  );
  requireElement("autotour-resume").focus();
}

function resumeAutoplayTour() {
  if (!STATE.autotourActive || !STATE.autotourPaused) {
    return;
  }
  if (STATE.prefersReducedMotion) {
    updateStatus(translate("tourManualReduced"));
    requireElement("autotour-next").focus();
    return;
  }
  STATE.autotourPaused = false;
  renderTourControls(true);
  updateStatus(
    translate("tourResumed", { current: STATE.autotourStep + 1 })
  );
  requireElement("autotour-pause").focus();
}

function restartAutoplayTour() {
  launchTourAt(0, STATE.prefersReducedMotion);
}

function moveTourStep(delta) {
  const nextStep = Math.max(
    0,
    Math.min(
      CONFIG.tourWaypoints.length - 1,
      STATE.autotourStep + delta
    )
  );
  launchTourAt(nextStep, STATE.prefersReducedMotion || STATE.autotourPaused);
}

// ============================================================================
// CAMERA PRESETS
// ============================================================================

function useCameraPreset(waypoint, labelKey, immediate = false) {
  if (STATE.autotourActive) {
    stopAutoplayTour();
  }
  updateStatus(
    translate("cameraSelected", { camera: translate(labelKey) })
  );
  return setCameraView(
    waypoint,
    immediate || STATE.prefersReducedMotion ? 0 : 2
  );
}

function cameraInitial(immediate = false) {
  return useCameraPreset(
    CONFIG.cameraPresets.initial,
    "cameraInitial",
    immediate
  );
}

function cameraOverview(immediate = false) {
  return useCameraPreset(
    CONFIG.cameraPresets.overview,
    "cameraOverview",
    immediate
  );
}

function cameraFoothills() {
  return useCameraPreset(
    CONFIG.cameraPresets.foothills,
    "cameraFoothills"
  );
}

function cameraCity() {
  return useCameraPreset(
    CONFIG.cameraPresets.city,
    "cameraCity"
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
    renderLegend();
    updateSelectedCellDetails();
    requireElement("animate-btn").disabled = false;
    updateStatus(translate("animationReduced"));
    return;
  }

  updateStatus(translate("animationRunning"));
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
      updateSelectedCellDetails();
      lastRender = now;
    }

    if (STATE.animationProgress === 1) {
      STATE.isAnimating = false;
      STATE.animationFrame = null;
      requireElement("animate-btn").disabled = false;
      updateKPIs();
      renderLegend();
      updateStatus(translate("animationComplete"));
      return;
    }
    STATE.animationFrame = requestAnimationFrame(step);
  };
  STATE.animationFrame = requestAnimationFrame(step);
}

(async function initializeDemo() {
  STATE.cells = generateSyntheticGrid();
  STATE.prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  await sampleGridTerrainHeights();
  visualizePointClouds();
  updateKPIs();
  renderLegend();
  applyTranslations();
  await cameraInitial(true);
  updateStatus(translate("ready"));

  const sceneHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  sceneHandler.setInputAction((movement) => {
    const picked = viewer.scene.pick(movement.position);
    const pickedEntity = Cesium.defined(picked) ? picked.id : undefined;
    const entityId =
      typeof pickedEntity === "string" ? pickedEntity : pickedEntity?.id;
    const cell = entityId ? STATE.cellByEntityId.get(entityId) : undefined;
    if (!cell) return;

    STATE.selectedCell = cell;
    visualizePointClouds();
    updateSelectedCellDetails();
    updateStatus(
      translate("selectedCell", {
        cell: `CELL-${String(cell.row + 1).padStart(2, "0")}-${String(
          cell.col + 1
        ).padStart(2, "0")}`,
      })
    );
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  document.querySelectorAll("[data-mode-button]").forEach((button) => {
    button.addEventListener("click", () => switchMode(button.dataset.mode));
  });
  requireElement("animate-btn").addEventListener("click", animateEpochChange);
  requireElement("language-select").addEventListener("change", (event) => {
    currentLanguage = event.target.value === "ja" ? "ja" : "en";
    applyTranslations();
    updateStatus(translate("ready"));
  });
  requireElement("selection-clear").addEventListener("click", () => {
    STATE.selectedCell = null;
    visualizePointClouds();
    updateSelectedCellDetails();
    updateStatus(translate("clearedSelection"));
   viewer.canvas.focus();
  });
  requireElement("camera-initial").addEventListener("click", () => {
   void cameraInitial();
  });
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
  requireElement("autotour-previous").addEventListener("click", () => {
   moveTourStep(-1);
  });
  requireElement("autotour-next").addEventListener("click", () => {
   moveTourStep(1);
  });
  requireElement("autotour-restart").addEventListener(
   "click",
   restartAutoplayTour
  );
  requireElement("autotour-close").addEventListener("click", () => {
   stopAutoplayTour({ focusStart: true });
   updateStatus(translate("tourClosed"));
  });
  requireElement("reset-btn").addEventListener("click", () => {
   STATE.isAnimating = false;
   STATE.animationProgress = 0;
   if (STATE.animationFrame !== null) {
     cancelAnimationFrame(STATE.animationFrame);
     STATE.animationFrame = null;
   }
   stopAutoplayTour();
   STATE.selectedCell = null;
   switchMode("year1", false);
   updateSelectedCellDetails();
   void cameraInitial();
   updateStatus(translate("resetComplete"));
  });

  console.info(
   `Demo 5 ready with ${STATE.cells.length} deterministic illustrative grid cells.`
  );
  console.info(
   "Virtual Shizuoka Atami LP LiDAR epochs uploaded to Cesium Ion: asset 5126345 (2019 pre-disaster), asset 5126355 (2020); catalog terms CC BY 4.0."
  );
})();
