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
    },
    strictPort: true, // Add this to ensure it only uses port 3001
    host: true, // Add this to allow external access
  },
  build: {
    outDir: path.resolve(__dirname, "dist/resume-viewer"),
    emptyOutDir: true,
  },
});
