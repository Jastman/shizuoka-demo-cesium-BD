#!/usr/bin/env node
/**
 * build.js — re-encodes all Sandcastle demos and stamps BUILD_UTC.
 * Run: node build.js
 * Run after editing any sandcastle/*.js file.
 */
const pako = require('/tmp/node_modules/pako');
const fs = require('fs');
const path = require('path');

const SANDCASTLE_HTML = `<style>
  @import url(../templates/bucket.css);
</style>
<div id="cesiumContainer" class="fullSize"></div>
<div id="loadingOverlay"><h1>Loading...</h1></div>
<div id="toolbar"></div>`;

const STANDALONE = 'https://sandcastle.cesium.com/standalone.html#c=';
const EDITOR = 'https://sandcastle.cesium.com/#c=';

function encode(code) {
  const json = JSON.stringify([code, SANDCASTLE_HTML]);
  const inner = json.slice(2, json.length - 2);
  const compressed = pako.deflate(inner, { raw: true, level: 9 });
  return Buffer.from(compressed).toString('base64').replace(/=+$/, '');
}

const demos = [
  'sandcastle/disaster-response-hydrodynamic.js',
  'sandcastle/point-cloud-vs-buildings.js',
  'sandcastle/voxel-water-saturation.js',
  'sandcastle/timeseries-pointcloud-change.js',
];

const encoded = demos.map(f => {
  const code = fs.readFileSync(f, 'utf8');
  const hash = encode(code);
  console.log(`  ${path.basename(f)}: ${hash.length} chars`);
  return hash;
});

// Build UTC timestamp
const buildUTC = new Date().toISOString();
console.log(`\n  BUILD_UTC: ${buildUTC}`);

// Read template HTML (shizuoka-sandcastles.html) and update CTAs + BUILD_UTC
for (const htmlFile of ['shizuoka-sandcastles.html', 'docs/index.html']) {
  let html = fs.readFileSync(htmlFile, 'utf8');

  // Update BUILD_UTC
  html = html.replace(
    /const BUILD_UTC = "[^"]+"/,
    `const BUILD_UTC = "${buildUTC}"`
  );

  // Replace all 4 standalone URLs in order
  let count = 0;
  html = html.replace(
    /https:\/\/sandcastle\.cesium\.com\/standalone\.html#c=[A-Za-z0-9+/]*/g,
    () => STANDALONE + encoded[count++]
  );

  // Replace all 4 editor URLs in order
  count = 0;
  html = html.replace(
    /https:\/\/sandcastle\.cesium\.com\/#c=[A-Za-z0-9+/]*/g,
    () => EDITOR + encoded[count++]
  );

  fs.writeFileSync(htmlFile, html);
  console.log(`  ✓ ${htmlFile} updated`);
}

// Also copy to session files dir for canvas preview
const sessionDir = '/Users/jake.steinerman/.copilot/session-state/aa02b063-76b0-44c7-b93b-41d6e8627c3a/files/shizuoka-sandcastles.html';
try {
  fs.copyFileSync('shizuoka-sandcastles.html', sessionDir);
  console.log('  ✓ canvas preview copy updated');
} catch(e) {}

console.log('\nDone. Commit with: git add shizuoka-sandcastles.html docs/index.html sandcastle/ && git commit');
