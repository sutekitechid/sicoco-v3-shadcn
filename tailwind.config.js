const presets = require('./lib/config/configPreset')

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['selector', '[data-mode="dark"]'],
	content: [
		'./pages/**/*.{ts,tsx,vue}',
		'./src/**/*.{ts,tsx,vue}',
		'./lib/**/*.{ts,tsx,vue}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
	},
	presets: [presets],
}
