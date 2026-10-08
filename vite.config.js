import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Essential for GitHub Pages deployment in any repository subfolder
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
