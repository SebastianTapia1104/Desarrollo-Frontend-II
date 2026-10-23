import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // En local queda "/". En GitHub Pages el flujo define VITE_BASE con el nombre del repositorio.
  base: process.env.VITE_BASE || "/",
  server: {
    port: 5173,
  },
});
