import { cva } from 'class-variance-authority'
export { default as PinInput } from './PinInput.vue'

export const pinInputVariants = cva(
	'pin__input w-11 h-11 bg-white rounded-lg text-center text-neutral-950 border border-neutral-400 dark:bg-neutral-100 ring-offset-neutral-100 placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/40 focus-visible:ring-offset-0 focus-visible:border-primary-500/60 disabled:cursor-not-allowed transition-colors focus-visible:transition-shadow',
	{
		variants: {
			disabled: {
				true: 'bg-neutral-300 text-neutral-500 cursor-not-allowed',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)
