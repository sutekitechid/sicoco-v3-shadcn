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
					'bg-primary-subtle dark:bg-primary-default border-primary-main dark:border-primary-200 text-primary-800',
				warning:
					'bg-warning-subtle dark:bg-warning-default border-warning-main dark:border-warning-200 text-warning-800',
				danger:
					'bg-danger-subtle dark:bg-danger-default border-danger-main dark:border-danger-300 text-danger-800',
				success:
					'bg-success-subtle dark:bg-success-default border-success-main dark:border-success-200 text-success-800',
				info: 'bg-info-subtle dark:bg-info-default border-info-main dark:border-info-200 text-info-800',
				neutral: 'bg-white border-main text-main',
			},
			bordered: {
				true: '!border-l-4 rounded-none',
				false: '',
			},
			outlined: {
				true: 'bg-white shadow-xs',
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
	},
)

export const alertVariantsIcon = cva('', {
	variants: {
		variant: {
			primary: 'text-primary-default dark:text-neutral-700',
			success: 'text-success-default dark:text-neutral-700',
			warning: 'text-warning-default dark:text-neutral-50',
			danger: 'text-danger-default dark:text-neutral-700',
			info: 'text-info-default dark:text-neutral-700',
			neutral: 'text-main',
		},
	},
	defaultVariants: {
		variant: 'success',
	},
})

export const alertDefaultIconVariants = cva('', {
	variants: {
		variant: {
			primary: 'si-heroicon-solid-information-circle',
			success: 'si-heroicon-solid-check-circle',
			warning: 'si-warning-alt',
			danger: 'si-heroicon-solid-exclamation-triangle',
			info: 'si-heroicon-solid-information-circle',
			neutral: 'si-heroicon-solid-information-circle',
		},
	},
	defaultVariants: {
		variant: 'success',
	},
})

export type AlertVariants = VariantProps<typeof alertVariants>
export type AlertVariantsIcon = VariantProps<typeof alertVariantsIcon>
