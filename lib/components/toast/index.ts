import type { ToastRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

export { default as Toast } from './Toast.vue'
export { default as ToastAction } from './ToastAction.vue'
export { default as ToastClose } from './ToastClose.vue'
export { default as ToastDescription } from './ToastDescription.vue'
export { default as Toaster } from './Toaster.vue'
export { default as ToastProvider } from './ToastProvider.vue'
export { default as ToastTitle } from './ToastTitle.vue'
export { default as ToastViewport } from './ToastViewport.vue'
export { toast, useToast } from './use-toast'

import { cva, type VariantProps } from 'class-variance-authority'

export const toastVariants = cva(
	'text-neutral-100 dark:text-neutral-10 group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[--radix-toast-swipe-end-x] data-[swipe=move]:translate-x-[--radix-toast-swipe-move-x] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
	{
		variants: {
			variant: {
				default:
					'bg-primary-10 dark:bg-primary-100 border-primary-100/30 dark:border-primary-100/30',
				primary:
					'bg-primary-10 dark:bg-primary-100 border-primary-100/30 dark:border-primary-100/30',
				warning:
					'bg-warning-10 dark:bg-warning-100 border-warning-100/30 dark:border-warning-100/30',
				danger:
					'bg-danger-10 dark:bg-danger-100 border-danger-100/30 dark:border-danger-100/30',
				success:
					'bg-success-10 dark:bg-success-100 border-success-100/30 dark:border-success-100/30',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

type ToastVariants = VariantProps<typeof toastVariants>
export type ToastVariantPosition = 'top' | 'bottom'

export interface ToastProps extends ToastRootProps {
	class?: HTMLAttributes['class']
	variant?: ToastVariants['variant']
	onOpenChange?: ((value: boolean) => void) | undefined
}

export const toastIconVariantEnum = {
	default: 'si-info text-primary-100 dark:text-primary-10',
	primary: 'si-info text-primary-100 dark:text-primary-10',
	warning: 'si-alert-triangle text-warning-100 dark:text-warning-10',
	danger: 'si-cross-circle text-danger-100 dark:text-danger-10',
	success: 'si-check-circle text-success-100 dark:text-success-10',
}

export const getToastIcon = (variant: ToastVariants['variant']) => {
	switch (variant) {
		case 'warning':
			return toastIconVariantEnum.warning
		case 'danger':
			return toastIconVariantEnum.danger
		case 'success':
			return toastIconVariantEnum.success
		default:
			return toastIconVariantEnum.primary
	}
}

export const getToastPosition = (position: ToastVariantPosition) => {
	switch (position) {
		case 'bottom':
			return '!bottom-0'
		default:
			return '!top-0'
	}
}
