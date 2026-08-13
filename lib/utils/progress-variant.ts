export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'

export const progressBarVariantBackgroundClass: Record<ProgressVariant, string> = {
	primary: 'bg-primary-400',
	success: 'bg-success-400',
	warning: 'bg-warning-400',
	danger: 'bg-danger-400',
}

export const progressBarTrackBackgroundClass: string = 'bg-neutral-100'

export const progressCircleVariantStrokeClass: Record<ProgressVariant, string> = {
	primary: 'stroke-primary-400',
	success: 'stroke-success-400',
	warning: 'stroke-warning-400',
	danger: 'stroke-danger-400',
}

export const progressCircleTrackVariantStrokeClass: string = 'stroke-neutral-100'
