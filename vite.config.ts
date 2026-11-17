import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: {
    outDir: 'build',
  },
  server: {
    host: true,
    port: 3000,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
