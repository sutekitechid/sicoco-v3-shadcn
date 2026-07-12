import type { ToastRootProps } from 'reka-ui'
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
	'text-main dark:text-neutral-700 group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[--reka-toast-swipe-end-x] data-[swipe=move]:translate-x-[--reka-toast-swipe-move-x] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
	{
		variants: {
			variant: {
				default:
					'bg-primary-subtle dark:bg-primary-default border-primary-default/30 dark:border-primary-default/30',
				primary:
					'bg-primary-subtle dark:bg-primary-default border-primary-default/30 dark:border-primary-default/30',
				warning:
					'bg-warning-subtle dark:bg-warning-default border-warning-default/30 dark:border-warning-default/30 text-black',
				danger:
					'bg-danger-subtle dark:bg-danger-default border-danger-default/30 dark:border-danger-default/30',
				success:
					'bg-success-subtle dark:bg-success-default border-success-default/30 dark:border-success-default/30',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

type ToastVariants = VariantProps<typeof toastVariants>
export type ToastVariantPosition =
	| 'top-left'
	| 'top-center'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-center'
	| 'bottom-right'

export interface ToastProps extends ToastRootProps {
	class?: HTMLAttributes['class']
	variant?: ToastVariants['variant']
	onOpenChange?: (value: boolean) => void
}

export const toastIconVariantEnum = {
	default: 'si-info text-primary-600 dark:text-neutral-700',
	primary: 'si-info text-primary-600 dark:text-neutral-700',
	warning: 'si-alert-triangle text-warning-600 dark:text-main dark:text-neutral-700',
	danger: 'si-cross-circle text-danger-600 dark:text-neutral-700',
	success: 'si-check-circle text-success-600 dark:text-neutral-700',
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
	const classNames = []
	if (position.includes('bottom')) {
		classNames.push('!bottom-0')
	} else {
		classNames.push('!top-0')
	}
	if (position.includes('left')) {
		classNames.push('!left-0')
	} else if (position.includes('right')) {
		classNames.push('!right-0')
	} else {
		classNames.push('!left-1/2 -translate-x-1/2')
	}
	return classNames.join(' ')
}
