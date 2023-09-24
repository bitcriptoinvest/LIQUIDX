import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';

/** Styles - WindiCSS utility framework */
import WindiCSS from 'vite-plugin-windicss';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import nodePolyfills from 'rollup-plugin-polyfill-node';

// https://vitejs.dev/config/
export default defineConfig({
  // define: {
  //   global: 'globalThis',
  // },
  plugins: [vue(), eslintPlugin(), WindiCSS()],
  resolve: {
    alias: {
      '@': '/src',
      web3: 'web3/dist/web3.min.js',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills(),
        inject({
          util: 'util/',
        }),
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});
