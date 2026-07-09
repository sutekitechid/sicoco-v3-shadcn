import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

const SOLID = {
	primary:
		'text-white border border-transparent bg-primary-500 ' +
		'hover:enabled:bg-primary-hover active:bg-primary-800 ' +
		'hover:enabled:border-primary-hover ' +
		'focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'text-white border border-transparent bg-secondary-500 ' +
		'hover:enabled:bg-secondary-hover active:bg-secondary-800 ' +
		'hover:enabled:border-secondary-hover ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'text-white border border-transparent bg-danger-500 ' +
		'hover:enabled:bg-danger-hover active:bg-danger-800 ' +
		'hover:enabled:border-danger-hover ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'text-white border border-transparent bg-warning-500 ' +
		'hover:enabled:bg-warning-hover active:bg-warning-800 ' +
		'hover:enabled:border-warning-hover ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'text-white border border-transparent bg-success-500 ' +
		'hover:enabled:bg-success-hover active:bg-success-800 ' +
		'hover:enabled:border-success-hover ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
	neutral:
		'bg-neutral-50 border border-neutral-400 text-neutral-950 ' +
		'hover:enabled:bg-disabled hover:enabled:border-neutral-950 ' +
		'active:bg-neutral-500 ' +
		'focus:bg-disabled focus:border-neutral-950 focus:outline-1 focus:outline focus-visible:border-neutral-950 focus-visible:outline-1 focus-visible:outline focus:outline-neutral-950 outline-offset-0',
} as const

const OUTLINED = {
	primary:
		'bg-transparent text-primary-500 border border-primary-500 ' +
		'hover:enabled:bg-primary-50 active:bg-primary-50 ' +
		'hover:enabled:border-primary-hover ' +
		'focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'bg-transparent text-secondary-500 border border-secondary-500 ' +
		'hover:enabled:bg-secondary-50 active:bg-secondary-50 ' +
		'hover:enabled:border-secondary-hover ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'bg-transparent text-danger-500 border border-danger-500 ' +
		'hover:enabled:bg-danger-50 active:bg-danger-50 ' +
		'hover:enabled:border-danger-hover ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'bg-transparent text-warning-500 border border-warning-500 ' +
		'hover:enabled:bg-warning-50 active:bg-warning-50 ' +
		'hover:enabled:border-warning-hover ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'bg-transparent text-success-500 border border-success-500 ' +
		'hover:enabled:bg-success-50 active:bg-success-50 ' +
		'hover:enabled:border-success-hover ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
} as const

const SOLID_DISABLED =
	'bg-neutral-300 text-neutral-500 border-transparent ' +
	'shadow-none hover:bg-neutral-300 active:bg-neutral-300 cursor-not-allowed'

const OUTLINED_DISABLED =
	'bg-transparent text-neutral-500 border-neutral-500 ' +
	'shadow-none hover:bg-transparent active:bg-transparent cursor-not-allowed'

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out active:enabled:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-none',
	{
		variants: {
			variant: {
				default: SOLID.primary,
				primary: SOLID.primary,
				secondary: SOLID.secondary,
				danger: SOLID.danger,
				warning: SOLID.warning,
				success: SOLID.success,
				neutral: SOLID.neutral,
			},
			size: {
				sm: 'px-2 text-label-sm rounded h-9 min-w-9',
				md: 'px-3 text-label-md rounded-lg h-11 min-w-11',
				lg: 'px-6 text-label-lg rounded-xl h-14 min-w-14',
			},
			outlined: {
				true: '',
			},
			disabled: {
				true: '',
			},
		},
		compoundVariants: [
			{ outlined: true, variant: 'default', class: OUTLINED.primary },
			{ outlined: true, variant: 'primary', class: OUTLINED.primary },
			{ outlined: true, variant: 'secondary', class: OUTLINED.secondary },
			{ outlined: true, variant: 'danger', class: OUTLINED.danger },
			{ outlined: true, variant: 'warning', class: OUTLINED.warning },
			{ outlined: true, variant: 'success', class: OUTLINED.success },

			{ disabled: true, class: SOLID_DISABLED },

			{ outlined: true, disabled: true, variant: 'default', class: OUTLINED_DISABLED },
			{ outlined: true, disabled: true, variant: 'primary', class: OUTLINED_DISABLED },
			{ outlined: true, disabled: true, variant: 'secondary', class: OUTLINED_DISABLED },
			{ outlined: true, disabled: true, variant: 'danger', class: OUTLINED_DISABLED },
			{ outlined: true, disabled: true, variant: 'warning', class: OUTLINED_DISABLED },
			{ outlined: true, disabled: true, variant: 'success', class: OUTLINED_DISABLED },
		],
		defaultVariants: {
			variant: 'default',
			size: 'md',
			outlined: false,
			disabled: false,
		},
	}
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
