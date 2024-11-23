import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // asegúrate de que Vite usa el archivo de configuración correcto
  },
  build: {
    outDir: 'dist', // Define la carpeta de salida
  },
});
