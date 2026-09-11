import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
// https://vite.dev/config/
export default defineConfig({
  base: './', // أضف هذا السطر هنا في البداية
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    // Allow the sandbox/preview host (and any *.e2b.app dev host) in dev and preview.
    allowedHosts: [".e2b.app"],
  },
  preview: {
    allowedHosts: [".e2b.app"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
