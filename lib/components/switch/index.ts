import { cva, type VariantProps } from 'class-variance-authority'
export { default as Switch } from './Switch.vue'

export const switchVariants = cva(
	'peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-4 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 data-[state=unchecked]:bg-neutral-300 hover:data-[state=unchecked]:bg-neutral-100 focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-neutral-300',
	{
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
		},
		compoundVariants: [
			{
				variant: ['default', 'primary'],
				class: 'focus:ring-primary-50 data-[state=checked]:bg-primary-500',
			},
			{
				variant: 'success',
				class: 'focus:ring-success-50 data-[state=checked]:bg-success-500',
			},
			{
				variant: 'warning',
				class: 'focus:ring-warning-50 data-[state=checked]:bg-warning-500',
			},
			{
				variant: 'danger',
				class: 'focus:ring-danger-50 data-[state=checked]:bg-danger-500',
			},
			{
				variant: 'secondary',
				class: 'focus:ring-secondary-50 data-[state=checked]:bg-secondary-500',
			},
			{
				variant: ['grey', 'gray'],
				class: 'focus:ring-neutral-100 data-[state=checked]:bg-neutral-950',
			},
		],
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type SwitchVariants = VariantProps<typeof switchVariants>
