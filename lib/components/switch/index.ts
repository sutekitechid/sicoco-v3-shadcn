import { cva, type VariantProps } from 'class-variance-authority'
export { default as Switch } from './Switch.vue'

export const switchVariants = cva(
	'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-4 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=unchecked]:bg-grey-30 hover:data-[state=unchecked]:bg-grey-20 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-grey-30',
	{
		variants: {
			type: {
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
		},
		compoundVariants: [
			{
				type: ['default', 'primary'],
				class: 'focus:ring-primary-20 data-[state=checked]:bg-primary-100',
			},
			{
				type: 'success',
				class: 'focus:ring-success-20 data-[state=checked]:bg-success-100',
			},
			{
				type: 'warning',
				class: 'focus:ring-warning-20 data-[state=checked]:bg-warning-100',
			},
			{
				type: 'danger',
				class: 'focus:ring-danger-20 data-[state=checked]:bg-danger-100',
			},
			{
				type: 'secondary',
				class: 'focus:ring-secondary-20 data-[state=checked]:bg-secondary-100',
			},
			{
				type: 'purple',
				class: 'focus:ring-purple-20 data-[state=checked]:bg-purple-100',
			},
			{
				type: ['grey', 'gray'],
				class: 'focus:ring-grey-20 data-[state=checked]:bg-grey-100',
			},
		],
		defaultVariants: {
			type: 'default',
		},
	}
)

export type SwitchVariants = VariantProps<typeof switchVariants>
