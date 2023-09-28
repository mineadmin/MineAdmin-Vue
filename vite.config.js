import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const proxyPrefix = env.VITE_APP_PROXY_PREFIX

  return defineConfig({
    base: env.VITE_APP_BASE,
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@cps': resolve(__dirname, 'src/components'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },

    build: {
      chunkSizeWarningLimit: 1500,
      // rollupOptions: {
      //   output: {
      //     manualChunks(id) {
      //       if (id.includes('node_modules')) {
      //         return id.toString().split("node_modules/")[1].split("/")[0].toString();
      //       }
      //     }
      //   }
      // }
    },

    server: {
      host: '0.0.0.0',
      port: env.VITE_APP_PORT || process.env.port,
      proxy: {
        [proxyPrefix]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true,
          toProxy: true,
          rewrite: path => path.replace(new RegExp(`^${proxyPrefix}`), ''),
        },
      },
    },
  })
}
