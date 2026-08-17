# Shizuoka Prefecture Geospatial Demo Suite

## Presenter guide for Business Development and PSS

This guide explains the story, the controls, the CesiumJS implementation, the data provenance, and
the language to use in front of Shizuoka Prefecture.

The suite is a customer-ready set of four CesiumJS experiences:

1. **Abe River Flood Response** - connect a flood-planning surface to
   emergency routes, shelters, and a simulated high-water event.
2. **Atami LiDAR Survey Corridor** - inspect LiDAR returns, separate ground
   from unclassified points, and relate the survey to terrain and buildings.
3. **Abe River Mouth ALB Voxel Morphology** - inspect airborne laser
   bathymetry at the river mouth and organize bed morphology into voxel
   analytics.
4. **2021 Atami Landslide LiDAR Comparison** - compare the 2019
   pre-landslide scan with the 2021 post-landslide emergency survey.

Together, the demos tell a progression from **regional context**, to
**measured observations**, to **analysis**, to **change over time**. The
common message is that CesiumJS can bring heterogeneous geospatial data into a
single, interactive 3D decision environment without requiring the audience to
leave the map.

## Before the presentation

### Opening the suite

1. Open the published landing page:
   `https://jastman.github.io/shizuoka-demo-cesium-BD/`
2. Use the four demo cards to open each standalone Cesium Sandcastle
   experience. The standalone links run the demo automatically.
3. Allow the first scene to stream terrain, imagery, and 3D Tiles before
   presenting. A wired or strong Wi-Fi connection is recommended.
4. Present in this order unless the audience asks for a different topic:
   **Flood Response -> LiDAR Corridor -> Abe River Mouth ALB Morphology ->
   Landslide Comparison**.

The landing page is the presentation entry point. The source scripts are in
`sandcastle/`; the landing page and GitHub Pages copy are generated output. If
the demos are changed before an event, run `node build.js` so the published
links contain the latest scripts.

### If a presenter needs to run a source script directly

For a development or backup workflow, open
`https://sandcastle.cesium.com/`, paste the relevant
`sandcastle/*.js` file into the editor, and select **Run** or press **F8**.
The four source files are:

| Demo | Source file |
| --- | --- |
| Flood Response | `sandcastle/disaster-response-hydrodynamic.js` |
| LiDAR Survey Corridor | `sandcastle/point-cloud-vs-buildings.js` |
| Abe River Mouth ALB Morphology | `sandcastle/voxel-water-saturation.js` |
| Atami Landslide Comparison | `sandcastle/timeseries-pointcloud-change.js` |

The normal BD/PSS workflow is to use the published landing page, not to edit
or paste code during the meeting.

### General presenter guidance

- Give the scene a few seconds to stream after each camera move. Cesium loads
  visible tiles on demand.
- Use **Start Guided Tour** or **Open guided tour** when introducing a demo.
  The tour provides a reliable narrative and camera framing.
- Use the manual controls after the tour to answer questions or show a
  specific layer.
- Read the provenance and limitation language aloud when discussing analytical
  results. Several visual layers are illustrative demonstrations of a
  production workflow, not operational forecasts.
- Do not describe any demo as an evacuation instruction, engineering
  certification, or public-safety forecast.
- If a layer is still loading, use the on-screen status rather than implying
  that missing data is empty geography.

## Suite-level overview script

> "This suite shows how Shizuoka's geospatial information can be used as a
> continuous 3D decision experience. We start with the Abe River and a
> flood-response scenario, where planning surfaces are connected to routes and
> shelters. We then move to Atami and inspect the underlying LiDAR returns,
> including the distinction between measured ground and unclassified points.
> The third chapter demonstrates how point observations can be organized into
> the Abe River mouth, where measured airborne laser bathymetry is organized
> into a voxel morphology view. Finally, we compare a 2019 pre-landslide LiDAR
> scan with a 2021 post-landslide emergency survey over the same Atami
> hillside. The suite moves from response, to evidence,
> to analysis, to change over time."

### What the suite demonstrates technically

All four experiences use CesiumJS in the browser:

- `Cesium.Viewer` provides the globe, camera, clock, imagery, terrain, and
  render loop.
- Cesium ion streams terrain, buildings, and point-cloud 3D Tiles.
- `Cesium3DTileStyle` applies GPU-side styling and filtering to 3D Tiles
  features and point-cloud attributes.
- Cesium entities provide lightweight annotations such as rivers, routes,
  shelters, labels, gauges, polygons, and bathymetry overlays.
- `CallbackProperty` connects visual properties to time or application state.
- `JulianDate` and the Cesium clock provide the flood scenario timeline.
- The voxel demo uses `VoxelPrimitive`, a custom voxel provider, metadata
  arrays, and a `CustomShader`.
- Camera tours use Cesium bounding spheres, heading/pitch/range offsets, and
  controlled transitions.
- The interfaces include bilingual copy, keyboard focus handling, live status
  announcements, reduced-motion behavior, and graceful degraded states.

The demos are intentionally self-contained Sandcastle scripts. They do not
require a separate application server for the presentation. Public data is streamed from Cesium ion, GSI, PLATEAU, GEOSPATIAL.JP, and
Virtual Shizuoka source resources linked by the demos.

---

# Demo 1: Abe River Flood Response

## Purpose and audience value

This demo presents a prefectural flood-response view from the Abe River
headwaters through Shizuoka City to Suruga Bay. It combines official 3D flood
planning layers with a response-oriented interface so an audience can see how
flood exposure, route status, shelters, and downstream dependencies can be
understood together.

The most important point is the relationship between layers: the flood surface
shows the hazard context, the colored routes show an operational consequence,
and the shelter markers show response resources in the same geographic frame.

## How to run it

1. Open **Abe River Flood Response** from the landing page.
2. Wait for the status to say that the official PLATEAU layers are loaded.
   Terrain and the GSI basemap may continue refining after the status changes.
3. Select **Start Guided Tour**.
4. Let the tour run, or use **Previous**, **Next**, and **Pause** in the tour
   panel.
5. Close the tour and demonstrate the manual controls:
   - **Run Scenario** starts the illustrative six-hour clock.
   - The **L1/L2** selector switches between the two official planning
     surfaces.
   - The **PLATEAU Buildings** control toggles the city model.
   - **Restart** returns the clock to the beginning.
6. If time allows, run the scenario from start to finish and point out how the
   gauge, phase, and route state change together.

## What the audience sees

The initial view establishes the geography:

- The Abe River is highlighted from the Akaishi Mountains toward the coast.
- Mt. Fuji is labeled as regional context, not as part of the Abe watershed.
- The Shizuoka City building model and flood-planning surface stream into the
  scene.
- Emergency shelters appear as green point markers.
- Emergency-route excerpts appear as thick lines whose colors respond to the
  simulated water level.

The guided tour has four stops:

1. **Watershed context.** A translucent watershed outline frames the
   mountains-to-coast story.
2. **Official flood planning data.** The MLIT PLATEAU inundation-depth tiles
   are shown in depth-ranked colors. The translucent animated overlay is
   explicitly illustrative.
3. **Emergency routes and shelters.** Shelters pulse and route lines show
   status as the scenario level changes.
4. **Floodplain to Suruga Bay.** The camera performs a low-altitude sweep from
   the upper corridor through the city and toward the coast, making downstream
   exposure visible as one connected route.

When **Run Scenario** is selected, the Cesium clock advances through a
six-hour, illustrative hydrograph. The modeled level rises from 1.5 m, peaks
at approximately 3.9 m around hour three, and then recedes. The interface
maps the level to four communication states:

| Modeled level | Phase | Route state | Visual |
| --- | --- | --- | --- |
| Below 2.1 m | Monitor | Open | Cyan |
| 2.1-2.79 m | Prepare | Watch | Gold |
| 2.8-3.49 m | Mobilize | Restricted | Orange |
| 3.5 m and above | Respond | Closed | Red |

The gauge and route changes are useful for explaining how a real operational
system could connect a time-varying water signal to response rules. They are
not a forecast in this demo.

## How it was built

The script creates a `Cesium.Viewer` with Cesium World Terrain and a GSI
standard-map `UrlTemplateImageryProvider`. The globe is configured for a
daylight presentation view, with fog and a dark base color to improve layer
contrast.

The static response context is built with Cesium entities:

- A ground-clamped glowing polyline for the Abe River.
- Labels for the river direction, Mt. Fuji, and the Akaishi headwaters.
- Point and label entities for four shelter locations.
- Ground-clamped route polylines for two emergency-route excerpts.
- An illustrative flood polygon whose extrusion height and material color are
  driven by `CallbackProperty`.
- An illustrative cylinder and label that act as the water-level gauge.

The official PLATEAU buildings and L1/L2 flood surfaces are loaded as
`Cesium3DTileset` instances with `Promise.all`. The flood tiles are styled with
`Cesium3DTileStyle` conditions using the PLATEAU `uro:rank_code` attribute.
The code also configures screen-space error, cache budgets, culling, and
flight preloading so that the broad regional view remains usable while tiles
stream.

The time behavior uses `JulianDate`, `ClockRange.CLAMPED`, a six-hour start and
stop time, and a clock multiplier of 180. The `onTick` listener updates the
gauge, status text, route colors, and completion state. Each 3D Tiles request
is isolated so one unavailable PLATEAU layer does not prevent the remaining
layers from loading.

## Data sources and provenance

- **Flood and building geometry:** MLIT Project PLATEAU FY2023 Shizuoka City
  data, published through the PLATEAU/GEOSPATIAL.JP catalog.
- **Flood tiles:** Abe River national flood planning surfaces for L1 and L2.
- **Emergency shelters and route excerpts:** embedded location and route
  excerpts based on the PLATEAU planning context.
- **Basemap:** Geospatial Information Authority of Japan (GSI) standard map
  tiles.
- **Terrain:** Cesium World Terrain.
- **Illustrative elements:** the six-hour hydrograph, thresholds, route
  impact state, animated flood polygon, gauge, and response timeline are
  presentation models.

Useful source links are listed in the [source index](#source-index).

## Spoken presentation script

> "This first view is the Abe River corridor, from the Akaishi Mountains
> through Shizuoka City to Suruga Bay. The river, terrain, city buildings,
> flood-planning surfaces, shelters, and response routes are all in one
> spatial frame. That is the value of the 3D view: we can discuss upstream
> conditions and downstream response dependencies without changing maps."

> "I will start the guided tour. The first stop establishes the watershed.
> The second shows the official PLATEAU planning surface. The color bands
> represent the published inundation-depth categories. The animated
> translucent layer on top is a communication device for this presentation;
> it is not a forecast."

> "At the third stop, the green markers are emergency shelters and the colored
> lines are route excerpts. I will now start the scenario. As the modeled
> water level rises, the gauge changes from monitor to prepare, mobilize, and
> respond. The routes move from open, to watch, to restricted, to closed.
> This illustrates the kind of rule-based operational view that could be
> connected to a calibrated live or scenario data feed."

> "The final stop follows the floodplain toward Suruga Bay. It makes the
> downstream story visible: a change in the upper corridor can affect urban
> routes, shelters, and coastal access in one connected geography."

> "For clarity, the geographic context and PLATEAU planning data are real.
> The six-hour hydrograph and its response states are illustrative. This
> demonstration is for planning communication, not for public-safety
> decisions."

## Questions this demo can support

- How could a prefecture connect hazard layers to response assets?
- How can different planning scenarios be compared in the same 3D context?
- How would a live gauge, forecast, or simulation feed replace the
  illustrative clock?
- Which route and shelter data would need to be maintained as authoritative
  operational datasets?

---

# Demo 2: Atami LiDAR Survey Corridor

## Purpose and audience value

This demo explains what is inside a LiDAR survey before asking an audience to
use it for analysis. It focuses on a narrow corridor of four adjacent
Virtual Shizuoka 2019 Atami tiles and lets the presenter separate class 2
ground returns from class 1 unclassified returns.

The practical value is data literacy. A decision-maker can see the difference
between a source point cloud, a classified terrain subset, and a surrounding
city model. It also creates a natural conversation about data quality,
classification, and where additional processing would produce more value.

## How to run it

1. Open **Atami, Shizuoka - reading a LiDAR survey corridor**.
2. Wait for the status panel to show that terrain, buildings, and the Atami
   LiDAR asset are streaming.
3. Select **Open story tour**. The tour has four chapters and can be paused,
   resumed, stepped with the arrow buttons, or closed.
4. After the tour, use the four geographic views:
   - **Atami context**
   - **Terrain context**
   - **Survey corridor**
   - **Ground close-up**
5. Use the layer controls:
   - **Buildings context**
   - **LiDAR + buildings**
   - **All LiDAR returns**
   - **Ground only**
   - **Unclassified only**
6. Toggle **High detail** only for a close inspection. Balanced detail is the
   recommended presentation setting because high detail can increase network
   and GPU use.
7. In the terrain chapter, enable the GSI Red Relief Image Map (RRIM) and
   slope overlay to emphasize ridges, drainage, and steepness.

## What the audience sees

The story begins with a regional Atami view so the corridor has geographic
meaning. The four neighboring survey tiles form a narrow measured strip across
the developed hillside.

The four chapters are:

1. **A measured corridor through Atami's steep terrain.** Terrain and buildings
   show where the LiDAR sits in the city.
2. **Terrain context.** The point cloud is temporarily hidden while the GSI
   RRIM and slope layers make ridges, drainage paths, and slope changes easier
   to read.
3. **Ground separation.** All LiDAR returns are shown and styled by
   classification. Ground class 2 is amber; unclassified class 1 is cyan.
   The source summary reports approximately 11.77% ground and 88.23%
   unclassified returns for the four tiles.
4. **Usable terrain evidence.** Ground-only, unclassified-only, and
   LiDAR-plus-buildings views show how the source can support terrain
   inspection, quality review, and urban context.

The display is not claiming that every unclassified return is vegetation,
construction, or damage. It is showing the classification field that exists in
the source and making the remaining uncertainty visible.

## How it was built

The viewer uses Cesium World Terrain, Cesium World Imagery, and OSM Buildings
3D Tiles. It also adds two GSI imagery layers:

- RRIM from the GSI 5 m DEM, used to emphasize landform.
- GSI slope map, used as a subtle steepness overlay.

The Atami point cloud is loaded as a `Cesium3DTileset` from Cesium ion. A
`Cesium3DTileStyle` evaluates the LAS `Classification` attribute, with
fallback expressions for alternate property capitalization. The style
supports:

- `show` expressions for ground-only and unclassified-only filtering.
- Conditional colors for class 2 and class 1.
- A consistent point size for the presentation.

`PointCloudShading` enables attenuation and eye-dome lighting so the streamed
points remain legible as the camera moves through the corridor. The script
uses dynamic screen-space error, foveated loading, cache budgets, and load
events to balance detail and responsiveness.

The story tour uses fixed Atami camera targets, Cesium bounding spheres,
heading/pitch/range offsets, a timed chapter progress bar, and explicit
pause/resume controls. Terrain and buildings can fail independently; the
status panel reports the failure while preserving the remaining context.
English and Japanese copy, keyboard navigation, live announcements, and
reduced-motion handling are built into the panel.

## Data sources and provenance

- **Point cloud:** Virtual Shizuoka / Shizuoka Prefecture Atami LP LiDAR 2019,
  four adjacent tiles, published to Cesium ion as asset **5131284**.
- **Source catalog:** GEOSPATIAL.JP Atami 3D dataset.
- **Terrain:** Cesium World Terrain, ion asset **1**.
- **Buildings:** OSM Buildings 3D Tiles, ion asset **96188**.
- **Terrain analysis imagery:** GSI RRIM and GSI slope-map tiles.
- **Catalog terms:** the source copy identifies the Virtual Shizuoka catalog
  terms as CC BY 4.0.

The point cloud is the measured source. The colors in the presentation are
Cesium styling, not a new classification product.

## Spoken presentation script

> "This chapter moves from flood response to the evidence that supports
> analysis: airborne LiDAR. We are looking at four adjacent 2019 Virtual
> Shizuoka tiles across a steep, developed Atami hillside. The regional
> terrain and building model tell us where the narrow survey corridor sits."

> "The second chapter temporarily hides the point cloud and turns on the
> GSI Red Relief Image Map. This is useful because imagery can hide landform.
> The relief and slope layers make ridges, drainage paths, and steep areas
> easier to interpret before we inspect the individual returns."

> "Now I will show all returns. The amber points are LAS class 2 ground
> returns. The cyan points are class 1 unclassified returns. In this source,
> the displayed summary is approximately 11.77 percent ground and 88.23
> percent unclassified. The point is not that the unclassified points are
> wrong; the point is that their interpretation is still open."

> "Ground-only mode isolates the terrain evidence. Unclassified-only mode
> exposes what remains to be interpreted. I can also add the building model
> back in, which helps relate the measured corridor to the surrounding city.
> This is the bridge from raw survey data to a quality-controlled,
> decision-ready terrain product."

> "Cesium is streaming the point-cloud tiles as the camera needs them. The
> styling and filtering happen in the 3D Tiles pipeline, so we are not
> creating one browser object for every point. That is what makes this type of
> inspection practical at interactive scale."

## Questions this demo can support

- Which LiDAR classes are authoritative for a particular workflow?
- Where would classification, ground filtering, or QA add the most value?
- How should point-cloud survey corridors be compared with buildings,
  terrain, roads, or other city context?
- What metadata, vertical datum, and source events must accompany a production
  analytical product?

---

# Demo 3: Abe River Mouth ALB Voxel Morphology

## Purpose and audience value

This demo focuses on the Abe River mouth, where the river channel, shallow
water, banks, and Suruga Bay meet. It uses Virtual Shizuoka airborne laser
bathymetry (ALB) as the source story and demonstrates how measured bed
observations can be organized into a voxel morphology workflow.

This is the demo to use when the discussion moves from "What was measured at
the river mouth?" to "How could the prefecture inspect bed form, depth, and
survey coverage in a repeatable 3D view?" It is the clearest demonstration of
Cesium's voxel, clipping, picking, and custom-shader capabilities in this
suite.

The distinction between real and illustrative data is essential:

- The **Virtual Shizuoka ALB source** is real. Tile `08ND9755` contains
  approximately 1.68 million measured returns, including approximately 21,668
  returns classified as water.
- The raw LAS and grid resources are linked in the demo, but they are not
  themselves a Cesium voxel tileset. The public demo currently has an empty
  `ION_VOXEL_TILES_URL`, so the visible voxel field is an explicitly
  illustrative fallback that demonstrates the rendering and interaction
  pattern. Do not describe the colored cells as reconstructed measured
  bathymetry.
- Bed depth and measurement occupancy are derived analytical fields. Occupancy
  indicates survey support; it is not river flow, discharge, water level, or a
  forecast.

## How to run it

1. Open the voxel analytics / water-intelligence card from the landing page.
2. Wait for Cesium World Bathymetry and the PLATEAU urban context to load.
3. If the panel is closed, select **Open ALB morphology**.
4. Start **Guided story** and let it advance through:
   - Start with measured ALB
   - Aggregate returns into voxels
   - Read the bed
   - Coverage is evidence, not flow
   - Support Shizuoka decisions
5. Use **Analysis field** to switch among:
   - **Bed elevation:** measured ALB Z in metres when sourced from ALB.
   - **Bed depth below reference:** a derived inspection value, not a tide
     level.
   - **Measurement occupancy / coverage:** derived points per voxel.
6. Use **Vertical clip**, **Section reveal**, and **Section position** to
   expose the channel cross-section or water-edge section.
7. Toggle **Context cutaway** to remove terrain and imagery only inside the
   analysis window. Use **Focus source footprint** to return to the mouth.
8. Click the visible voxel field to open the sample/profile readout. Explain
   that the current fallback readout is illustrative until a validated voxel
   asset is connected.
9. Open **Source & method** when questions arise about the source tile, CRS,
   vertical datum, catalog footprint, or production boundary.

## What the audience sees

The guided story deliberately follows the river mouth and the data pipeline:

1. **Measured source footprint.** Tile `08ND9755` is framed within a
   source-derived 13-tile catalog window covering the channel, banks, and bay
   transition. The cyan outline is geographic context, not a rotated point
   cloud.
2. **Voxel aggregation.** The story explains how a local PDAL preparation
   preserves XYZ, intensity, classification, and RGB, then duplicates Z into
   an `Elevation` scalar for a future voxel tiler.
3. **Bed morphology.** Bed elevation is the measured ALB Z concept; depth below
   a declared reference surface is derived for inspection. Section and
   vertical clipping make the channel depression and shallow bed transition
   easier to read.
4. **Coverage evidence.** Occupancy counts returns supporting each voxel.
   Sparse or dense coverage helps an analyst judge survey support, but it does
   not describe velocity, discharge, or water level.
5. **Decision context.** The scene connects repeatable mouth morphology to
   maintenance, shallow-water access screening, sediment and shoreline review,
   and future post-event comparisons.

The current fallback field is approximately 2.268 km by 0.9 km and uses a
single illustrative voxel tile with display vertical exaggeration. Its
legend and readout retain physical units, but the extrusion is not an
absolute vertical placement and is not a measured bed surface.

## How it was built

The viewer uses `Cesium.createWorldBathymetryAsync` with vertex normals and
falls back to ellipsoid terrain if the bathymetry terrain request fails. A
PLATEAU Shizuoka City Suruga-ku LOD1 tileset and an OpenStreetMap river
alignment provide geographic context.

The analytical volume is implemented with Cesium's voxel APIs:

The runtime currently uses an explicit `FallbackAlbVoxelProvider` because
`ION_VOXEL_TILES_URL` is empty:

- The provider declares a box volume with 18 x 16 x 14 FLOAT32 samples,
  one available level, and one maximum tile.
- `requestData` returns `Cesium.VoxelContent.fromMetadataArray` with a scalar
  `value` field and a `visibility` field.
- The fallback function creates morphology-shaped elevation, derived depth,
  and coverage-like values inside the source-derived analysis window. It does
  not load or reconstruct the ALB LAS returns in the browser.
- A `CustomShader` maps the selected scalar to a color ramp and applies voxel
  visibility as material alpha.
- `VoxelPrimitive` is rebuilt when the selected analysis field or section
  changes. Local ENU transforms and clipping planes expose the channel and
  water-edge sections.
- Cesium picking and `pickPosition` populate an accessible sample/profile
  readout. Provider and tile-load status are surfaced in the panel.

The source and method disclosure links to the Virtual Shizuoka original and
grid resources, reports the inspected LAS bounds and return counts, identifies
the 13-tile analysis window, and states the CRS uncertainty. A production
implementation would publish a validated georeferenced voxel tileset with
explicit `elevation`, `depth`, and occupancy metadata instead of activating
the fallback.

## Data sources and provenance

- **Measured source:** Virtual Shizuoka 2025 Airborne Laser Bathymetry,
  original tile `08ND9755` and its matching grid resource. Catalog terms are
  identified as CC BY 4.0 and ODbL.
- **Source statistics:** the inspected `08ND9755` LAS contains approximately
  1,682,108 measured returns, with approximately 21,668 class 9 water returns.
  Water classification does not make every return bathymetry.
- **Analysis window:** 13 official catalog tile IDs are listed in the demo's
  source disclosure. Their combined footprint is approximately 2.268 km by
  0.9 km around the Abe River mouth.
- **Runtime state:** the raw LAS is not loaded as a voxel tileset in this
  public demo. `ION_VOXEL_TILES_URL` is empty and the visible field is an
  explicitly illustrative fallback.
- **CRS and vertical datum:** the project README identifies EPSG:6676
  (JGD2011 / Japan Plane Rectangular CS VIII), while the dataset-specific
  catalog notes JGD2024 / CS VIII and the LAS header embeds no SRS. Confirm
  CRS, coordinate epoch, vertical datum, and any tide/reference surface before
  production use.
- **Context:** Cesium World Bathymetry, the PLATEAU Shizuoka City Suruga-ku
  LOD1 tileset, and OpenStreetMap way 59328409 for Abe River alignment.

## Spoken presentation script

> "This chapter brings us to the Abe River mouth, where the channel, shallow
> water, banks, and Suruga Bay meet. Instead of showing a generic watershed
> index, we are using Virtual Shizuoka airborne laser bathymetry to talk about
> the measured bed and the evidence available for interpreting it."

> "The source story starts with tile 08ND9755, which contains about 1.68 million
> measured returns. The demo's analysis window follows the mouth, channel,
> banks, and bay transition across a 13-tile catalog footprint. The cyan
> outline shows that geographic window and the river line is orientation
> context."

> "Now we organize that morphology into a voxel workflow. I can switch between
> bed elevation, a derived depth-below-reference value, and measurement
> occupancy. I can reveal a channel or water-edge section, clip vertically,
> and click the field to inspect a sample."

> "There is an important boundary to state clearly. The raw LAS and grid are
> real source data, but the public demo does not yet connect a validated
> Cesium voxel tileset. The colored volume is an explicitly illustrative
> fallback so we can demonstrate the Cesium provider, metadata, shader,
> clipping, and picking pattern without claiming that every displayed cell is
> a reconstructed measurement."

> "The occupancy view is survey evidence: it helps show where returns support
> an interpretation and where coverage is sparse. It is not river velocity,
> discharge, water level, or a hydrodynamic forecast. A production version
> would publish validated voxel metadata with an agreed CRS, vertical datum,
> reference surface, no-data policy, and provenance for each analytical field."

> "For Shizuoka, this pattern can support Abe-mouth maintenance, shallow-water
> access screening, sediment and shoreline review, and future post-event
> comparisons. The key value is a repeatable 3D way to move from measured
> returns to explainable morphology analysis."

## Questions this demo can support

- Which Abe-mouth fields should be authoritative: bed elevation, derived depth,
  coverage, sediment indicators, or a future change metric?
- Which CRS, coordinate epoch, vertical datum, reference surface, and no-data
  rules must be confirmed before voxel tiling?
- How should an authoritative voxel asset be versioned, invalidated, and
  refreshed after a new survey?
- Which fields should be stored in the voxel product, and which should be
  derived or filtered in the browser?
- How can coverage evidence be shown without implying river flow, discharge, or
  a water-level forecast?

---

# Demo 4: 2021 Atami Landslide LiDAR Comparison

## Purpose and audience value

This demo tells the story of the July 2021 Atami Izusan landslide by comparing
two real Virtual Shizuoka LiDAR surveys over the same corrected coastal slope:

- **2019**, a pre-landslide reference scan showing the vegetated slope before
  the disaster.
- **2021**, an emergency drone LiDAR survey acquired on July 6 after the
  landslide, showing exposed ground and the debris-flow corridor.

The visual comparison helps an audience inspect stripped slope material,
deposited debris, exposed ground, and the relationship to homes, roads, and
shoreline infrastructure. It is important to state exactly what it does: the
browser toggles and overlays two separate point-cloud tilesets. Cesium is not
computing a per-point difference surface in this demo. A formal change product
would require external registration, differencing, quality control, and
publication.

## How to run it

1. Open **Atami Izusan - 2021 landslide story**.
2. Wait for the status to say that terrain, the 2019 scan, and the 2021
   emergency scan are available.
3. Start **Guided landslide story tour**.
4. Let the tour run, or use **Previous**, **Next**, **Pause**, **Resume**, and
   **Restart**.
5. After the tour, demonstrate the view modes:
   - **2019 pre-disaster**
   - **2021 post-landslide**
   - **2019 + 2021 overlay**
   - **Buildings + landslide**
6. Use **Play 2019 -> 2021** to show a short visual transition from the
   pre-landslide reference to the post-landslide survey.
7. Use the camera buttons:
   - **Wide story view**
   - **Top-down overview**
   - **Close-up detail**
   - **Coast + buildings**
8. Use **Reset demo** to return to the wide story view.

## What the audience sees

The guided tour has seven stops:

1. **Atami in regional context:** steep volcanic terrain, the sea, and the
   narrow valley where the July 2021 debris flow entered a dense neighborhood.
2. **Before the disaster:** the 2019 corridor reads as a continuous vegetated
   slope draining toward the coast, with homes and roads downslope.
3. **Immediate post-landslide survey:** the July 6, 2021 emergency LiDAR shows
   freshly exposed ground and a sharply defined debris-flow path.
4. **Reading the change corridor:** the overlay distinguishes stripped slope
   material, deposited debris, and the built edge intersecting the flow path.
5. **Impact at the urban edge:** buildings make the proximity of homes and
   streets to the mapped debris pathway legible.
6. **Downstream reach:** the mountain channel, neighborhood streets, and
   shoreline infrastructure read as one connected system.
7. **Regional takeaway:** a compact, high-consequence corridor where terrain,
   settlement, and drainage align to shape landslide risk.

The manual modes make the comparison repeatable. In the two single-survey
modes, the source RGB point colors are retained. In overlay mode, the 2019
scan is tinted orange and the 2021 scan blue. In the buildings mode, OSM
Buildings are shown with the active landslide survey.

The transition button animates opacity and tint for approximately 1.8 seconds.
It is a visual handoff between surveys, not an interpolation of points,
terrain, or the landslide process.

## How it was built

The viewer uses Cesium World Terrain and Cesium World Imagery, with OSM
Buildings loaded as a contextual 3D Tileset. The two LiDAR scans are loaded
in parallel as separate `Cesium3DTileset` instances from Cesium ion.

Each point-cloud tileset uses `PointCloudShading` with attenuation and
eye-dome lighting. Screen-space error, foveated loading, cache budgets, and
load-progress events are configured so the two large datasets remain
interactive.

The mode state controls visibility and styling:

- 2019 mode shows only the 2019 tileset.
- 2021 mode shows only the 2021 tileset.
- Overlay mode shows both and applies contrasting `Cesium3DTileStyle` tints.
- Buildings mode shows the 2021 survey with OSM Buildings.

The animation uses `requestAnimationFrame` to change the two scan styles and
then settles on the 2021 mode. The guided tour uses seven fixed camera
waypoints and explicit cancellation/version state so a user can pause, close,
restart, or step without leaving an old tour running.

The implementation also accounts for a common elevation issue: the source
LiDAR elevations are orthometric while Cesium terrain is ellipsoidal. Terrain
depth testing is therefore disabled so the point cloud is not hidden by a
vertical-datum mismatch. This is a useful production consideration when
combining survey data with global terrain.

## Data sources and provenance

- **2019 LiDAR:** Atami LP LiDAR 2019, Virtual Shizuoka, Cesium ion asset
  **5131794**, clipped to the July 2021 emergency-survey footprint.
- **2021 LiDAR:** Atami emergency drone LiDAR acquired **2021-07-06** and
  finalized **2021-08-06**, Virtual Shizuoka, Cesium ion asset **5131679**.
- **Terrain:** Cesium World Terrain, ion asset **1**, with vertex normals.
- **Buildings:** OSM Buildings 3D Tiles, ion asset **96188**.
- **Basemap:** Cesium World Imagery.
- **Publisher/catalog context:** Shizuoka Prefecture through GEOSPATIAL.JP /
  Virtual Shizuoka; the source copy identifies the catalog terms as CC BY 4.0.
- **Preprocessing note:** both datasets were reprojected from EPSG:6676 to
  EPSG:4978 for spatially matched Cesium ion tiling. The 2019 source was
  clipped to the exact 2021 emergency-survey bounds before tiling.

## Spoken presentation script

> "The final demo tells the story of the July 2021 Atami Izusan landslide. We
> start with a 2019 pre-landslide LiDAR scan over the same coastal slope and
> then compare it with the emergency drone LiDAR survey acquired on July 6,
> 2021."

> "The 2019 view shows a continuous vegetated slope draining toward the coast,
> with homes and roads directly downslope. I will keep this camera position
> fixed so the audience sees the later survey in the same geographic frame."

> "Now I switch to the July 2021 emergency survey. The exposed ground and
> sharply defined debris-flow path make the landslide corridor visible. This
> is the evidence view: it shows the changed surface and the route through the
> valley, not a simulation of how the flow moved."

> "The overlay uses orange for 2019 and blue for 2021. Where the surveys
> occupy the same space, the colors visually overlap; where material was
> stripped or deposited, the separation is easier to see. Adding the building
> model relates the debris corridor to homes, streets, and the urban edge."

> "The Play button provides a short visual handoff from the 2019 reference to
> the 2021 survey. It is important to be precise: this is a visual comparison
> of two real point-cloud tilesets. The demo does not calculate per-point
> displacement or a difference surface. A production change-detection product
> would add registration, differencing, quality control, and a published
> derived dataset."

> "Cesium's role is to stream both large spatial datasets, control level of
> detail, shade the points for readability, and keep the camera and layer
> state coherent. This same pattern could support landslide review,
> construction monitoring, post-event inspection, or infrastructure change
> analysis when a validated change product is available."

## Questions this demo can support

- How should repeated LiDAR surveys be registered and quality-controlled?
- What change metrics matter: elevation, exposed structure, vegetation, or
  surface displacement?
- How can a derived change product be published alongside the source scans?
- Which survey scans and vertical datums should be retained for auditability?

---

## Suggested closing script

> "Across the four demos, Cesium is acting as the shared spatial operating
> environment. We can stream official planning data, inspect source LiDAR,
> render derived volumetric analytics, and compare repeated surveys without
> losing the geographic relationship between them. The next step for an
> operational Shizuoka solution would be to replace illustrative elements with
> calibrated services and authoritative feeds while preserving this same
> interaction model."

## Source index

- Virtual Shizuoka catalog:
  <https://www.geospatial.jp/ckan/dataset?q=VIRTUAL+SHIZUOKA&organization=shizuokapref&sort=metadata_modified+desc>
- GEOSPATIAL.JP Atami 3D dataset:
  <https://www.geospatial.jp/ckan/dataset/atami-3d>
- PLATEAU Shizuoka City FY2023 dataset:
  <https://www.geospatial.jp/ckan/dataset/plateau-22100-shizuoka-shi-2023>
- GSI tile catalog:
  <https://maps.gsi.go.jp/development/ichiran.html>
- GSI terms:
  <https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html>
- GSI RRIM tiles:
  `https://cyberjapandata.gsi.go.jp/xyz/sekishoku/{z}/{x}/{y}.png`
- GSI slope tiles:
  `https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png`
- GSI standard map tiles:
  `https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png`
## Asset availability note

Cesium ion asset IDs and externally hosted URLs are configuration dependencies,
not permanent guarantees. Before a customer presentation, open each demo once
and confirm the status panel reports the expected layers as streaming. If an
asset has been replaced or removed, update the source script and rebuild the
landing page rather than presenting an unverified substitute.
