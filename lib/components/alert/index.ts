import { cva, type VariantProps } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva(
	'relative w-full rounded-lg border-slate-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 dark:border-slate-800 dark:[&>svg]:text-slate-50',
	{
		variants: {
			variant: {
				primary:
					'bg-primary-10 dark:bg-primary-100 border-primary-50 dark:border-primary-50',
				warning:
					'bg-warning-10 dark:bg-warning-100 border-warning-50 dark:border-warning-50',
				danger:
					'bg-danger-10 dark:bg-danger-100 border-danger-80 dark:border-danger-80',
				success:
					'bg-success-10 dark:bg-success-100 border-success-50 dark:border-success-50',
				info: 'bg-info-10 dark:bg-info-100 border-info-50 dark:border-info-50',
			},
			bordered: {
				true: '!border-l-4 rounded-none',
				false: '',
			},
			outlined: {
				true: 'bg-white shadow-sm',
				false: 'border',
			},
		},
		compoundVariants: [
			{
				variant: 'primary',
				bordered: true,
				class: 'border-l-primary-90',
			},
			{
				variant: 'warning',
				bordered: true,
				class: 'border-l-warning-90',
			},
			{
				variant: 'danger',
				bordered: true,
				class: 'border-l-danger-80',
			},
			{
				variant: 'success',
				bordered: true,
				class: 'border-l-success-90',
			},
			{
				variant: 'info',
				bordered: true,
				class: 'border-l-info-100',
			},
		],
		defaultVariants: {
			variant: 'success',
		},
	}
)

export const alertVariantsIcon = cva('', {
	variants: {
		variant: {
			primary: 'si-info text-primary-90',
			success: 'si-check-circle text-success-90',
			warning: 'si-warning-alt text-warning-90',
			danger: 'si-x-circle text-danger-80',
			info: 'si-info text-info-90',
		},
	},
	defaultVariants: {
		variant: 'success',
	},
})

export type AlertVariants = VariantProps<typeof alertVariants>
export type AlertVariantsIcon = VariantProps<typeof alertVariantsIcon>
