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
				'solid': '',
			'primary solid': '',
			info: '',
			'info solid': '',
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
				'neutral solid': ''
			},
		rounded: {
			false: 'rounded-sm',
			true: 'rounded-full',
		},
		size: {
			small: 'text-label-sm h-7 px-2 gap-1',
			medium: 'text-label-md h-7 px-3 gap-1',
			large: 'text-label-lg h-10 px-4 gap-2',
		},
		content: {
			default: '',
			iconLeft: '',
			iconOnly: 'justify-center p-0',
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
			class: 'bg-primary-subtle dark:bg-primary-200 text-primary-hover dark:text-primary-950',
		},
		{
			variant: 'info',
			class: 'bg-info-subtle dark:bg-info-200 text-info-press dark:text-info-950',
		},
		{
			variant: 'success',
			class: 'bg-success-subtle dark:bg-success-200 text-success-hover dark:text-success-950',
		},
		{
			variant: 'warning',
			class: 'bg-warning-100 text-warning-press',
		},
		{
			variant: 'danger',
			class: 'bg-danger-100 text-danger-hover',
		},
		{
			variant: 'secondary',
			class: 'bg-secondary-subtle text-secondary-hover',
		},
		{
			variant: ['grey', 'gray', 'neutral'],
			class: 'bg-neutral-300 text-main dark:text-neutral-700',
		},
		{
			variant: ['solid', 'primary solid'],
			class: 'bg-primary-default text-white dark:text-neutral-700',
		},
		{
			variant: 'info solid',
			class: 'bg-info-default text-white dark:text-neutral-700',
		},
		{
			variant: 'success solid',
			class: 'bg-success-default text-white dark:text-neutral-700',
		},
		{
			variant: 'warning solid',
			class: 'bg-warning-default text-white dark:text-neutral-50',
		},
		{
			variant: 'danger solid',
			class: 'bg-danger-default text-white dark:text-neutral-700',
		},
		{
			variant: 'secondary solid',
			class: 'bg-secondary-default text-white dark:text-neutral-700',
		},
		{
			variant: ['grey solid', 'gray solid', 'neutral solid'],
			class: 'bg-neutral-950 text-white dark:text-black',
		},
		{
			size: 'small',
			content: 'iconOnly',
			class: 'w-7',
		},
		{
			size: 'medium',
			content: 'iconOnly',
			class: 'w-7',
		},
		{
			size: 'large',
			content: 'iconOnly',
			class: 'w-10',
		},
	],
	defaultVariants: {
		variant: 'default',
		rounded: false,
		size: 'medium',
	},
})

export const badgeCloseIconVariants = cva('si-heroicon-solid-x-mark cursor-pointer', {
	variants: {
		variant: {
			default: '',
			primary: '',
			'solid': '',
			'primary solid': '',
			info: '',
			'info solid': '',
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
			small: 'before:text-label-sm ml-0.5',
			medium: 'before:text-label-md ml-1',
			large: 'before:text-label-lg ml-1',
		},
	},

	compoundVariants: [
		{
			variant: ['default', 'primary'],
			class: 'text-primary-700',
		},
		{
			variant: 'info',
			class: 'text-info-700',
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
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: 'info solid',
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: 'success solid',
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: 'warning solid',
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: 'danger solid',
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: 'secondary solid',
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: ['grey solid', 'gray solid'],
			class: 'text-white dark:text-neutral-700',
		},
		{
			variant: 'neutral solid',
			class: 'text-white dark:text-black',
		},
	],
	defaultVariants: {
		variant: 'default',
		size: 'medium',
	},
})


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
