import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// Vite config para tema WordPress ink-theme.
// Un solo bundle `app` cargado en todas las plantillas: monta el chrome
// (header/footer) una vez, hidrata las secciones de cada página y maneja la
// navegación AJAX (fetch + swap del <main> sin recargar). El manifest.json lo
// lee PHP en inc/enqueue.php.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  root: '.',
  base: '/wp-content/themes/ink-theme/dist/',
  build: {
    outDir: 'dist',
    manifest: true,
    emptyOutDir: true,
    sourcemap: false,
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'src/entries/app.jsx'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/chunk-[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
}));
