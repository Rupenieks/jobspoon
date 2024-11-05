import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src/resume-viewer/src"),
  base: "/",
  server: {
    port: 3001,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    },
    strictPort: true,
    host: true,
  },
  build: {
    outDir: path.resolve(__dirname, "dist/resume-viewer"),
    emptyOutDir: true,
  },
});
