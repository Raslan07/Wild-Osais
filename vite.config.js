import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {
      '@src': '/src',
      '@components': '/src/components',
      '@features': '/src/features',
      '@pages': '/src/pages',
      '@services': '/src/services',
      '@styles': '/src/styles',
      '@ui': '/src/ui',
    },
  },
  server: {
    open: true,
  },
});
