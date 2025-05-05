import { cva, type VariantProps } from 'class-variance-authority'

export const DEFAULT_STEP_NUMBER = 1

export interface StepItem {
	step: number
	title: string
	description: string
}

export enum StepperOrientation {
	Vertical = 'vertical',
	Horizontal = 'horizontal',
}

export const stepperVariants = cva('flex', {
	variants: {
		orientation: {
			horizontal: 'flex-row',
			vertical: 'flex-col',
		},
		fullWidth: {
			true: 'w-full',
			false: 'w-fit',
		},
	},
	defaultVariants: {
		orientation: StepperOrientation.Horizontal,
		fullWidth: true,
	},
})

export type StepperVariants = VariantProps<typeof stepperVariants>

export { default as SStepper } from './Stepper.vue'
export { default as SStepperItem } from './StepperItem.vue'
export { default as SStepperDescription } from './StepperDescription.vue'
export { default as SStepperTitle } from './StepperTitle.vue'
export { default as SStepperTrigger } from './StepperTrigger.vue'
export { default as SStepperSeparator } from './StepperSeparator.vue'
export { default as SStepperIndicator } from './StepperIndicator.vue'
