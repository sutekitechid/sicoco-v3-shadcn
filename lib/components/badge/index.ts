import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'
export { default as BadgeFilter } from './BadgeFilter.vue'

export const badgeVariants = cva(
	'inline-flex whitespace-nowrap border-transparent w-fit items-center font-medium',
	{
		variants: {
			variant: {
				default: '',
				primary: '',
				solid: '',
				'primary solid': '',
				success: '',
				'success solid': '',
				warning: '',
				'warning solid': '',
				danger: '',
				'danger solid': '',
				secondary: '',
				'secondary solid': '',
				grey: '',
				'grey solid': '',
				gray: '',
				'gray solid': '',
				neutral: '',
				'neutral solid': '',
			},
			rounded: {
				false: 'rounded-lg',
				true: 'rounded-full',
			},
			size: {
				small: 'text-label-sm h-6 px-2',
				medium: 'text-label-md h-7 px-3',
				large: 'text-label-lg h-8 px-4',
			},
			closeable: {
				true: '',
			},
		},
		compoundVariants: [
			{
				size: 'small',
				closeable: true,
				class: 'pr-1',
			},
			{
				size: 'medium',
				closeable: true,
				class: 'pr-2',
			},
			{
				size: 'large',
				closeable: true,
				class: 'pr-3',
			},
			{
				variant: ['default', 'primary'],
				class: 'bg-primary-subtle  text-primary-700 ',
			},
			{
				variant: 'success',
				class: 'bg-success-subtle  text-success-700 ',
			},
			{
				variant: 'warning',
				class: 'bg-warning-100 text-warning-700',
			},
			{
				variant: 'danger',
				class: 'bg-danger-100 text-danger-700',
			},
			{
				variant: 'secondary',
				class: 'bg-secondary-100 text-secondary-700',
			},
			{
				variant: ['grey', 'gray', 'neutral'],
				class: 'bg-neutral-300 text-main',
			},
			{
				variant: ['solid', 'primary solid'],
				class: 'bg-primary-default text-white',
			},
			{
				variant: 'success solid',
				class: 'bg-success-default text-white',
			},
			{
				variant: 'warning solid',
				class: 'bg-warning-default text-white',
			},
			{
				variant: 'danger solid',
				class: 'bg-danger-default text-white',
			},
			{
				variant: 'secondary solid',
				class: 'bg-secondary-default text-white',
			},
			{
				variant: ['grey solid', 'gray solid', 'neutral solid'],
				class: 'bg-neutral-950 text-white',
			},
		],
		defaultVariants: {
			variant: 'default',
			rounded: false,
			size: 'medium',
		},
	},
)

export const badgeCloseIconVariants = cva(
	'si-heroicon-solid-x-mark cursor-pointer',
	{
		variants: {
			variant: {
				default: '',
				primary: '',
				solid: '',
				'primary solid': '',
				success: '',
				'success solid': '',
				warning: '',
				'warning solid': '',
				danger: '',
				'danger solid': '',
				secondary: '',
				'secondary solid': '',
				purple: '',
				grey: '',
				'grey solid': '',
				gray: '',
				'gray solid': '',
				neutral: '',
				'neutral solid': '',
			},
			size: {
				small: 'icon-sm ml-0.5',
				medium: 'icon-md ml-1',
				large: 'icon-md ml-1',
			},
		},

		compoundVariants: [
			{
				variant: ['default', 'primary'],
				class: 'text-primary-700',
			},
			{
				variant: 'success',
				class: 'text-success-700',
			},
			{
				variant: 'warning',
				class: 'text-warning-700',
			},
			{
				variant: 'danger',
				class: 'text-danger-700',
			},
			{
				variant: 'secondary',
				class: 'text-secondary-700',
			},
			{
				variant: 'purple',
				class: 'text-purple-100',
			},
			{
				variant: ['grey', 'gray'],
				class: 'text-neutral-500',
			},
			{
				variant: ['solid', 'primary solid'],
				class: 'text-white',
			},
			{
				variant: 'success solid',
				class: 'text-white',
			},
			{
				variant: 'warning solid',
				class: 'text-white',
			},
			{
				variant: 'danger solid',
				class: 'text-white',
			},
			{
				variant: 'secondary solid',
				class: 'text-white',
			},
			{
				variant: ['grey solid', 'gray solid'],
				class: 'text-white',
			},
			{
				variant: 'neutral solid',
				class: 'text-white',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'medium',
		},
	},
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
export type BadgeCloseIconVariants = VariantProps<typeof badgeCloseIconVariants>

export const badgeFilterVariants = cva(
	'p-4 inline-flex items-center gap-2 border font-medium whitespace-nowrap',
	{
		variants: {
			state: {
				default:
					'border-neutral-300 bg-transparent text-main ' +
					'hover:bg-secondary-50 hover:border-secondary-500 hover:text-secondary-500',
				selected:
					'border-secondary-500 bg-secondary-50 text-secondary-500 ' +
					'hover:bg-secondary-50 hover:border-secondary-500',
				inactive:
					'border-neutral-300 bg-neutral-50 text-neutral-500 cursor-not-allowed',
			},
		},
		defaultVariants: {
			state: 'default',
		},
	},
)

export const badgeFilterCounterVariants = cva(
	'inline-flex items-center justify-center rounded-full ' +
		'min-w-5 min-h-5 aspect-square leading-none text-xs font-semibold',
	{
		variants: {
			state: {
				default: 'bg-secondary-500 text-white',
				selected: 'bg-secondary-500 text-white',
				inactive: 'bg-neutral-500 text-white',
			},
		},
		defaultVariants: {
			state: 'default',
		},
	},
)

export type BadgeFilterCounterVariants = VariantProps<
	typeof badgeFilterCounterVariants
>
export type BadgeFilterVariants = VariantProps<typeof badgeFilterVariants>
