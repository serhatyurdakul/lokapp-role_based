import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5175,
  },
  plugins: [
    react(),
    svgr({
      include: ["**/*.svg"],
      svgrOptions: {
        exportType: "named",
        ref: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Modern Sass API'sini kullan
        sassOptions: {
          outputStyle: "compressed",
          charset: false,
        },
      },
    },
  },
});
