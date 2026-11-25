import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Proxy /api to the Spring service so the browser treats every request as
    // same-origin. The refresh-token cookie is HttpOnly + SameSite=Lax, which only
    // rides along on same-origin requests - the proxy is what makes that work in
    // dev without flipping cookies to SameSite=None + Secure.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
