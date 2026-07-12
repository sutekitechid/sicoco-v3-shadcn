import isEqual from 'lodash/isEqual'

export { default as Checkbox } from './Checkbox.vue'
export { default as CheckboxLabel } from './CheckboxLabel.vue'
export { default as CheckboxErrorMessage } from './CheckboxErrorMessage.vue'
export { default as CheckboxGroup } from './CheckboxGroup.vue'

import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxVariant = cva(
	'cursor-pointer shrink-0 rounded border border-main transition-colors duration-500 focus-visible:outline-none focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:border-main disabled:bg-disabled data-[state=checked]:disabled:text-disabled data-[state=checked]:disabled:bg-disabled data-[state=checked]:text-white dark:text-neutral-500 dark:data-[state=checked]:text-neutral-700',
	{
		variants: {
			variant: {
				default: 'bg-transparent',
				primary: 'bg-transparent',
				danger: 'bg-transparent',
				warning: 'bg-transparent',
				success: 'bg-transparent',
				'default light': 'bg-transparent',
				'primary light': 'bg-transparent',
				'danger light': 'bg-transparent',
				'warning light': 'bg-transparent',
				'success light': 'bg-transparent',
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
				true: 'bg-neutral-100 text-disabled',
			},
			rounded: {
				true: 'rounded-full',
			},
			alwaysShowIndicator: {
				true: 'text-main dark:text-neutral-500 data-[state=checked]:text-main dark:text-neutral-500',
			},
		},
		compoundVariants: [
			{
				variant: ['default', 'primary'],
				disabled: false,
				class: 'data-[state=checked]:bg-primary-default hover:enabled:border-primary-hover focus:enabled:border-primary-700 focus:shadow-primary focus-visible:shadow-primary data-[state=checked]:hover:bg-primary-hover',
			},
			{
				variant: 'danger',
				disabled: false,
				class: 'data-[state=checked]:bg-danger-default hover:enabled:border-danger-hover focus:enabled:border-danger-700 focus:shadow-danger focus-visible:shadow-danger data-[state=checked]:hover:bg-danger-hover',
			},
			{
				variant: 'warning',
				disabled: false,
				class: 'data-[state=checked]:bg-warning-default hover:enabled:border-warning-hover focus:enabled:border-warning-700 focus:shadow-warning focus-visible:shadow-warning data-[state=checked]:hover:bg-warning-hover',
			},
			{
				variant: 'success',
				disabled: false,
				class: 'data-[state=checked]:bg-success-default hover:enabled:border-success-hover focus:enabled:border-success-700 focus:shadow-success focus-visible:shadow-success data-[state=checked]:hover:bg-success-hover',
			},
			{
				variant: 'default light',
				disabled: false,
				class: 'data-[state=checked]:bg-primary-subtle data-[state=checked]:text-primary-default focus:shadow-primary focus-visible:shadow-primary hover:enabled:ring-primary-100',
			},
			{
				variant: 'primary light',
				disabled: false,
				class: 'data-[state=checked]:bg-primary-subtle data-[state=checked]:text-primary-default focus:shadow-primary focus-visible:shadow-primary hover:enabled:ring-primary-100',
			},
			{
				variant: 'danger light',
				disabled: false,
				class: 'data-[state=checked]:bg-danger-subtle data-[state=checked]:text-danger-default focus:shadow-danger focus-visible:shadow-danger hover:enabled:ring-danger-100',
			},
			{
				variant: 'warning light',
				disabled: false,
				class: 'data-[state=checked]:bg-warning-subtle data-[state=checked]:text-warning-default focus:shadow-warning focus-visible:shadow-warning hover:enabled:ring-warning-100',
			},
			{
				variant: 'success light',
				disabled: false,
				class: 'data-[state=checked]:bg-success-subtle data-[state=checked]:text-success-default focus:shadow-success focus-visible:shadow-success hover:enabled:ring-success-100',
			},
			{
				disabled: true,
				class: 'focus:shadow-transparent focus-visible:shadow-transparent',
			},
		],
		defaultVariants: {
			variant: 'default',
			size: 'md',
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
