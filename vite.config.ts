import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/gratitude_tracker/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  define: {
    "import.meta.env.VITE_DATABASE_URL": JSON.stringify(process.env.VITE_DATABASE_URL),
    "import.meta.env.VITE_NEON_PROJECT_ID": JSON.stringify(process.env.VITE_NEON_PROJECT_ID),
    "import.meta.env.VITE_NEON_API_KEY": JSON.stringify(process.env.VITE_NEON_API_KEY),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
