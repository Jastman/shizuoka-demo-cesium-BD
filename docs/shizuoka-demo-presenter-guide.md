# Shizuoka Prefecture Geospatial Demo Suite

## Presenter guide for Business Development and PSS

This guide is written for a presenter who did not build the demos. It explains
the story, the controls, the CesiumJS implementation, the data provenance, and
the language to use in front of Shizuoka Prefecture.

The suite is a customer-ready set of four CesiumJS experiences:

1. **Abe River Flood Response** - connect a flood-planning surface to
   emergency routes, shelters, and a simulated high-water event.
2. **Atami LiDAR Survey Corridor** - inspect LiDAR returns, separate ground
   from unclassified points, and relate the survey to terrain and buildings.
3. **Shizuoka Water Intelligence** - explore a watershed voxel analytics
   workflow, then transition to measured coastal bathymetry.
4. **Atami LiDAR Epoch Comparison** - compare real 2019 and 2020 point-cloud
   epochs over the same coastal slope.

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
   **Flood Response -> LiDAR Corridor -> Water Intelligence -> Epoch
   Comparison**.

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
| Water Intelligence | `sandcastle/voxel-water-saturation.js` |
| Epoch Comparison | `sandcastle/timeseries-pointcloud-change.js` |

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
> a volumetric analytics model across the watershed, with a measured
> bathymetry case at the coast. Finally, we compare two real LiDAR survey
> epochs over the same hillside. The suite moves from response, to evidence,
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
require a separate application server for the presentation. Public data is
streamed from Cesium ion, GSI, PLATEAU, GEOSPATIAL.JP, and the suite's hosted
coastal overlay files.

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
- What metadata, vertical datum, and source epoch must accompany a production
  analytical product?

---

# Demo 3: Shizuoka Water Intelligence and Voxel Analytics

## Purpose and audience value

This demo introduces a watershed-to-coast analytics workflow. It shows how
point observations can be organized into a spatial volume, rendered as
analytical voxels, inspected at an individual cell, and connected to a
measured coastal bathymetry case.

This is the demo to use when the discussion moves from "What was measured?" to
"How could the prefecture analyze conditions throughout a volume?" It is
also the clearest demonstration of Cesium's voxel and custom-shader
capabilities.

The distinction between real and illustrative data is essential:

- The **Shimizu bathymetry** overlay is derived from measured Virtual
  Shizuoka airborne laser bathymetry.
- The **Abe River voxel field** is a procedural demonstration of the
  analytical pipeline. It is not a calibrated field measurement or an
  operational prediction.

## How to run it

1. Open **Shizuoka Water Intelligence** from the landing page.
2. Wait for the world terrain and PLATEAU city context to load.
3. Use the chapter buttons or select **Open guided tour**.
4. Let the tour advance through:
   - Abe River watershed
   - Voxel analytics volume
   - Urban core + LiDAR
   - Shimizu coastal survey
5. In the voxel chapters, demonstrate:
   - **Analytical view:** water saturation, change from baseline, topographic
     wetness, runoff risk, or infiltration simulation.
   - **Point-to-voxel aggregation:** average, minimum, maximum, median, or
     mode using 0.025 bins.
   - **Visibility threshold:** hide values below a chosen threshold.
   - **Vertical reveal:** clip the volume to expose its interior.
   - **Storm simulation:** move the scenario hour from 0 to 24.
6. Click a visible voxel to open the **Voxel Inspector**. It reports the
   analytical value, risk class, approximate elevation, longitude/latitude,
   normalized coordinates, storm hour, and aggregation method.
7. Demonstrate **Add +0.08 recharge** and then **Clear update**. Explain that
   this is a client-side update demonstration, not a database write.
8. At the coastal chapter, point out the measured depth legend, white 2 m
   contours, dashed source extent, and transparent no-data areas.

## What the audience sees

The guided story deliberately follows geography:

1. **Abe River watershed.** The camera establishes the approximately 167 km2
   Abe River watershed from the Akaishi range to the city.
2. **Voxel analytics volume.** A 5 km by 6 km by 600 m volume is placed over
   the urban corridor. The color ramp represents the selected analytical
   value.
3. **Urban buildings and overlap.** The PLATEAU building model is used as
   context over the voxel volume, making the relationship between subsurface
   conditions and dense urban form visible.
4. **Shimizu coastal bathymetry.** The voxel field is hidden and a separate
   measured coastal survey is shown. Color represents measured depth below
   mean sea level. White contours are at 2 m intervals down to approximately
   10 m. Transparent areas mean no measured underwater depth, not zero depth.

The manual controls make the analytical model understandable:

- Water saturation increases around the modeled river and lowland areas as the
  scenario hour advances.
- Change from baseline isolates the modeled storm contribution.
- Wetness and runoff are dimensionless screening indices.
- Infiltration is a scenario visualization.
- Threshold and clipping provide visual exploration without changing the
  source data.
- Tile statistics show minimum, maximum, average, median, and mode for the
  active analytical tile.

## How it was built

The viewer uses Cesium World Terrain and OpenStreetMap imagery. PLATEAU 2023
LOD2 buildings are loaded as a `Cesium3DTileset` for city context.

The analytical volume is implemented with Cesium's voxel APIs:

- `ShizuokaVoxelProvider` declares a box-shaped voxel volume.
- The volume has 8 x 8 x 8 samples per tile, three available levels, and up to
  73 octree tiles.
- An east-north-up transform centers the volume near
  138.383 E, 34.972 N, at approximately 300 m.
- The volume dimensions are 5 km east-west, 6 km north-south, and 600 m
  vertically.
- `requestData` returns `Float32Array` scalar metadata through
  `Cesium.VoxelContent.fromMetadataArray`.
- The analytical function models river proximity, lowland elevation,
  mountain recharge, storm progression, and deterministic noise.
- Min, max, average, median, and binned mode are calculated in JavaScript.
- A `CustomShader` maps scalar values to a color ramp and makes values below
  the selected threshold transparent.
- `VoxelPrimitive` settings control sampling, screen-space error, step size,
  and vertical clipping.

The click inspector uses Cesium picking:

1. Pick the voxel primitive.
2. Read voxel tile coordinates and level.
3. Transform the picked Cartesian position into the local ENU frame.
4. Convert it to normalized coordinates and recompute the displayed
   analytical value.
5. Present the result in an accessible overlay.

The coastal overlay uses an image rectangle for the measured depth raster and
`GeoJsonDataSource` for the contour lines. The contour positions are raised
to a consistent presentation height so the overlay remains readable. Loading
errors are surfaced as a warning while the voxel scene remains available.

The individual update control increments a revision and rebuilds the primitive
with a targeted sample boost. The UI explains the production pattern:
validate a FLOAT32 attribute, invalidate the affected tile and ancestors,
publish an atomic version, and refresh the analytical primitive. The demo
does not claim to persist a server-side edit.

## Data sources and provenance

- **Voxel context:** illustrative, procedural derived values over the Abe River
  corridor. It is not a measured product and requires calibration before
  operational use.
- **Measured bathymetry:** Virtual Shizuoka 2025 Airborne Laser Bathymetry,
  tiles 08NE2263-08NE2272, catalog terms identified as CC BY 4.0.
- **Bathymetry processing:** the demo documentation states that the source
  EPSG:6676 LAS tiles were reprojected to WGS84, rasterized with PDAL, and
  published as a depth image plus GeoJSON contours.
- **Bathymetry overlay files:**
  `assets/shimizu-bathymetry-depth.png` and
  `assets/shimizu-bathymetry-contours.geojson` in the GitHub Pages site.
- **City context:** MLIT PLATEAU 2023 Shizuoka City LOD2 buildings.
- **Terrain:** Cesium World Terrain.
- **Basemap:** OpenStreetMap contributors.

The coastal survey is on the Shimizu coast and is intentionally identified as
separate from the Abe River mouth. Do not describe the overlay as coverage of
the river mouth.

## Spoken presentation script

> "This third chapter asks a different question: once observations are
> available, how could we analyze conditions throughout a 3D volume? The
> scene follows the Abe River from the mountains into the urban corridor."

> "The colored volume is a voxel analytics model. Each cell carries a scalar
> value, and Cesium streams only the visible voxel tiles. I can change the
> analytical view, choose how values are aggregated, raise the visibility
> threshold, reveal the interior vertically, or move through a 24-hour storm
> scenario."

> "The important engineering pattern is the separation between data and
> rendering. A provider returns Float32 scalar metadata, while a custom shader
> converts that value into a GPU-rendered color and transparency. This lets the
> same spatial volume support several analytical views without rebuilding the
> entire user interface."

> "I will click one voxel. The inspector reports its value, risk class,
> approximate location, elevation, storm hour, and aggregation method. This
> is the kind of cell-level explainability that helps an analyst move from a
> regional pattern to a specific location."

> "The voxel values in this presentation are procedural and illustrative. They
> demonstrate the Cesium voxel workflow; they are not a field measurement or
> calibrated forecast. A production version would replace the provider with
> validated data derived from LiDAR, hydrology, soil, or other authoritative
> sources."

> "The final chapter switches to a separate measured coastal case. This is
> Virtual Shizuoka airborne laser bathymetry along the Shimizu coast. The
> colors show measured depth below mean sea level, white lines mark two-meter
> contours, and transparent areas mean no measured data. This side-by-side
> contrast shows how a single Cesium experience can combine a volumetric
> analytics product with a measured coastal survey."

## Questions this demo can support

- What analytical variables would Shizuoka want to store in a voxel product?
- Which source CRS, vertical datum, epoch, units, and no-data rules must be
  validated before tiling?
- How should a derived volume be versioned and refreshed?
- Which data should be computed server-side, and which values should be
  rendered or filtered on the GPU?
- How can measured bathymetry, terrain, buildings, and subsurface indicators
  be presented together without implying false precision?

---

# Demo 4: Atami LiDAR Epoch Comparison

## Purpose and audience value

This demo compares two real Virtual Shizuoka LiDAR epochs over the same
corrected Atami Izusan coastal slope:

- **2019**, presented as the pre-disaster reference epoch.
- **2020**, presented as the later survey epoch.

The visual comparison helps an audience inspect changes in terrain texture,
vegetation cover, exposed edges, and the relationship to buildings. It is a
strong demonstration of multi-temporal 3D data, but it is important to state
exactly what it does: the browser toggles and overlays two separate point-cloud
tilesets. Cesium is not computing a per-point difference surface in this demo.
A formal change product would require external registration, differencing,
quality control, and publication.

## How to run it

1. Open **Atami Izusan - 2019 vs 2020 LiDAR epochs**.
2. Wait for the status to say that terrain and both LiDAR epochs are
   available.
3. Start **Guided epoch comparison**.
4. Let the tour run, or use **Previous**, **Next**, **Pause**, **Resume**, and
   **Restart**.
5. After the tour, demonstrate the epoch modes:
   - **2019 pre-disaster**
   - **2020 epoch**
   - **2019 + 2020 overlay**
   - **Buildings + epoch**
6. Use **Play 2019 -> 2020** to show a short visual transition between epochs.
7. Use the camera buttons:
   - **Epoch close-up**
   - **Full strip**
   - **Slope detail**
   - **Coast + buildings**
8. Use **Reset demo** to return to the 2019 close-up.

## What the audience sees

The guided tour has seven stops:

1. **Epoch overview:** both corrected assets are framed over the same slope.
2. **2019 pre-disaster scan:** the reference hillside is shown.
3. **2020 epoch scan:** the later point cloud is shown from the same camera.
4. **Overlay comparison:** the two epochs receive contrasting tints so
   agreement and separation are easier to see.
5. **Buildings plus epoch:** OSM Buildings add urban massing context.
6. **Coastal edge:** an oblique view emphasizes the shoreline, retaining edges,
   and slope.
7. **Full-strip recap:** the audience sees the spatial footprint again.

The manual modes make the comparison repeatable. In single-epoch modes the
source RGB point colors are retained. In overlay mode the 2019 epoch is tinted
orange and the 2020 epoch blue. In the buildings mode, OSM Buildings are
shown with the active epoch.

The transition button animates opacity and tint for approximately 1.8 seconds.
It is a visual handoff between surveys, not a time interpolation of points or
terrain.

## How it was built

The viewer uses Cesium World Terrain and Cesium World Imagery, with OSM
Buildings loaded as a contextual 3D Tileset. The two LiDAR epochs are loaded
in parallel as separate `Cesium3DTileset` instances from Cesium ion.

Each point-cloud tileset uses `PointCloudShading` with attenuation and
eye-dome lighting. Screen-space error, foveated loading, cache budgets, and
load-progress events are configured so the two large datasets remain
interactive.

The mode state controls visibility and styling:

- 2019 mode shows only the 2019 tileset.
- 2020 mode shows only the 2020 tileset.
- Overlay mode shows both and applies contrasting `Cesium3DTileStyle` tints.
- Buildings mode shows the 2019 epoch with OSM Buildings.

The animation uses `requestAnimationFrame` to change the two epoch styles and
then settles on the 2020 mode. The guided tour uses seven fixed camera
waypoints and explicit cancellation/version state so a user can pause, close,
restart, or step without leaving an old tour running.

The implementation also accounts for a common elevation issue: the source
LiDAR elevations are orthometric while Cesium terrain is ellipsoidal. Terrain
depth testing is therefore disabled so the point cloud is not hidden by a
vertical-datum mismatch. This is a useful production consideration when
combining survey data with global terrain.

## Data sources and provenance

- **2019 LiDAR:** Atami LP LiDAR 2019, Virtual Shizuoka, Cesium ion asset
  **5131479**.
- **2020 LiDAR:** Atami LP LiDAR 2020, Virtual Shizuoka, Cesium ion asset
  **5131486**.
- **Terrain:** Cesium World Terrain, ion asset **1**, with vertex normals.
- **Buildings:** OSM Buildings 3D Tiles, ion asset **96188**.
- **Basemap:** Cesium World Imagery.
- **Publisher/catalog context:** Shizuoka Prefecture through GEOSPATIAL.JP /
  Virtual Shizuoka; the source copy identifies the catalog terms as CC BY 4.0.
- **Preprocessing note:** the two epochs were reprojected into a corrected
  geocentric frame before Cesium ion tiling and aligned to the same story
  cameras.

## Spoken presentation script

> "The final demo adds time. We are looking at two real Virtual Shizuoka
> LiDAR epochs over the same Atami Izusan coastal slope: 2019 and 2020. The
> key requirement for a meaningful comparison is spatial alignment, so both
> assets were corrected into a common geocentric frame before tiling."

> "I will show the 2019 reference first, then the 2020 epoch from the same
> camera. This keeps the audience focused on what changed in the view rather
> than asking them to mentally register two different map positions."

> "Now I will turn on the overlay. The orange and blue tints distinguish the
> two surveys. Where the point clouds agree, the colors visually occupy the
> same space; where they separate, the difference is easier to notice. I can
> add the building model to relate the surveyed slope to the surrounding
> urban form."

> "The Play button provides a short visual transition from 2019 to 2020. It is
> important to be precise: this is a visual comparison of two real point-cloud
> tilesets. The demo does not calculate a per-point displacement or a
> difference surface. A production change-detection product would add
> registration, differencing, quality control, and a published derived
> dataset."

> "Cesium's role here is to stream both large spatial datasets, control their
> level of detail, shade the points for readability, and keep the camera and
> layer state coherent. The same interaction pattern could support landslide
> review, construction monitoring, post-event inspection, or infrastructure
> change analysis when a validated change product is available."

## Questions this demo can support

- How should repeated LiDAR surveys be registered and quality-controlled?
- What change metrics matter: elevation, exposed structure, vegetation, or
  surface displacement?
- How can a derived change product be published alongside the source epochs?
- Which survey epochs and vertical datums should be retained for auditability?

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
- Hosted Shimizu bathymetry depth raster:
  <https://jastman.github.io/shizuoka-demo-cesium-BD/assets/shimizu-bathymetry-depth.png>
- Hosted Shimizu bathymetry contours:
  <https://jastman.github.io/shizuoka-demo-cesium-BD/assets/shimizu-bathymetry-contours.geojson>

## Asset availability note

Cesium ion asset IDs and externally hosted URLs are configuration dependencies,
not permanent guarantees. Before a customer presentation, open each demo once
and confirm the status panel reports the expected layers as streaming. If an
asset has been replaced or removed, update the source script and rebuild the
landing page rather than presenting an unverified substitute.
