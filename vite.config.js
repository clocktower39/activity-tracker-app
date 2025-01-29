import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: "autoUpdate",
      manifest: {
        name: "Activity Tracker",
        short_name: "Activity Tracker",
        description: "Track your activities effortlessly!",
        theme_color: "#000",
        background_color: "#000",
        display: "standalone",
        id:'/activity-tracker/',
        start_url: "/activity-tracker/",
        scope: "/activity-tracker/",
        icons: [
          {
            src: "favicon_144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  base: "/activity-tracker/",
});
