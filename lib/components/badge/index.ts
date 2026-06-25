import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
	'inline-block whitespace-nowrap border-transparent w-fit flex justify-center items-center',
	{
		variants: {
			variant: {
				default: '',
				primary: '',
				success: '',
				warning: '',
				danger: '',
				secondary: '',
				grey: '',
				gray: '',
			},
			rounded: {
				false: 'rounded-md',
				true: 'rounded-full',
			},
			size: {
				small: 'text-xs font-normal leading-[18px] h-[22px] px-2',
				medium: 'text-xs font-semibold leading-[22px] h-6 px-2.5',
				large: 'text-sm font-semibold leading-[22px] h-7 px-3',
			},
		},
		compoundVariants: [
			{
				variant: ['default', 'primary'],
				class: 'bg-primary-50 text-primary-500',
			},
			{
				variant: 'success',
				class: 'bg-success-50 text-success-500',
			},
			{
				variant: 'warning',
				class: 'bg-warning-50 text-warning-500',
			},
			{
				variant: 'danger',
				class: 'bg-danger-50 text-danger-500',
			},
			{
				variant: 'secondary',
				class: 'bg-secondary-50 text-secondary-500',
			},
			{
				variant: ['grey', 'gray'],
				class: 'bg-neutral-100 text-neutral-500',
			},
		],
		defaultVariants: {
			variant: 'default',
			rounded: false,
			size: 'medium',
		},
	}
)

export const badgeCloseIconVariants = cva('si-x cursor-pointer ml-2 ', {
	variants: {
		variant: {
			default: '',
			primary: '',
			success: '',
			warning: '',
			danger: '',
			secondary: '',
			purple: '',
			grey: '',
			gray: '',
		},
		size: {
			small: 'text-xs',
			medium: 'text-xs',
			large: 'text-sm',
		},
	},

	compoundVariants: [
		{
			variant: ['default', 'primary'],
			class: 'text-primary-500',
		},
		{
			variant: 'success',
			class: 'text-success-200',
		},
		{
			variant: 'warning',
			class: 'text-warning-200',
		},
		{
			variant: 'danger',
			class: 'text-danger-200',
		},
		{
			variant: 'secondary',
			class: 'text-secondary-500',
		},
		{
			variant: 'purple',
			class: 'text-purple-100',
		},
		{
			variant: ['grey', 'gray'],
			class: 'text-neutral-500',
		},
	],
	defaultVariants: {
		variant: 'default',
		size: 'medium',
	},
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
export type BadgeCloseIconVariants = VariantProps<typeof badgeCloseIconVariants>
