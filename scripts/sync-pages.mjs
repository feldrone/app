/**
 * GitHub Pages sync (legacy branch-source mode).
 * Pages deploys this repo's ROOT folder, so the entry index.html at the
 * root must be the BUILT single-file bundle (the app template lives in
 * template.html). Run after `npm run build`:
 *   node scripts/sync-pages.mjs
 * Copies dist/index.html → ./index.html (with a do-not-edit banner) and
 * public/favicon.svg → ./favicon.svg so /app/favicon.svg resolves on Pages.
 * CI does this automatically; the Actions-artifact pipeline remains the
 * forward-looking deploy path if the Pages source is switched to
 * "GitHub Actions".
 */
import fs from "node:fs";

const banner =
  "<!-- GENERATED FILE — built artifact of template.html (npm run build && npm run pages:sync). Do not edit by hand. -->\n";

const distHtml = fs.readFileSync("dist/index.html", "utf8");
if (distHtml.includes("/src/main.tsx")) {
  console.error("refusing to sync: dist/index.html looks like the dev template, run the build first");
  process.exit(1);
}
fs.writeFileSync("index.html", banner + distHtml);
fs.copyFileSync("public/favicon.svg", "favicon.svg");
console.log("synced: index.html (" + (banner.length + distHtml.length) + " bytes) + favicon.svg");
