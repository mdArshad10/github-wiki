import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  cacheDir: process.env.VITE_CACHE_DIR ?? "/private/tmp/github-wiki-vite-cache",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
