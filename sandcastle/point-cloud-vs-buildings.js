/* global Cesium */
(async function () {
  "use strict";

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MTA5NjcxZS04ZGIwLTQxMGMtYTgzYy1mOTVkYzQ4ZDNiNzUiLCJpZCI6NDIxMzE4LCJzdWIiOiJKYWtlLlN0ZWluZXJtYW4iLCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoiRGVtbyAxLSBEaXNhc3RlciBSZXNwb25zZSAmIEh5ZHJvZHluYW1pYyBTaW11bGF0aW9uIiwiaWF0IjoxNzg1NDQ1NTkwfQ.f14WW5ROSpSJULiwGF1iWovpqDFbNq-KY5-QJckUDUY";

  const JAPAN_TERRAIN_ASSET_ID = 1;       // Cesium World Terrain (public Ion asset)
  const JAPAN_BUILDINGS_ASSET_ID = 96188; // Cesium OSM Buildings worldwide (public Ion asset)

  // Atami LP LiDAR 2019 — real Virtual Shizuoka data, tiles 08NF2350–2353
  // Uploaded to Ion from virtual-shizuoka.s3.ap-northeast-1.amazonaws.com/2019/LP/Ground/...
  const VIRTUAL_SHIZUOKA_ION_ASSET_ID = 5131284;

  const ATAMI_PACKAGE_URL =
    "https://www.geospatial.jp/ckan/dataset/atami-3d";

  const COPY = {
    en: {
      languageLabel: "Language",
      title: "Atami, Shizuoka — reading a LiDAR survey corridor",
      lede:
        "Explore four adjacent tiles from Virtual Shizuoka's 2019 airborne LiDAR survey. Separate measured ground from unclassified returns, then relate the corridor to terrain and buildings context.",
      viewsTitle: "Geographic chapter",
      viewRegional: "Atami context",
      viewTerrain: "Terrain context",
      viewCorridor: "Survey corridor",
      viewUrban: "Ground close-up",
      layersTitle: "Return filters & context",
      layerBuildings: "Buildings context",
      layerBoth: "LiDAR + buildings",
      layerAll: "All LiDAR returns",
      layerGround: "Ground only",
      layerUnclassified: "Unclassified only",
      legendTitle: "LiDAR return classes",
      legendGround: "Ground — class 2 (11.77%)",
      legendUnclassified: "Unclassified — class 1 (88.23%)",
      detailBalanced: "Detail: balanced",
      detailHigh: "Detail: high",
      statusTitle: "Data status",
      terrainLabel: "Japan regional terrain",
      buildingsLabel: "Japan buildings",
      lidarLabel: "Atami LP LiDAR 2019 (Ion asset 5131284)",
      terrainFallback: "Fallback ellipsoid",
      terrainStreaming: "Streaming",
      terrainUnavailable: "Unavailable - using ellipsoid",
      loading: "Loading",
      assetRequired: "Not loaded - asset ID required",
      buildingsStreaming: "Streaming context",
      buildingsUnavailable: "Unavailable - terrain remains",
      pointStreaming: "Asset request succeeded",
      pointUnavailable: "Asset unavailable - context remains",
      dataAnswerLabel: "Live source:",
      dataAnswer:
        "Ion asset 5131284 is not yet loaded.",
      dataAnswerLoading:
        "Ion asset 5131284 is loading.",
      dataAnswerReady:
        "Ion asset 5131284 is streaming from Cesium ion for the Atami LiDAR story.",
      dataAnswerError:
        "Ion asset 5131284 could not be loaded.",
      sourceLink: "Source: Virtual Shizuoka 2019 Atami LAS tiles",
      closeTour: "Close story tour",
      previous: "Previous",
      pause: "Pause",
      resume: "Resume",
      restart: "Restart",
      next: "Next",
      openTour: "Open story tour",
      chapterStep: (current, total) => `Chapter ${current} of ${total}`,
      chapter1Title: "A measured corridor through Atami's steep terrain",
      chapter1Copy:
        "Four adjacent 2019 survey tiles form a narrow measured corridor across Atami's developed hillside. Regional terrain and buildings establish where the measurements sit; the LiDAR provides the detailed surface evidence examined in the next chapters.",
      chapter2Title: "Terrain context: reading ridges and drainage",
      chapter2Copy:
        "The Red Relief Image Map (RRIM), derived from the GSI 5m DEM, removes imagery detail to emphasize terrain form. Ridges, drainage paths, and changes in slope become easier to read, providing geographic context for the narrower LiDAR corridor.",
      chapter3Title: "Ground separation: revealing the underlying slope",
      chapter3Copy:
        "The source LAS separates class 2 ground returns (amber) from class 1 unclassified returns (cyan). Across the four survey tiles, 11.77% of points are ground and 88.23% remain unclassified. Use the filters to isolate the measured terrain beneath the hillside surface and inspect the remaining unsorted returns independently.",
      chapter4Title: "From raw returns to usable terrain evidence",
      chapter4Copy:
        "Ground-only mode isolates the terrain measurements; unclassified-only mode reveals the returns that still need interpretation; and the buildings layer shows how the surveyed corridor relates to the surrounding city model. Together, these views support terrain inspection, data-quality review, and decisions about where richer upstream classification would add value.",
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
      pointReady: "Atami LP LiDAR 2019 (Ion asset 5131284) is streaming.",
      pointError:
        "Atami LP LiDAR 2019 (Ion asset 5131284) is unavailable. Japan context remains functional.",
      reducedMotion:
        "Story tour is paused and camera transitions are instant because reduced motion is enabled.",
      languageChanged: "Language changed to English.",
    },
    ja: {
      languageLabel: "言語",
      title: "熱海・静岡 — LiDAR測量回廊を読む",
      lede:
        "VIRTUAL SHIZUOKAの2019年航空LiDARから隣接する4図郭を表示し、地表面と未分類リターンを分離して、地形・建物コンテキストと関連づけます。",
      viewsTitle: "地域チャプター",
      viewRegional: "熱海コンテキスト",
      viewTerrain: "地形コンテキスト",
      viewCorridor: "測量回廊",
      viewUrban: "地表面クローズアップ",
      layersTitle: "リターン分類とコンテキスト",
      layerBuildings: "建物コンテキスト",
      layerBoth: "LiDAR + 建物",
      layerAll: "全LiDARリターン",
      layerGround: "地表面のみ",
      layerUnclassified: "未分類のみ",
      legendTitle: "LiDARリターン分類",
      legendGround: "地表面 — クラス2（11.77%）",
      legendUnclassified: "未分類 — クラス1（88.23%）",
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
      dataAnswerLabel: "ライブデータ：",
      dataAnswer:
        "Ionアセット5131284はまだ読み込まれていません。",
      dataAnswerLoading:
        "Ionアセット5131284を読み込み中です。",
      dataAnswerReady:
        "Ionアセット5131284をCesium ionから配信しています。熱海のLiDARストーリーに使用するデータです。",
      dataAnswerError:
        "Ionアセット5131284を読み込めませんでした。",
      sourceLink: "データソース：VIRTUAL SHIZUOKA 2019年熱海LAS図郭",
      closeTour: "ストーリーツアーを閉じる",
      previous: "前へ",
      pause: "一時停止",
      resume: "再開",
      restart: "最初から",
      next: "次へ",
      openTour: "ストーリーツアーを開く",
      chapterStep: (current, total) => `チャプター ${current} / ${total}`,
      chapter1Title: "実測された斜面ストリップ",
      chapter1Copy:
        "2019年の隣接する4図郭が、熱海の市街化された斜面を横切る細長い実測回廊を構成しています。地域地形と建物で位置関係を確認し、次のチャプターでLiDARの詳細な表面情報を読みます。",
      chapter2Title: "尾根と排水を地形コンテキストで読む",
      chapter2Copy:
        "国土地理院5m DEM由来のRRIMは、画像の細部を抑えて地形形状を強調します。尾根、排水経路、斜面変化が読みやすくなり、細いLiDAR回廊の地理的コンテキストを示します。",
      chapter3Title: "地表面分離で斜面形状を明らかにする",
      chapter3Copy:
        "元のLASは、クラス2の地表面リターン（琥珀色）とクラス1の未分類リターン（水色）を分離しています。4図郭全体では地表面が11.77%、未分類が88.23%です。フィルターで斜面の実測地形を抽出し、残りの未整理リターンを個別に確認できます。",
      chapter4Title: "生のリターンを利用可能な地形情報へ",
      chapter4Copy:
        "地表面のみでは実測地形を抽出し、未分類のみでは追加解釈が必要なリターンを確認できます。建物レイヤーを重ねると測量回廊と周辺都市モデルの関係が分かり、地形確認、データ品質レビュー、追加分類が有効な場所の判断に利用できます。",
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
      pointReady: "設定されたVIRTUAL SHIZUOKA点群5131284を配信中です。",
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
  scene.requestRenderMode = true;
  viewer.resolutionScale = Math.min(window.devicePixelRatio || 1, 1.25);
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
          <button class="vs-button" type="button" data-view="rrim" data-i18n="viewTerrain">${t("viewTerrain")}</button>
          <button class="vs-button" type="button" data-view="foothills" data-i18n="viewCorridor">${t("viewCorridor")}</button>
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
          <button class="vs-button" type="button" data-layer="all" aria-pressed="false" aria-disabled="true" data-i18n="layerAll">
            ${t("layerAll")}
          </button>
          <button class="vs-button" type="button" data-layer="ground" aria-pressed="false" aria-disabled="true" data-i18n="layerGround">
            ${t("layerGround")}
          </button>
          <button class="vs-button" type="button" data-layer="unclassified" aria-pressed="false" aria-disabled="true" data-i18n="layerUnclassified">
            ${t("layerUnclassified")}
          </button>
          <button class="vs-button" id="vs-detail" type="button" aria-pressed="false" data-i18n="detailBalanced">
            ${t("detailBalanced")}
          </button>
        </div>
      </section>

      <section class="vs-section" aria-labelledby="vs-legend-title" id="vs-legend-section" style="display:none">
        <h2 class="vs-section-title" id="vs-legend-title" data-i18n="legendTitle">${t("legendTitle")}</h2>
        <dl class="vs-legend-list">
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#d99524"></span><dt data-i18n="legendGround">${t("legendGround")}</dt></div>
          <div class="vs-legend-row"><span class="vs-legend-swatch" style="background:#55d7ff"></span><dt data-i18n="legendUnclassified">${t("legendUnclassified")}</dt></div>
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
        <p>
          <a class="vs-link" href="${ATAMI_PACKAGE_URL}" target="_blank" rel="noopener noreferrer" data-i18n="sourceLink">
            ${t("sourceLink")}
          </a>
        </p>
      </section>
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

  // Stable Atami-centered story cameras.
  const VIEWS = {
    // Ch1: regional overview
    regional: {
      target: Cesium.Cartesian3.fromDegrees(139.0743, 35.098, 400),
      heading: Cesium.Math.toRadians(235),
      pitch: Cesium.Math.toRadians(-36),
      range: 9000,
    },
    // Ch2: RRIM framing over the Atami LiDAR hillside
    rrim: {
      target: Cesium.Cartesian3.fromDegrees(139.0744, 35.0979, 135),
      heading: Cesium.Math.toRadians(242),
      pitch: Cesium.Math.toRadians(-38),
      range: 3400,
    },
    // Ch3: LiDAR-focused close view on the 2019 Atami asset
    urban: {
      target: Cesium.Cartesian3.fromDegrees(139.07415, 35.09722, 95),
      heading: Cesium.Math.toRadians(228),
      pitch: Cesium.Math.toRadians(-24),
      range: 650,
    },
    // Ch4: wider slope context around the 2019 Atami asset
    foothills: {
      target: Cesium.Cartesian3.fromDegrees(139.07425, 35.09745, 120),
      heading: Cesium.Math.toRadians(236),
      pitch: Cesium.Math.toRadians(-30),
      range: 1250,
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

  const classificationExpr = "Number(${Classification})";
  const classificationFallbackExpr =
    `(${classificationExpr} >= 0 ? ${classificationExpr} : Number(\${classification}))`;
  const classificationValueExpr =
    `(${classificationFallbackExpr} >= 0 ? ${classificationFallbackExpr} : Number(\${CLASSIFICATION}))`;

  function createPointCloudStyle(mode) {
    const show = mode === "ground"
      ? `${classificationValueExpr} === 2`
      : mode === "unclassified"
        ? `${classificationValueExpr} === 1`
        : "true";

    return new Cesium.Cesium3DTileStyle({
      show,
      pointSize: "4.0",
      color: {
        conditions: [
          [`${classificationValueExpr} === 2`, "color('#d99524')"],
          [`${classificationValueExpr} === 1`, "color('#55d7ff')"],
          ["true", "color('#b8c7d1', 0.8)"],
        ],
      },
    });
  }

  function applyPointCloudStyle(mode) {
    if (state.pointCloud) {
      state.pointCloud.style = createPointCloudStyle(mode);
    }
  }

  function flyTo(viewName, options = {}) {
    const view = VIEWS[viewName];
    const isLidarView =
      viewName === "rrim" || viewName === "urban" || viewName === "foothills";
    const lidarSphere = isLidarView && state.pointCloud
      ? state.pointCloud.boundingSphere
      : null;
    const boundingSphere = lidarSphere ||
      new Cesium.BoundingSphere(view.target, 0);
    const rangeMultiplier = viewName === "urban" ? 1.35 : 2.15;
    const range = lidarSphere
      ? Math.max(lidarSphere.radius * rangeMultiplier, 450)
      : view.range;

    viewer.camera.flyToBoundingSphere(boundingSphere, {
      offset: new Cesium.HeadingPitchRange(
        view.heading,
        view.pitch,
        range,
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
      state.buildings.show = mode === "buildings" || mode === "both";
    }
    if (state.pointCloud) {
      state.pointCloud.show = mode !== "buildings";
      applyPointCloudStyle(mode);
    }
    updateLayerButtons();
    scene.requestRender();
  }

  function updateDetail(shouldAnnounce = true) {
    const buildingError = state.detailed ? 8 : 16;
    const pointError = state.detailed ? 4 : 8;

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
    // Chapter 4 (index 3): also show RRIM to reinforce terrain context.
    if (state.chapterIndex === 1 || state.chapterIndex === 3) {
      rrimLayer.alpha = 0.82;
      slopeLayer.alpha = 0.25;
    } else {
      rrimLayer.alpha = state.rrimManual ? 0.82 : 0.0;
      slopeLayer.alpha = state.rrimManual ? 0.25 : 0.0;
    }
    if (rrimToggle) rrimToggle.checked = state.chapterIndex === 1 || state.chapterIndex === 3 || state.rrimManual;

    // Chapter 3 compares the two classes; chapter 4 adds buildings for context.
    if (state.chapterIndex === 2 && state.pointCloud) {
      applyLayerMode("all");
    } else if (state.chapterIndex === 3 && state.pointCloud) {
      applyLayerMode("both");
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
          maximumScreenSpaceError: 18,
          cacheBytes: 256 * 1024 * 1024,
          maximumCacheOverflowBytes: 128 * 1024 * 1024,
          skipLevelOfDetail: true,
          baseScreenSpaceError: 1024,
          immediatelyLoadDesiredLevelOfDetail: false,
          loadSiblings: false,
          dynamicScreenSpaceError: false,
          cullWithChildrenBounds: true,
          foveatedScreenSpaceError: true,
          foveatedTimeDelay: 0.2,
          preloadFlightDestinations: false,
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
          maximumScreenSpaceError: 8,
          cacheBytes: 256 * 1024 * 1024,
          maximumCacheOverflowBytes: 96 * 1024 * 1024,
          skipLevelOfDetail: true,
          baseScreenSpaceError: 1024,
          immediatelyLoadDesiredLevelOfDetail: false,
          loadSiblings: false,
          dynamicScreenSpaceError: true,
          dynamicScreenSpaceErrorDensity: 2.0e-4,
          dynamicScreenSpaceErrorFactor: 16,
          cullWithChildrenBounds: true,
          foveatedScreenSpaceError: true,
          foveatedTimeDelay: 0.2,
          preferLeaves: true,
        },
      );

      pointCloud.pointCloudShading = new Cesium.PointCloudShading({
        attenuation: true,
        maximumAttenuation: 4,
        geometricErrorScale: 0.75,
        eyeDomeLighting: true,
        eyeDomeLightingStrength: 0.8,
        eyeDomeLightingRadius: 1.2,
      });

      scene.primitives.add(pointCloud);
      state.pointCloud = pointCloud;
      applyPointCloudStyle(state.layerMode);

      pointCloud.tileLoad.addEventListener(() => scene.requestRender());
      pointCloud.tileUnload.addEventListener(() => scene.requestRender());
      pointCloud.loadProgress.addEventListener(() => scene.requestRender());

      layerButtons.forEach((button) => {
        button.removeAttribute("aria-disabled");
      });
      setStatus(pointStatus, "pointStreaming", "ready", "pointReady");
      setDataAnswer("dataAnswerReady");
      const legendSection = shell.querySelector("#vs-legend-section");
      if (legendSection) legendSection.style.display = "";

      if (state.chapterIndex === 2) {
        applyLayerMode("all");
      } else if (state.chapterIndex === 3) {
        applyLayerMode("both");
      } else {
        applyLayerMode(state.layerMode);
      }
      if (state.chapterIndex >= 1) {
        flyTo(CHAPTERS[state.chapterIndex].view);
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

  updatePlayButton();
  updateLayerButtons();
  // Tour is user-initiated — fly to regional overview on load
  flyTo("regional");
  state.storyOpen = false;

  if (prefersReducedMotion) {
    announce(t("reducedMotion"));
  }
})();
