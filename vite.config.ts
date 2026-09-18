import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages deployment lives under the /app/ project path — every
  // bundled and public asset URL must be prefixed with it. Vite rewrites
  // index.html references (favicon, module scripts) and publicDir files
  // (brand SVGs, robots, sitemap) through this base at build time.
  base: process.env.VITE_BASE ?? "/app/",
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      // The static entry is template.html; Pages (and vite preview) need the
      // emitted file named index.html — rename it in the bundle graph.
      name: "entry-rename-to-index",
      enforce: "post",
      generateBundle(_options, bundle) {
        const key = Object.keys(bundle).find(
          (k) => bundle[k].fileName === "template.html",
        );
        if (key) {
          const file = bundle[key];
          file.fileName = "index.html";
          delete bundle[key];
          bundle["index.html"] = file;
        }
      },
    },
    {
      // Corporate-identity review pages (static, public/brand-review/…).
      // Dev-only: Vite's SPA fallback rewrites extensionless directory URLs
      // to the app shell, so serve the public file directly for the review
      // routes. The production build serves the public/ directories
      // natively — zero build impact, not part of production navigation.
      name: "serve-brand-review",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req.url ?? "").split("?")[0];
          // Isolated review branch entry: the preview pane opens the port
          // root, which is the SPA. On THIS branch only (dev-only, never in
          // build/preview/production), redirect the bare root to the stamp
          // review page. A redirect (not a rewrite) so the page's relative
          // asset paths keep resolving. All app routes remain internally
          // reachable via their own paths.
          if (url === "/" || url === "/index.html") {
            res.statusCode = 302;
            res.setHeader("Location", "/brand-review/stamp/");
            res.end();
            return;
          }
          if (url === "/brand-review/stamp" || url === "/brand-review/stamp/") {
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            fs
              .createReadStream(
                path.resolve(__dirname, "public/brand-review/stamp/index.html"),
              )
              .pipe(res);
            return;
          }
          next();
        });
      },
    },
  ],
  build: {
    // Static HTML source entry. The repo-root index.html is reserved for the
    // built single-file bundle that GitHub Pages' branch-source pipeline
    // serves (kept in sync via npm run pages:sync / CI).
    // (object form keeps the emitted name as index.html, not template.html)
    rollupOptions: { input: { index: path.resolve(__dirname, "template.html") } },
  },
  server: {
    // Allow the sandbox/preview host (and any *.e2b.app dev host) in dev and preview.
    allowedHosts: [".e2b.app"],
    open: "/template.html",
    // Dev convenience: the quote API runs next to vite (npm run dev:api).
    proxy: { "/api": "http://localhost:8787" },
  },
  preview: {
    allowedHosts: [".e2b.app"],
    // Same /api wiring as dev, so `npm run preview` demos the real backend
    // flow (pair with `npm run dev:api`).
    proxy: { "/api": "http://localhost:8787" },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
