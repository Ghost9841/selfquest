// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-manifest',
      closeBundle() {
        // Ensure dist exists
        if (!existsSync('dist')) {
          mkdirSync('dist');
        }
        
        // Copy files
        try {
          copyFileSync('public/manifest.json', 'dist/manifest.json');
          
          // Only copy icons if they exist
          const icons = ['icon16.png', 'icon48.png', 'icon128.png'];
          icons.forEach(icon => {
            try {
              copyFileSync(`public/${icon}`, `dist/${icon}`);
            } catch (e) {
              console.log(`⚠️ ${icon} not found, skipping...`);
            }
          });
          
          console.log('✅ Manifest and icons copied to dist');
        } catch (err) {
          console.error('❌ Error copying files:', err);
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor libraries into a separate chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit to 1000kb (extension is fine)
    chunkSizeWarningLimit: 1000,
  },
});