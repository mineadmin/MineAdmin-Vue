import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const proxyPrefix = env.VITE_APP_PROXY_PREFIX

  return defineConfig({
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@cps': resolve(__dirname, 'src/components'),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      },
    },

    build: {
      chunkSizeWarningLimit: 3000,
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
