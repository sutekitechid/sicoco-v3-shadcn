import { cva, type VariantProps } from 'class-variance-authority'
export { default as Switch } from './Switch.vue'

export const switchContainerVariants = cva(
	'cursor-pointer',
	{
		variants: {
			disabled: {
				true: 'cursor-not-allowed text-neutral-400'
			},
		}
	}
)

export const switchVariants = cva(
	'peer inline-flex h-5 w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none data-[state=unchecked]:bg-neutral-400 disabled:cursor-not-allowed disabled:!bg-neutral-300',
	{
		variants: {
			variant: {
				default: 'hover:enabled:border-primary-700',
				primary: 'hover:enabled:border-primary-700',
				success: 'hover:enabled:border-success-700',
				warning: 'hover:enabled:border-warning-700',
				danger: 'hover:enabled:border-danger-700',
				secondary: 'hover:enabled:border-secondary-700',
				grey: 'hover:enabled:border-neutral-950',
				gray: 'hover:enabled:border-neutral-950',
				neutral: 'hover:enabled:border-neutral-950'
			},
		},
		compoundVariants: [
			{
				variant: ['default', 'primary'],
				class: 'focus:border-primary-500 focus:shadow-primary focus-visible:shadow-primary data-[state=checked]:bg-primary-500 disabled:focus:shadow-transparent disabled:focus-visible:shadow-transparent',
			},
			{
				variant: 'success',
				class: 'focus:border-success-500 focus:shadow-success focus-visible:shadow-success data-[state=checked]:bg-success-500 disabled:focus:shadow-transparent disabled:focus-visible:shadow-transparent',
			},
			{
				variant: 'warning',
				class: 'focus:border-warning-500 focus:shadow-warning focus-visible:shadow-warning data-[state=checked]:bg-warning-500 disabled:focus:shadow-transparent disabled:focus-visible:shadow-transparent',
			},
			{
				variant: 'danger',
				class: 'focus:border-danger-500 focus:shadow-danger focus-visible:shadow-danger data-[state=checked]:bg-danger-500 disabled:focus:shadow-transparent disabled:focus-visible:shadow-transparent',
			},
			{
				variant: 'secondary',
				class: 'focus:border-secondary-500 focus:shadow-secondary focus-visible:shadow-secondary data-[state=checked]:bg-secondary-500 disabled:focus:shadow-transparent disabled:focus-visible:shadow-transparent',
			},
			{
				variant: ['grey', 'gray', 'neutral'],
				class: 'focus:border-neutral-500 focus:shadow-neutral focus-visible:shadow-neutral data-[state=checked]:bg-neutral-950 disabled:focus:shadow-transparent disabled:focus-visible:shadow-transparent',
			},
		],
		defaultVariants: {
			variant: 'default',
		},
	}
)

export const switchLabelVariant = cva(
	'text-left cursor-pointer text-label-md peer-disabled:opacity-100',
	{
		variants: {
			disabled: {
				true: 'text-neutral-400 dark:text-neutral-500',
			},
		},
		defaultVariants: {
			disabled: false,
		},
	}
)

export const thumbVariant = cva(
	'pointer-events-none block h-4 w-4 rounded-full bg-neutral-100 shadow-lg ring-0 transition-transform mx-0.5 data-[state=checked]:translate-x-[0.7rem]',
	{
		variants: {
			disabled: {
				true: 'data-[state=checked]:bg-neutral-400'
			}
		}
	}
)

export type SwitchVariants = VariantProps<typeof switchVariants>
