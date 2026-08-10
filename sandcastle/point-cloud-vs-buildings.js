/* global Cesium */
(async function () {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OWYyMTY3OS05ZWEzLTRlN2MtYjhkMC03YWE0MmU4ZDZhODEiLCJpZCI6MjUzMzg1LCJzdWIiOiJDZXNpdW1CRCIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJWaXJ0dWFsIFNoaXpvdWthIERlbW9zIiwiaWF0IjoxNzg2Mzk5NjcyfQ.N5gdB7U145m_8SqF0QDcE73DtbZ2FHe3TtMU500BGhA";

  const JAPAN_TERRAIN_ASSET_ID = 2767062;
  const JAPAN_BUILDINGS_ASSET_ID = 2602291;

  // Replace with an ion asset tiled from one selected Virtual Shizuoka source.
  // Leave undefined rather than presenting unrelated point-cloud data as Virtual Shizuoka.
  const VIRTUAL_SHIZUOKA_ION_ASSET_ID = 5124307;

  const SOURCE_SEARCH_URL =
    "https://www.geospatial.jp/ckan/dataset?q=VIRTUAL+SHIZUOKA&organization=shizuokapref&sort=metadata_modified+desc";
  const POINT_CLOUD_PACKAGE_URL =
    "https://www.geospatial.jp/ckan/dataset/shizuoka-2021-pointcloud";
  const LP_RESOURCE_URL =
    "https://www.geospatial.jp/ckan/dataset/shizuoka-2021-pointcloud/resource/4ff14a3c-f85a-4244-8bd3-ffbfa0895076";
  const POINT_CLOUD_API_URL =
    "https://www.geospatial.jp/ckan/api/3/action/package_show?id=shizuoka-2021-pointcloud";
  const ATAMI_PACKAGE_URL =
    "https://www.geospatial.jp/ckan/dataset/atami-3d";

  const COPY = {
    en: {
      languageLabel: "Language",
      title: "From Mt. Fuji LiDAR to Shizuoka's urban context",
      lede:
        "A Shizuoka Prefecture workflow for turning official survey LiDAR into streamable point-cloud 3D Tiles alongside nationwide building context.",
      viewsTitle: "Geographic chapter",
      viewRegional: "Fuji to Shizuoka",
      viewFuji: "Mt. Fuji foothills",
      viewEast: "Shizuoka East",
      viewUrban: "Shizuoka urban",
      layersTitle: "Comparison layers",
      layerBuildings: "Buildings context",
      layerBoth: "LiDAR + buildings",
      layerPointCloud: "LiDAR only",
      detailBalanced: "Detail: balanced",
      detailHigh: "Detail: high",
      statusTitle: "Data status",
      terrainLabel: "Japan regional terrain",
      buildingsLabel: "Japan buildings",
      lidarLabel: "Core Virtual Shizuoka LiDAR",
      terrainFallback: "Fallback ellipsoid",
      terrainStreaming: "Streaming",
      terrainUnavailable: "Unavailable - using ellipsoid",
      loading: "Loading",
      assetRequired: "Not loaded - asset ID required",
      buildingsStreaming: "Streaming context",
      buildingsUnavailable: "Unavailable - terrain remains",
      pointStreaming: "Streaming verified asset",
      pointUnavailable: "Asset unavailable - context remains",
      dataAnswerLabel: "Current answer:",
      dataAnswer:
        "Core Virtual Shizuoka LiDAR is not yet loaded. Point-cloud controls stay unavailable until VIRTUAL_SHIZUOKA_ION_ASSET_ID is set.",
      dataAnswerLoading:
        "A configured Virtual Shizuoka ion asset is loading. Point-cloud controls will become available after it is ready.",
      dataAnswerReady:
        "The configured Virtual Shizuoka LiDAR asset is streaming. Point-cloud comparison controls are available.",
      dataAnswerError:
        "The configured Virtual Shizuoka LiDAR asset could not be loaded. Point-cloud controls remain unavailable; verify the ion asset ID and access.",
      setupSummary: "Add the official LiDAR layer",
      recommendedLabel: "Recommended source:",
      recommended:
        "Use the 2021 package's “LP data - original/ground data” resource for the Fuji southeastern flank to Shizuoka East story.",
      selectionLabel: "Mesh selection:",
      selection:
        "The CKAN API exposes the LP map resource, not a definitive mesh list for this camera corridor. In the package map, select only national map meshes intersecting the intended Fuji-to-Shizuoka-East camera footprint; confirm coverage before download rather than guessing mesh codes.",
      workflowLabel: "Ion workflow:",
      workflow:
        "Download the selected LAS ZIP/7z archives, decompress them, validate JGD2011 / Japan Plane Rectangular CS VIII and the source vertical datum, then upload the LAS/LAZ files to Cesium ion for point-cloud 3D Tiles tiling. Retain Shizuoka Prefecture attribution and paste the resulting ion asset ID into VIRTUAL_SHIZUOKA_ION_ASSET_ID.",
      licenseLabel: "Catalog facts:",
      license:
        "The package states CC BY 4.0 / ODbL dual licensing, JGD2011 / Japan Plane Rectangular CS VIII, roughly 300 MB per archive on average, and files up to 2.8 GB.",
      atamiLabel: "Atami option:",
      atami:
        "The Atami package provides direct 2019 ground-LAS mesh ZIPs and is useful as a smaller disaster-area pilot. It does not match the Fuji / Shizuoka East anchor, so do not substitute it for the main story.",
      contextLabel: "Context only:",
      context:
        "Japan Regional Terrain (ion 2767062) and Japan Buildings 3D Tiles (ion 2602291) follow Cesium's official Japan Buildings example. Neither is presented as Virtual Shizuoka LiDAR.",
      catalogLink: "Virtual Shizuoka catalog",
      packageLink: "2021 point-cloud package",
      resourceLink: "LP original/ground resource",
      apiLink: "Verified CKAN API",
      atamiLink: "Atami pilot package",
      closeTour: "Close story tour",
      previous: "Previous",
      pause: "Pause",
      resume: "Resume",
      restart: "Restart",
      next: "Next",
      openTour: "Open story tour",
      chapterStep: (current, total) => `Chapter ${current} of ${total}`,
      chapter1Title: "One connected geographic system",
      chapter1Copy:
        "Begin with the regional relationship: Mt. Fuji and its foothills transition southwest into Shizuoka's developed urban land. Terrain supplies the geographic frame; streamed 3D Tiles add detail only where decisions need it.",
      chapter2Title: "Official survey LiDAR is the source",
      chapter2Copy:
        "Shizuoka Prefecture publishes airborne laser (LP), airborne laser bathymetry (ALB), and mobile mapping (MMS) collections. These downloads are survey source files, not a browser-ready 3D Tiles endpoint.",
      chapter3Title: "Cesium ion creates the streaming layer",
      chapter3Copy:
        "Select LP original/ground meshes for the Fuji-to-Shizuoka-East footprint, validate the CRS and height datum, then upload the decompressed LAS/LAZ files to Cesium ion. CesiumJS requests only the point-cloud tiles needed for the current view.",
      chapter4Title: "LiDAR and buildings answer different questions",
      chapter4Copy:
        "Building 3D Tiles provide semantic urban context. LiDAR preserves measured ground, canopy, utility, and surface detail between modeled structures. Together they support planning, inspection, resilience, and change analysis without conflating the sources.",
      viewSelected: (label) => `${label} view selected.`,
      pointNeedsAsset:
        "Virtual Shizuoka point-cloud controls require a configured ion asset ID.",
      detailHighAnnouncement:
        "High detail selected. This may increase network and GPU use.",
      detailBalancedAnnouncement: "Balanced detail selected.",
      tourResumed: "Story tour resumed.",
      tourPaused: "Story tour paused.",
      tourRestarted: "Story restarted.",
      tourRestartedReduced:
        "Story restarted and paused to respect reduced motion.",
      buildingsReady: "Japan buildings context is streaming.",
      buildingsError:
        "Japan buildings are unavailable. Terrain remains functional.",
      pointReady: "The configured Virtual Shizuoka point cloud is streaming.",
      pointError:
        "The configured Virtual Shizuoka point cloud is unavailable. Japan context remains functional.",
      reducedMotion:
        "Story tour is paused and camera transitions are instant because reduced motion is enabled.",
      languageChanged: "Language changed to English.",
    },
    ja: {
      languageLabel: "言語",
      title: "富士山のLiDARから静岡の都市3Dコンテキストへ",
      lede:
        "静岡県の公式測量LiDARを、全国建物データと並べて配信可能な点群3D Tilesへ変換するワークフローです。",
      viewsTitle: "地域チャプター",
      viewRegional: "富士山から静岡へ",
      viewFuji: "富士山麓",
      viewEast: "静岡県東部",
      viewUrban: "静岡市街",
      layersTitle: "比較レイヤー",
      layerBuildings: "建物コンテキスト",
      layerBoth: "LiDAR + 建物",
      layerPointCloud: "LiDARのみ",
      detailBalanced: "詳細度：標準",
      detailHigh: "詳細度：高",
      statusTitle: "データ状況",
      terrainLabel: "日本地域地形",
      buildingsLabel: "日本の建物",
      lidarLabel: "VIRTUAL SHIZUOKA コアLiDAR",
      terrainFallback: "楕円体で代替",
      terrainStreaming: "配信中",
      terrainUnavailable: "利用不可 - 楕円体で代替",
      loading: "読み込み中",
      assetRequired: "未読込 - アセットIDが必要",
      buildingsStreaming: "コンテキスト配信中",
      buildingsUnavailable: "利用不可 - 地形は表示中",
      pointStreaming: "検証済みアセットを配信中",
      pointUnavailable: "アセット利用不可 - コンテキストは表示中",
      dataAnswerLabel: "現在の状況：",
      dataAnswer:
        "VIRTUAL SHIZUOKAのコアLiDARはまだ読み込まれていません。VIRTUAL_SHIZUOKA_ION_ASSET_IDを設定するまで点群操作は利用できません。",
      dataAnswerLoading:
        "設定されたVIRTUAL SHIZUOKAのionアセットを読み込んでいます。準備が完了すると点群操作が利用できます。",
      dataAnswerReady:
        "設定されたVIRTUAL SHIZUOKA LiDARアセットを配信中です。点群比較操作を利用できます。",
      dataAnswerError:
        "設定されたVIRTUAL SHIZUOKA LiDARアセットを読み込めませんでした。点群操作は利用できません。ionアセットIDとアクセス権を確認してください。",
      setupSummary: "公式LiDARレイヤーを追加する",
      recommendedLabel: "推奨ソース：",
      recommended:
        "富士山南東部から静岡県東部のストーリーには、2021年パッケージの「LPデータ オリジナル・グラウンドデータ」を使用します。",
      selectionLabel: "図郭の選択：",
      selection:
        "CKAN APIはLP地図リソースを公開していますが、このカメラ経路に対応する確定図郭一覧は提供していません。図郭コードを推測せず、パッケージの地図で富士山から静岡県東部の対象範囲と交差する国土基本図郭だけを選び、ダウンロード前に範囲を確認してください。",
      workflowLabel: "ionワークフロー：",
      workflow:
        "選択したLASのZIP/7zをダウンロードして展開し、JGD2011 / 平面直角座標系第VIII系と標高基準を確認します。LAS/LAZをCesium ionへアップロードして点群3D Tilesに変換し、静岡県の帰属表示を維持して、生成されたionアセットIDをVIRTUAL_SHIZUOKA_ION_ASSET_IDへ貼り付けます。",
      licenseLabel: "カタログ情報：",
      license:
        "パッケージにはCC BY 4.0 / ODbLのデュアルライセンス、JGD2011 / 平面直角座標系第VIII系、1ファイル平均約300MB、最大2.8GBと記載されています。",
      atamiLabel: "熱海の選択肢：",
      atami:
        "熱海パッケージは2019年の地表LAS図郭ZIPを直接提供し、小規模な災害地域パイロットに適しています。ただし富士山・静岡県東部の中心ストーリーとは一致しないため、メインデータの代替にはしません。",
      contextLabel: "参考コンテキスト：",
      context:
        "日本地域地形（ion 2767062）と日本の建物3D Tiles（ion 2602291）は、Cesium公式のJapan Buildings例に基づきます。どちらもVIRTUAL SHIZUOKA LiDARとして表示していません。",
      catalogLink: "VIRTUAL SHIZUOKAカタログ",
      packageLink: "2021年点群パッケージ",
      resourceLink: "LPオリジナル・グラウンドリソース",
      apiLink: "検証済みCKAN API",
      atamiLink: "熱海パイロットパッケージ",
      closeTour: "ストーリーツアーを閉じる",
      previous: "前へ",
      pause: "一時停止",
      resume: "再開",
      restart: "最初から",
      next: "次へ",
      openTour: "ストーリーツアーを開く",
      chapterStep: (current, total) => `チャプター ${current} / ${total}`,
      chapter1Title: "一つにつながる地理システム",
      chapter1Copy:
        "富士山と山麓から南西の静岡市街へ続く地域関係から始めます。地形が地理的な枠組みを示し、ストリーミング3D Tilesが判断に必要な場所だけへ詳細を追加します。",
      chapter2Title: "公式測量LiDARがソース",
      chapter2Copy:
        "静岡県は航空レーザ（LP）、航空レーザ測深（ALB）、モバイルマッピング（MMS）の点群を公開しています。これらは測量ソースファイルであり、ブラウザ向け3D Tilesエンドポイントではありません。",
      chapter3Title: "Cesium ionでストリーミングレイヤーを作成",
      chapter3Copy:
        "富士山から静岡県東部の対象範囲に合うLPオリジナル・グラウンド図郭を選び、座標系と標高基準を確認して、展開したLAS/LAZをCesium ionへアップロードします。CesiumJSは現在の視点に必要な点群タイルだけを要求します。",
      chapter4Title: "LiDARと建物は異なる問いに答える",
      chapter4Copy:
        "建物3D Tilesは意味を持つ都市コンテキストを提供し、LiDARは地表、樹冠、設備、構造物間の表面形状を計測値として保持します。両者を区別して組み合わせることで、計画、点検、防災、変化解析を支援します。",
      viewSelected: (label) => `${label}ビューを選択しました。`,
      pointNeedsAsset:
        "VIRTUAL SHIZUOKA点群の操作にはionアセットIDの設定が必要です。",
      detailHighAnnouncement:
        "高詳細を選択しました。ネットワークとGPUの負荷が増える場合があります。",
      detailBalancedAnnouncement: "標準詳細を選択しました。",
      tourResumed: "ストーリーツアーを再開しました。",
      tourPaused: "ストーリーツアーを一時停止しました。",
      tourRestarted: "ストーリーを最初から開始しました。",
      tourRestartedReduced:
        "動きを減らす設定に従い、ストーリーを最初から一時停止状態にしました。",
      buildingsReady: "日本の建物コンテキストを配信中です。",
      buildingsError: "日本の建物は利用できません。地形表示は継続します。",
      pointReady: "設定されたVIRTUAL SHIZUOKA点群を配信中です。",
      pointError:
        "設定されたVIRTUAL SHIZUOKA点群は利用できません。日本のコンテキスト表示は継続します。",
      reducedMotion:
        "動きを減らす設定に従い、ツアーを一時停止しカメラ移動を即時にしています。",
      languageChanged: "表示言語を日本語に変更しました。",
    },
  };
  let locale = "en";
  const t = (key, ...args) => {
    const value = COPY[locale][key];
    return typeof value === "function" ? value(...args) : value;
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cameraDuration = prefersReducedMotion ? 0 : 2.4;

  let terrainProvider = new Cesium.EllipsoidTerrainProvider();
  let terrainStatusKey = "terrainFallback";
  let terrainTone = "warning";

  try {
    terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(
      JAPAN_TERRAIN_ASSET_ID,
      { requestVertexNormals: true },
    );
    terrainStatusKey = "terrainStreaming";
    terrainTone = "ready";
  } catch (error) {
    terrainStatusKey = "terrainUnavailable";
  }

  const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider,
    baseLayer: new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        credit: "OpenStreetMap contributors",
        maximumLevel: 19,
      }),
    ),
    baseLayerPicker: false,
    sceneModePicker: false,
    animation: false,
    timeline: false,
    geocoder: false,
    homeButton: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    selectionIndicator: false,
    infoBox: false,
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
  });

  const scene = viewer.scene;
  viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
    "2026-08-10T03:00:00Z",
  );
  viewer.clock.shouldAnimate = false;
  scene.globe.depthTestAgainstTerrain = true;
  scene.globe.enableLighting = true;
  scene.globe.dynamicAtmosphereLighting = true;
  scene.sun.show = true;
  scene.backgroundColor = Cesium.Color.fromCssColorString("#8fc5e8");
  scene.fog.enabled = true;

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --vs-bg: rgba(8, 15, 28, 0.9);
      --vs-bg-soft: rgba(21, 33, 52, 0.82);
      --vs-border: rgba(180, 203, 226, 0.28);
      --vs-text: #f4f8fc;
      --vs-muted: #c4d1df;
      --vs-accent: #54d2c7;
      --vs-accent-strong: #8be5de;
      --vs-warning: #ffd479;
      --vs-danger: #ffaaa2;
      --vs-shadow: 0 18px 48px rgba(0, 0, 0, 0.38);
    }

    .vs-shell {
      position: absolute;
      inset: 0;
      pointer-events: none;
      color: var(--vs-text);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
      line-height: 1.45;
    }

    .vs-panel,
    .vs-story,
    .vs-open-story {
      pointer-events: auto;
      border: 1px solid var(--vs-border);
      background: var(--vs-bg);
      box-shadow: var(--vs-shadow);
      backdrop-filter: blur(16px) saturate(125%);
      -webkit-backdrop-filter: blur(16px) saturate(125%);
    }

    .vs-panel {
      position: absolute;
      top: 14px;
      right: 14px;
      width: min(390px, calc(100vw - 28px));
      max-height: calc(100vh - 66px);
      overflow: auto;
      border-radius: 16px;
      padding: 16px;
      scrollbar-color: rgba(196, 209, 223, 0.55) transparent;
      scrollbar-width: thin;
      overscroll-behavior: contain;
    }

    .vs-story {
      position: fixed;
      inset: auto auto 42px 14px;
      width: min(420px, calc(100vw - 28px));
      margin: 0;
      border-radius: 16px;
      padding: 18px;
      color: var(--vs-text);
    }

    .vs-story::backdrop {
      background: transparent;
    }

    .vs-open-story {
      position: absolute;
      left: 14px;
      bottom: 42px;
      display: none;
      border-radius: 999px;
      padding: 10px 14px;
      color: var(--vs-text);
      font-weight: 750;
    }

    .vs-open-story.is-visible {
      display: inline-flex;
    }

    .vs-eyebrow {
      margin: 0 0 5px;
      color: var(--vs-accent-strong);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .vs-title {
      margin: 0;
      max-width: 30ch;
      font-size: clamp(18px, 2.2vw, 25px);
      line-height: 1.12;
      letter-spacing: -0.02em;
    }

    .vs-language {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 10px;
      font-size: 12px;
      font-weight: 750;
    }

    .vs-language select {
      min-height: 44px;
      border: 1px solid rgba(180, 203, 226, 0.42);
      border-radius: 9px;
      padding: 7px 32px 7px 10px;
      background: #152134;
      color: var(--vs-text);
      font: inherit;
    }

    .vs-lede,
    .vs-copy {
      margin: 8px 0 0;
      color: var(--vs-muted);
      font-size: 13px;
    }

    .vs-story-title {
      margin: 2px 36px 4px 0;
      font-size: 19px;
      line-height: 1.2;
    }

    .vs-story-copy {
      min-height: 5.4em;
      margin: 8px 0 14px;
      color: var(--vs-muted);
      font-size: 13px;
    }

    .vs-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      font-size: 20px;
    }

    .vs-section {
      padding-top: 14px;
      margin-top: 14px;
      border-top: 1px solid rgba(180, 203, 226, 0.18);
    }

    .vs-section-title {
      margin: 0 0 9px;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .vs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .vs-button {
      min-height: 44px;
      border: 1px solid rgba(180, 203, 226, 0.34);
      border-radius: 10px;
      padding: 9px 11px;
      background: var(--vs-bg-soft);
      color: var(--vs-text);
      cursor: pointer;
      font: inherit;
      font-size: 12px;
      font-weight: 750;
      text-align: left;
    }

    .vs-button:hover:not(:disabled) {
      border-color: rgba(139, 229, 222, 0.76);
      background: rgba(37, 61, 76, 0.94);
    }

    .vs-button:focus-visible,
    .vs-link:focus-visible,
    .vs-summary:focus-visible,
    .vs-language select:focus-visible {
      outline: 3px solid #ffffff;
      outline-offset: 2px;
    }

    .vs-button[aria-pressed="true"] {
      border-color: var(--vs-accent);
      background: rgba(22, 94, 91, 0.62);
      color: #ffffff;
    }

    .vs-button:disabled,
    .vs-button[aria-disabled="true"] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .vs-story-actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
    }

    .vs-story-actions .vs-button {
      text-align: center;
    }

    .vs-status-list {
      display: grid;
      gap: 7px;
      margin: 0;
    }

    .vs-legend-list {
      display: grid;
      gap: 5px;
      margin: 0;
    }

    .vs-legend-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 9px;
      border-radius: 7px;
      background: rgba(21, 33, 52, 0.62);
      font-size: 12px;
    }

    .vs-legend-swatch {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .vs-legend-row dt {
      font-weight: 600;
      margin: 0;
    }

    .vs-status-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 10px;
      align-items: start;
      border-radius: 9px;
      padding: 8px 9px;
      background: rgba(21, 33, 52, 0.62);
      font-size: 12px;
    }

    .vs-status-row dt {
      font-weight: 700;
    }

    .vs-status-row dd {
      margin: 0;
      color: var(--vs-muted);
      text-align: right;
    }

    .vs-status-row dd[data-tone="ready"] {
      color: var(--vs-accent-strong);
    }

    .vs-status-row dd[data-tone="warning"] {
      color: var(--vs-warning);
    }

    .vs-status-row dd[data-tone="error"] {
      color: var(--vs-danger);
    }

    .vs-ask {
      margin: 10px 0 0;
      border: 1px solid rgba(255, 212, 121, 0.38);
      padding: 8px 10px;
      background: rgba(92, 63, 13, 0.34);
      color: #ffe5ac;
      font-size: 12px;
    }

    .vs-details {
      margin-top: 10px;
      border-radius: 10px;
      background: rgba(21, 33, 52, 0.58);
    }

    .vs-summary {
      min-height: 44px;
      padding: 11px;
      cursor: pointer;
      color: var(--vs-text);
      font-size: 12px;
      font-weight: 750;
    }

    .vs-details-body {
      padding: 0 11px 12px;
      color: var(--vs-muted);
      font-size: 12px;
    }

    .vs-details-body p {
      margin: 7px 0;
    }

    .vs-details-body ol {
      margin: 8px 0 0;
      padding-left: 20px;
    }

    .vs-details-body li + li {
      margin-top: 8px;
    }

    .vs-link {
      color: #a9e9ff;
      text-decoration-thickness: 1px;
      text-underline-offset: 3px;
    }

    .vs-progress {
      height: 3px;
      margin: 0 0 12px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(196, 209, 223, 0.2);
    }

    .vs-progress-bar {
      height: 100%;
      background: var(--vs-accent);
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 240ms ease;
    }

    .vs-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 760px) {
      .vs-panel {
        top: 8px;
        right: 8px;
        width: min(350px, calc(100vw - 16px));
        max-height: 52vh;
      }

      .vs-story {
        inset: auto 8px 38px 8px;
        width: auto;
      }

      .vs-open-story {
        left: 8px;
        bottom: 38px;
      }
    }

    @media (max-width: 480px) {
      .vs-panel,
      .vs-story {
        max-height: 40vh;
        overflow: auto;
      }

      .vs-grid {
        grid-template-columns: 1fr;
      }

      .vs-story-actions {
        grid-template-columns: 1fr 1fr;
      }

      .vs-story-copy {
        min-height: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .vs-progress-bar {
        transition: none;
      }
    }
  `;
  document.head.appendChild(style);

  const shell = document.createElement("div");
  shell.className = "vs-shell";
  shell.lang = locale;
  shell.innerHTML = `
    <main class="vs-panel" aria-labelledby="vs-title">
      <div class="vs-language">
        <label for="vs-language" data-i18n="languageLabel">${t("languageLabel")}</label>
        <select id="vs-language">
          <option value="en" selected>English</option>
          <option value="ja" lang="ja">日本語</option>
        </select>
      </div>
      <h1 class="vs-title" id="vs-title" data-i18n="title">${t("title")}</h1>
      <p class="vs-lede" data-i18n="lede">${t("lede")}</p>

      <section class="vs-section" aria-labelledby="vs-views-title">
        <h2 class="vs-section-title" id="vs-views-title" data-i18n="viewsTitle">${t("viewsTitle")}</h2>
        <div class="vs-grid" id="vs-view-controls">
          <button class="vs-button" type="button" data-view="regional" data-i18n="viewRegional">${t("viewRegional")}</button>
          <button class="vs-button" type="button" data-view="fuji" data-i18n="viewFuji">${t("viewFuji")}</button>
          <button class="vs-button" type="button" data-view="east" data-i18n="viewEast">${t("viewEast")}</button>
          <button class="vs-button" type="button" data-view="urban" data-i18n="viewUrban">${t("viewUrban")}</button>
        </div>
      </section>

      <section class="vs-section" aria-labelledby="vs-layers-title">
        <h2 class="vs-section-title" id="vs-layers-title" data-i18n="layersTitle">${t("layersTitle")}</h2>
        <div class="vs-grid" id="vs-layer-controls">
          <button class="vs-button" type="button" data-layer="buildings" aria-pressed="true" data-i18n="layerBuildings">
            ${t("layerBuildings")}
          </button>
          <button class="vs-button" type="button" data-layer="both" aria-pressed="false" aria-disabled="true" data-i18n="layerBoth">
            ${t("layerBoth")}
          </button>
          <button class="vs-button" type="button" data-layer="pointcloud" aria-pressed="false" aria-disabled="true" data-i18n="layerPointCloud">
            ${t("layerPointCloud")}
          </button>
          <button class="vs-button" id="vs-detail" type="button" aria-pressed="false" data-i18n="detailBalanced">
            ${t("detailBalanced")}
          </button>
        </div>
      </section>

      <section class="vs-section" aria-labelledby="vs-legend-title" id="vs-legend-section" style="display:none">
        <h2 class="vs-section-title" id="vs-legend-title">${lang === "ja" ? "点群分類凡例" : "LiDAR classification"}</h2>
        <dl class="vs-legend-list">
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#8B6914"></span><dt>${lang === "ja" ? "地表面" : "Ground"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#90EE90"></span><dt>${lang === "ja" ? "低植生" : "Low vegetation"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#228B22"></span><dt>${lang === "ja" ? "高植生・森林" : "High vegetation / forest"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#FF6B35"></span><dt>${lang === "ja" ? "建築物" : "Buildings"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#4FC3F7"></span><dt>${lang === "ja" ? "水域（安倍川）" : "Water (Abe River)"}</dt></div>
        </dl>
      </section>

      <section class="vs-section" aria-labelledby="vs-status-title">
        <h2 class="vs-section-title" id="vs-status-title" data-i18n="statusTitle">${t("statusTitle")}</h2>
        <dl class="vs-status-list">
          <div class="vs-status-row">
            <dt data-i18n="terrainLabel">${t("terrainLabel")}</dt>
            <dd id="vs-terrain-status" data-tone="${terrainTone}" data-status-key="${terrainStatusKey}">${t(terrainStatusKey)}</dd>
          </div>
          <div class="vs-status-row">
            <dt data-i18n="buildingsLabel">${t("buildingsLabel")}</dt>
            <dd id="vs-buildings-status" data-status-key="loading">${t("loading")}</dd>
          </div>
          <div class="vs-status-row">
            <dt data-i18n="lidarLabel">${t("lidarLabel")}</dt>
            <dd id="vs-point-status" data-tone="warning" data-status-key="${
              VIRTUAL_SHIZUOKA_ION_ASSET_ID ? "loading" : "assetRequired"
            }">${
              VIRTUAL_SHIZUOKA_ION_ASSET_ID ? t("loading") : t("assetRequired")
            }</dd>
          </div>
        </dl>
        <p class="vs-ask">
          <strong data-i18n="dataAnswerLabel">${t("dataAnswerLabel")}</strong>
          <span id="vs-data-answer" data-i18n="${
            VIRTUAL_SHIZUOKA_ION_ASSET_ID ? "dataAnswerLoading" : "dataAnswer"
          }">${
            VIRTUAL_SHIZUOKA_ION_ASSET_ID
              ? t("dataAnswerLoading")
              : t("dataAnswer")
          }</span>
        </p>
      </section>

      <details class="vs-details">
        <summary class="vs-summary" data-i18n="setupSummary">${t("setupSummary")}</summary>
        <div class="vs-details-body">
          <ol>
            <li>
              <strong data-i18n="recommendedLabel">${t("recommendedLabel")}</strong>
              <span data-i18n="recommended">${t("recommended")}</span>
            </li>
            <li>
              <strong data-i18n="selectionLabel">${t("selectionLabel")}</strong>
              <span data-i18n="selection">${t("selection")}</span>
            </li>
            <li>
              <strong data-i18n="workflowLabel">${t("workflowLabel")}</strong>
              <span data-i18n="workflow">${t("workflow")}</span>
            </li>
            <li>
              <strong data-i18n="licenseLabel">${t("licenseLabel")}</strong>
              <span data-i18n="license">${t("license")}</span>
            </li>
            <li>
              <strong data-i18n="atamiLabel">${t("atamiLabel")}</strong>
              <span data-i18n="atami">${t("atami")}</span>
            </li>
            <li>
              <strong data-i18n="contextLabel">${t("contextLabel")}</strong>
              <span data-i18n="context">${t("context")}</span>
            </li>
          </ol>
          <p>
            <a class="vs-link" href="${SOURCE_SEARCH_URL}" target="_blank" rel="noopener noreferrer">
              <span data-i18n="catalogLink">${t("catalogLink")}</span>
            </a>
            ·
            <a class="vs-link" href="${POINT_CLOUD_PACKAGE_URL}" target="_blank" rel="noopener noreferrer">
              <span data-i18n="packageLink">${t("packageLink")}</span>
            </a>
            ·
            <a class="vs-link" href="${LP_RESOURCE_URL}" target="_blank" rel="noopener noreferrer">
              <span data-i18n="resourceLink">${t("resourceLink")}</span>
            </a>
            ·
            <a class="vs-link" href="${POINT_CLOUD_API_URL}" target="_blank" rel="noopener noreferrer">
              <span data-i18n="apiLink">${t("apiLink")}</span>
            </a>
            ·
            <a class="vs-link" href="${ATAMI_PACKAGE_URL}" target="_blank" rel="noopener noreferrer">
              <span data-i18n="atamiLink">${t("atamiLink")}</span>
            </a>
          </p>
        </div>
      </details>
    </main>

    <section
      class="vs-story"
      id="vs-story"
      popover="manual"
      role="dialog"
      aria-labelledby="vs-story-title"
      aria-describedby="vs-story-copy"
    >
      <button class="vs-button vs-close" id="vs-close" type="button" aria-label="${t("closeTour")}" data-i18n-aria-label="closeTour">×</button>
      <p class="vs-eyebrow" id="vs-story-step"></p>
      <h2 class="vs-story-title" id="vs-story-title"></h2>
      <p class="vs-story-copy" id="vs-story-copy"></p>
      <div class="vs-progress" aria-hidden="true">
        <div class="vs-progress-bar" id="vs-progress"></div>
      </div>
      <div class="vs-story-actions">
        <button class="vs-button" id="vs-previous" type="button" data-i18n="previous">${t("previous")}</button>
        <button class="vs-button" id="vs-play" type="button">${t("pause")}</button>
        <button class="vs-button" id="vs-restart" type="button" data-i18n="restart">${t("restart")}</button>
        <button class="vs-button" id="vs-next" type="button" data-i18n="next">${t("next")}</button>
      </div>
    </section>

    <button class="vs-open-story" id="vs-open-story" type="button" data-i18n="openTour">${t("openTour")}</button>
    <div class="vs-sr-only" id="vs-announcer" aria-live="polite"></div>
  `;
  viewer.container.appendChild(shell);

  const storyElement = shell.querySelector("#vs-story");
  const openStoryButton = shell.querySelector("#vs-open-story");
  const playButton = shell.querySelector("#vs-play");
  const pointStatus = shell.querySelector("#vs-point-status");
  const buildingStatus = shell.querySelector("#vs-buildings-status");
  const announcer = shell.querySelector("#vs-announcer");
  const layerButtons = Array.from(
    shell.querySelectorAll("#vs-layer-controls [data-layer]"),
  );

  const VIEWS = {
    regional: {
      target: Cesium.Cartesian3.fromDegrees(138.55, 35.08, 2500),
      heading: Cesium.Math.toRadians(18),
      pitch: Cesium.Math.toRadians(-28),
      range: 118000,
    },
    fuji: {
      target: Cesium.Cartesian3.fromDegrees(138.7274, 35.3606, 3776),
      heading: Cesium.Math.toRadians(205),
      pitch: Cesium.Math.toRadians(-24),
      range: 42000,
    },
    east: {
      target: Cesium.Cartesian3.fromDegrees(138.75, 35.12, 900),
      heading: Cesium.Math.toRadians(32),
      pitch: Cesium.Math.toRadians(-27),
      range: 47000,
    },
    urban: {
      target: Cesium.Cartesian3.fromDegrees(138.3831, 34.9756, 80),
      heading: Cesium.Math.toRadians(188),
      pitch: Cesium.Math.toRadians(-24),
      range: 12500,
    },
  };

  const CHAPTERS = [
    {
      view: "regional",
      titleKey: "chapter1Title",
      copyKey: "chapter1Copy",
    },
    {
      view: "fuji",
      titleKey: "chapter2Title",
      copyKey: "chapter2Copy",
    },
    {
      view: "east",
      titleKey: "chapter3Title",
      copyKey: "chapter3Copy",
    },
    {
      view: "urban",
      titleKey: "chapter4Title",
      copyKey: "chapter4Copy",
    },
  ];

  const state = {
    buildings: null,
    pointCloud: null,
    layerMode: "buildings",
    detailed: false,
    chapterIndex: 0,
    playing: !prefersReducedMotion,
    storyOpen: true,
    timer: null,
  };

  function flyTo(viewName) {
    const view = VIEWS[viewName];
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(view.target, 0), {
      offset: new Cesium.HeadingPitchRange(
        view.heading,
        view.pitch,
        view.range,
      ),
      duration: cameraDuration,
    });
  }

  function announce(message) {
    announcer.textContent = "";
    window.setTimeout(() => {
      announcer.textContent = message;
    }, 20);
  }

  function setStatus(element, statusKey, tone, announcementKey) {
    element.dataset.statusKey = statusKey;
    element.textContent = t(statusKey);
    element.dataset.tone = tone;
    announce(t(announcementKey));
  }

  function setDataAnswer(answerKey) {
    const dataAnswer = shell.querySelector("#vs-data-answer");
    dataAnswer.dataset.i18n = answerKey;
    dataAnswer.textContent = t(answerKey);
  }

  function updateLayerButtons() {
    layerButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.layer === state.layerMode),
      );
    });
  }

  function applyLayerMode(mode) {
    if (mode !== "buildings" && !state.pointCloud) {
      announce(t("pointNeedsAsset"));
      return;
    }

    state.layerMode = mode;
    if (state.buildings) {
      state.buildings.show = mode !== "pointcloud";
    }
    if (state.pointCloud) {
      state.pointCloud.show = mode !== "buildings";
    }
    updateLayerButtons();
    scene.requestRender();
  }

  function updateDetail(shouldAnnounce = true) {
    const buildingError = state.detailed ? 8 : 16;
    const pointError = state.detailed ? 6 : 12;

    if (state.buildings) {
      state.buildings.maximumScreenSpaceError = buildingError;
    }
    if (state.pointCloud) {
      state.pointCloud.maximumScreenSpaceError = pointError;
    }

    const detailButton = shell.querySelector("#vs-detail");
    const detailKey = state.detailed ? "detailHigh" : "detailBalanced";
    detailButton.dataset.i18n = detailKey;
    detailButton.textContent = t(detailKey);
    detailButton.setAttribute("aria-pressed", String(state.detailed));
    if (shouldAnnounce) {
      announce(
        t(
          state.detailed
            ? "detailHighAnnouncement"
            : "detailBalancedAnnouncement",
        ),
      );
    }
    scene.requestRender();
  }

  function stopTimer() {
    if (state.timer !== null) {
      window.clearTimeout(state.timer);
      state.timer = null;
    }
  }

  function scheduleNextChapter() {
    stopTimer();
    if (!state.playing || !state.storyOpen) {
      return;
    }
    state.timer = window.setTimeout(() => {
      showChapter((state.chapterIndex + 1) % CHAPTERS.length);
    }, 9000);
  }

  function updatePlayButton() {
    playButton.textContent = t(state.playing ? "pause" : "resume");
    playButton.setAttribute("aria-pressed", String(state.playing));
  }

  function renderChapterText() {
    const chapter = CHAPTERS[state.chapterIndex];
    shell.querySelector("#vs-story-step").textContent = t(
      "chapterStep",
      state.chapterIndex + 1,
      CHAPTERS.length,
    );
    shell.querySelector("#vs-story-title").textContent = t(chapter.titleKey);
    shell.querySelector("#vs-story-copy").textContent = t(chapter.copyKey);
    shell.querySelector("#vs-progress").style.transform =
      `scaleX(${(state.chapterIndex + 1) / CHAPTERS.length})`;
  }

  function showChapter(index) {
    state.chapterIndex = (index + CHAPTERS.length) % CHAPTERS.length;
    const chapter = CHAPTERS[state.chapterIndex];

    renderChapterText();
    flyTo(chapter.view);
    announce(`${t(chapter.titleKey)}. ${t(chapter.copyKey)}`);
    scheduleNextChapter();
  }

  function setLocale(nextLocale) {
    locale = nextLocale;
    shell.lang = locale;
    shell.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    shell.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    shell.querySelectorAll("[data-status-key]").forEach((element) => {
      element.textContent = t(element.dataset.statusKey);
    });
    updatePlayButton();
    updateDetail(false);
    renderChapterText();
    announce(t("languageChanged"));
  }

  function setStoryOpen(open, focusControl) {
    state.storyOpen = open;
    if (open) {
      if (typeof storyElement.showPopover === "function") {
        if (!storyElement.matches(":popover-open")) {
          storyElement.showPopover();
        }
      } else {
        storyElement.hidden = false;
      }
      openStoryButton.classList.remove("is-visible");
      showChapter(state.chapterIndex);
      if (focusControl) {
        playButton.focus();
      }
    } else {
      stopTimer();
      if (
        typeof storyElement.hidePopover === "function" &&
        storyElement.matches(":popover-open")
      ) {
        storyElement.hidePopover();
      } else {
        storyElement.hidden = true;
      }
      openStoryButton.classList.add("is-visible");
      openStoryButton.focus();
    }
  }

  shell.querySelector("#vs-view-controls").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-view]");
    if (!button) {
      return;
    }
    state.playing = false;
    updatePlayButton();
    stopTimer();
    flyTo(button.dataset.view);
    announce(t("viewSelected", button.textContent.trim()));
  });

  shell.querySelector("#vs-layer-controls").addEventListener("click", (event) => {
    const layerButton = event.target.closest("button[data-layer]");
    if (layerButton) {
      applyLayerMode(layerButton.dataset.layer);
    }
  });

  shell.querySelector("#vs-detail").addEventListener("click", () => {
    state.detailed = !state.detailed;
    updateDetail();
  });

  shell.querySelector("#vs-previous").addEventListener("click", () => {
    showChapter(state.chapterIndex - 1);
  });

  shell.querySelector("#vs-next").addEventListener("click", () => {
    showChapter(state.chapterIndex + 1);
  });

  playButton.addEventListener("click", () => {
    state.playing = !state.playing;
    updatePlayButton();
    if (state.playing) {
      scheduleNextChapter();
    } else {
      stopTimer();
    }
    announce(t(state.playing ? "tourResumed" : "tourPaused"));
  });

  shell.querySelector("#vs-restart").addEventListener("click", () => {
    state.playing = !prefersReducedMotion;
    updatePlayButton();
    showChapter(0);
    announce(
      t(prefersReducedMotion ? "tourRestartedReduced" : "tourRestarted"),
    );
  });

  shell.querySelector("#vs-language").addEventListener("change", (event) => {
    setLocale(event.target.value);
  });

  storyElement.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showChapter(state.chapterIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showChapter(state.chapterIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showChapter(0);
    }
  });

  shell.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.storyOpen) {
      event.preventDefault();
      setStoryOpen(false, false);
    }
  });

  shell.querySelector("#vs-close").addEventListener("click", () => {
    setStoryOpen(false, false);
  });

  openStoryButton.addEventListener("click", () => {
    setStoryOpen(true, true);
  });

  async function loadBuildings() {
    try {
      const buildings = await Cesium.Cesium3DTileset.fromIonAssetId(
        JAPAN_BUILDINGS_ASSET_ID,
        {
          maximumScreenSpaceError: 16,
          cacheBytes: 512 * 1024 * 1024,
          maximumCacheOverflowBytes: 256 * 1024 * 1024,
          skipLevelOfDetail: false,
          dynamicScreenSpaceError: false,
          cullWithChildrenBounds: false,
          foveatedScreenSpaceError: false,
          preloadFlightDestinations: true,
        },
      );
      buildings.style = new Cesium.Cesium3DTileStyle({
        color: "color('#d8ccb8', 0.92)",
      });
      scene.primitives.add(buildings);
      state.buildings = buildings;
      buildings.tileLoad.addEventListener(() => scene.requestRender());
      buildings.tileUnload.addEventListener(() => scene.requestRender());
      buildings.loadProgress.addEventListener(() => scene.requestRender());
      setStatus(
        buildingStatus,
        "buildingsStreaming",
        "ready",
        "buildingsReady",
      );
      applyLayerMode(state.layerMode);
    } catch (error) {
      setStatus(
        buildingStatus,
        "buildingsUnavailable",
        "error",
        "buildingsError",
      );
    }
  }

  async function loadVirtualShizuokaPointCloud() {
    if (!VIRTUAL_SHIZUOKA_ION_ASSET_ID) {
      return;
    }

    try {
      const pointCloud = await Cesium.Cesium3DTileset.fromIonAssetId(
        VIRTUAL_SHIZUOKA_ION_ASSET_ID,
        {
          maximumScreenSpaceError: 12,
          cacheBytes: 256 * 1024 * 1024,
          maximumCacheOverflowBytes: 64 * 1024 * 1024,
          dynamicScreenSpaceError: true,
          dynamicScreenSpaceErrorDensity: 2.0e-4,
          dynamicScreenSpaceErrorFactor: 12,
          cullWithChildrenBounds: true,
        },
      );
      // Classification-based color styling matching LP LiDAR standard classes
      pointCloud.style = new Cesium.Cesium3DTileStyle({
        pointSize: 3,
        color: {
          conditions: [
            ["${Classification} === 2", "color('#8B6914')"],   // ground - brown
            ["${Classification} === 3", "color('#90EE90')"],   // low vegetation - light green
            ["${Classification} === 5", "color('#228B22')"],   // high vegetation - forest green
            ["${Classification} === 6", "color('#FF6B35')"],   // buildings - orange-red
            ["${Classification} === 9", "color('#4FC3F7')"],   // water - blue
            ["true", "color('#CCCCCC')"],                      // other - grey
          ],
        },
      });

      // After first tile loads, auto-correct height so points sit on terrain surface.
      // Synthetic LAS may have small geoid offset discrepancies vs Cesium World Terrain.
      pointCloud.allTilesLoaded.addEventListener(function onFirstLoad() {
        pointCloud.allTilesLoaded.removeEventListener(onFirstLoad);
        try {
          const bs = pointCloud.boundingSphere;
          const carto = Cesium.Cartographic.fromCartesian(bs.center);
          // Sample terrain height at the cloud center to compute delta
          Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [carto])
            .then(function (positions) {
              const terrainH = positions[0].height || 0;
              const cloudCenterH = carto.height;
              // If cloud center is below terrain, lift it up
              const delta = terrainH - cloudCenterH;
              if (delta > 5) {
                const surface = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, 0);
                const lifted  = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, delta);
                const translation = Cesium.Cartesian3.subtract(lifted, surface, new Cesium.Cartesian3());
                pointCloud.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
              }
            })
            .catch(function () { /* terrain sample failed — leave as-is */ });
        } catch (e) { /* ignore */ }
      });

      scene.primitives.add(pointCloud);
      state.pointCloud = pointCloud;
      layerButtons.forEach((button) => {
        button.removeAttribute("aria-disabled");
      });
      setStatus(
        pointStatus,
        "pointStreaming",
        "ready",
        "pointReady",
      );
      setDataAnswer("dataAnswerReady");
      // Show classification legend now that LiDAR is live
      const legendSection = shell.querySelector("#vs-legend-section");
      if (legendSection) legendSection.style.display = "";
    } catch (error) {
      setStatus(
        pointStatus,
        "pointUnavailable",
        "error",
        "pointError",
      );
      setDataAnswer("dataAnswerError");
    }
  }

  await Promise.allSettled([
    loadBuildings(),
    loadVirtualShizuokaPointCloud(),
  ]);

  updatePlayButton();
  updateLayerButtons();
  setStoryOpen(true, true);

  if (prefersReducedMotion) {
    announce(t("reducedMotion"));
  }
})();
