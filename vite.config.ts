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
        followRedirects: true,
        rewrite: (path) => path.replace(/^\/api\/glbajaj/, "/ISIMGLB"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url, "->", proxyReq.path);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
            // Rewrite Location header to go through proxy
            if (proxyRes.headers.location) {
              const location = proxyRes.headers.location;
              console.log("Original redirect location:", location);
              // Convert absolute URLs to use the proxy path
              if (location.includes("glbg.servergi.com")) {
                const url = new URL(location);
                // Rewrite /ISIMGLB/* to /api/glbajaj/*
                const newPath = url.pathname.replace(/^\/ISIMGLB/, "/api/glbajaj");
                proxyRes.headers.location = newPath;
                console.log("Rewritten redirect location:", proxyRes.headers.location);
              } else if (location.startsWith("/ISIMGLB")) {
                // Handle relative URLs that start with /ISIMGLB
                proxyRes.headers.location = location.replace(/^\/ISIMGLB/, "/api/glbajaj");
                console.log("Rewritten redirect location:", proxyRes.headers.location);
              }
            }
          });
        },
      },
      "/ISIMGLB": {
        target: "https://glbg.servergi.com:8072",
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url, "->", proxyReq.path);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log("Received Response from the Target:", proxyRes.statusCode, req.url);
            // Rewrite Location header to go through proxy
            if (proxyRes.headers.location) {
              const location = proxyRes.headers.location;
              console.log("Original redirect location:", location);
              // If redirecting to /ISIMGLB/*, keep it as is (will be proxied)
              // If redirecting to absolute URL, convert to relative
              if (location.includes("glbg.servergi.com")) {
                const url = new URL(location);
                proxyRes.headers.location = url.pathname;
                console.log("Rewritten redirect location:", proxyRes.headers.location);
              }
            }
          });
        },
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
