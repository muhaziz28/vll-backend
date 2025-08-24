import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const srcPath = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@app': srcPath
    }
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.e2e.ts']
  }
});