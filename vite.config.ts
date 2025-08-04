import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [tailwindcss(), reactRouter()],
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
}));
