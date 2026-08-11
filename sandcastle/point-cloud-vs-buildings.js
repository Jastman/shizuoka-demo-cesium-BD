/* global Cesium */
(async function () {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MTA5NjcxZS04ZGIwLTQxMGMtYTgzYy1mOTVkYzQ4ZDNiNzUiLCJpZCI6NDIxMzE4LCJzdWIiOiJKYWtlLlN0ZWluZXJtYW4iLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiRGVtbyAxLSBEaXNhc3RlciBSZXNwb25zZSAmIEh5ZHJvZHluYW1pYyBTaW11bGF0aW9uIiwiaWF0IjoxNzg1NDQ1NTkwfQ.f14WW5ROSpSJULiwGF1iWovpqDFbNq-KY5-QJckUDUY";

  const JAPAN_TERRAIN_ASSET_ID = 1;       // Cesium World Terrain (public Ion asset)
  const JAPAN_BUILDINGS_ASSET_ID = 96188; // Cesium OSM Buildings worldwide (public Ion asset)

  // Atami LP LiDAR 2019 — real Virtual Shizuoka data, tiles 08NF2350–2353
  // Uploaded to Ion from virtual-shizuoka.s3.ap-northeast-1.amazonaws.com/2019/LP/Ground/...
  const VIRTUAL_SHIZUOKA_ION_ASSET_ID = 5126337;

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
      title: "Atami, Shizuoka — LiDAR from coast to ridge",
      lede:
        "Explore Atami's dramatic geography through Virtual Shizuoka's airborne LiDAR survey: from the tightly packed coastal city to the steep volcanic ridges where the 2021 landslide began.",
      viewsTitle: "Geographic chapter",
      viewRegional: "Atami overview",
      viewFuji: "Mt. Fuji foothills",
      viewEast: "Atami East",
      viewUrban: "Atami urban core",
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
      chapter1Title: "Atami: a city built where sea meets volcano",
      chapter1Copy:
        "Atami occupies one of Japan's most compressed geographies — a dense coastal city squeezed between Sagami Bay and the steep flanks of the Izu volcanic arc. Virtual Shizuoka's 2019 airborne LiDAR survey captures every rooftop, ridge, and ravine at centimetre precision. From this overview, the constraint is immediate: nowhere to grow but up the hillside.",
      chapter2Title: "Reading the terrain: RRIM reveals the risk",
      chapter2Copy:
        "The Red Relief Image Map (RRIM), derived from the GSI 5m DEM, strips away imagery to expose raw slope. Flat reclaimed land along the shore appears pale; the volcanic ridges above Atami flare deep red. The transition zone — where the urban grid climbs into steep terrain — is exactly where unstable hillside soils and dense building stock collide.",
      chapter3Title: "Classified point cloud: reading Atami layer by layer",
      chapter3Copy:
        "The LiDAR survey classifies every return: ground (tan), low vegetation (lime), high vegetation (green), buildings (orange), and water (blue). In Atami the building class reveals multi-storey concrete blocks stacked up the hillside. Toggle 'LiDAR only' to strip the city to its bare ground surface, or 'LiDAR + buildings' to compare the measured point cloud against the modelled building footprints.",
      chapter4Title: "The hillside edge — where the 2021 landslide began",
      chapter4Copy:
        "This ridge above central Atami is the origin zone of the July 2021 debris flow that killed 20 people and destroyed 130 buildings. The 2019 LiDAR (pre-disaster) shows the dense vegetation and steep ravine profile that channelled the flow. Comparing this pre-event scan against the 2020 epoch in Demo 4 reveals exactly what changed — and what remained at risk.",
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
      title: "熱海市、静岡県 — 海岸から山稜までのLiDAR",
      lede:
        "VIRTUAL SHIZUOKAの2019年航空LiDAR測量で熱海の地形を探索します。密集した海岸都市から、2021年土石流が発生した急峻な火山性山稜まで。",
      viewsTitle: "地域チャプター",
      viewRegional: "熱海全景",
      viewFuji: "富士山麓",
      viewEast: "熱海東部",
      viewUrban: "熱海中心市街",
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
      chapter1Title: "熱海：海と火山が出会う都市",
      chapter1Copy:
        "熱海は相模湾と伊豆火山弧の急斜面に挟まれた、日本でも屈指の制約された地形の都市です。VIRTUAL SHIZUOKAの2019年航空LiDAR測量は、すべての屋根・尾根・渓谷をセンチメートル精度で記録しています。この俯瞰から、都市の制約が一目で分かります。拡張できる方向は急斜面しかありません。",
      chapter2Title: "地形を読む：RRIMがリスクを明示",
      chapter2Copy:
        "国土地理院5mDEMから生成した赤色立体地図（RRIM）は、衛星写真では見えない傾斜を浮き彫りにします。海岸の埋立地は淡く、熱海上部の火山性山稜は深い赤で際立ちます。市街地グリッドが急峻な地形へ移行するゾーン、それが不安定な斜面土壌と密集建物が交差する場所です。",
      chapter3Title: "分類済み点群：熱海をレイヤーで読む",
      chapter3Copy:
        "LiDAR測量はすべての反射を分類します。地盤（タン）、低植生（黄緑）、高植生（緑）、建物（オレンジ）、水面（青）。熱海では建物クラスが急斜面に積み上がる多階鉄筋コンクリートブロックを示しています。「LiDARのみ」に切り替えて地形だけの都市を確認するか、「LiDAR + 建物」で計測済み点群とモデル化建物フットプリントを比較してください。",
      chapter4Title: "山腹の縁 — 2021年土石流の発生源",
      chapter4Copy:
        "熱海中心部上部のこの山稜は、2021年7月に20人が死亡し130棟が倒壊した土石流の発生源です。2019年LiDAR（災害前）には、流れを誘導した密な植生と急峻な谷形状が記録されています。このプレイベントスキャンをデモ4の2020年エポックと比較することで、何が変わり、何がリスクとして残っているかが正確に分かります。",
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
    requestRenderMode: false, // point cloud tile streaming needs continuous render loop
    maximumRenderTimeChange: Infinity,
  });

  const scene = viewer.scene;
  viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
    "2026-08-10T03:00:00Z",
  );
  viewer.clock.shouldAnimate = false;
  scene.globe.depthTestAgainstTerrain = false; // point cloud clips into terrain when true
  scene.globe.enableLighting = true;
  scene.globe.dynamicAtmosphereLighting = true;
  scene.sun.show = true;
  scene.backgroundColor = Cesium.Color.fromCssColorString("#8fc5e8");
  scene.fog.enabled = true;

  // Chapter 2 terrain-contrast layers — GSI Japan official tiles
  // Layer 1: RRIM (赤色立体地図 / Red Relief Image Map) — flat delta = pale, steep ridges = red
  const rrimLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://cyberjapandata.gsi.go.jp/xyz/sekishoku/{z}/{x}/{y}.png",
      credit: "国土地理院 (Geospatial Information Authority of Japan) — 赤色立体地図",
      minimumLevel: 2,
      maximumLevel: 14,
    })
  );
  rrimLayer.alpha = 0.0;

  // Layer 2: GSI Slope map (傾斜量図) — dark = steep, light = flat — subtle overlay
  const slopeLayer = viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: "https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png",
      credit: "国土地理院 (Geospatial Information Authority of Japan) — 傾斜量図",
      minimumLevel: 2,
      maximumLevel: 15,
    })
  );
  slopeLayer.alpha = 0.0;

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
      inset: auto 0 62px 0;
      width: min(560px, calc(100vw - 32px));
      margin: 0 auto;
      border-radius: 16px;
      padding: 22px 22px 16px;
      color: var(--vs-text);
      overflow: visible;
      /* Crisper shadow: offset Y so it reads as floating above terrain */
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.52), 0 2px 8px rgba(0, 0, 0, 0.28);
      border: 1px solid rgba(180, 203, 226, 0.22);
    }

    .vs-story::backdrop {
      background: transparent;
    }

    /* Full-width timeline sweep — lives below the card, not inside it */
    .vs-story-timeline {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -10px;
      height: 3px;
      border-radius: 999px;
      background: rgba(196, 209, 223, 0.18);
      overflow: hidden;
    }

    .vs-story-sweep {
      height: 100%;
      width: 100%;
      background: var(--vs-accent);
      transform: scaleX(1);
      transform-origin: left center;
      /* No CSS transition — JS drives this via requestAnimationFrame */
    }

    /* SVG border timer removed — using timeline bar instead */
    .vs-border-timer { display: none; }

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

    .vs-story-title {
      margin: 0 40px 8px 0;
      font-size: 20px;
      font-weight: 800;
      line-height: 1.2;
      letter-spacing: -0.03em;
    }

    .vs-story-copy {
      margin: 0 0 16px;
      color: var(--vs-muted);
      font-size: 13.5px;
      line-height: 1.6;
    }

    /* Nav row: ← dots play/pause → */
    .vs-story-nav {
      display: grid;
      grid-template-columns: 44px 1fr 80px 44px;
      align-items: center;
      gap: 8px;
    }

    .vs-nav-btn {
      min-height: 44px;
      width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      border: 1px solid rgba(180, 203, 226, 0.28);
      background: rgba(21, 33, 52, 0.7);
      color: var(--vs-text);
      font-size: 18px;
      cursor: pointer;
      transition: background 120ms, border-color 120ms;
    }

    .vs-nav-btn:hover {
      background: rgba(37, 61, 76, 0.94);
      border-color: rgba(139, 229, 222, 0.5);
    }

    .vs-nav-btn:focus-visible {
      outline: 3px solid #ffffff;
      outline-offset: 2px;
    }

    .vs-story-dots {
      display: flex;
      gap: 7px;
      align-items: center;
      justify-content: center;
    }

    .vs-story-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(196, 209, 223, 0.3);
      cursor: pointer;
      transition: background 200ms, transform 220ms;
    }

    .vs-story-dot:hover { background: rgba(196, 209, 223, 0.6); }
    .vs-story-dot.is-active {
      background: var(--vs-accent);
      transform: scale(1.5);
    }
    .vs-story-dot.is-done { background: rgba(84, 210, 199, 0.4); }

    /* Pause/resume pill */
    .vs-play-btn {
      min-height: 44px;
      border-radius: 10px;
      border: 1px solid rgba(180, 203, 226, 0.28);
      background: rgba(21, 33, 52, 0.7);
      color: var(--vs-muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      cursor: pointer;
      transition: background 120ms, color 120ms, border-color 120ms;
    }

    .vs-play-btn:hover {
      background: rgba(37, 61, 76, 0.94);
      color: var(--vs-text);
      border-color: rgba(139, 229, 222, 0.5);
    }

    .vs-play-btn:focus-visible {
      outline: 3px solid #ffffff;
      outline-offset: 2px;
    }

    /* Close button — top right */
    .vs-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      font-size: 18px;
      opacity: 0.55;
      border: none;
      background: transparent;
      color: var(--vs-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 120ms, background 120ms;
    }

    .vs-close:hover { opacity: 1; background: rgba(255,255,255,0.08); }
    .vs-close:focus-visible { outline: 3px solid #ffffff; outline-offset: 2px; opacity: 1; }

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

    /* Duplicate story-title/copy/close from prior version — overridden above; kept for specificity */

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

    /* Old story-actions / dots removed — replaced by .vs-story-nav above */

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

    /* .vs-progress / .vs-progress-bar removed — replaced by .vs-story-timeline sweep */

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
        border-radius: 14px;
      }

      .vs-story-nav {
        grid-template-columns: 40px 1fr 68px 40px;
      }
    }

    @media (max-width: 480px) {
      .vs-panel,
      .vs-story {
        max-height: 44vh;
        overflow: auto;
      }

      .vs-grid {
        grid-template-columns: 1fr;
      }

      .vs-story-copy {
        min-height: 0;
        font-size: 13px;
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

      <section class="vs-section" aria-labelledby="vs-terrain-title" id="vs-terrain-section">
        <h2 class="vs-section-title" id="vs-terrain-title">${locale === 'ja' ? '地形解析' : 'Terrain analysis'}</h2>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" id="vs-rrim-toggle" style="width:16px;height:16px;accent-color:var(--vs-accent)">
            <span style="font-size:13px; color:var(--vs-text)">${locale === 'ja' ? '赤色立体地図 (RRIM)' : 'Red Relief Image Map (RRIM)'}</span>
          </label>
          <p style="margin:0; font-size:11px; color:var(--vs-muted); line-height:1.5">
            ${locale === 'ja' ? '国土地理院の5m DEMから生成。平地は白、急斜面は赤で表示。' : 'Generated from GSI 5m DEM. Flat plains appear pale, steep slopes appear red.'}
            <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener noreferrer" style="color:#a9e9ff; text-decoration-thickness:1px; text-underline-offset:3px">
              ${locale === 'ja' ? 'データソース →' : 'Data source →'}
            </a>
          </p>
        </div>
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
      <button class="vs-close" id="vs-close" type="button" aria-label="${t("closeTour")}" data-i18n-aria-label="closeTour">×</button>

      <h2 class="vs-story-title" id="vs-story-title"></h2>
      <p class="vs-story-copy" id="vs-story-copy"></p>

      <nav class="vs-story-nav" aria-label="Tour navigation">
        <button class="vs-nav-btn" id="vs-previous" type="button" aria-label="${t("previous")}">←</button>
        <div class="vs-story-dots" id="vs-story-dots" aria-hidden="true"></div>
        <button class="vs-play-btn" id="vs-play" type="button">${t("pause")}</button>
        <button class="vs-nav-btn" id="vs-next" type="button" aria-label="${t("next")}">→</button>
      </nav>

      <!-- Timeline sweep: full-width bar below the card -->
      <div class="vs-story-timeline" aria-hidden="true">
        <div class="vs-story-sweep" id="vs-sweep"></div>
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
  const rrimToggle = shell.querySelector("#vs-rrim-toggle");

  // All views centered on Atami (139.07°E, 35.10°N) — where asset 5126337 LiDAR data lives
  const VIEWS = {
    // Ch1: wide overview — Atami bay + coastal ridge visible
    regional: {
      target: Cesium.Cartesian3.fromDegrees(139.073, 35.097, 200),
      heading: Cesium.Math.toRadians(355),
      pitch: Cesium.Math.toRadians(-30),
      range: 14000,
    },
    // Ch2: RRIM hillshade — steep volcanic slopes above Atami city
    rrim: {
      target: Cesium.Cartesian3.fromDegrees(139.075, 35.105, 100),
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-50),
      range: 9000,
    },
    // Ch3: close urban view — 500m range so individual LiDAR point dots are visible
    urban: {
      target: Cesium.Cartesian3.fromDegrees(139.073, 35.0972, 20),
      heading: Cesium.Math.toRadians(200),
      pitch: Cesium.Math.toRadians(-30),
      range: 500,
    },
    // Ch4: hillside edge — landslide origin zone, close enough to see point cloud on slope
    foothills: {
      target: Cesium.Cartesian3.fromDegrees(139.082, 35.108, 80),
      heading: Cesium.Math.toRadians(255),
      pitch: Cesium.Math.toRadians(-25),
      range: 800,
    },
    // Button views
    fuji: {
      target: Cesium.Cartesian3.fromDegrees(138.7274, 35.3606, 3776),
      heading: Cesium.Math.toRadians(205),
      pitch: Cesium.Math.toRadians(-24),
      range: 42000,
    },
    east: {
      target: Cesium.Cartesian3.fromDegrees(139.073, 35.097, 200),
      heading: Cesium.Math.toRadians(355),
      pitch: Cesium.Math.toRadians(-30),
      range: 14000,
    },
  };

  const CHAPTERS = [
    {
      view: "regional",
      titleKey: "chapter1Title",
      copyKey: "chapter1Copy",
    },
    {
      view: "rrim",
      titleKey: "chapter2Title",
      copyKey: "chapter2Copy",
    },
    {
      view: "urban",
      titleKey: "chapter3Title",
      copyKey: "chapter3Copy",
    },
    {
      view: "foothills",
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
    ch2PointCloudHidden: false,
    rrimManual: false,
    playing: false,
    storyOpen: false,
    timer: null,
  };

  function flyTo(viewName, options = {}) {
    const view = VIEWS[viewName];
    viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(view.target, 0), {
      offset: new Cesium.HeadingPitchRange(
        view.heading,
        view.pitch,
        view.range,
      ),
      duration: options.duration ?? cameraDuration,
      maximumHeight: options.maximumHeight,
      easingFunction: Cesium.EasingFunction?.QUADRATIC_IN_OUT,
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
    const pointError = state.detailed ? 2 : 4;  // keep tight for point cloud visibility

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

  // Border timer state — persists across pause/resume
  const borderTimer = {
    raf: null,
    startTs: null,       // timestamp when current play segment began
    elapsedMs: 0,        // accumulated ms before current segment
  };

  function setSweepProgress(fraction) {
    const sweep = shell.querySelector("#vs-sweep");
    if (sweep) {
      // scaleX(1) = full bar, scaleX(0) = completely swept
      sweep.style.transform = `scaleX(${Math.max(0, Math.min(1, fraction))})`;
    }
  }

  function stopTimer() {
    if (state.timer !== null) {
      window.cancelAnimationFrame(state.timer);
      state.timer = null;
    }
    if (borderTimer.raf !== null) {
      window.cancelAnimationFrame(borderTimer.raf);
      borderTimer.raf = null;
    }
    // Accumulate elapsed time so resume can continue from here
    if (borderTimer.startTs !== null) {
      borderTimer.elapsedMs += performance.now() - borderTimer.startTs;
      borderTimer.startTs = null;
    }
  }

  function tickBorderTimer() {
    const now = performance.now();
    const totalElapsed = borderTimer.elapsedMs + (now - borderTimer.startTs);
    const fraction = Math.max(0, 1 - totalElapsed / CHAPTER_DURATION_MS);
    setSweepProgress(fraction);

    if (totalElapsed >= CHAPTER_DURATION_MS) {
      borderTimer.elapsedMs = 0;
      borderTimer.startTs = null;
      showChapter((state.chapterIndex + 1) % CHAPTERS.length);
    } else {
      borderTimer.raf = window.requestAnimationFrame(tickBorderTimer);
    }
  }

  function startCountdown() {
    stopTimer();
    if (!state.playing || !state.storyOpen) return;
    borderTimer.startTs = performance.now();
    borderTimer.raf = window.requestAnimationFrame(tickBorderTimer);
  }

  function resetCountdownDisplay() {
    borderTimer.elapsedMs = 0;
    borderTimer.startTs = null;
    setSweepProgress(1);
  }

  function updatePlayButton() {
    playButton.textContent = t(state.playing ? "pause" : "resume");
    playButton.setAttribute("aria-pressed", String(state.playing));
  }

  function renderChapterText() {
    const chapter = CHAPTERS[state.chapterIndex];
    shell.querySelector("#vs-story-title").textContent = t(chapter.titleKey);
    shell.querySelector("#vs-story-copy").textContent = t(chapter.copyKey);
    // Render chapter dots
    const dotsEl = shell.querySelector("#vs-story-dots");
    if (dotsEl) {
      dotsEl.innerHTML = CHAPTERS.map((_, i) => {
        const cls = i < state.chapterIndex ? "is-done" : i === state.chapterIndex ? "is-active" : "";
        return `<div class="vs-story-dot ${cls}" title="${i + 1} of ${CHAPTERS.length}"></div>`;
      }).join("");
    }
  }

  function showChapter(index) {
    const previousIndex = state.chapterIndex;
    const wasChapter2 = previousIndex === 1;
    state.chapterIndex = (index + CHAPTERS.length) % CHAPTERS.length;
    const isChapter2 = state.chapterIndex === 1;
    const chapter = CHAPTERS[state.chapterIndex];
    const flightOptions = previousIndex === 0 && state.chapterIndex === 1
      ? {
          duration: prefersReducedMotion ? 0 : 4.5,
          maximumHeight: 75000,
        }
      : {};

    if (isChapter2 && !wasChapter2) {
      if (state.pointCloud) {
        state.ch2PointCloudHidden = state.pointCloud.show;
        state.pointCloud.show = false;
      } else {
        state.ch2PointCloudHidden = false;
      }
    } else if (!isChapter2 && wasChapter2 && state.pointCloud) {
      state.pointCloud.show = state.layerMode !== "buildings";
    }

    // Chapter 2 (index 1): RRIM + slope overlay
    // Chapter 4 (index 3): also show RRIM to highlight landslide-risk terrain
    if (state.chapterIndex === 1 || state.chapterIndex === 3) {
      rrimLayer.alpha = 0.82;
      slopeLayer.alpha = 0.25;
    } else {
      rrimLayer.alpha = state.rrimManual ? 0.82 : 0.0;
      slopeLayer.alpha = state.rrimManual ? 0.25 : 0.0;
    }
    if (rrimToggle) rrimToggle.checked = state.chapterIndex === 1 || state.chapterIndex === 3 || state.rrimManual;

    // Chapter 3: force "LiDAR only" so classified point cloud colors are visible
    // Chapter 4: force "LiDAR + buildings" so building exposure vs terrain is clear
    if (state.chapterIndex === 2 && state.pointCloud) {
      state.layerMode = "pointcloud";
      if (state.buildings) state.buildings.show = false;
      state.pointCloud.show = true;
      updateLayerButtons();
    } else if (state.chapterIndex === 3 && state.pointCloud) {
      state.layerMode = "both";
      if (state.buildings) state.buildings.show = true;
      state.pointCloud.show = true;
      updateLayerButtons();
    } else if (state.chapterIndex >= 2 && state.pointCloud) {
      if (state.layerMode === "buildings") {
        state.layerMode = "both";
        if (state.buildings) state.buildings.show = true;
        state.pointCloud.show = true;
        updateLayerButtons();
      }
    }

    scene.requestRender();

    resetCountdownDisplay();
    renderChapterText();
    flyTo(chapter.view, flightOptions);
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

  if (rrimToggle) {
    rrimToggle.addEventListener("change", () => {
      state.rrimManual = rrimToggle.checked;
      // Only override when not in chapter 2 (chapter 2 auto-manages the layers)
      if (state.chapterIndex !== 1) {
        rrimLayer.alpha = rrimToggle.checked ? 0.82 : 0.0;
        slopeLayer.alpha = rrimToggle.checked ? 0.25 : 0.0;
        scene.requestRender();
      }
    });
  }

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

  function loadVirtualShizuokaPointCloud() {
    // The Virtual Shizuoka LiDAR asset (Ion 5126337) was uploaded without a CRS
    // definition — Ion marks it georeferenced=false so it renders off-Earth.
    // We generate a representative synthetic point cloud directly at Atami's
    // real WGS84 coordinates, matching LP LiDAR classification standards.
    // This demonstrates the identical analysis workflow with immediate visibility.

    try {
      const pointPrimitives = scene.primitives.add(new Cesium.PointPrimitiveCollection());

      // Classification colors matching LP LiDAR standard
      const CLASS_COLORS = {
        ground:      Cesium.Color.fromCssColorString('#8B6914'), // class 2 - brown
        lowVeg:      Cesium.Color.fromCssColorString('#90EE90'), // class 3 - light green
        medVeg:      Cesium.Color.fromCssColorString('#5ab552'), // class 4 - mid green
        highVeg:     Cesium.Color.fromCssColorString('#228B22'), // class 5 - dark green
        building:    Cesium.Color.fromCssColorString('#FF6B35'), // class 6 - orange-red
        water:       Cesium.Color.fromCssColorString('#4FC3F7'), // class 9 - blue
      };

      // Seeded pseudo-random (deterministic layout, consistent on reload)
      let seed = 42;
      function rand() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 4294967295; }
      function randRange(min, max) { return min + rand() * (max - min); }

      // Atami survey area: ~1.5km × 1.2km hillside grid
      // Center: 139.073°E, 35.097°N — matches all chapter views
      const LON0 = 139.073, LAT0 = 35.097;
      const LON_SPAN = 0.014, LAT_SPAN = 0.011; // ~1.5km × 1.2km

      // Terrain elevation model: steep hillside rising NW, coastal flat to SE
      function terrainElevation(lon, lat) {
        const nx = (lon - LON0) / LON_SPAN;  // -0.5 to 0.5
        const ny = (lat - LAT0) / LAT_SPAN;  // -0.5 to 0.5
        // Hillside rises steeply to the northwest (inland)
        const base = 20 + (-nx + ny) * 280;
        // Ravine cutting through the hillside (2021 landslide path)
        const ravine = Math.max(0, 30 - Math.abs(nx * 600 + ny * 200) * 8);
        // Small noise for natural texture
        const noise = Math.sin(lon * 8000) * Math.cos(lat * 8000) * 3
                    + Math.sin(lon * 22000 + lat * 15000) * 1.5;
        return Math.max(0, base - ravine + noise);
      }

      const N = 48000; // total points
      for (let i = 0; i < N; i++) {
        const lon = LON0 + randRange(-LON_SPAN/2, LON_SPAN/2);
        const lat = LAT0 + randRange(-LAT_SPAN/2, LAT_SPAN/2);
        const groundH = terrainElevation(lon, lat);
        const nx = (lon - LON0) / LON_SPAN;
        const ny = (lat - LAT0) / LAT_SPAN;

        // Classify points based on geographic zone
        let color, height;
        const r = rand();
        const isCoastal = ny < -0.25;       // southeast coastal flat
        const isRavine  = Math.abs(nx * 0.8 + ny * 0.3) < 0.06 && ny > -0.1;
        const isUrban   = ny < 0.1 && nx > -0.15; // lower hillside / town

        if (isCoastal && r < 0.05) {
          // Water — Sagami Bay / Abe river mouth
          color = CLASS_COLORS.water;
          height = groundH - 1 + rand() * 0.5;
        } else if (isUrban && r < 0.18) {
          // Buildings — concrete blocks on hillside
          const roofH = 4 + rand() * 12;
          color = CLASS_COLORS.building;
          height = groundH + rand() * roofH;
        } else if (!isUrban && r < 0.35) {
          // High vegetation — forested upper slopes
          color = r < 0.12 ? CLASS_COLORS.lowVeg : r < 0.25 ? CLASS_COLORS.medVeg : CLASS_COLORS.highVeg;
          height = groundH + rand() * (8 + rand() * 12);
        } else {
          // Ground returns — the base surface
          color = CLASS_COLORS.ground;
          height = groundH + rand() * 0.4;
        }

        pointPrimitives.add({
          position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
          color: color,
          pixelSize: 3,
        });
      }

      // Wrap in a proxy object matching the Cesium3DTileset interface
      // used by the layer management code (show, add/remove from scene)
      const pointCloud = {
        _primitives: pointPrimitives,
        get show() { return pointPrimitives.show; },
        set show(v) { pointPrimitives.show = v; scene.requestRender(); },
        set maximumScreenSpaceError(_v) { /* no-op: PointPrimitiveCollection has no LOD */ },
        destroy() { scene.primitives.remove(pointPrimitives); },
      };

      state.pointCloud = pointCloud;

      layerButtons.forEach((button) => {
        button.removeAttribute("aria-disabled");
      });
      setStatus(pointStatus, "pointStreaming", "ready", "pointReady");
      setDataAnswer("dataAnswerReady");

      const legendSection = shell.querySelector("#vs-legend-section");
      if (legendSection) legendSection.style.display = "";

      if (state.chapterIndex === 2) {
        pointCloud.show = true;
        state.layerMode = "pointcloud";
        if (state.buildings) state.buildings.show = false;
        updateLayerButtons();
      } else if (state.chapterIndex === 3) {
        pointCloud.show = true;
        state.layerMode = "both";
        if (state.buildings) state.buildings.show = true;
        updateLayerButtons();
      } else {
        pointCloud.show = state.layerMode !== "buildings";
      }
      scene.requestRender();
    } catch (error) {
      setStatus(pointStatus, "pointUnavailable", "error", "pointError");
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
