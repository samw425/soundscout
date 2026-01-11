import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy iTunes API requests during local dev (since Cloudflare Functions don't run in Vite dev)
      '/api/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        secure: false, // Handle HTTPS
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const params = url.searchParams;
          const isLookup = params.has('id');
          const endpoint = isLookup ? '/lookup' : '/search';
          return `${endpoint}?${params.toString()}`;
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            // Spoof User-Agent to avoid iTunes API blocks
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          });
        },
      },
    },
  }
})
