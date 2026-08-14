# Shizuoka Prefecture CesiumJS Demo Suite

Four interactive CesiumJS demonstrations show how Shizuoka's terrain,
buildings, LiDAR, flood-planning surfaces, volumetric analytics, and coastal
bathymetry can be combined into a single 3D decision environment.

## Explore the suite

- **[Open the live GitHub Pages implementation](https://jastman.github.io/shizuoka-demo-cesium-BD/)**
- **[Read the presenter guide](docs/shizuoka-demo-presenter-guide.md)** for the
  full BD/PSS presentation narrative, run instructions, technical details,
  data sources, caveats, and spoken scripts.

## Demos

### Abe River Flood Response

<img width="1839" height="995" alt="Abe River Flood Response" src="https://github.com/user-attachments/assets/3ccffebe-1f9e-488f-a38f-5b6b37eb233f" />

An interactive flood-response dashboard for the Abe River corridor. It combines
PLATEAU buildings, flood-planning surfaces, emergency routes, shelters, terrain,
and a guided high-water scenario so stakeholders can discuss risk exposure and
response context in one view. The scenario controls and animated impacts are
illustrative; the underlying planning geography is real.

### Atami LiDAR Survey Corridor

<img width="1840" height="1113" alt="Atami LiDAR Survey Corridor" src="https://github.com/user-attachments/assets/9de73d03-db05-4dc2-96dc-199411a69269" />


An Atami hillside LiDAR exploration using four adjacent Virtual Shizuoka 2019
point-cloud tiles. Users can switch between all returns, ground, and
unclassified returns, compare the survey with terrain and buildings, and use
RRIM imagery to read ridges, drainage, and slope form.

### Shizuoka Water Intelligence

<img width="1853" height="1244" alt="Shizuoka Water Intelligence" src="https://github.com/user-attachments/assets/db330cc4-259d-45b2-b1c4-049b871491e6" />

A volumetric analytics experience that organizes a watershed-scale model into
interactive voxels. It demonstrates threshold filtering, aggregation modes,
vertical reveal, voxel picking, metadata inspection, and a transition to
measured Shimizu coastal bathymetry. The watershed voxel values are procedural
illustrations of an analysis workflow, not a calibrated operational product.

### Atami LiDAR 2019-2021 LAndslide Comparison

<img width="1838" height="1116" alt="Atami LiDAR 2019-2021 LAndslide Comparison" src="https://github.com/user-attachments/assets/514cfd82-99dd-4c7a-882e-695a377dbc9c" />


A visual comparison of real Virtual Shizuoka 2019 and 2021 LiDAR scans over
the same Atami Izusan coastal slope, pre and post the 2021 landslide. Two separately streamed point-cloud
tilesets can be shown independently or together with buildings and imagery,
supporting discussion of terrain, vegetation, and exposed structure changes.
This is a visual  comparison rather than a computed per-point change
surface.

## Technology and data

The experiences use CesiumJS and Cesium Ion to stream terrain, imagery, 3D
Tiles, and point clouds. Data references include Virtual Shizuoka LiDAR,
MLIT/PLATEAU planning and building data, Japan GSI map products, Cesium World
Terrain and Imagery, OpenStreetMap-derived buildings, and Virtual Shizuoka
coastal bathymetry.
