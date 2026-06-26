import isEqual from 'lodash/isEqual'

export { default as Checkbox } from './Checkbox.vue'
export { default as CheckboxLabel } from './CheckboxLabel.vue'
export { default as CheckboxErrorMessage } from './CheckboxErrorMessage.vue'
export { default as CheckboxGroup } from './CheckboxGroup.vue'

import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxVariant = cva(
	'transition-colors duration-500 shrink-0 rounded-md border border-neutral-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-0 hover:ring-4 disabled:cursor-not-allowed',
	{
		variants: {
			variant: {
				default:
					'data-[state=checked]:bg-primary-500 data-[state=checked]:text-neutral-100 data-[state=checked]:disabled:bg-neutral-300 data-[state=checked]:disabled:text-neutral-500 focus:ring-primary-500/30 hover:ring-primary-500/30',
				primary:
					'data-[state=checked]:bg-primary-500 data-[state=checked]:text-neutral-100 data-[state=checked]:disabled:bg-neutral-300 data-[state=checked]:disabled:text-neutral-500 focus:ring-primary-500/30 hover:ring-primary-500/30',
				danger:
					'data-[state=checked]:bg-danger-500 data-[state=checked]:text-neutral-100 data-[state=checked]:disabled:bg-neutral-300 data-[state=checked]:disabled:text-neutral-500 focus:ring-danger-500/30 hover:ring-danger-500/30',
				warning:
					'data-[state=checked]:bg-warning-500 data-[state=checked]:text-neutral-100 data-[state=checked]:disabled:bg-neutral-300 data-[state=checked]:disabled:text-neutral-500 focus:ring-warning-500/30 hover:ring-warning-500/30',
				success:
					'data-[state=checked]:bg-success-500 data-[state=checked]:text-neutral-100 data-[state=checked]:disabled:bg-neutral-300 data-[state=checked]:disabled:text-neutral-500 focus-visible:ring-success-500/30 hover:ring-success-500/30',
				'default light':
					'data-[state=checked]:bg-primary-500/10 data-[state=checked]:text-primary-500/50 focus-visible:ring-primary-500/10 hover:ring-primary-500/20',
				'primary light':
					'data-[state=checked]:bg-primary-500/10 data-[state=checked]:text-primary-500/50 focus-visible:ring-primary-500/10 hover:ring-primary-500/20',
				'danger light':
					'data-[state=checked]:bg-danger-500/10 data-[state=checked]:text-danger-500/50 focus-visible:ring-danger-500/10 hover:ring-danger-500/20',
				'warning light':
					'data-[state=checked]:bg-warning-500/10 data-[state=checked]:text-warning-500/50 focus-visible:ring-warning-500/10 hover:ring-warning-500/20',
				'success light':
					'data-[state=checked]:bg-success-500/10 data-[state=checked]:text-success-500/50 focus-visible:ring-success-500/10 hover:ring-success-500/20',
				'light default':
					'data-[state=checked]:bg-primary-500/10 data-[state=checked]:text-primary-500/50 focus-visible:ring-primary-500/10 hover:ring-primary-500/20',
				'light primary':
					'data-[state=checked]:bg-primary-500/10 data-[state=checked]:text-primary-500/50 focus-visible:ring-primary-500/10 hover:ring-primary-500/20',
				'light danger':
					'data-[state=checked]:bg-danger-500/10 data-[state=checked]:text-danger-500/50 focus-visible:ring-danger-500/10 hover:ring-danger-500/20',
				'light warning':
					'data-[state=checked]:bg-success-500/10 data-[state=checked]:text-success-500/50 focus-visible:ring-success-500/10 hover:ring-success-500/20',
				'light success':
					'data-[state=checked]:bg-success-500/10 data-[state=checked]:text-success-500/50 focus-visible:ring-success-500/10 hover:ring-success-500/20',
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
				true: 'cursor-not-allowed hover:ring-0',
			},
			rounded: {
				true: 'rounded-full',
			},
			alwaysShowIndicator: {
				true: 'text-neutral-950	 data-[state=checked]:text-neutral-950	',
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
	checked: boolean,
	value: unknown,
	modelValue: unknown
): unknown {
	if (Array.isArray(modelValue)) {
		if (checked) {
			return [...modelValue, value]
		}
		return modelValue.filter((v: unknown) => v !== value)
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
export function isChecked(
	value: boolean | string | number | object | Array<unknown> | null,
	modelValue: boolean | string | number | object | Array<unknown> | null
): boolean {
	if (typeof modelValue === typeof value) {
		return isEqual(modelValue, value)
	}
	if (Array.isArray(modelValue)) {
		return modelValue.some((item) => isEqual(item, value))
	}
	return false
}
