import { cva, type VariantProps } from 'class-variance-authority'

export interface StepItem {
	step: number
	title: string
	description: string
}

export enum StepperOrientation {
	Vertical = 'vertical',
	Horizontal = 'horizontal',
}

export const stepperVariants = cva('flex justify-center', {
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

export { default as Stepper } from './Stepper.vue'
export { default as StepperItem } from './StepperItem.vue'
export { default as StepperDescription } from './StepperDescription.vue'
export { default as StepperTitle } from './StepperTitle.vue'
export { default as StepperTrigger } from './StepperTrigger.vue'
export { default as StepperSeparator } from './StepperSeparator.vue'
export { default as StepperIndicator } from './StepperIndicator.vue'
