import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  base: './', // السطر الأساسي لحل مشكلة الصور والمسارات
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    allowedHosts: [".e2b.app"],
  },
  preview: {
    allowedHosts: [".e2b.app"],
  },
});
