import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  root: 'ThreeDify-frontend',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'ThreeDify-frontend/src')
    }
  }
})
