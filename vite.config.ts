import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Asegúrate de que esto funcione
      '~': path.resolve(__dirname, './node_modules'),
    },
  },
  define: {
    'process.env': process.env, // Permite el acceso a variables de entorno
  },
});