import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
	'inline-block px-2 py-1 text-xs font-medium whitespace-nowrap border-transparent',
	{
		variants: {
			type: {
				default: '',
				primary: '',
				success: '',
				green: '',
				warning: '',
				yellow: '',
				danger: '',
				red: '',
				secondary: '',
				cyan: '',
				purple: '',
				tertiary: '',
				grey: '',
				gray: '',
			},
			isRounded: {
				false: 'rounded-[0.25rem]',
				true: 'rounded-full',
			},
		},
		compoundVariants: [
			{
				type: ['default', 'primary'],
				class: 'bg-primary-10 text-primary-100',
			},
			{
				type: ['success', 'green'],
				class: 'bg-success-10 text-success-100',
			},
			{
				type: ['warning', 'yellow'],
				class: 'bg-warning-10 text-warning-100',
			},
			{
				type: ['danger', 'red'],
				class: 'bg-danger-10 text-danger-100',
			},
			{
				type: 'secondary',
				class: 'bg-secondary-10 text-secondary-100',
			},
			{
				type: ['purple', 'tertiary'],
				class: 'bg-purple-10 text-purple-100',
			},
			{
				type: ['grey', 'gray'],
				class: 'bg-grey-10 text-grey-60',
			},
		],
		defaultVariants: {
			type: 'default',
			isRounded: true,
		},
	}
)

export const badgeCloseIconVariants = cva('si-x my-auto cursor-pointer', {
	variants: {
		type: {
			default: '',
			primary: '',
			success: '',
			green: '',
			warning: '',
			yellow: '',
			danger: '',
			red: '',
			secondary: '',
			cyan: '',
			purple: '',
			tertiary: '',
			grey: '',
			gray: '',
		},
	},

	compoundVariants: [
		{
			type: ['default', 'primary'],
			class: 'text-primary-100',
		},
		{
			type: ['success', 'green'],
			class: 'text-success-60',
		},
		{
			type: ['warning', 'yellow'],
			class: 'text-warning-60',
		},
		{
			type: ['danger', 'red'],
			class: 'text-danger-60',
		},
		{
			type: ['secondary', 'cyan'],
			class: 'text-secondary-100',
		},
		{
			type: ['purple', 'tertiary'],
			class: 'text-tertiary-100',
		},
		{
			type: ['grey', 'gray'],
			class: 'text-grey-60',
		},
	],
	defaultVariants: {
		type: 'default',
	},
})

export type BadgeVariants = VariantProps<typeof badgeVariants>
export type BadgeCloseIconVariants = VariantProps<typeof badgeCloseIconVariants>
