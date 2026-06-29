import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
	'inline-flex items-center text-white dark:text-neutral-950 justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background focus:ring-primary-500/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-fit transition-transform transition-shadow duration-150 ease-out active:scale-95 active:shadow-inner',
	{
		variants: {
			variant: {
				default: 'bg-primary-500 hover:bg-primary-500/90',
				primary: 'bg-primary-500 hover:bg-primary-500/90',
				danger: 'bg-danger-500 hover:bg-danger-500/90 focus:ring-danger-500/30',
				warning:
					'bg-warning-500 hover:bg-warning-500/90 focus:ring-warning-500/30',
				success:
					'bg-success-500 hover:bg-success-500/90 focus:ring-success-500/30',
				secondary: 'bg-secondary-500 hover:bg-secondary-500/90',
				'default light':
					'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20',
				'primary light':
					'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20',
				'secondary light':
					'bg-secondary-500/10 text-secondary-500 hover:bg-secondary-500/20',
				'danger light':
					'bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 focus:ring-danger-500/30',
				'warning light':
					'bg-warning-500/10 text-warning-500 hover:bg-warning-500/20 focus:ring-warning-500/30',
				'success light':
					'bg-success-500/10 text-success-500 hover:bg-success-500/20 focus:ring-success-500/30',
				'light default':
					'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20',
				'light primary':
					'bg-primary-500/10 text-primary-500 hover:bg-primary-500/20',
				'light secondary':
					'bg-secondary-500/10 text-secondary-500 hover:bg-secondary-500/20',
				'light danger':
					'bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 focus:ring-danger-500/30',
				'light warning':
					'bg-warning-500/10 text-warning-500 hover:bg-warning-500/20 focus:ring-warning-500/30',
				'light success':
					'bg-success-500/10 text-success-500 hover:bg-success-500/20 focus:ring-success-500/30',
			},
			size: {
				default: 'h-11 px-4 py-3',
				sm: 'h-8 px-3 py-2 text-xs rounded',
				md: 'h-11 px-4 py-3',
				lg: 'h-14 px-8 py-4 text-base',
			},
			rounded: {
				true: 'rounded-full',
			},
			outlined: {
				true: 'bg-transparent border border-neutral-300 hover:text-neutral-100',
			},
			disabled: {
				true: 'bg-neutral-300 text-white dark:text-neutral-950 cursor-not-allowed hover:bg-neutral-300 hover:text-white dark:text-neutral-950 dark:hover:text-neutral-950',
			},
		},
		compoundVariants: [
			{
				variant: 'default',
				outlined: true,
				disabled: false,
				class: 'text-primary-500 hover:bg-primary-500/90',
			},
			{
				variant: 'primary',
				outlined: true,
				disabled: false,
				class: 'text-primary-500',
			},
			{
				variant: 'secondary',
				outlined: true,
				disabled: false,
				class: 'text-secondary-500',
			},
			{
				variant: 'danger',
				outlined: true,
				disabled: false,
				class: 'text-danger-500',
			},
			{
				variant: 'warning',
				outlined: true,
				disabled: false,
				class: 'text-warning-500',
			},
			{
				variant: 'success',
				outlined: true,
				disabled: false,
				class: 'text-success-500',
			},
			{
				variant: [
					'default light',
					'primary light',
					'secondary light',
					'danger light',
					'warning light',
					'success light',
					'light default',
					'light primary',
					'light secondary',
					'light danger',
					'light warning',
					'light success',
				],
				disabled: true,
				class: 'hover:bg-neutral-100',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'default',
			rounded: false,
			outlined: false,
			disabled: false,
		},
	}
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
