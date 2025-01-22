import { cva, type VariantProps } from 'class-variance-authority'

export { default as Alert } from './Alert.vue'
export { default as AlertDescription } from './AlertDescription.vue'
export { default as AlertTitle } from './AlertTitle.vue'

export const alertVariants = cva(
	'relative w-full rounded-lg border border-slate-200 p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-slate-950 dark:border-slate-800 dark:[&>svg]:text-slate-50',
	{
		variants: {
			variant: {
				warning:
					'bg-warning-10 dark:bg-warning-100 border-warning-100/30 dark:border-warning-100/30',
				danger:
					'bg-danger-10 dark:bg-danger-100 border-danger-100/30 dark:border-danger-100/30',
				success:
					'bg-success-10 dark:bg-success-100 border-success-100/30 dark:border-success-100/30',
			},
		},
		defaultVariants: {
			variant: 'success',
		},
	}
)

export const alertVariantsIcon = cva('', {
	variants: {
		variant: {
			success: 'si-check-circle text-success-100',
			warning: 'si-warning-alt text-warning-100',
			danger: 'si-x-circle text-danger-100',
		},
	},
	defaultVariants: {
		variant: 'success',
	},
})

export type AlertVariants = VariantProps<typeof alertVariants>
export type AlertVariantsIcon = VariantProps<typeof alertVariantsIcon>
