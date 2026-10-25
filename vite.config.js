import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` keeps asset URLs relative so the build works when loaded from
// file:///android_asset/ inside an Android WebView.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019', // older Android System WebViews on TVs
    chunkSizeWarningLimit: 800,
  },
});
