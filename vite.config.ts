import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  base: '/traveller-rpg-assist/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    open: '/',
  },
  preview: {
    port: 5174,
    open: false,
  },
});
