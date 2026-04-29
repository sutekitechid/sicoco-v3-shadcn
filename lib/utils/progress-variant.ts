export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'

export const progressVariantBgClass: Record<ProgressVariant, string> = {
	primary: 'bg-primary-90',
	success: 'bg-success-90',
	warning: 'bg-warning-90',
	danger: 'bg-danger-90',
}

export const progressVariantStrokeClass: Record<ProgressVariant, string> = {
	primary: 'stroke-primary-90',
	success: 'stroke-success-90',
	warning: 'stroke-warning-90',
	danger: 'stroke-danger-90',
}
