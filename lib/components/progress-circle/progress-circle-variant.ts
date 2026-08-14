import type { ProgressVariant } from '../progress/progress-variant'

export const progressCircleVariantStrokeClass: Record<ProgressVariant, string> = {
	primary: 'stroke-primary-400',
	success: 'stroke-success-400',
	warning: 'stroke-warning-400',
	danger: 'stroke-danger-400',
}

export const progressCircleTrackVariantStrokeClass: string = 'stroke-neutral-100'
