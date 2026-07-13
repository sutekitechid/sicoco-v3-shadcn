import { CalendarDate, type DateValue } from '@internationalized/date'

export interface DateParts {
	day: string
	month: string
	year: string
}

export const EMPTY_PARTS: DateParts = { day: '', month: '', year: '' }

/**
 * Check whether the given day string is a numeric value between 1 and 31.
 * The month and year are optional but, when provided, are used to validate
 * that the day is actually possible in that month (e.g. 31 Feb is rejected).
 */
export function isValidDay(
	dayStr: string,
	monthStr?: string,
	yearStr?: string
): boolean {
	if (!isDigitsOnly(dayStr)) return false
	const day = Number(dayStr)
	if (!Number.isInteger(day) || day < 1 || day > 31) return false

	const month = monthStr && monthStr.length > 0 ? Number(monthStr) : null
	const year = yearStr && yearStr.length > 0 ? Number(yearStr) : null

	if (month !== null && (month < 1 || month > 12)) return false

	if (month !== null && day > 28) {
		// Use 2000 (a leap year) when no year is provided so Feb 29 stays valid.
		const maxDay = getDaysInMonth(month, year ?? 2000)
		if (day > maxDay) return false
	}

	return true
}

/**
 * Check whether the given month string is a numeric value between 1 and 12.
 */
export function isValidMonth(monthStr: string): boolean {
	if (!isDigitsOnly(monthStr)) return false
	const month = Number(monthStr)
	return Number.isInteger(month) && month >= 1 && month <= 12
}

/**
 * Check whether the given year string is a 4-digit numeric value within
 * the provided range. If `yearsRange` is not provided, a reasonable default
 * of 1900 - 2100 is used.
 */
export function isValidYear(
	yearStr: string,
	yearsRange?: number[]
): boolean {
	if (!isDigitsOnly(yearStr) || yearStr.length !== 4) return false
	const year = Number(yearStr)
	if (!Number.isInteger(year)) return false

	const [start, end] = yearsRange ?? []
	if (!start && !end) {
		return true
	}
	if (!end) {
		return year >= start
	}
	return year >= start && year <= end
}

/**
 * Check whether the combination of day, month, and year forms a real date.
 * All three parts must be completely filled and individually valid first.
 */
export function isValidDateParts(
	parts: DateParts,
	yearsRange?: number[]
): boolean {
	const { day, month, year } = parts
	if (!day || !month || !year) return false
	if (!isValidMonth(month) || !isValidYear(year, yearsRange)) return false
	if (!isValidDay(day, month, year)) return false

	return true
}

/**
 * Build a CalendarDate from the given parts. Returns `null` if any part is
 * missing or the combination does not form a valid date. The optional
 * `yearsRange` is forwarded to the underlying validation.
 */
export function buildCalendarDate(
	parts: DateParts,
	yearsRange?: number[]
): CalendarDate | null {
	if (!isValidDateParts(parts, yearsRange)) return null
	return new CalendarDate(Number(parts.year), Number(parts.month), Number(parts.day))
}

/**
 * Split a DateValue (or null) into the day, month and year strings used by
 * the editable input. Returns empty strings for null / undefined input.
 */
export function partsFromModelValue(value: DateValue | null | undefined): DateParts {
	if (!value) return { ...EMPTY_PARTS }
	return {
		day: padStart(String(value.day), 2, '0'),
		month: padStart(String(value.month), 2, '0'),
		year: padStart(String(value.year), 4, '0'),
	}
}

/**
 * Strip non-digit characters from the given value and pad it to the
 * requested length with leading zeros.
 */
export function sanitizeAndPad(value: string, length: number): string {
	const digits = value.replace(/\D/g, '').slice(0, length)
	if (digits.length === 0) return ''
	return digits.padStart(length, '0')
}

/**
 * Strip non-digit characters from the given value without padding.
 */
export function sanitizeDigits(value: string, maxLength: number): string {
	return value.replace(/\D/g, '').slice(0, maxLength)
}

function isDigitsOnly(value: string): boolean {
	return value.length > 0 && /^\d+$/.test(value)
}

function padStart(value: string, length: number, pad: string): string {
	if (value.length >= length) return value
	return pad.repeat(length - value.length) + value
}

function getDaysInMonth(month: number, year: number): number {
	return new Date(year, month, 0).getDate()
}
