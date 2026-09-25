import { cva, type VariantProps } from 'class-variance-authority'
export { default as PinInput } from './PinInput.vue'

export const pinInputVariants = cva(
	'pin__input rounded-lg border border-main bg-white text-center font-medium text-main caret-text-main ring-offset-neutral-100 placeholder:text-neutral-600 focus-visible:border-primary-default focus-visible:outline-hidden focus-visible:shadow-primary focus-visible:transition-shadow disabled:cursor-not-allowed',
	{
		variants: {
			size: {
				sm: 'h-10 w-10 text-title-sm',
				md: 'h-10 w-10 text-title-md',
				lg: 'h-12 w-12 text-title-lg',
			},
			disabled: {
				true: 'bg-disabled text-placeholder cursor-not-allowed',
			},
			readonly: {
				true: 'bg-disabled text-main',
			},
		},
		defaultVariants: {
			size: 'md',
			disabled: false,
			readonly: false,
		},
	}
)

export type PinInputVariants = VariantProps<typeof pinInputVariants>
