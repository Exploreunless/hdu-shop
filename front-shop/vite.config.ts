import { defineConfig } from 'vite'
import {resolve} from 'path'
import vue from '@vitejs/plugin-vue'
// import vitePluginImp from 'vite-plugin-imp'
import vueJsx from '@vitejs/plugin-vue-jsx';


// https://vitejs.dev/config/
export default defineConfig({
  // base: '',
  // resolve: {
  //   alias: [
  //     {
  //       find: '@',
  //       replacement: '/src',
  //     },
  //   ],
  // },
  base: '/front',
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/dev-api': {
        target: 'http://10.253.193.65:8081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/dev-api/, ''),
      },
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import '/src/styles/variable.less';`,
        },
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    // vitePluginImp({
    //   libList: [
    //     // {
    //     //   libName: 'vant',
    //     //   style(name) {
    //     //     if (/CompWithoutStyleFile/i.test(name)) {
    //     //       return false
    //     //     }
    //     //     return `vant/es/${name}/style/index.js`
    //     //   }
    //     // }
    //   ]
    // })
  ],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks(id) { //静态资源分拆打包
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  }
})
