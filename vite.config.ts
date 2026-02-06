import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin } from 'vite'

// Plugin to inject Google Tag in HTML
const injectGoogleTag = (): Plugin => {
  return {
    name: 'inject-google-tag',
    transformIndexHtml(html) {
      const googleTagScript = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=AW-1792581474"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'AW-1792581474');
  </script>`;
      return html.replace('<head>', '<head>' + googleTagScript);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), injectGoogleTag()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
})
