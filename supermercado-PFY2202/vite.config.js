import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // En local queda "/". En GitHub Pages el flujo define VITE_BASE con el nombre del repositorio.
  base: process.env.VITE_BASE || "/",
  server: {
    port: 5173,
  },
});
