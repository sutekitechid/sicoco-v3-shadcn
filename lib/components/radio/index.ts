import { cva, type VariantProps } from 'class-variance-authority'

export const radioGroupItemVariant = cva(
	'aspect-square h-5 w-5 rounded-full border border-neutral-300 ring-offset-neutral-100 focus:outline-none focus-visible:ring-4 hover:ring-4 disabled:cursor-not-allowed hover:scale-110 transition duration-200 ease-in-out transform',
	{
		variants: {
			variant: {
				default: 'focus:ring-primary-500/30 hover:ring-primary-500/30',
				primary: 'focus:ring-primary-500/30 hover:ring-primary-500/30',
				danger: 'focus:ring-danger-500/30 hover:ring-danger-500/30',
				warning: 'focus:ring-warning-500/30 hover:ring-warning-500/30',
				success: 'focus-visible:ring-success-500/30 hover:ring-success-500/30',
			},
			disabled: {
				true: 'bg-neutral-100/50 text-neutral-300 cursor-not-allowed hover:ring-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			disabled: false,
		},
	}
)

export type RadioGroupItemVariant = VariantProps<typeof radioGroupItemVariant>

export const radioGroupItemIndicatorVariant = cva(
	'flex items-center justify-center w-full h-full rounded-full',
	{
		variants: {
			variant: {
				default: 'bg-primary-500',
				primary: 'bg-primary-500',
				danger: 'bg-danger-500',
				warning: 'bg-warning-500',
				success: 'bg-success-500',
			},
			disabled: {
				true: '!bg-neutral-100/50 text-neutral-500 cursor-not-allowed hover:ring-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			disabled: false,
		},
	}
)

export const radioGroupItemLabelVariant = cva(
	'text-neutral-950 text-left cursor-pointer',
	{
		variants: {
			disabled: {
				true: 'text-neutral-500 cursor-not-allowed',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)

export const radioGroupItemInnerIndicator = cva(
	'h-2 w-2 rounded-full radio-group-item-indicator bg-neutral-100',
	{
		variants: {
			disabled: {
				true: '!bg-neutral-300',
			},
		},
	}
)

export { default as RadioGroup } from './RadioGroup.vue'
export { default as RadioGroupItem } from './RadioGroupItem.vue'
export { default as RadioGroupItemLabel } from './RadioGroupItemLabel.vue'
export { default as RadioGroupErrorMessage } from './RadioGroupErrorMessage.vue'
