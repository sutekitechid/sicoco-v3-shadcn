import { cva, type VariantProps } from 'class-variance-authority'

export { default as Spinner } from './Spinner.vue'

export const spinnerVariants = cva('inline-flex animate-spin text-primary-default', {
	variants: {
		size: {
			sm: 'h-5 w-5',
			md: 'h-10 w-10',
			lg: 'h-12 w-12',
		},
	},
	defaultVariants: {
		size: 'md',
	},
})

export type SpinnerVariants = VariantProps<typeof spinnerVariants>
