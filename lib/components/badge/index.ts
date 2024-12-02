import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
	'inline-block whitespace-nowrap border-transparent w-fit flex justify-center items-center',
	{
		variants: {
			type: {
				default: '',
				primary: '',
				success: '',
				warning: '',
				danger: '',
				secondary: '',
				tertiary: '',
				grey: '',
				gray: '',
			},
			rounded: {
				false: 'rounded-md',
				true: 'rounded-full',
			},
			size: {
				small: 'text-xs font-normal leading-[18px] py-0.5 px-2',
				medium: 'text-xs font-semibold leading-[22px] py-[3px] px-2.5',
				large: 'text-sm font-semibold leading-[22px] py-[3px] px-3',
			},
		},
		compoundVariants: [
			{
				type: ['default', 'primary'],
				class: 'bg-primary-10 text-primary-100',
			},
			{
				type: ['success'],
				class: 'bg-success-10 text-success-100',
			},
			{
				type: ['warning'],
				class: 'bg-warning-10 text-warning-100',
			},
			{
				type: ['danger'],
				class: 'bg-danger-10 text-danger-100',
			},
			{
				type: 'secondary',
				class: 'bg-secondary-10 text-secondary-100',
			},
			{
				type: ['tertiary'],
				class: 'bg-purple-10 text-purple-100',
			},
			{
				type: ['grey', 'gray'],
				class: 'bg-grey-10 text-grey-60',
			},
		],
		defaultVariants: {
			type: 'default',
			rounded: false,
			size: 'medium',
		},
	}
)

export const badgeCloseIconVariants = cva('si-x cursor-pointer ml-2 ', {
	variants: {
		type: {
			default: '',
			primary: '',
			success: '',
			warning: '',
			danger: '',
			secondary: '',
			tertiary: '',
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
			type: ['default', 'primary'],
			class: 'text-primary-100',
		},
		{
			type: ['success'],
			class: 'text-success-60',
		},
		{
			type: ['warning'],
			class: 'text-warning-60',
		},
		{
			type: ['danger'],
			class: 'text-danger-60',
		},
		{
			type: ['secondary'],
			class: 'text-secondary-100',
		},
		{
			type: ['tertiary'],
			class: 'text-tertiary-100',
		},
		{
			type: ['grey', 'gray'],
			class: 'text-grey-60',
		},
	],
	defaultVariants: {
		type: 'default',
		size: 'medium',
	},
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
export type BadgeCloseIconVariants = VariantProps<typeof badgeCloseIconVariants>
