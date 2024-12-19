export { default as Checkbox } from './Checkbox.vue'
export { default as CheckboxLabel } from './CheckboxLabel.vue'
export { default as CheckboxErrorMessage } from './CheckboxErrorMessage.vue'
export { default as CheckboxGroup } from './CheckboxGroup.vue'

import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxVariant = cva(
	'peer h-5 w-5 shrink-0 rounded-md border border-neutral-30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0 hover:ring-4 disabled:cursor-not-allowed data-[state=checked]:text-neutral-10',
	{
		variants: {
			variant: {
				default:
					'data-[state=checked]:bg-primary-100 focus:ring-primary-100/30 hover:ring-primary-100/30',
				primary:
					'data-[state=checked]:bg-primary-100 focus:ring-primary-100/30 hover:ring-primary-100/30',
				danger:
					'data-[state=checked]:bg-danger-100 focus:ring-danger-100/30 hover:ring-danger-100/30',
				warning:
					'data-[state=checked]:bg-warning-100 focus:ring-warning-100/30 hover:ring-warning-100/30',
				success:
					'data-[state=checked]:bg-success-100 focus-visible:ring-success-100/30 hover:ring-success-100/30',
			},
			disabled: {
				true: '!bg-neutral-10/50 !text-neutral-50 cursor-not-allowed hover:ring-0',
			},
		},
		defaultVariants: {
			variant: 'default',
			disabled: false,
		},
	}
)

export type CheckboxVariant = VariantProps<typeof checkboxVariant>

/**
 * Determine the model value based on the checked state and modelValue type
 * @param checked
 * @param value
 * @param modelValue
 * @returns
 */
export function determineModelValue(
	checked: any,
	value: any,
	modelValue: any
): any {
	if (Array.isArray(modelValue)) {
		if (checked) {
			return [...modelValue, value]
		}
		return modelValue.filter((v: any) => v !== value)
	}
	if (typeof modelValue === 'boolean') {
		return checked
	}
	if (checked) {
		return value
	}
	return undefined
}

/**
 * Check if the value is checked based on the modelValue
 * @param value
 * @param modelValue
 * @returns
 */
export function isChecked(value: any, modelValue: any): boolean {
	if (Array.isArray(modelValue)) {
		return modelValue.includes(value)
	}
	return modelValue === value
}
