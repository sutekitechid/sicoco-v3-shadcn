import { cva, type VariantProps } from 'class-variance-authority'
import { convertToNumber } from '../../utils/numeric'
import { formatCurrency } from '../../utils/currency'

export { default as Input } from './Input.vue'
export { default as InputErrorMessage } from './InputErrorMessage.vue'
export { default as InputPrefix } from './InputPrefix.vue'
export { default as InputSuffix } from './InputSuffix.vue'
export { default as InputMorpUnit } from './InputMorpUnit.vue'
export { default as InputPassword } from './InputPassword.vue'

export const inputContainerVariants = cva(
	'',
	{
		variants: {
			size: {
				default: 'text-label-lg',
				sm: 'text-label-md',
				md: 'text-label-lg',
				lg: 'text-label-lg',
			},
		},
	}
)

export const inputVariants = cva(
	'box-border w-full font-normal text-main dark:text-neutral-500 border border-main bg-white dark:bg-neutral-100 ring-offset-neutral-100 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-600 focus-visible:outline-none focus-visible:shadow-primary focus-visible:border-primary-default dark:focus-visible:border-primary-700 disabled:cursor-not-allowed transition-colors focus-visible:transition-shadow truncate',
	{
		variants: {
			size: {
				default: 'h-12 px-3 rounded',
				sm: 'h-9 px-3 rounded',
				md: 'h-12 px-3 rounded',
				lg: 'h-14 px-4 rounded-lg',
			},
			disabled: {
				true: 'bg-disabled !text-disabled cursor-not-allowed',
			},
			readonly: {
				true: 'bg-disabled'
			}
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
	const number = Number.parseFloat(value.replaceAll('.', ''))
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
export function listenInput({
	event,
	type,
	emit,
	props,
}: {
	event: Event
	type: string
	emit: (event: string, value: unknown) => void
	props: {
		max?: number
		maxLength?: number
		maxFractionDigits?: number | string
	}
}) {
	const target = event.target as HTMLInputElement
	let value = target.value

	const { maxLength, max, maxFractionDigits } = props

	if (maxLength && hasExceedsMaxLength(value, maxLength)) {
		value = value.slice(0, maxLength)
	}

	const { number, currency, numeric } = InputTypeEnum

	if (type === number) {
		const numValue = convertToNumber(value)

		if (!isWithinRange(numValue, max)) {
			value = String(max)
			target.value = value
			updateInputValue(max, emit)
			return
		}

		if (
			maxFractionDigits &&
			!isValidFractionalDigits(value, maxFractionDigits)
		) {
			value = truncateFractionDigits(value, maxFractionDigits)
			if (value !== '') {
				target.value = value
			}
		}

		updateInputValue(convertToNumber(value), emit)
		return
	}

	if (type === numeric || type === currency) {
		if (!isValidNumber(value)) {
			value = removeNonNumericChars(value)
			target.value = value
		}
	}

	if (type === currency) {
		const number = parseCurrencyToNumber(value)

		if (number > max) {
			value = formatCurrency(max)
			target.value = value
			updateInputValue(max, emit)
			return
		}

		if (isEmptyInput(value)) {
			updateInputValue(undefined, emit)
			return
		}
		target.value = formatCurrency(number)
		updateInputValue(number, emit)
		return
	}

	target.value = value
	updateInputValue(value, emit)
}

function updateInputValue(
	value: string | number | undefined,
	emit: (event: string, value: unknown) => void
) {
	emit('update:modelValue', value)
	emit('input', value)
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

const paddingBySizeEnum = {
	default: '0.75em',
	lg: '1em',
	md: '0.75em',
	sm: '0.75em'
}

const additionalPaddingBySizeEnum = {
	default: '0.5em',
	lg: '0.5em',
	md: '0.5em',
	sm: '8.5px'
}

/**
 * Convert suffix/prefix width to css
 * @param width
 * @returns
 */
export const convertMorpWidthToCss = (width: number, size?: InputVariants['size']) => {
	if (width === 0) {
		return ''
	}
	const mSize = size ? size : 'md'
	return `calc(${paddingBySizeEnum[mSize]} + ${width}px + ${additionalPaddingBySizeEnum[mSize]})`
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
		// Truncate the fraction part to the allowed
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
	// if (!/^\d+([.,]\d*)?$/.test(newValue)) {
	// 	return false
	// }

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
 * @param max
 * @returns boolean
 * @example
 * isWithinRange('123', 200) // true
 * isWithinRange('123', 100) // false
 * isWithinRange('123.45', 200) // true
 * isWithinRange('123.45', 100) // false
 **/
export function isWithinRange(value: string | number, max: number | string) {
	if (!value) {
		return true
	}
	if (typeof value === 'string') {
		value = convertToNumber(value)
	}

	if (max === undefined || max === null) {
		max = Infinity
	}
	if (typeof max === 'string') {
		max = convertToNumber(max)
	}

	return value <= max
}

export function removeNonNumericChars(value: string): string {
	return value.replace(/[^0-9]/g, '')
}

export function hasExceedsMaxLength(value: string, maxLength: number): boolean {
	if (maxLength === undefined) {
		return false
	}
	return value.length > maxLength
}
