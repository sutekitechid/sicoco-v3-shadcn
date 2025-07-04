import { cva, type VariantProps } from 'class-variance-authority'
import { convertToNumber } from '../../utils/numeric'

export { default as Input } from './Input.vue'
export { default as InputErrorMessage } from './InputErrorMessage.vue'
export { default as InputPrefix } from './InputPrefix.vue'
export { default as InputSuffix } from './InputSuffix.vue'
export { default as InputMorpUnit } from './InputMorpUnit.vue'
export { default as InputPassword } from './InputPassword.vue'

export const inputVariants = cva(
	'box-border w-full rounded-md text-neutral-100 border border-neutral-30 bg-white dark:bg-neutral-10 ring-offset-neutral-10 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-50/40 focus-visible:ring-offset-0 focus-visible:border-primary-100/60 disabled:cursor-not-allowed disabled:opacity-50 transition-colors focus-visible:transition-shadow',
	{
		variants: {
			size: {
				default: 'h-11 px-4 py-3',
				sm: 'h-8 px-3 py-2 text-xs',
				md: 'h-11 px-4 py-3',
				lg: 'h-14 px-8 py-4 text-base',
			},
			disabled: {
				true: 'bg-neutral-10 text-neutral-50 cursor-not-allowed',
			},
		},
		defaultVariants: {
			size: 'default',
			disabled: false,
		},
	}
)

export type InputVariants = VariantProps<typeof inputVariants>
export type InputType =
	| 'text'
	| 'number'
	| 'currency'
	| 'password'
	| 'email'
	| 'url'
	| 'numeric'
export const InputTypeEnum = {
	text: 'text',
	number: 'number',
	currency: 'currency',
	password: 'password',
	email: 'email',
	url: 'url',
	numeric: 'numeric',
}

/**
 * Parse the currency value to a number
 * @param value
 * @returns number
 * @example
 * parseCurrencyToNumber('1.000,00') // 1000
 **/
export const parseCurrencyToNumber = (value: string) => {
	const number = parseFloat(value.replaceAll('.', ''))
	return number
}

/**
 * Listen to the input event and update the model value
 * @param event
 * @param type
 * @param emit
 * @returns void
 * @example
 * <input @input="listenInput($event, 'number', $emit)" />
 * <input @input="listenInput($event, 'currency', $emit)" />
 */
export function listenInput(
	event: InputEvent,
	type: string,
	emit: (event: string, value: unknown) => void
) {
	const target = event.target as HTMLInputElement
	const value = target?.value
	if (type === InputTypeEnum.number) {
		let number = Number(value)
		if (isEmptyInput(value)) {
			number = undefined
		}
		emit('update:modelValue', number)
		emit('input', number)
		return
	}
	if (type === InputTypeEnum.currency) {
		if (isEmptyInput(value)) {
			emit('update:modelValue', undefined)
			emit('input', undefined)
			return
		}
		const number = parseCurrencyToNumber(value)
		emit('update:modelValue', number)
		emit('input', number)
	} else {
		emit('update:modelValue', value)
		emit('input', value)
	}
}

function isEmptyInput(value: string | number) {
	if (value === undefined || value === null || value === '') {
		return true
	}
	if (typeof value === 'string') {
		return value.trim() === ''
	}
	return false
}

/**
 * Check if the value meets the exact length
 * @param value
 * @param length
 * @returns boolean
 */
export const meetsExactLength = (value: string | number, length: number) => {
	let mValue = value
	if (typeof value === 'number') {
		mValue = value.toString()
	}
	return value ? typeof mValue === 'string' && mValue.length === length : true
}

/**
 * Convert suffix/prefix width to css
 * @param width
 * @returns
 */
export const convertMorpWidthToCss = (width: number) => {
	if (width === 0) {
		return ''
	}
	return `calc(0.5rem + ${width}px)`
}

/**
 * Get the input padding right
 * @param suffixWidth
 * @param dirty
 * @param invalid
 * @returns
 */
export const getInputPaddingRight = (
	suffixWidth: number,
	dirty: boolean,
	invalid: boolean
) => {
	if (suffixWidth === 0 && !dirty && !invalid) {
		return ''
	}
	const suffixWidthCss = convertMorpWidthToCss(suffixWidth)
	if (suffixWidth && dirty && invalid) {
		return `calc(${suffixWidthCss} + 1.5rem)`
	}
	return suffixWidthCss
}

/**
 * Truncate the fraction digits of a numeric string value according to the allowed maximum number of fractional digits.
 * If the value has more digits after the decimal separator than allowed, it truncates them.
 * If maxFractionDigits is 0, it returns only the integer part.
 *
 * @param {string} value - The numeric string value to truncate.
 * @param {number | string} maxFractionDigits - The maximum number of allowed digits after the decimal separator.
 * @returns {string} The truncated numeric string value.
 *
 * @example
 * truncateFractionDigits('123.4567', 2) // '123.45'
 * truncateFractionDigits('123.4', 0) // '123'
 */
export function truncateFractionDigits(
	value: string,
	maxFractionDigits: number | string
) {
	if (!hasMaxFractionDigits(maxFractionDigits)) {
		return value
	}

	const parts = value.split(/[.,]/)
	if (parts.length === 2 && parts[1].length > Number(maxFractionDigits)) {
		// if maxFractionDigits is 0, return the integer part only
		if (Number(maxFractionDigits) === 0) {
			return parts[0]
		}
		return parts[0] + '.' + parts[1].slice(0, Number(maxFractionDigits))
	}
	return value
}

/**
 * Checks if a numeric string value is valid according to the allowed maximum number of fractional digits.
 * This function ensures the value contains only digits and at most one decimal separator (dot or comma),
 * and that the number of digits after the separator does not exceed the specified maximum.
 *
 * @param {string} newValue - The string value to validate.
 * @param {number | string} maxFractionDigits - The maximum number of allowed digits after the decimal separator.
 * @returns {boolean} True if the value is valid, false otherwise.
 *
 * @example
 * isValidFractionalDigits('123.45', 2) // true
 * isValidFractionalDigits('123.456', 2) // false
 * isValidFractionalDigits('123', 2) // true
 * isValidFractionalDigits('123.4', 0) // false
 */
export function isValidFractionalDigits(
	newValue: string,
	maxFractionDigits: number | string
) {
	if (!hasMaxFractionDigits(maxFractionDigits)) {
		return true
	}

	// Allow only numbers and one dot (.)
	if (!/^\d+([.,]\d*)?$/.test(newValue)) {
		return false
	}

	// Check fraction digit constraints
	const parts = newValue.split(/[.,]/)

	if (parts.length !== 2) {
		return true
	}

	const fraction = parts[1]

	// Prevent entering more than maxFractionDigits decimal places
	if (fraction.length > Number(maxFractionDigits)) {
		return false
	}

	return true
}

function hasMaxFractionDigits(maxFractionDigits: number | string) {
	if (
		maxFractionDigits === undefined ||
		maxFractionDigits === null ||
		maxFractionDigits === ''
	) {
		return false
	}

	return true
}

/**
 * Check if the value is a valid number
 * @param value
 * @returns boolean
 * @example
 * isValidNumber('123') // true
 * isValidNumber('123.45') // true
 * isValidNumber('123.45.67') // false
 * isValidNumber('123.45,67') // false
 * isValidNumber('123,45') // true
 * isValidNumber('123,45.67') // false
 **/
export function isValidNumber(value: string | number) {
	if (!value) {
		return true
	}
	if (typeof value === 'string') {
		return !isNaN(Number(value))
	}
	return !isNaN(value)
}

/**
 * Check if the value is a within range
 * @param value
 * @param min
 * @param max
 * @returns boolean
 * @example
 * isWithinRange('123', 100, 200) // true
 * isWithinRange('123', 100, 120) // false
 **/
export function isWithinRange(
	value: string | number,
	min: number | string,
	max: number | string
) {
	if (!value) {
		return true
	}
	if (typeof value === 'string') {
		value = convertToNumber(value)
	}

	// min and max should can be undefined or null
	if (min === undefined || min === null) {
		min = -Infinity
	}
	if (max === undefined || max === null) {
		max = Infinity
	}
	if (typeof min === 'string') {
		min = convertToNumber(min)
	}
	if (typeof max === 'string') {
		max = convertToNumber(max)
	}

	return value <= max
}

export function removeNonNumericChars(value: string): string {
	return value.replace(/[^0-9]/g, '')
}
