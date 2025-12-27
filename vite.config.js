import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5185,
    host: true,
    allowedHosts: [".trycloudflare.com"],
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
      variables: path.resolve(__dirname, "src/styles/_variables.scss"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Modern Sass API'sini kullan
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, "src"),
            path.resolve(__dirname, "src/styles"),
          ],
          outputStyle: "compressed",
          charset: false,
        },
      },
    },
  },
});
