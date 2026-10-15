import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import articles from './scripts/vite-plugin-articles.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), articles()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
