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
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost');
          const params = url.searchParams;
          const isLookup = params.has('id');
          const endpoint = isLookup ? '/lookup' : '/search';
          return `${endpoint}?${params.toString().replace('id=', 'id=')}`;
        },
      },
    },
  }
})
