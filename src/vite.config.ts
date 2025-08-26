import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  root: './src',
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
})
