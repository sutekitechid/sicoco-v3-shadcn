import { cva, type VariantProps } from 'class-variance-authority'

export const radioGroupItemVariant = cva(
	'group aspect-square h-5 w-5 cursor-pointer rounded-full border border-main transition-colors duration-500 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:border-main disabled:bg-disabled data-[state=checked]:disabled:text-disabled data-[state=checked]:text-white dark:text-neutral-500 dark:data-[state=checked]:text-neutral-700 text-main dark:text-neutral-500',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				primary: 'bg-transparent',
				danger: 'bg-transparent',
				warning: 'bg-transparent',
				success: 'bg-transparent',
			},
			disabled: {
				true: 'bg-neutral-100 text-disabled',
			},
		},
		compoundVariants: [
			{
				variant: ['default', 'primary'],
				disabled: false,
				class: 'hover:enabled:border-primary-700 focus:enabled:border-primary-700 focus:shadow-primary focus-visible:shadow-primary',
			},
			{
				variant: 'danger',
				disabled: false,
				class: 'hover:enabled:border-danger-700 focus:enabled:border-danger-700 focus:shadow-danger focus-visible:shadow-danger',
			},
			{
				variant: 'warning',
				disabled: false,
				class: 'hover:enabled:border-warning-700 focus:enabled:border-warning-700 focus:shadow-warning focus-visible:shadow-warning',
			},
			{
				variant: 'success',
				disabled: false,
				class: 'hover:enabled:border-success-700 focus:enabled:border-success-700 focus:shadow-success focus-visible:shadow-success',
			},
			{
				disabled: true,
				class: 'focus:shadow-transparent focus-visible:shadow-transparent',
			},
		],
		defaultVariants: {
			variant: 'default',
			disabled: false,
		},
	}
)

export type RadioGroupItemVariant = VariantProps<typeof radioGroupItemVariant>

export const radioGroupItemIndicatorVariant = cva(
	'flex h-full w-full items-center justify-center rounded-full transition-colors duration-500 ease-in-out',
	{
		variants: {
			variant: {
				default: 'bg-primary-default',
				primary: 'bg-primary-default',
				danger: 'bg-danger-default',
				warning: 'bg-warning-default',
				success: 'bg-success-default',
			},
			disabled: {
				true: '!bg-disabled text-disabled cursor-not-allowed',
			},
		},
		compoundVariants: [
			{
				variant: ['default', 'primary'],
				disabled: false,
				class: 'data-[state=checked]:group-hover:bg-primary-hover',
			},
			{
				variant: 'danger',
				disabled: false,
				class: 'data-[state=checked]:group-hover:bg-danger-hover',
			},
			{
				variant: 'warning',
				disabled: false,
				class: 'data-[state=checked]:group-hover:bg-warning-hover',
			},
			{
				variant: 'success',
				disabled: false,
				class: 'data-[state=checked]:group-hover:bg-success-hover',
			},
		],
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
				true: 'text-disabled dark:text-disabled hover:cursor-not-allowed',
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
				true: '!bg-neutral-400',
			},
		},
	}
)

export { default as RadioGroup } from './RadioGroup.vue'
export { default as RadioGroupItem } from './RadioGroupItem.vue'
export { default as RadioGroupItemLabel } from './RadioGroupItemLabel.vue'
export { default as RadioGroupErrorMessage } from './RadioGroupErrorMessage.vue'
