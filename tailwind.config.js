const animate = require('tailwindcss-animate')
const presets = require('./lib/config/configPreset')

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['selector'],
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
	plugins: [
		animate,
		function ({ addUtilities }) {
			const textStrokeUtilities = {
				'.text-stroke-0': { '-webkit-text-stroke': '0px' },
				'.text-stroke-0-5': { '-webkit-text-stroke': '0.5px' },
				'.text-stroke-1': { '-webkit-text-stroke': '1px' },
				'.text-stroke-1-5': { '-webkit-text-stroke': '1.5px' },
				'.text-stroke-2': { '-webkit-text-stroke': '2px' },
				'.text-stroke-2-5': { '-webkit-text-stroke': '2.5px' },
				'.text-stroke-3': { '-webkit-text-stroke': '3px' },
				'.text-stroke-3-5': { '-webkit-text-stroke': '3.5px' },
				'.text-stroke-4': { '-webkit-text-stroke': '4px' },
				'.text-stroke-4-5': { '-webkit-text-stroke': '4.5px' },
				'.text-stroke-5': { '-webkit-text-stroke': '5px' },
			}
			addUtilities(textStrokeUtilities, ['responsive'])
		},
	],
	presets: [presets],
}
