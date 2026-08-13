import { cva } from 'class-variance-authority'
export { default as PinInput } from './PinInput.vue'

export const pinInputVariants = cva(
	'pin__input w-12 h-12 bg-white rounded-lg text-center text-main dark:text-neutral-500 border border-main dark:bg-neutral-100 ring-offset-neutral-100 placeholder:text-neutral-600 focus-visible:outline-hidden focus-visible:shadow-primary focus-visible:border-primary-default disabled:cursor-not-allowed transition-colors focus-visible:transition-shadow',
	{
		variants: {
			disabled: {
				true: 'bg-disabled text-disabled cursor-not-allowed',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)
