import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

const autoImports = {
  "ElMessage": true
}

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'mockServiceWorker.js']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImports,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  {
    rules: {
      // Allow single-word component names
      'vue/multi-word-component-names': 'off',
    },
  },
  
])
