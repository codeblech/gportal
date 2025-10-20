import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/gportal/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/glbajaj": {
        target: "https://glbg.servergi.com:8072",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/glbajaj/, "/ISIMGLB"),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["vite.svg", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "GPortal",
        short_name: "GPortal",
        description: "GL Bajaj College Student Portal",
        start_url: "/gportal/",
        theme_color: "#000000",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-icons/circle.ico",
            sizes: "48x48",
          },
          {
            src: "pwa-icons/circle.svg",
            sizes: "72x72 96x96",
            purpose: "maskable",
          },
          {
            src: "pwa-icons/circle.svg",
            sizes: "128x128 256x256",
          },
          {
            src: "pwa-icons/circle.svg",
            sizes: "512x512",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/glbg\.servergi\.com/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/gportal-proxy-server\.my-malikyash\.workers\.dev/,
            handler: "NetworkFirst",
            options: {
              cacheName: "worker-api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
});
