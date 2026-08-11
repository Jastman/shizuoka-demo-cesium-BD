/* global Cesium */
(async function () {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5OWYyMTY3OS05ZWEzLTRlN2MtYjhkMC03YWE0MmU4ZDZhODEiLCJpZCI6MjUzMzg1LCJzdWIiOiJDZXNpdW1CRCIsImlzcyI6Imh0dHBzOi8vYXBpLmNlc2l1bS5jb20iLCJhdWQiOiJWaXJ0dWFsIFNoaXpvdWthIERlbW9zIiwiaWF0IjoxNzg2Mzk5NjcyfQ.N5gdB7U145m_8SqF0QDcE73DtbZ2FHe3TtMU500BGhA";

  const JAPAN_TERRAIN_ASSET_ID = 2767062;
  const JAPAN_BUILDINGS_ASSET_ID = 2602291;

  // Replace with an ion asset tiled from one selected Virtual Shizuoka source.
  // Leave undefined rather than presenting unrelated point-cloud data as Virtual Shizuoka.
  const VIRTUAL_SHIZUOKA_ION_ASSET_ID = 5124359;

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
      title: "Shizuoka Prefecture — from peak to floodplain",
      lede:
        "Explore Shizuoka's geography through Virtual Shizuoka's airborne LiDAR survey: from Mt. Fuji's forested flanks to the Abe River delta and Suruga Bay.",
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
      chapter1Title: "Shizuoka: where mountains meet the sea",
      chapter1Copy:
        "Mt. Fuji anchors the northern skyline. Its flanks drain southwest into the Abe River valley, which fans out across a coastal plain before meeting Suruga Bay — one of Japan's deepest bays. This geography shapes everything: the city grew on alluvial floodplain, bounded by steep volcanic ridges and an active coastline.",
      chapter2Title: "A city of 700,000 built on a delta",
      chapter2Copy:
        "Shizuoka city spreads across the Abe River delta. Look closely: the dense urban grid meets abrupt terrain transitions — hills, river channels, reclaimed coast. Virtual Shizuoka's airborne LiDAR captures all of it at survey precision, resolving roof heights, tree canopy, and ground surface simultaneously.",
      chapter3Title: "Classified point cloud: reading the city layer by layer",
      chapter3Copy:
        "The LiDAR survey classifies every return: ground (tan), low vegetation (lime), high vegetation (green), buildings (orange), and water (blue). Toggle 'LiDAR only' to strip the city to its bare terrain, or 'LiDAR + buildings' to compare measured canopy against modeled building footprints.",
      chapter4Title: "The Fuji corridor: from peak to floodplain",
      chapter4Copy:
        "Pan north and the LiDAR narrative extends toward the foothills of Fuji-san. The same dataset that shows Shizuoka's urban blocks resolves forested ridges and terraced tea plantations — a continuous digital twin from stratovolcano to shoreline.",
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
      title: "静岡県：山頂から沖積平野へ",
      lede:
        "VIRTUAL SHIZUOKAの航空LiDAR測量で静岡の地理を探索します。富士山の森林斜面から安倍川デルタ、駿河湾まで。",
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
      chapter1Title: "静岡：山と海が出会う場所",
      chapter1Copy:
        "富士山が北の空を占め、その山腹から安倍川が南西に向かって流れ、海岸平野へと広がり、駿河湾に注ぎます。駿河湾は日本最深の湾のひとつです。この地形が静岡のすべてを形づくっています。市街地は沖積三角州の上に発達し、急峻な火山性の尾根と活発な海岸線に囲まれています。",
      chapter2Title: "沖積デルタに広がる70万人の都市",
      chapter2Copy:
        "静岡市は安倍川デルタに広がっています。密集した市街地が急峻な地形変化と接していることに注目してください。丘陵、河川、埋め立て地が入り組んでいます。VIRTUAL SHIZUOKAの航空LiDARはすべてをサーベイ精度で捉え、屋根の高さ、樹冠、地表面を同時に記録しています。",
      chapter3Title: "分類済み点群：レイヤーで読む都市",
      chapter3Copy:
        "LiDAR測量はすべての反射を分類します。地盤（タン）、低植生（黄緑）、高植生（緑）、建物（オレンジ）、水面（青）。レイヤーを切り替えて、地形だけに絞った都市の姿や、樹木の樹冠とモデル化された建物フットプリントを比較してください。",
      chapter4Title: "富士山回廊：山頂から沖積平野へ",
      chapter4Copy:
        "北に視点を移すと、LiDARのデータは富士山麓まで続きます。静岡の市街地ブロックを捉えたのと同じデータが、内陸の森林尾根や茶畑の段々畑まで解像します。成層火山から海岸線まで続く、途切れのないデジタルツインです。",
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

  // Hillshade layer — added on top of OSM, toggled for terrain-contrast chapters
  const hillshadeLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}",
      credit: "Esri, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen and the GIS User Community",
      maximumLevel: 15,
    })
  );
  hillshadeLayer.alpha = 0.0; // hidden by default; shown for terrain-contrast chapters

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
    .vs-story {
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
      left: 14px;
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
      /* Bottom-center, above Cesium toolbar */
      inset: auto 0 52px 0;
      width: min(560px, calc(100vw - 32px));
      margin: 0 auto;
      border-radius: 20px;
      padding: 20px 22px 18px;
      color: var(--vs-text);
    }

    .vs-story::backdrop {
      background: transparent;
    }

    .vs-open-story {
      display: none;
    }

    /* Tour CTA — vivid blue, sits between lede and controls */
    .vs-tour-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      margin: 12px 0 0;
      padding: 13px 16px;
      border-radius: 12px;
      background: linear-gradient(135deg, #2196f3 0%, #1565c0 100%);
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.02em;
      text-align: center;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 18px rgba(33, 150, 243, 0.45);
      transition: filter 120ms, transform 80ms, box-shadow 120ms;
    }

    .vs-tour-cta::before {
      content: "▶";
      font-size: 11px;
    }

    .vs-tour-cta:hover {
      filter: brightness(1.15);
      box-shadow: 0 6px 24px rgba(33, 150, 243, 0.6);
    }
    .vs-tour-cta:active { transform: scale(0.97); }
    .vs-tour-cta:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }
    .vs-tour-cta.is-hidden { display: none; }

    /* Story header row: step counter + countdown ring side by side */
    .vs-story-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 6px;
    }

    /* Countdown ring */
    .vs-countdown {
      position: relative;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
    }

    .vs-countdown svg {
      position: absolute;
      inset: 0;
      transform: rotate(-90deg);
    }

    .vs-countdown-track {
      fill: none;
      stroke: rgba(196, 209, 223, 0.18);
      stroke-width: 3.5;
    }

    .vs-countdown-arc {
      fill: none;
      stroke: var(--vs-accent);
      stroke-width: 3.5;
      stroke-linecap: round;
      /* circumference = 2π × 17 ≈ 106.8 */
      stroke-dasharray: 106.8;
      stroke-dashoffset: 0;
      transition: stroke-dashoffset 1000ms linear;
    }

    .vs-countdown-num {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: var(--vs-accent-strong);
      font-variant-numeric: tabular-nums;
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
      margin: 0 0 6px;
      font-size: 20px;
      line-height: 1.2;
      font-weight: 800;
    }

    .vs-story-copy {
      margin: 0 0 14px;
      color: var(--vs-muted);
      font-size: 13.5px;
      line-height: 1.55;
    }

    .vs-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 18px;
      opacity: 0.7;
    }

    .vs-close:hover { opacity: 1; }

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
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .vs-story-actions .vs-button {
      text-align: center;
      flex: 1;
    }

    .vs-story-dots {
      display: flex;
      gap: 5px;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .vs-story-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(196, 209, 223, 0.35);
      transition: background 200ms, transform 200ms;
    }

    .vs-story-dot.is-active {
      background: var(--vs-accent);
      transform: scale(1.4);
    }

    .vs-story-dot.is-done {
      background: rgba(84, 210, 199, 0.45);
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
        left: 8px;
        width: min(350px, calc(100vw - 16px));
        max-height: 52vh;
      }

      .vs-story {
        inset: auto 8px 38px 8px;
        width: auto;
        border-radius: 16px;
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
      <button class="vs-tour-cta" id="vs-open-story" type="button" data-i18n="openTour">${t("openTour")}</button>

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
        <h2 class="vs-section-title" id="vs-legend-title">${locale === "ja" ? "点群分類凡例" : "LiDAR classification"}</h2>
        <dl class="vs-legend-list">
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#8B6914"></span><dt>${locale === "ja" ? "地表面" : "Ground"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#90EE90"></span><dt>${locale === "ja" ? "低植生" : "Low vegetation"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#228B22"></span><dt>${locale === "ja" ? "高植生・森林" : "High vegetation / forest"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#FF6B35"></span><dt>${locale === "ja" ? "建築物" : "Buildings"}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#4FC3F7"></span><dt>${locale === "ja" ? "水域（安倍川）" : "Water (Abe River)"}</dt></div>
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

      <div class="vs-story-header">
        <p class="vs-eyebrow" id="vs-story-step"></p>
        <div class="vs-countdown" aria-hidden="true">
          <svg viewBox="0 0 38 38" width="42" height="42">
            <circle class="vs-countdown-track" cx="19" cy="19" r="17"/>
            <circle class="vs-countdown-arc" id="vs-countdown-arc" cx="19" cy="19" r="17"/>
          </svg>
          <span class="vs-countdown-num" id="vs-countdown-num">30</span>
        </div>
      </div>

      <h2 class="vs-story-title" id="vs-story-title"></h2>
      <p class="vs-story-copy" id="vs-story-copy"></p>

      <div class="vs-progress" aria-hidden="true">
        <div class="vs-progress-bar" id="vs-progress"></div>
      </div>

      <div class="vs-story-actions">
        <button class="vs-button" id="vs-previous" type="button" data-i18n="previous">${t("previous")}</button>
        <div class="vs-story-dots" id="vs-story-dots" aria-hidden="true"></div>
        <button class="vs-button" id="vs-play" type="button">${t("pause")}</button>
        <button class="vs-button" id="vs-next" type="button" data-i18n="next">${t("next")}</button>
      </div>
    </section>

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
      view: "urban",
      titleKey: "chapter2Title",
      copyKey: "chapter2Copy",
    },
    {
      view: "urban",
      titleKey: "chapter3Title",
      copyKey: "chapter3Copy",
    },
    {
      view: "fuji",
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
    playing: false,
    storyOpen: false,
    timer: null,
    countdownInterval: null,
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

  const CHAPTER_DURATION_MS = 30000;
  const COUNTDOWN_CIRCUMFERENCE = 2 * Math.PI * 17; // ≈ 106.8

  function stopTimer() {
    if (state.timer !== null) {
      window.clearTimeout(state.timer);
      state.timer = null;
    }
    if (state.countdownInterval !== null) {
      window.clearInterval(state.countdownInterval);
      state.countdownInterval = null;
    }
  }

  function startCountdown() {
    stopTimer();
    if (!state.playing || !state.storyOpen) return;

    const arc = shell.querySelector("#vs-countdown-arc");
    const num = shell.querySelector("#vs-countdown-num");
    let secondsLeft = CHAPTER_DURATION_MS / 1000;

    function tick() {
      if (num) num.textContent = String(secondsLeft);
      if (arc) {
        const fraction = secondsLeft / (CHAPTER_DURATION_MS / 1000);
        arc.style.strokeDashoffset = String(COUNTDOWN_CIRCUMFERENCE * (1 - fraction));
      }
      secondsLeft--;
    }
    tick();
    state.countdownInterval = window.setInterval(tick, 1000);

    state.timer = window.setTimeout(() => {
      window.clearInterval(state.countdownInterval);
      state.countdownInterval = null;
      showChapter((state.chapterIndex + 1) % CHAPTERS.length);
    }, CHAPTER_DURATION_MS);
  }

  function resetCountdownDisplay() {
    const arc = shell.querySelector("#vs-countdown-arc");
    const num = shell.querySelector("#vs-countdown-num");
    if (num) num.textContent = "30";
    if (arc) arc.style.strokeDashoffset = "0";
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
    // Render chapter dots
    const dotsEl = shell.querySelector("#vs-story-dots");
    if (dotsEl) {
      dotsEl.innerHTML = CHAPTERS.map((_, i) => {
        const cls = i < state.chapterIndex ? "is-done" : i === state.chapterIndex ? "is-active" : "";
        return `<div class="vs-story-dot ${cls}"></div>`;
      }).join("");
    }
  }

  function showChapter(index) {
    state.chapterIndex = (index + CHAPTERS.length) % CHAPTERS.length;
    const chapter = CHAPTERS[state.chapterIndex];

    // Chapter 2 (index 1): terrain-contrast view — enable hillshade to show delta boundary
    hillshadeLayer.alpha = state.chapterIndex === 1 ? 0.55 : 0.0;
    scene.requestRender();

    resetCountdownDisplay();
    renderChapterText();
    flyTo(chapter.view);
    announce(`${t(chapter.titleKey)}. ${t(chapter.copyKey)}`);
    startCountdown();
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
    const tourCta = shell.querySelector("#vs-open-story");
    if (open) {
      if (typeof storyElement.showPopover === "function") {
        if (!storyElement.matches(":popover-open")) {
          storyElement.showPopover();
        }
      } else {
        storyElement.hidden = false;
      }
      if (tourCta) tourCta.classList.add("is-hidden");
      // Auto-play when opened (user intent to start tour)
      state.playing = true;
      updatePlayButton();
      showChapter(state.chapterIndex);
      if (focusControl) {
        playButton.focus();
      }
    } else {
      stopTimer();
      resetCountdownDisplay();
      state.playing = false;
      updatePlayButton();
      if (
        typeof storyElement.hidePopover === "function" &&
        storyElement.matches(":popover-open")
      ) {
        storyElement.hidePopover();
      } else {
        storyElement.hidden = true;
      }
      if (tourCta) tourCta.classList.remove("is-hidden");
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
    stopTimer();
    resetCountdownDisplay();
    showChapter(state.chapterIndex - 1);
  });

  shell.querySelector("#vs-next").addEventListener("click", () => {
    stopTimer();
    resetCountdownDisplay();
    showChapter(state.chapterIndex + 1);
  });

  playButton.addEventListener("click", () => {
    state.playing = !state.playing;
    updatePlayButton();
    if (state.playing) {
      startCountdown();
    } else {
      stopTimer();
      resetCountdownDisplay();
    }
    announce(t(state.playing ? "tourResumed" : "tourPaused"));
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
            ["${Classification} === 4", "color('#5ab552')"],   // medium vegetation - mid green
            ["${Classification} === 5", "color('#228B22')"],   // high vegetation / forest - dark green
            ["${Classification} === 6", "color('#FF6B35')"],   // buildings - orange-red
            ["${Classification} === 9", "color('#4FC3F7')"],   // water - blue
            ["true", "color('#a08c6e')"],                      // unclassified - warm tan (not grey)
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

  // Add Mt. Fuji summit label
  viewer.entities.add({
    name: "Mt. Fuji",
    position: Cesium.Cartesian3.fromDegrees(138.7274, 35.3606, 3776),
    label: {
      text: "富士山  Mt. Fuji\n3,776 m",
      font: "bold 16px ui-sans-serif, system-ui, sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString("#1a2540"),
      outlineWidth: 4,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -14),
      heightReference: Cesium.HeightReference.NONE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      // Visible and prominent at all zoom levels from 5km to 500km
      scaleByDistance: new Cesium.NearFarScalar(5000, 1.6, 500000, 0.7),
      translucencyByDistance: new Cesium.NearFarScalar(5000, 1.0, 800000, 0.4),
    },
    point: {
      pixelSize: 10,
      color: Cesium.Color.fromCssColorString("#e74c3c"),
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2.5,
      heightReference: Cesium.HeightReference.NONE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      scaleByDistance: new Cesium.NearFarScalar(5000, 1.6, 500000, 0.8),
    },
  });

  updatePlayButton();
  updateLayerButtons();
  // Tour is user-initiated — fly to regional overview on load
  flyTo("regional");
  state.storyOpen = false;

  if (prefersReducedMotion) {
    announce(t("reducedMotion"));
  }
})();
