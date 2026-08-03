# Shizuoka Demo Pack — Cesium BD / PSS

Customer-ready Sandcastle demo pack for **Shizuoka Prefecture + Pacific Spatial Solutions (PSS)** meetings.  
Demonstrates Virtual Shizuoka as an **operational and analytical digital twin**, not just a 3D visualization.

Three self-contained demos, each paste-ready into [Cesium Sandcastle](https://sandcastle.cesium.com/).

---

## Quick start

1. Open https://sandcastle.cesium.com/
2. Paste the contents of the demo file into the **JS** panel
3. Click **Run** (▶)

| File | Purpose | Runtime |
|------|---------|---------|
| `sandcastle/shizuoka-storyboard.js` | Executive narrative, prefecture context | 3–4 min |
| `sandcastle/disaster-response-hydrodynamic.js` | Flood response operations dashboard | 4–6 min |
| `sandcastle/voxel-change-detection.js` | Voxel analytics + change detection | 4–5 min |

---

## Demo 1 — Disaster Response & Hydrodynamic Simulation

### What it shows

A time-driven flood response scenario for the **Abe River (安倍川) basin** in Shizuoka City.  
As the clock advances, water levels rise, the threat level escalates, and the operational dashboard updates in real time.

### What's on the map

| Layer | Source | Real data? |
|-------|--------|-----------|
| LOD2 buildings — Aoi Ward (葵区) | PLATEAU 2023 (MLIT) | ✅ Official |
| LOD1 buildings — Suruga Ward (駿河区) | PLATEAU 2023 (MLIT) | ✅ Official |
| LOD1 buildings — Shimizu Ward (清水区) | PLATEAU 2023 (MLIT) | ✅ Official |
| Flood inundation zones L1 (100-yr) — Abe River | PLATEAU 2023 (MLIT) | ✅ Official |
| Flood inundation zones L2 (worst-case) — Abe River | PLATEAU 2023 (MLIT) | ✅ Official |
| GSI flood depth raster overlay | Geospatial Information Authority of Japan | ✅ Official |
| Emergency transport routes (緊急輸送路) | 静岡県緊急輸送路図 2019 via PLATEAU 2023 | ✅ Official |
| Designated evacuation shelters (避難所) | 22100_shizuoka-shi_city_2023_shelter.geojson, PLATEAU 2023 | ✅ Official |
| Base imagery | GSI seamless photo + standard map tiles | ✅ Official |
| Animated flood water body | Synthetic 3D slab (illustrative) | ⚠️ Illustrative |
| Incident points (red/yellow/cyan dots) | Synthetic scenario events | ⚠️ Illustrative |

### Official emergency routes wired in

Three real routes from the **静岡県緊急輸送路図 (Shizuoka Prefecture Emergency Transport Routes)** dataset, clipped to the Abe River flood zone:

| Route | Class | Description |
|-------|-------|-------------|
| 国道362号 | 2nd class | East-west arterial through the flood zone |
| 中島南安倍線 | **1st class** | Crosses the Abe River corridor into southern Shizuoka |
| 中野小鹿線 | 2nd class | North-south connector in the flood zone |

Route color tracks danger state: **cyan → yellow → orange → red** as water rises.

### Official evacuation shelters wired in

Four real Level-1 designated shelters from PLATEAU 2023, with official capacity figures:

| Shelter | Capacity | Coordinates |
|---------|---------|-------------|
| 中田小学校 (Nakada Elementary) | 1,219 | 138.39313, 34.96377 |
| 豊田中学校 (Toyota Junior High) | 1,106 | 138.40888, 34.97105 |
| 井宮小学校 (Imiya Elementary) | 1,001 | 138.36686, 34.98843 |
| 安西小学校 (Anzai Elementary) | 705 | 138.37406, 34.98125 |

### Scenario mechanics

- **Clock speed:** 120× real time (a 6-hour flood event plays in ~3 minutes)
- **Water gauge:** Abe River gauge rises from 1.9 m → 3.9 m over the scenario
- **Danger thresholds:** Low → Guarded (2.5 m) → High (3.0 m) → Severe (3.5 m)
- **Dashboard:** Live water level, danger state, estimated impacted population, route status
- **Flood tiles:** PLATEAU L2 inundation tiles alpha-fades in as water rises
- **Route stress:** Route color and status text update as danger escalates

### Buttons

| Button | What it does |
|--------|-------------|
| Start Scenario | Begins the time-driven scenario at 1×120 speed |
| Pause / Resume | Freeze/resume the scenario clock |
| Reset Time | Rewind to scenario start |
| Focus Flood Zone | Camera flies to Abe River flood zone |
| Focus Water Gauge | Camera flies to the Abe River gauge station |
| Focus Routes | Camera flies to the emergency route network |
| Flood: L1 / L2 | Toggle between 100-yr and worst-case PLATEAU flood tiles |
| Toggle Flood Raster | Show/hide GSI flood depth raster overlay |
| Toggle Shadows | Enable sun-shadow casting (off by default for performance) |

### Talk track

> "This scene simulates a flood-response cycle along the Abe River — every road, shelter, and flood zone you see is real Shizuoka government data from PLATEAU 2023.  
> As we start the scenario, the water gauge at the Abe River station rises. The decision dashboard updates in real time: threat level, estimated impacted population, and whether evacuation routes remain passable.  
> Rather than static PDF hazard maps, this gives incident commanders a single live operational picture — fusing hydrological conditions, urban 3D context, and logistics in one view.  
> The next step for PSS and Shizuoka would be to wire in real-time sensor feeds from the actual gauge network."

---

## Demo 2 — Executive Storyboard (`shizuoka-storyboard.js`)

### Talk track

> "This view frames the prefecture-scale opportunity. We're combining real terrain, satellite imagery, official 3D buildings, hazard layers, and time-dynamic operations on one shared geospatial foundation.  
> The same base data serves multiple departments — emergency management, infrastructure, logistics, urban planning — all working from the same ground truth.  
> Here we layer flood risk directly into the 3D scene so cross-department coordination is faster: everyone references the same spatial context rather than swapping PDFs."

---

## Demo 3 — Voxel Analytics & Change Detection (`voxel-change-detection.js`)

### Talk track

> "This scene represents a voxel analytical grid: each cell stores a measurable condition at a point in time.  
> Switch between Baseline, Current, and Delta views — the delta layer highlights where meaningful change has occurred. Threshold controls let teams focus on statistically significant shifts, not noise.  
> The KPIs — changed area percentage, positive/negative shift ratio, max delta — convert 3D spatial data into the decision metrics that matter.  
> For Shizuoka, this is the architecture for comparing pre/post-flood building exposure, monitoring infrastructure vulnerability over time, or tracking urban growth against hazard zones."

---

## Recommended meeting flow

1. **Executive open (2 min):** Storyboard → sets the 'why'
2. **Operational depth (5 min):** Disaster response → shows the 'how'
   - Start Scenario, let it run 60–90 seconds, point to flood tiles, routes, and dashboard updating simultaneously
   - Toggle Flood L1/L2 to show the difference between 100-yr and worst-case modeling
   - Focus Routes to show the emergency transport network
3. **Analytics close (4 min):** Voxel change detection → positions 'what's next'
4. **Close (1 min):** "The next step is to wire in your production datasets — real-time gauge feeds, PSS data products, department-specific KPIs."

---

## Data sources

All 3D Tiles are served directly from the PLATEAU CDN — no authentication required, no local server needed.

### PLATEAU 2023 3D Tiles (buildings)
```
Aoi Ward LOD2:
https://assets.cms.plateau.reearth.io/assets/16/f01621-f72d-4c64-9c40-67c97cee7c5f/
22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22101_aoi-ku_lod2/tileset.json

Suruga Ward LOD1:
https://assets.cms.plateau.reearth.io/assets/18/aba17e-da3b-441d-9712-a6db88f3e6c5/
22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22102_suruga-ku_lod1/tileset.json

Shimizu Ward LOD1:
https://assets.cms.plateau.reearth.io/assets/db/4e7d98-7baf-4fae-bf13-3c98fd53cf32/
22100_shizuoka-shi_city_2023_citygml_3_op_bldg_3dtiles_22103_shimizu-ku_lod1/tileset.json
```

### PLATEAU 2023 3D Tiles (Abe River flood inundation)
```
L1 (100-yr flood):
https://assets.cms.plateau.reearth.io/assets/41/edaf1e-f484-4ed4-9084-dbcede6352d5/
22100_shizuoka-shi_city_2023_citygml_3_op_fld_natl_abegawa_abegawa-warasinagawa_3dtiles_l1_no_texture/tileset.json

L2 (worst-case maximum):
https://assets.cms.plateau.reearth.io/assets/23/720679-10c9-46e4-9ab6-4a76ada7566c/
22100_shizuoka-shi_city_2023_citygml_3_op_fld_natl_abegawa_abegawa-warasinagawa_3dtiles_l2_no_texture/tileset.json
```

### PLATEAU 2023 GeoJSON (emergency routes + shelters)
```
ZIP: https://assets.cms.plateau.reearth.io/assets/33/ac2b62-001e-4e19-9dd0-714c3b674251/
     22100_shizuoka-shi_2023_related.zip

Contains:
  22100_shizuoka-shi_city_2023_emergency_route.geojson  (63 routes, 静岡県緊急輸送路図 2019)
  22100_shizuoka-shi_city_2023_shelter.geojson          (364 shelters)
  22100_shizuoka-shi_city_2023_park.geojson
  22100_shizuoka-shi_city_2023_landmark.geojson
  22100_shizuoka-shi_city_2023_station.geojson
  22100_shizuoka-shi_city_2023_railway.geojson
  22100_shizuoka-shi_city_2023_border.geojson
```

### GSI tile services (basemap + hazard)
```
Seamless photo:  https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg
Standard map:    https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png
Flood depth L2:  https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png
```

---

## Related issues

- [iTwin/business-development#1192](https://github.com/iTwin/business-development/issues/1192) — Shizuoka BD opportunity
- [iTwin/cesium-japan#196](https://github.com/iTwin/cesium-japan/issues/196) — PSS partnership / Virtual Shizuoka
