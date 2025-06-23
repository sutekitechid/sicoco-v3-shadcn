import { cva, type VariantProps } from 'class-variance-authority'

export const generateRandomName = () => {
	return `input__${Math.random().toString(36).substring(7)}`
}

export const baseInputCva = cva('block relative transition-all duration-300', {
	variants: {
		invalid: {
			true: 'input__has-error',
			false: '',
		},
	},
	defaultVariants: {
		invalid: false,
	},
})

export { default } from './BaseInput.vue'
