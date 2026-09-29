import { cva, type VariantProps } from 'class-variance-authority'

import { progressBarTrackBackgroundClass } from './progress-variant'

export { default as Progress } from './Progress.vue'

export const progressBarTrackVariants = cva(
	'relative w-full overflow-hidden rounded-full',
	{
		variants: {
			background: {
				inactive: progressBarTrackBackgroundClass,
				white: 'bg-white',
			},
			disabled: {
				true: 'bg-disabled',
				false: '',
			},
		},
		defaultVariants: {
			background: 'inactive',
			disabled: false,
		},
	},
)

export type ProgressBarTrackVariants = VariantProps<typeof progressBarTrackVariants>
