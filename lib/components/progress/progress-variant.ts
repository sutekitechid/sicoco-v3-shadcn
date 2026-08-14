export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'

export const progressBarVariantBackgroundClass: Record<ProgressVariant, string> = {
	primary: 'bg-primary-main',
	success: 'bg-success-main',
	warning: 'bg-warning-main',
	danger: 'bg-danger-main',
}

export const progressCompletionIconClass: Record<ProgressVariant, string> = {
	primary: 'si-heroicon-solid-check-circle text-primary-main',
	success: 'si-heroicon-solid-check-circle text-success-main',
	warning: 'si-heroicon-solid-exclamation-circle text-warning-main',
	danger: 'si-heroicon-solid-exclamation-circle text-danger-main',
}

export const progressBarTrackBackgroundClass: string = 'bg-neutral-100'
