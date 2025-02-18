import {
	DateFormatter,
	DateValue,
	getLocalTimeZone,
} from '@internationalized/date'

/**
 * Formats a date into the standard format (DD-MM-YYYY) with leading zeros.
 *
 * @param date - The date to be formatted.
 * @param locale - The locale to be used for formatting (default: 'id-ID').
 * @returns A string representing the date in DD-MM-YYYY format.
 * @example
 * ```typescript
 * const date = parseDate('2024-12-18');
 * formatStandard(date, 'id-ID'); // "18-12-2024"
 * ```
 */
export function formatStandard(date: DateValue): string {
	const year = date.year.toString()
	const month = date.month.toString().padStart(2, '0') // Ensures two digits
	const day = date.day.toString().padStart(2, '0') // Ensures two digits

	return `${day}-${month}-${year}` // Standard format with dashes
}
/**
 * Formats a date with the month name in the specified locale (e.g., "18 Desember 2024").
 *
 * @param date - The date to be formatted.
 * @param locale - The locale to be used for formatting (default: 'id-ID').
 * @returns A string representing the date in DD Month YYYY format.
 * @example
 * ```typescript
 * const date = parseDate('2024-12-18');
 * formatWithMonthName(date, 'id-ID'); // "18 Desember 2024"
 * ```
 */
export function formatWithMonthName(
	date: DateValue,
	locale: string = 'id-ID'
): string {
	const formatter = new DateFormatter(locale, {
		dateStyle: 'long',
	})
	return formatter.format(date.toDate(getLocalTimeZone()))
}

/**
 * Formats a date with the abbreviated month name in the specified locale (e.g., "2 Des 2024").
 *
 * @param date - The date to be formatted.
 * @param locale - The locale to be used for formatting (default: 'id-ID').
 * @returns A string representing the date in DD Month YYYY format.
 * @example
 * ```typescript
 * const date = parseDate('2024-12-02');
 * formatWithMonthName(date, 'id-ID'); // "2 Des 2024"
 * ```
 */
export function formatWithShortMonthName(
	date: DateValue,
	locale: string = 'id-ID'
): string {
	const jsDate = date.toDate(getLocalTimeZone())

	return jsDate.toLocaleDateString(locale, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

/**
 * Formats a date into a full format with the day name (e.g., "Rabu, 18 Desember 2024").
 *
 * @param date - The date to be formatted.
 * @param locale - The locale to be used for formatting (default: 'id-ID').
 * @returns A string representing the date in Day, DD Month YYYY format.
 * @example
 * ```typescript
 * const date = parseDate('2024-12-18');
 * formatFull(date, 'id-ID'); // "Rabu, 18 Desember 2024"
 * ```
 */
export function formatFull(date: DateValue, locale: string = 'id-ID'): string {
	const formatter = new DateFormatter(locale, { dateStyle: 'full' })
	return formatter.format(date.toDate(getLocalTimeZone()))
}

/**
 * Formats a date into a short format with hyphens (DD-MM-YYYY).
 *
 * @param date - The date to be formatted.
 * @param locale - The locale to be used for formatting (default: 'id-ID').
 * @returns A string representing the date in DD-MM-YYYY format.
 * @example
 * ```typescript
 * const date = parseDate('2024-12-18');
 * formatShort(date, 'id-ID'); // "18-12-2024"
 * ```
 */
export function formatShort(date: DateValue, locale: string = 'id-ID'): string {
	const formatter = new DateFormatter(locale, {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	})
	return formatter.format(date.toDate(getLocalTimeZone()))
}
