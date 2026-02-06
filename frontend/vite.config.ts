import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const allowedDomain = process.env.VITE_ALLOWED_HOST || 'localhost';
const baseDomain = process.env.DOMAIN || 'localhost';

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  plugins: [react(), TanStackRouterVite()],
  server: {
    host: '0.0.0.0',
    port: 80,
    hmr: {
      clientPort: process.env.VITE_HMR_PORT ? parseInt(process.env.VITE_HMR_PORT) : (baseDomain === 'localhost' ? 80 : 443),
      protocol: baseDomain === 'localhost' ? 'ws' : 'wss'
    },
    allowedHosts: [allowedDomain, new RegExp(`^(.+\.)?${allowedDomain.replace(/\./g, '\\.')}$`)]
  }
});
