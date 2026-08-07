const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
	plugins: [require('tailwindcss-animate')],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1440px',
			tablet: '768px',
			'tablet-landscape': '1024px',
			desktop: '1280px',
			wide: '1440px',
		},
		colors: {
			...colors,
			transparent: 'transparent',
			current: 'currentColor',
		},
		extend: {
			borderWidth: {
				'1': '1px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--reka-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--reka-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			colors: {
				primary: {
					50: 'rgba(var(--color-primary-50) / <alpha-value>)',
					100: 'rgba(var(--color-primary-100) / <alpha-value>)',
					200: 'rgba(var(--color-primary-200) / <alpha-value>)',
					300: 'rgba(var(--color-primary-300) / <alpha-value>)',
					400: 'rgba(var(--color-primary-400) / <alpha-value>)',
					500: 'rgba(var(--color-primary-500) / <alpha-value>)',
					600: 'rgba(var(--color-primary-600) / <alpha-value>)',
					700: 'rgba(var(--color-primary-700) / <alpha-value>)',
					800: 'rgba(var(--color-primary-800) / <alpha-value>)',
					900: 'rgba(var(--color-primary-900) / <alpha-value>)',
					950: 'rgba(var(--color-primary-950) / <alpha-value>)',
					default: 'rgba(var(--color-primary-500) / <alpha-value>)',
					main: 'rgba(var(--color-primary-500) / <alpha-value>)',
					subtle: 'rgba(var(--color-primary-50) / <alpha-value>)',
					hover: 'rgba(var(--color-primary-700) / <alpha-value>)',
				},
				secondary: {
					50: 'rgba(var(--color-secondary-50) / <alpha-value>)',
					100: 'rgba(var(--color-secondary-100) / <alpha-value>)',
					200: 'rgba(var(--color-secondary-200) / <alpha-value>)',
					300: 'rgba(var(--color-secondary-300) / <alpha-value>)',
					400: 'rgba(var(--color-secondary-400) / <alpha-value>)',
					500: 'rgba(var(--color-secondary-500) / <alpha-value>)',
					600: 'rgba(var(--color-secondary-600) / <alpha-value>)',
					700: 'rgba(var(--color-secondary-700) / <alpha-value>)',
					800: 'rgba(var(--color-secondary-800) / <alpha-value>)',
					900: 'rgba(var(--color-secondary-900) / <alpha-value>)',
					950: 'rgba(var(--color-secondary-950) / <alpha-value>)',
					default: 'rgba(var(--color-secondary-500) / <alpha-value>)',
					main: 'rgba(var(--color-secondary-500) / <alpha-value>)',
					subtle: 'rgba(var(--color-secondary-50) / <alpha-value>)',
					hover: 'rgba(var(--color-secondary-700) / <alpha-value>)',
				},
				warning: {
					50: 'rgba(var(--color-warning-50) / <alpha-value>)',
					100: 'rgba(var(--color-warning-100) / <alpha-value>)',
					200: 'rgba(var(--color-warning-200) / <alpha-value>)',
					300: 'rgba(var(--color-warning-300) / <alpha-value>)',
					400: 'rgba(var(--color-warning-400) / <alpha-value>)',
					500: 'rgba(var(--color-warning-500) / <alpha-value>)',
					600: 'rgba(var(--color-warning-600) / <alpha-value>)',
					700: 'rgba(var(--color-warning-700) / <alpha-value>)',
					800: 'rgba(var(--color-warning-800) / <alpha-value>)',
					900: 'rgba(var(--color-warning-900) / <alpha-value>)',
					950: 'rgba(var(--color-warning-950) / <alpha-value>)',
					default: 'rgba(var(--color-warning-500) / <alpha-value>)',
					main: 'rgba(var(--color-warning-500) / <alpha-value>)',
					subtle: 'rgba(var(--color-warning-50) / <alpha-value>)',
					hover: 'rgba(var(--color-warning-700) / <alpha-value>)',
				},
				success: {
					50: 'rgba(var(--color-success-50) / <alpha-value>)',
					100: 'rgba(var(--color-success-100) / <alpha-value>)',
					200: 'rgba(var(--color-success-200) / <alpha-value>)',
					300: 'rgba(var(--color-success-300) / <alpha-value>)',
					400: 'rgba(var(--color-success-400) / <alpha-value>)',
					500: 'rgba(var(--color-success-500) / <alpha-value>)',
					600: 'rgba(var(--color-success-600) / <alpha-value>)',
					700: 'rgba(var(--color-success-700) / <alpha-value>)',
					800: 'rgba(var(--color-success-800) / <alpha-value>)',
					900: 'rgba(var(--color-success-900) / <alpha-value>)',
					950: 'rgba(var(--color-success-950) / <alpha-value>)',
					default: 'rgba(var(--color-success-500) / <alpha-value>)',
					main: 'rgba(var(--color-success-500) / <alpha-value>)',
					subtle: 'rgba(var(--color-success-50) / <alpha-value>)',
					hover: 'rgba(var(--color-success-700) / <alpha-value>)',
				},
				danger: {
					50: 'rgba(var(--color-danger-50) / <alpha-value>)',
					100: 'rgba(var(--color-danger-100) / <alpha-value>)',
					200: 'rgba(var(--color-danger-200) / <alpha-value>)',
					300: 'rgba(var(--color-danger-300) / <alpha-value>)',
					400: 'rgba(var(--color-danger-400) / <alpha-value>)',
					500: 'rgba(var(--color-danger-500) / <alpha-value>)',
					600: 'rgba(var(--color-danger-600) / <alpha-value>)',
					700: 'rgba(var(--color-danger-700) / <alpha-value>)',
					800: 'rgba(var(--color-danger-800) / <alpha-value>)',
					900: 'rgba(var(--color-danger-900) / <alpha-value>)',
					950: 'rgba(var(--color-danger-950) / <alpha-value>)',
					default: 'rgba(var(--color-danger-500) / <alpha-value>)',
					main: 'rgba(var(--color-danger-500) / <alpha-value>)',
					subtle: 'rgba(var(--color-danger-50) / <alpha-value>)',
					hover: 'rgba(var(--color-danger-700) / <alpha-value>)',
				},
				neutral: {
					50: 'rgba(var(--color-neutral-50) / <alpha-value>)',
					100: 'rgba(var(--color-neutral-100) / <alpha-value>)',
					200: 'rgba(var(--color-neutral-200) / <alpha-value>)',
					300: 'rgba(var(--color-neutral-300) / <alpha-value>)',
					400: 'rgba(var(--color-neutral-400) / <alpha-value>)',
					500: 'rgba(var(--color-neutral-500) / <alpha-value>)',
					600: 'rgba(var(--color-neutral-600) / <alpha-value>)',
					700: 'rgba(var(--color-neutral-700) / <alpha-value>)',
					800: 'rgba(var(--color-neutral-800) / <alpha-value>)',
					900: 'rgba(var(--color-neutral-900) / <alpha-value>)',
					950: 'rgba(var(--color-neutral-950) / <alpha-value>)',
				},
				info: {
					50: 'rgba(var(--color-info-50) / <alpha-value>)',
					100: 'rgba(var(--color-info-100) / <alpha-value>)',
					200: 'rgba(var(--color-info-200) / <alpha-value>)',
					300: 'rgba(var(--color-info-300) / <alpha-value>)',
					400: 'rgba(var(--color-info-400) / <alpha-value>)',
					500: 'rgba(var(--color-info-500) / <alpha-value>)',
					600: 'rgba(var(--color-info-600) / <alpha-value>)',
					700: 'rgba(var(--color-info-700) / <alpha-value>)',
					800: 'rgba(var(--color-info-800) / <alpha-value>)',
					900: 'rgba(var(--color-info-900) / <alpha-value>)',
					950: 'rgba(var(--color-info-950) / <alpha-value>)',
				},
				orange: {
					50: 'rgba(var(--color-orange-50) / <alpha-value>)',
					100: 'rgba(var(--color-orange-100) / <alpha-value>)',
					200: 'rgba(var(--color-orange-200) / <alpha-value>)',
					300: 'rgba(var(--color-orange-300) / <alpha-value>)',
					400: 'rgba(var(--color-orange-400) / <alpha-value>)',
					500: 'rgba(var(--color-orange-500) / <alpha-value>)',
					600: 'rgba(var(--color-orange-600) / <alpha-value>)',
					700: 'rgba(var(--color-orange-700) / <alpha-value>)',
					800: 'rgba(var(--color-orange-800) / <alpha-value>)',
					900: 'rgba(var(--color-orange-900) / <alpha-value>)',
					950: 'rgba(var(--color-orange-950) / <alpha-value>)',
				},
				white: '#ffffff',
				black: '#000000',
			},
			fontFamily: {
				sans: ['Inter', ...defaultTheme.fontFamily.sans],
			},
			fontSize: {
				xs: '0.75rem', // 12px
				sm: '0.875rem', // 14px
				base: '1rem', // 16px
				lg: '1.125rem', // 18px
				xl: '1.25rem', // 20px
				'2xl': '1.5rem', // 24px
				'3xl': '1.875rem', // 30px
				'display-xl': [
					'6rem', // 96px
					{ lineHeight: '6.75rem', /* 108px */ letterSpacing: '-0.125rem' },
				],
				'display-lg': [
					'5rem', // 80px
					{ lineHeight: '5.75rem', /* 92px */ letterSpacing: '-0.1875rem' },
				],
				'display-md': [
					'4rem', // 64px
					{ lineHeight: '4.75rem', /* 76px */ letterSpacing: '-0.125rem' },
				],
				'display-sm': [
					'3.25rem', // 52px
					{ lineHeight: '4rem', /* 64px */ letterSpacing: '-0.125rem' },
				],
				'heading-xl': [
					'2.5rem', // 40px
					{ lineHeight: '3.25rem', /* 52px */ letterSpacing: '-0.0625rem' },
				],
				'heading-lg': [
					'2.25rem', // 36px
					{ lineHeight: '3rem', /* 48px */ letterSpacing: '-0.0625rem' },
				],
				'heading-md': [
					'2rem', // 32px
					{ lineHeight: '2.75rem', /* 44px */ letterSpacing: '-0.0625rem' },
				],
				'heading-sm': [
					'1.75rem', // 28px
					{ lineHeight: '2.5rem', /* 40px */ letterSpacing: '0' },
				],
				'title-lg': [
					'1.5rem', // 24px
					{ lineHeight: '2.25rem', /* 36px */ letterSpacing: '0' },
				],
				'title-md': [
					'1.375rem', // 22px
					{ lineHeight: '2rem', /* 32px */ letterSpacing: '0' },
				],
				'title-sm': [
					'1.25rem', // 20px
					{ lineHeight: '1.875rem', /* 30px */ letterSpacing: '0' },
				],
				'body-lg': [
					'1.125rem', // 18px
					{ lineHeight: '1.75rem', /* 28px */ letterSpacing: '0' },
				],
				'body-md': [
					'1rem', // 16px
					{ lineHeight: '1.5rem', /* 24px */ letterSpacing: '0' },
				],
				'body-sm': [
					'0.875rem', // 14px
					{ lineHeight: '1.25rem', /* 20px */ letterSpacing: '0' },
				],
				'label-lg': [
					'1rem', // 16px
					{ lineHeight: '1.5rem', /* 24px */ letterSpacing: '0' },
				],
				'label-md': [
					'0.875rem', // 14px
					{ lineHeight: '1.25rem', /* 20px */ letterSpacing: '0' },
				],
				'label-sm': [
					'0.75rem', // 12px
					{ lineHeight: '1.125rem', /* 18px */ letterSpacing: '0' },
				],
				'caption-md': [
					'0.75rem', // 12px
					{ lineHeight: '1.375rem', /* 22px */ letterSpacing: '0' },
				],
				'caption-sm': [
					'0.6875rem', // 11px
					{ lineHeight: '1.125rem', /* 18px */ letterSpacing: '0' },
				],
			},
			fontWeight: {
				normal: '400',
				semibold: '600',
				bold: '700',
			},
			boxShadow: {
				'1': '0 1px 2px 0 rgba(var(--color-neutral-950) / 0.1)',
				'2': '0 4px 8px 0 rgba(var(--color-neutral-950) / 0.1)',
				primary: '0 0 0 3px var(--ring-primary)',
				secondary: '0 0 0 3px var(--ring-secondary)',
				warning: '0 0 0 3px var(--ring-warning)',
				success: '0 0 0 3px var(--ring-success)',
				danger: '0 0 0 3px var(--ring-danger)',
				neutral: '0 0 0 3px var(--ring-neutral)',
			},
		},
	},
}
