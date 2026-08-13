import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [vue(), tailwindcss()],
  root: './src',
  base: mode === 'e2e' ? '/' : '/sicoco-v3-shadcn/',
  build: {
    outDir: '../dist-app',
    emptyOutDir: true
  },

	resolve: {
		alias: {
			'@': resolve(__dirname, '../lib'),
			Quill: 'quill',
		},
	},
}))
