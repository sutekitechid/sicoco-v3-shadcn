import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

const SOLID = {
	primary:
		'text-white border border-transparent bg-primary-default ' +
		'hover:bg-primary-hover [&:not([disabled])]:active:bg-primary-800 ' +
		'hover:border-primary-hover ' +
		'focus:border-primary-700 focus:shadow-primary focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'text-white border border-transparent bg-secondary-default ' +
		'hover:bg-secondary-hover [&:not([disabled])]:active:bg-secondary-800 ' +
		'hover:border-secondary-hover ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'text-white border border-transparent bg-danger-default ' +
		'hover:bg-danger-hover [&:not([disabled])]:active:bg-danger-800 ' +
		'hover:border-danger-hover ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'text-white border border-transparent bg-warning-default ' +
		'hover:bg-warning-hover [&:not([disabled])]:active:bg-warning-800 ' +
		'hover:border-warning-hover ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'text-white border border-transparent bg-success-default ' +
		'hover:bg-success-hover [&:not([disabled])]:active:bg-success-800 ' +
		'hover:border-success-hover ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
	neutral:
		'bg-neutral-50 border border-main text-main ' +
		'hover:bg-disabled hover:border-neutral-950 ' +
		'[&:not([disabled])]:active:bg-neutral-500 ' +
		'focus:bg-disabled focus:border-neutral-950 focus:outline-1 focus:outline focus-visible:border-neutral-950 focus-visible:outline-1 focus-visible:outline focus:outline-neutral-950 outline-offset-0',
} as const

const OUTLINED = {
	primary:
		'bg-transparent text-primary-default border border-primary-default ' +
		'hover:bg-primary-subtle [&:not([disabled])]:active:bg-primary-subtle ' +
		'hover:border-primary-hover ' +
		'focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'bg-transparent text-secondary-default border border-secondary-default ' +
		'hover:bg-secondary-subtle [&:not([disabled])]:active:bg-secondary-subtle ' +
		'hover:border-secondary-hover ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'bg-transparent text-danger-default border border-danger-default ' +
		'hover:bg-danger-subtle [&:not([disabled])]:active:bg-danger-subtle ' +
		'hover:border-danger-hover ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'bg-transparent text-warning-default border border-warning-default ' +
		'hover:bg-warning-subtle [&:not([disabled])]:active:bg-warning-subtle ' +
		'hover:border-warning-hover ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'bg-transparent text-success-default border border-success-default ' +
		'hover:bg-success-subtle [&:not([disabled])]:active:bg-success-subtle ' +
		'hover:border-success-hover ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
	neutral:
		'bg-transparent text-secondary border border-main ' +
		'hover:bg-neutral-100 hover:border-neutral-950 ' +
		'[&:not([disabled])]:active:bg-neutral-100 ' +
		'focus-visible:border-neutral-950 focus-visible:shadow-neutral',
} as const

const SECONDARY = {
	primary: OUTLINED.primary,
	secondary: OUTLINED.secondary,
	danger: OUTLINED.danger,
	warning: OUTLINED.warning,
	success: OUTLINED.success,
	neutral: OUTLINED.neutral,
} as const

const TERTIARY = {
	primary:
		'bg-transparent text-primary-default border border-transparent ' +
		'hover:bg-primary-subtle [&:not([disabled])]:active:bg-primary-subtle ' +
		'focus-visible:border-primary-700 focus-visible:shadow-primary',
	secondary:
		'bg-transparent text-secondary-default border border-transparent ' +
		'hover:bg-secondary-subtle [&:not([disabled])]:active:bg-secondary-subtle ' +
		'focus-visible:border-secondary-700 focus-visible:shadow-secondary',
	danger:
		'bg-transparent text-danger-default border border-transparent ' +
		'hover:bg-danger-subtle [&:not([disabled])]:active:bg-danger-subtle ' +
		'focus-visible:border-danger-700 focus-visible:shadow-danger',
	warning:
		'bg-transparent text-warning-default border border-transparent ' +
		'hover:bg-warning-subtle [&:not([disabled])]:active:bg-warning-subtle ' +
		'focus-visible:border-warning-700 focus-visible:shadow-warning',
	success:
		'bg-transparent text-success-default border border-transparent ' +
		'hover:bg-success-subtle [&:not([disabled])]:active:bg-success-subtle ' +
		'focus-visible:border-success-700 focus-visible:shadow-success',
	neutral:
		'bg-transparent text-main border border-transparent ' +
		'hover:bg-disabled [&:not([disabled])]:active:bg-disabled ' +
		'focus-visible:border-neutral-700 focus-visible:shadow-neutral',
} as const

const LINK = {
	primary:
		'bg-transparent border border-transparent text-primary-default ' +
		'hover:text-primary-700 ' +
		'[&:not([disabled])]:active:text-primary-800 ' +
		'focus:enabled:text-primary-800 focus-visible:enabled:text-primary-800',
	secondary:
		'bg-transparent border border-transparent text-secondary-default ' +
		'hover:text-secondary-700 ' +
		'[&:not([disabled])]:active:text-secondary-800 ' +
		'focus:enabled:text-secondary-800 focus-visible:enabled:text-secondary-800',
	danger:
		'bg-transparent border border-transparent text-danger-default ' +
		'hover:text-danger-700 ' +
		'[&:not([disabled])]:active:text-danger-800 ' +
		'focus:enabled:text-danger-800 focus-visible:enabled:text-danger-800',
	warning:
		'bg-transparent border border-transparent text-warning-default ' +
		'hover:text-warning-700 ' +
		'[&:not([disabled])]:active:text-warning-800 ' +
		'focus:enabled:text-warning-800 focus-visible:enabled:text-warning-800',
	success:
		'bg-transparent border border-transparent text-success-default ' +
		'hover:text-success-700 ' +
		'[&:not([disabled])]:active:text-success-800 ' +
		'focus:enabled:text-success-800 focus-visible:enabled:text-success-800',
	neutral:
		'bg-transparent border border-transparent text-secondary ' +
		'hover:text-neutral-700 ' +
		'[&:not([disabled])]:active:text-neutral-800 ' +
		'focus:enabled:text-neutral-800 focus-visible:enabled:text-neutral-800',
} as const

const LINK_DISABLED =
	'bg-transparent text-disabled hover:!bg-transparent active:bg-transparent ' +
	'hover:!text-disabled cursor-not-allowed shadow-none'

const SOLID_DISABLED =
	'bg-neutral-300 text-neutral-500 border-transparent ' +
	'shadow-none hover:!bg-neutral-300 hover:!border-transparent active:bg-neutral-300 cursor-not-allowed'

const OUTLINED_DISABLED =
	'bg-transparent text-neutral-500 border-neutral-500 ' +
	'shadow-none hover:!bg-transparent hover:!border-neutral-500 active:bg-transparent cursor-not-allowed'

export const buttonVariants = cva(
	'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors transition-shadow duration-150 ease-out [&:not([disabled])]:active:scale-[0.98] disabled:cursor-not-allowed [&_svg]:shrink-0 outline-hidden cursor-pointer',
	{
		variants: {
			variant: {
				default: SOLID.primary,
				primary: SOLID.primary,
				secondary: SOLID.secondary,
				danger: SOLID.danger,
				warning: SOLID.warning,
				success: SOLID.success,
				neutral: SECONDARY.neutral,
				'secondary-primary': SECONDARY.primary,
				'secondary-secondary': SECONDARY.secondary,
				'secondary-danger': SECONDARY.danger,
				'secondary-warning': SECONDARY.warning,
				'secondary-success': SECONDARY.success,
				'secondary-neutral': SECONDARY.neutral,
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
				'tertiary-neutral': TERTIARY.neutral,
			},
			size: {
				xs: 'text-label-sm rounded-sm h-7 min-w-7 py-1 button-xs',
				sm: 'text-label-md rounded-sm h-9 min-w-9 py-2 button-sm',
				md: 'text-label-lg rounded-sm h-12 min-w-12 py-3 button-md',
				lg: 'text-label-lg rounded-lg h-14 min-w-14 py-4 button-lg',
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

			{
				disabled: true,
				variant: [
					'tertiary-primary',
					'tertiary-secondary',
					'tertiary-danger',
					'tertiary-warning',
					'tertiary-success',
					'tertiary-neutral',
				],
				class: 'bg-transparent hover:bg-transparent active:bg-transparent',
			},

			{ disabled: true, variant: 'link-primary', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-secondary', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-danger', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-warning', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-success', class: LINK_DISABLED },
			{ disabled: true, variant: 'link-neutral', class: LINK_DISABLED },
			{ disabled: true, variant: 'neutral', class: OUTLINED_DISABLED },

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
			{ disabled: true, variant: 'secondary-neutral', class: OUTLINED_DISABLED },
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

			{ size: 'xs', content: ['default', 'iconBoth'], class: 'px-2' },
			{ size: 'xs', content: 'iconOnly', class: 'w-7 button-xs-icon-only' },
			{ size: 'xs', content: 'iconLeft', class: 'pl-2 pr-3' },
			{ size: 'xs', content: 'iconRight', class: 'pl-3 pr-2' },
			
			{ size: 'sm', content: ['default', 'iconBoth'], class: 'px-3' },
			{ size: 'sm', content: 'iconOnly', class: 'w-9' },
			{ size: 'sm', content: 'iconLeft', class: 'pl-3 pr-5' },
			{ size: 'sm', content: 'iconRight', class: 'pl-5 pr-3' },

			{ size: 'md', content: ['default', 'iconBoth'], class: 'px-4' },
			{ size: 'md', content: 'iconOnly', class: 'w-12' },
			{ size: 'md', content: 'iconLeft', class: 'pl-4 pr-6' },
			{ size: 'md', content: 'iconRight', class: 'pl-6 pr-4' },

			{ size: 'lg', content: ['default', 'iconBoth'], class: 'px-6' },
			{ size: 'lg', content: 'iconOnly', class: 'w-14' },
			{ size: 'lg', content: 'iconLeft', class: 'pl-6 pr-9' },
			{ size: 'lg', content: 'iconRight', class: 'pl-9 pr-6' },

			{
				variant: [
					'link-primary',
					'link-secondary',
					'link-danger',
					'link-warning',
					'link-success',
					'link-neutral',
				],
				class: '!w-fit !min-w-0 !h-fit !px-0',
			},

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

export const buttonContentVariants = cva('inline-flex items-center w-full justify-center', {
  variants: {
    size: {
	  xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-2',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
	size: 'md'
  }
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
export type ButtonContentVariants = VariantProps<typeof buttonContentVariants>
