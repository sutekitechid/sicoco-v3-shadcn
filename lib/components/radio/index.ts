import { cva, type VariantProps } from 'class-variance-authority'

export const radioGroupItemVariant = cva(
	'group aspect-square h-5 w-5 rounded-full border border-neutral-400 disabled:border-neutral-400 focus:outline-none focus-visible:ring-4 focus:ring-4 disabled:cursor-not-allowed transition-colors duration-500 ease-in-out transform data-[state=checked]:disabled:text-neutral-400 disabled:bg-neutral-300 data-[state=checked]:text-white dark:text-neutral-500 dark:data-[state=checked]:text-neutral-700 text-neutral-950 dark:text-neutral-500',
	{
		variants: {
			variant: {
				default: 'focus:ring-primary-50 hover:border-primary-700',
				primary: 'focus:ring-primary-50 hover:border-primary-700',
				danger: 'focus:ring-danger-50 hover:border-danger-700',
				warning: 'focus:ring-warning-50 hover:border-warning-700',
				success: 'focus:ring-success-50 hover:border-success-700',
			},
			disabled: {
				true: 'bg-neutral-50 text-neutral-400 dark:text-neutral-500 hover:ring-0',
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
	'flex items-center justify-center w-full h-full rounded-full transition-colors duration-500 ease-in-out transform',
	{
		variants: {
			variant: {
				default: 'bg-primary-500 data-[state=checked]:group-hover:bg-primary-700',
				primary: 'bg-primary-500 data-[state=checked]:group-hover:bg-primary-700',
				danger: 'bg-danger-500 data-[state=checked]:group-hover:bg-danger-700',
				warning: 'bg-warning-500 data-[state=checked]:group-hover:bg-warning-700',
				success: 'bg-success-500 data-[state=checked]:group-hover:bg-success-700',
			},
			disabled: {
				true: '!bg-neutral-300 text-neutral-500 cursor-not-allowed hover:ring-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			disabled: false,
		},
	}
)

export const radioGroupItemLabelVariant = cva(
	'text-left cursor-pointer text-label-md peer-disabled:opacity-100',
	{
		variants: {
			disabled: {
				true: 'text-neutral-400 dark:text-neutral-500 hover:cursor-not-allowed',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)

export const radioGroupItemInnerIndicator = cva(
	'h-2 w-2 rounded-full radio-group-item-indicator bg-white',
	{
		variants: {
			disabled: {
				true: '!bg-neutral-500',
			},
		},
	}
)

export { default as RadioGroup } from './RadioGroup.vue'
export { default as RadioGroupItem } from './RadioGroupItem.vue'
export { default as RadioGroupItemLabel } from './RadioGroupItemLabel.vue'
export { default as RadioGroupErrorMessage } from './RadioGroupErrorMessage.vue'
