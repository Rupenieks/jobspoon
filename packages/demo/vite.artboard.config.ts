import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src/artboard"),
  base: "/artboard/",
  server: {
    port: 3001,
  },
});
