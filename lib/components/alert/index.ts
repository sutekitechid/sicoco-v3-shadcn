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
					'bg-primary-50 dark:bg-primary-500 border-primary-200 dark:border-primary-200',
				warning:
					'bg-warning-50 dark:bg-warning-500 border-warning-200 dark:border-warning-200',
				danger:
					'bg-danger-50 dark:bg-danger-500 border-danger-300 dark:border-danger-300',
				success:
					'bg-success-50 dark:bg-success-500 border-success-200 dark:border-success-200',
				info: 'bg-info-50 dark:bg-info-500 border-info-200 dark:border-info-200',
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
				class: 'border-l-primary-400',
			},
			{
				variant: 'warning',
				bordered: true,
				class: 'border-l-warning-400',
			},
			{
				variant: 'danger',
				bordered: true,
				class: 'border-l-danger-300',
			},
			{
				variant: 'success',
				bordered: true,
				class: 'border-l-success-400',
			},
			{
				variant: 'info',
				bordered: true,
				class: 'border-l-info-500',
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
			primary: 'si-info text-primary-400',
			success: 'si-check-circle text-success-400',
			warning: 'si-warning-alt text-warning-400',
			danger: 'si-x-circle text-danger-300',
			info: 'si-info text-info-400',
		},
	},
	defaultVariants: {
		variant: 'success',
	},
})

export type AlertVariants = VariantProps<typeof alertVariants>
export type AlertVariantsIcon = VariantProps<typeof alertVariantsIcon>
