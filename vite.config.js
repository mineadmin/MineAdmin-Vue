import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default ({ mode }) => {

  const env = loadEnv(mode, process.cwd())
  const proxyPrefix = env.VITE_PROXY_PREFIX

  return defineConfig({
    plugins: [vue()],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@cps': resolve(__dirname, 'src/components')
      }
    },

    server:{
      host: '0.0.0.0',
      port: env.VITE_APP_PORT || process.env.port,
      proxy:{
        [ proxyPrefix ]: {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          ws: true,
          toProxy: true,
          rewrite: (path) => path.replace(new RegExp(`^${proxyPrefix}`), '')
        }
      }
    }
  })
}