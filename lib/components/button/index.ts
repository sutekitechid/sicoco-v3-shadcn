import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

const SOLID = {
	primary:
		'text-white border border-transparent bg-primary-default ' +
		'hover:enabled:bg-primary-hover active:bg-primary-800 ' +
		'hover:enabled:border-primary-hover ' +
		'focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'text-white border border-transparent bg-secondary-default ' +
		'hover:enabled:bg-secondary-hover active:bg-secondary-800 ' +
		'hover:enabled:border-secondary-hover ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'text-white border border-transparent bg-danger-default ' +
		'hover:enabled:bg-danger-hover active:bg-danger-800 ' +
		'hover:enabled:border-danger-hover ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'text-white border border-transparent bg-warning-default ' +
		'hover:enabled:bg-warning-hover active:bg-warning-800 ' +
		'hover:enabled:border-warning-hover ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'text-white border border-transparent bg-success-default ' +
		'hover:enabled:bg-success-hover active:bg-success-800 ' +
		'hover:enabled:border-success-hover ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
	neutral:
		'bg-neutral-50 border border-main text-main ' +
		'hover:enabled:bg-disabled hover:enabled:border-neutral-950 ' +
		'active:bg-neutral-500 ' +
		'focus:bg-disabled focus:border-neutral-950 focus:outline-1 focus:outline focus-visible:border-neutral-950 focus-visible:outline-1 focus-visible:outline focus:outline-neutral-950 outline-offset-0',
} as const

const OUTLINED = {
	primary:
		'bg-transparent text-primary-default border border-primary-default ' +
		'hover:enabled:bg-primary-subtle active:bg-primary-subtle ' +
		'hover:enabled:border-primary-hover ' +
		'focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'bg-transparent text-secondary-default border border-secondary-default ' +
		'hover:enabled:bg-secondary-subtle active:bg-secondary-subtle ' +
		'hover:enabled:border-secondary-hover ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'bg-transparent text-danger-default border border-danger-default ' +
		'hover:enabled:bg-danger-subtle active:bg-danger-subtle ' +
		'hover:enabled:border-danger-hover ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'bg-transparent text-warning-default border border-warning-default ' +
		'hover:enabled:bg-warning-subtle active:bg-warning-subtle ' +
		'hover:enabled:border-warning-hover ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'bg-transparent text-success-default border border-success-default ' +
		'hover:enabled:bg-success-subtle active:bg-success-subtle ' +
		'hover:enabled:border-success-hover ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
} as const

const SECONDARY = {
	primary: OUTLINED.primary,
	secondary: OUTLINED.secondary,
	danger: OUTLINED.danger,
	warning: OUTLINED.warning,
	success: OUTLINED.success,
} as const

const TERTIARY = {
	primary:
		'bg-transparent text-main border border-transparent ' +
		'hover:enabled:bg-primary-subtle active:bg-primary-subtle ' +
		'focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'bg-transparent text-secondary-default border border-transparent ' +
		'hover:enabled:bg-secondary-subtle active:bg-secondary-subtle ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'bg-transparent text-danger-default border border-transparent ' +
		'hover:enabled:bg-danger-subtle active:bg-danger-subtle ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'bg-transparent text-warning-default border border-transparent ' +
		'hover:enabled:bg-warning-subtle active:bg-warning-subtle ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'bg-transparent text-success-default border border-transparent ' +
		'hover:enabled:bg-success-subtle active:bg-success-subtle ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
} as const

const LINK = {
	primary:
		'underline ' +
		'bg-transparent border border-transparent text-primary-default ' +
		'hover:enabled:text-primary-700 ' +
		'active:enabled:text-primary-800 ' +
		'focus:enabled:text-primary-800 focus-visible:enabled:text-primary-800',
	secondary:
		'underline ' +
		'bg-transparent border border-transparent text-secondary-default ' +
		'hover:enabled:text-secondary-700 ' +
		'active:enabled:text-secondary-800 ' +
		'focus:enabled:text-secondary-800 focus-visible:enabled:text-secondary-800',
	danger:
		'underline ' +
		'bg-transparent border border-transparent text-danger-default ' +
		'hover:enabled:text-danger-700 ' +
		'active:enabled:text-danger-800 ' +
		'focus:enabled:text-danger-800 focus-visible:enabled:text-danger-800',
	warning:
		'underline ' +
		'bg-transparent border border-transparent text-warning-default ' +
		'hover:enabled:text-warning-700 ' +
		'active:enabled:text-warning-800 ' +
		'focus:enabled:text-warning-800 focus-visible:enabled:text-warning-800',
	success:
		'underline ' +
		'bg-transparent border border-transparent text-success-default ' +
		'hover:enabled:text-success-700 ' +
		'active:enabled:text-success-800 ' +
		'focus:enabled:text-success-800 focus-visible:enabled:text-success-800',
	neutral:
		'underline ' +
		'bg-transparent border border-transparent text-main ' +
		'hover:enabled:text-neutral-700 ' +
		'active:enabled:text-neutral-800 ' +
		'focus:enabled:text-neutral-800 focus-visible:enabled:text-neutral-800',
} as const

const LINK_DISABLED =
	'bg-transparent text-disabled cursor-not-allowed shadow-none'

const SOLID_DISABLED =
	'bg-neutral-300 text-neutral-500 border-transparent ' +
	'shadow-none hover:bg-neutral-300 active:bg-neutral-300 cursor-not-allowed'

const OUTLINED_DISABLED =
	'bg-transparent text-neutral-500 border-neutral-500 ' +
	'shadow-none hover:bg-transparent active:bg-transparent cursor-not-allowed'

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors transition-shadow duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-none',
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
				'secondary-primary': SECONDARY.primary,
				'secondary-secondary': SECONDARY.secondary,
				'secondary-danger': SECONDARY.danger,
				'secondary-warning': SECONDARY.warning,
				'secondary-success': SECONDARY.success,
				'link-primary': LINK.primary,
				'link-secondary': LINK.secondary,
				'link-danger': LINK.danger,
				'link-warning': LINK.warning,
				'link-success': LINK.success,
				'link-neutral': LINK.neutral,
				'tertiary-primary': TERTIARY.primary,
				'tertiary-secondary': TERTIARY.secondary,
				'tertiary-danger': TERTIARY.danger,
				'tertiary-warning': TERTIARY.warning,
				'tertiary-success': TERTIARY.success,
			},
			size: {
				sm: 'text-label-sm rounded h-9 min-w-9',
				md: 'text-label-lg rounded h-11 min-w-11',
				lg: 'text-label-lg rounded-lg h-14 min-w-14',
			},
			content: {
				default: '',
				iconOnly: '',
				iconLeft: '',
				iconRight: '',
				iconBoth: '',
			},
			outlined: {
				true: '',
			},
			disabled: {
				true: 'active:scale-1',
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

			{ disabled: true, variant: 'link-primary', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-secondary', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-danger', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-warning', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-success', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-neutral', class: LINK_DISABLED },

			{
				disabled: true,
				variant: 'secondary-primary',
				class: OUTLINED_DISABLED,
			},
			{
				disabled: true,
				variant: 'secondary-secondary',
				class: OUTLINED_DISABLED,
			},
			{ disabled: true, variant: 'secondary-danger', class: OUTLINED_DISABLED },
			{
				disabled: true,
				variant: 'secondary-warning',
				class: OUTLINED_DISABLED,
			},
			{
				disabled: true,
				variant: 'secondary-success',
				class: OUTLINED_DISABLED,
			},

			{
				outlined: true,
				disabled: true,
				variant: 'default',
				class: OUTLINED_DISABLED,
			},
			{
				outlined: true,
				disabled: true,
				variant: 'primary',
				class: OUTLINED_DISABLED,
			},
			{
				outlined: true,
				disabled: true,
				variant: 'secondary',
				class: OUTLINED_DISABLED,
			},
			{
				outlined: true,
				disabled: true,
				variant: 'danger',
				class: OUTLINED_DISABLED,
			},
			{
				outlined: true,
				disabled: true,
				variant: 'warning',
				class: OUTLINED_DISABLED,
			},
			{
				outlined: true,
				disabled: true,
				variant: 'success',
				class: OUTLINED_DISABLED,
			},
			
			{ size: 'sm', content: ['default', 'iconBoth'], class: 'px-3' },
			{ size: 'sm', content: 'iconOnly', class: 'px-2' },
			{ size: 'sm', content: 'iconLeft', class: 'pl-3 pr-5' },
			{ size: 'sm', content: 'iconRight', class: 'pl-5 pr-3' },

			{ size: 'md', content: ['default', 'iconBoth'], class: 'px-4' },
			{ size: 'md', content: 'iconOnly', class: 'px-2' },
			{ size: 'md', content: 'iconLeft', class: 'pl-4 pr-6' },
			{ size: 'md', content: 'iconRight', class: 'pl-6 pr-4' },

			{ size: 'lg', content: ['default', 'iconBoth'], class: 'px-6' },
			{ size: 'lg', content: 'iconOnly', class: 'px-3' },
			{ size: 'lg', content: 'iconLeft', class: 'pl-6 pr-9' },
			{ size: 'lg', content: 'iconRight', class: 'pl-9 pr-6' },
		],
		defaultVariants: {
			variant: 'default',
			size: 'md',
			content: 'default',
			outlined: false,
			disabled: false,
		},
	},
)

export const buttonContentVariants = cva('inline-flex items-center', {
  variants: {
    size: {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-2',
    },
  },
  defaultVariants: {
	size: 'md'
  }
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
export type ButtonContentVariants = VariantProps<typeof buttonContentVariants>
