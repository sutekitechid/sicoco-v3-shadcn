export { default as Checkbox } from './Checkbox.vue'
export { default as CheckboxLabel } from './CheckboxLabel.vue'
export { default as CheckboxErrorMessage } from './CheckboxErrorMessage.vue'
export { default as CheckboxGroup } from './CheckboxGroup.vue'

import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxVariant = cva(
	'transition-colors duration-500 shrink-0 rounded-md border border-neutral-30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0 hover:ring-4 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default:
					'data-[state=checked]:bg-primary-100 data-[state=checked]:text-neutral-10 focus:ring-primary-100/30 hover:ring-primary-100/30',
				primary:
					'data-[state=checked]:bg-primary-100 data-[state=checked]:text-neutral-10 focus:ring-primary-100/30 hover:ring-primary-100/30',
				danger:
					'data-[state=checked]:bg-danger-100 data-[state=checked]:text-neutral-10 focus:ring-danger-100/30 hover:ring-danger-100/30',
				warning:
					'data-[state=checked]:bg-warning-100 data-[state=checked]:text-neutral-10 focus:ring-warning-100/30 hover:ring-warning-100/30',
				success:
					'data-[state=checked]:bg-success-100 data-[state=checked]:text-neutral-10 focus-visible:ring-success-100/30 hover:ring-success-100/30',
				'default light':
					'data-[state=checked]:bg-primary-100/10 data-[state=checked]:text-primary-100/50 focus-visible:ring-primary-100/10 hover:ring-primary-100/20',
				'primary light':
					'data-[state=checked]:bg-primary-100/10 data-[state=checked]:text-primary-100/50 focus-visible:ring-primary-100/10 hover:ring-primary-100/20',
				'danger light':
					'data-[state=checked]:bg-danger-100/10 data-[state=checked]:text-danger-100/50 focus-visible:ring-danger-100/10 hover:ring-danger-100/20',
				'warning light':
					'data-[state=checked]:bg-warning-100/10 data-[state=checked]:text-warning-100/50 focus-visible:ring-warning-100/10 hover:ring-warning-100/20',
				'success light':
					'data-[state=checked]:bg-success-100/10 data-[state=checked]:text-success-100/50 focus-visible:ring-success-100/10 hover:ring-success-100/20',
				'light default':
					'data-[state=checked]:bg-primary-100/10 data-[state=checked]:text-primary-100/50 focus-visible:ring-primary-100/10 hover:ring-primary-100/20',
				'light primary':
					'data-[state=checked]:bg-primary-100/10 data-[state=checked]:text-primary-100/50 focus-visible:ring-primary-100/10 hover:ring-primary-100/20',
				'light danger':
					'data-[state=checked]:bg-danger-100/10 data-[state=checked]:text-danger-100/50 focus-visible:ring-danger-100/10 hover:ring-danger-100/20',
				'light warning':
					'data-[state=checked]:bg-success-100/10 data-[state=checked]:text-success-100/50 focus-visible:ring-success-100/10 hover:ring-success-100/20',
				'light success':
					'data-[state=checked]:bg-success-100/10 data-[state=checked]:text-success-100/50 focus-visible:ring-success-100/10 hover:ring-success-100/20',
			},
			size: {
				sm: 'peer h-4 w-4',
				md: 'peer h-5 w-5',
				lg: 'peer h-6 w-6',
				xl: 'peer h-7 w-7',
				'2xl': 'peer h-8 w-8',
				'3xl': 'peer h-9 w-9',
				'4xl': 'peer h-10 w-10',
			},
			disabled: {
				true: '!text-opacity-10 !data-[state=checked]:text-opacity-10 bg-neutral-10/50 cursor-not-allowed hover:ring-0',
			},
			rounded: {
				true: 'rounded-full',
			},
			alwaysShowIndicator: {
				true: 'text-neutral-100	 data-[state=checked]:text-neutral-100	',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			disabled: false,
		},
		compoundVariants: [
			{
				variant: ['default', 'primary', 'success', 'warning', 'danger'],
				disabled: true,
				class: 'data-[state=checked]:bg-opacity-50',
			},
		],
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
