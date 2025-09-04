// import path from 'path'

import {
  fileURLToPath,
  URL
} from 'node:url'

import {
  defineConfig,
  loadEnv
} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// ElementPlus components
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// ElementPlus svg icon
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
// SvgSpritemap
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap'
// markdown
import mdPlugin from 'vite-plugin-markdown'

export default defineConfig(({
  mode
}) => {
  const env = loadEnv(mode, process.cwd())

  const config = {
    base: env.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    css: {
      // Customizing themes with unplugin-vue-components
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/theme/index.scss";`,
        },
      },
    },
    plugins: [
      mdPlugin.plugin({
        mode: [mdPlugin.Mode.VUE]
      }),
      // svg 雪碧图
      VitePluginSvgSpritemap('./src/icons/svg/*.svg', {
        // injectSvgOnDev: true,
      }),
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [
          // 自动导入 element plus 相关函数 如ElMessage
          ElementPlusResolver({
            importStyle: "sass", // Custom theme
          }),
          // Auto import icon components
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ],

      }),
      Components({
        resolvers: [
          // 自动导入 element plus 组件
          ElementPlusResolver({
            importStyle: "sass", // Custom theme
          }),
          // 自动注册图标组件@iconify-json/ep
          IconsResolver({
            // prefix: 'i', // 默认：'i' 使用： {prefix}-{collection}-{icon}
            enabledCollections: [
              'ep'
            ],
          }),
        ],
      }),
      Icons({
        autoInstall: true, // 自动安装了 enabledCollections 指定的图标 如@iconify-json/ep
      }),
    ],
    
  }

  return defineConfig(config)
})
