import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['pw-tests', 'node_modules'],
  },
});
