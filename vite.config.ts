import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    // Allow the sandbox/preview host (and any *.e2b.app dev host) in dev and preview.
    allowedHosts: [".e2b.app"],
  },
  preview: {
    allowedHosts: [".e2b.app"],
  },
});
