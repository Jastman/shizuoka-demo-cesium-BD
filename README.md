# Shizuoka Prefecture Geospatial Analysis Demos

Production-ready CesiumJS Sandcastle demos showcasing geospatial analysis, disaster response, point cloud visualization, and temporal change detection for Shizuoka Prefecture.

## Demos Overview

### 1. Abe River Flood Response (`disaster-response-hydrodynamic.js`)
Interactive dashboard for flood response analysis along the Abe River. Features include:
- **Real-time flood visualization** with water extent polygons and flow direction highlights
- **Evacuation infrastructure** showing routes, shelter locations, and emergency response centers
- **Geographic context** highlighting Mount Fuji, Akashi Mountains, and key landmarks
- **Guided tour** with 4 stops showing different aspects of the flood response
- **Bilingual UI** (English/Japanese) with language toggle
- **Live animation** during tour stops highlighting rivers, mountains, and infrastructure

**Data**: PLATEAU building layer (LOD2), flood extent vectors, evacuation infrastructure

### 2. Point Cloud vs. Buildings (`point-cloud-vs-buildings.js`)
Comparative visualization of LiDAR point cloud data against 3D building footprints.
- **Layer comparison** toggle between LiDAR points and building models
- **Transparency controls** for overlay analysis
- **Noon JST daylight** rendering for realistic lighting
- **WCAG accessibility** with keyboard navigation, focus management, and ARIA labels
- **Bilingual support** (English/Japanese)
- **Guided tour** demonstrating comparison techniques

**Data**: Virtual Shizuoka LiDAR point cloud (when Ion asset ID configured), PLATEAU buildings

**Note**: Requires `VIRTUAL_SHIZUOKA_ION_ASSET_ID` environment variable or Cesium Ion asset configuration. Data source: https://www.geospatial.jp/ckan/dataset/shizuoka-2021-pointcloud

### 3. Voxel Analytics (`voxel-water-saturation.js`)
3D voxel-based spatial analytics for water saturation and bathymetry analysis.
- **Interactive voxel picking** to inspect individual voxel data properties
- **Vertical reveal controls** (vertical slider) to cut through voxel volume
- **Bathymetry data** showing seafloor topology
- **Tour-driven analysis** with 4 stops showing different data aspects
- **Dynamic visualization** with step-by-step data animation
- **Bilingual UI** (English/Japanese)

**Data**: Voxel dataset (water saturation), bathymetry layer, building context

### 4. Time-Series Point Cloud Change (`timeseries-pointcloud-change.js`)
Temporal change detection using multi-epoch point cloud data.
- **Multi-temporal comparison** of LiDAR datasets from different periods
- **Change highlighting** showing areas of significant terrain/structure modification
- **Voxel picking** for detailed inspection of changes
- **Regional overview** tour ending with complete area context
- **Guided tour** with 4+ stops analyzing different change areas
- **Bilingual support** (English/Japanese)

**Data**: Time-series point cloud datasets (multiple epochs), change detection vectors

## Testing & Validation

All demos are accessible via Sandcastle Share URLs in `shizuoka-sandcastles.html`:

```bash
# Open the launcher
open shizuoka-sandcastles.html
```

Each demo includes:
- ✓ Bilingual English/Japanese toggle (top-right language selector)
- ✓ Guided tour with Previous/Next/Pause/Resume/Restart controls
- ✓ Keyboard accessibility (Tab, Enter, arrow keys for navigation)
- ✓ WCAG compliance with ARIA labels and focus management
- ✓ Responsive layout (desktop and mobile)
- ✓ Zero console errors in production

## Demos Location

- **Source files**: `sandcastle/` directory
  - `disaster-response-hydrodynamic.js`
  - `point-cloud-vs-buildings.js`
  - `voxel-water-saturation.js`
  - `timeseries-pointcloud-change.js`
- **Launcher**: `shizuoka-sandcastles.html`

## Data Sources

### Shizuoka 2021 Point Cloud
- **Source**: https://www.geospatial.jp/ckan/dataset/shizuoka-2021-pointcloud
- **Resource**: "LPデータ オリジナル・グラウンドデータ" (LP Data - Original/Ground Data)
- **Format**: LAS/LAZ files organized by Japan national map mesh grid
- **License**: CC BY 4.0 / ODbL
- **Coordinates**: JGD2011 / Japan Plane Rectangular CS VIII
- **Size**: ~300 MB average per mesh; up to 2.8 GB for large tiles
- **Next Step**: Select specific mesh(es) from the dataset map, download ZIPs, and tile with Cesium Ion

### PLATEAU Buildings
- **Source**: National PLATEAU 3D building dataset
- **Format**: 3D Tiles with LOD2 building models
- **Coverage**: All of Japan including Shizuoka
- **Cache settings**: 1 GiB + 512 MiB overflow (optimized for dense LOD2 rendering)

### Bathymetry
- **Coverage**: Suruga Bay and surrounding areas
- **Format**: Elevation dataset
- **Integration**: Blended with topography for seamless terrain

## Architecture Notes

### Bilingual Implementation
All demos use a lightweight i18n system embedded directly in the code:
- Language selector in UI (top-right corner)
- Persistence via localStorage
- Default language: English
- All tour steps, labels, descriptions, and status messages are translated

### Tour UI Standardization
All four demos use a consistent tour interface:
- Bottom-left card showing: step counter (x/y), title, description, progress bar
- Controls: Previous, Pause, Resume, Restart, Close (all ≥44px touch targets)
- Keyboard accessible: Tab navigation, Enter to activate, arrows to step through

### Camera & Rendering Optimizations
- **Flood demo**: Uses `flyToBoundingSphere()` with screen-space bias to ensure AOI is unobscured by info panels
- **Point Cloud demo**: Fixed daylight (noon JST) for realistic rendering
- **Voxel demo**: Bounded cache (512+256 MiB) for efficient memory management
- **All demos**: Disabled dynamic LOD/foveated selection for stable continuous rendering

### Share URL Format
Each demo generates a Cesium Share URL (9–31 KB encoded) that includes:
- Full source code (deflate-compressed + base64)
- Scene configuration (camera, entities, styles)
- User state (language, UI settings)

The Share URL is regenerated when testing in Sandcastle using the Share button.

## Development

### Adding a New Demo
1. Create a new `.js` file in `sandcastle/` with Cesium initialization
2. Include bilingual i18n with `t()` function calls
3. Implement consistent tour UI using the pattern from existing demos
4. Test in Sandcastle, capture Share URL
5. Add entry to `shizuoka-sandcastles.html`

### Testing Checklist
- [ ] Syntax valid (runs without parse errors)
- [ ] Tour controls (Previous/Next/Pause/Resume/Restart) functional
- [ ] Language toggle switches between English/Japanese
- [ ] Keyboard navigation works (Tab, Enter, arrows)
- [ ] Responsive layout on desktop (1920px+) and mobile (390px)
- [ ] Zero console errors (open DevTools → Console tab)
- [ ] Picking/inspection features work (if applicable)
- [ ] Share URL click-tested and works when reopened
