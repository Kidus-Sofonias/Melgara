import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Three main vendor chunks + per-route page chunks (React.lazy).
        // · react  — framework + router (smallest, loads first)
        // · three  — WebGL renderer + all 3D code (only pulled by 3D pages)
        // · ui     — carousel + smooth-scroll utilities
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          react: ["react", "react-dom", "react-router-dom"],
          ui: ["embla-carousel-react", "embla-carousel-autoplay", "lenis"],
        },
      },
    },
    // The GLB models + ores photos are static assets in public/ — the
    // 3D scenes stay lightweight because geometry ships in the .glb files.
    // three is a big vendor chunk by nature; it only loads on 3D pages.
    chunkSizeWarningLimit: 1000,
  },
});
