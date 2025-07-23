import { cva } from 'class-variance-authority'
export { default as PinInput } from './PinInput.vue'

export const pinInputVariants = cva(
	'pin__input w-11 h-11 bg-white rounded-md text-center text-neutral-100 border border-neutral-30 dark:bg-neutral-10 ring-offset-neutral-10 placeholder:text-neutral-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:ring-offset-0 focus-visible:border-primary-100/60 disabled:cursor-not-allowed disabled:opacity-50 transition-colors focus-visible:transition-shadow',
	{
		variants: {
			disabled: {
				true: 'bg-neutral-10 text-neutral-50 cursor-not-allowed',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)
