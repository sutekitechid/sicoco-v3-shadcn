// eslint.config.js
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
  {
    files: ['**/*.vue', '**/*.ts', '**/*.js'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': ts,
    },
    rules: {
      ...vue.configs.recommended.rules,
      ...ts.configs.recommended.rules,

      // optional rules
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/.output/**',
      'src/**',
      "**/config/**",
      "tailwind.config.js",
      "cypress.config.ts"
    ],
  },
]
