import { cva, type VariantProps } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva(
	'relative w-full rounded-lg border-neutral-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-main dark:border-neutral-800 dark:[&>svg]:text-neutral-50',
	{
		variants: {
			variant: {
				primary:
					'bg-primary-subtle dark:bg-primary-default border-primary-200 dark:border-primary-200',
				warning:
					'bg-warning-subtle dark:bg-warning-default border-warning-200 dark:border-warning-200 dark:text-neutral-50',
				danger:
					'bg-danger-subtle dark:bg-danger-default border-danger-300 dark:border-danger-300',
				success:
					'bg-success-subtle dark:bg-success-default border-success-200 dark:border-success-200',
				info: 'bg-info-subtle dark:bg-info-default border-info-200 dark:border-info-200',
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
				class: 'border-l-info-default',
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
			primary: 'si-info text-primary-600 dark:text-neutral-700',
		success: 'si-check-circle text-success-600 dark:text-neutral-700',
		warning: 'si-warning-alt text-warning-600 dark:text-neutral-50',
		danger: 'si-x-circle text-danger-600 dark:text-neutral-700',
		info: 'si-info text-info-600 dark:text-neutral-700',
		},
	},
	defaultVariants: {
		variant: 'success',
	},
})

export type AlertVariants = VariantProps<typeof alertVariants>
export type AlertVariantsIcon = VariantProps<typeof alertVariantsIcon>
