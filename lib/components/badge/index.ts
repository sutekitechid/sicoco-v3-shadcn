import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
	'inline-flex whitespace-nowrap border-transparent w-fit items-center font-medium',
	{
		variants: {
			variant: {
				default: '',
				primary: '',
				'solid': '',
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
				'neutral solid': ''
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
			class: 'bg-primary-50 dark:bg-primary-200 text-primary-700 dark:text-primary-950',
		},
			{
				variant: 'success',
				class: 'bg-success-50 dark:bg-success-200 text-success-700 dark:text-success-950',
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
				class: 'bg-neutral-300 text-neutral-950 dark:text-neutral-700',
			},
			{
				variant: ['solid', 'primary solid'],
				class: 'bg-primary-500 text-white dark:text-neutral-700',
			},
			{
				variant: 'success solid',
				class: 'bg-success-500 text-white dark:text-neutral-700',
			},
			{
				variant: 'warning solid',
				class: 'bg-warning-500 text-white dark:text-neutral-50',
			},
			{
				variant: 'danger solid',
				class: 'bg-danger-500 text-white dark:text-neutral-700',
			},
			{
				variant: 'secondary solid',
				class: 'bg-secondary-500 text-white dark:text-neutral-700',
			},
			{
				variant: ['grey solid', 'gray solid', 'neutral solid'],
				class: 'bg-neutral-950 text-white dark:text-black',
			},
		],
		defaultVariants: {
			variant: 'default',
			rounded: false,
			size: 'medium',
		},
	}
)

export const badgeCloseIconVariants = cva('si-sr-cross-small cursor-pointer', {
	variants: {
		variant: {
			default: '',
			primary: '',
			'solid': '',
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
