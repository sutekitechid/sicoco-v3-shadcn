import { ImportantDate } from './date-picker-types'
import { formatStandard } from './format-date'
import { DateValue } from '@internationalized/date'

/**
 * Mencari tanggal penting dalam daftar tanggal penting berdasarkan tanggal yang diberikan.
 *
 * @param {ImportantDate[]} listImportantDates - Daftar tanggal penting.
 * @param {string} currentDate - Tanggal yang akan dicari.
 * @returns {ImportantDate[]} - Array dari objek ImportantDate yang cocok dengan tanggal yang diberikan.
 */
export function selectedImportantDate(
	listImportantDates: ImportantDate[],
	currentDate: string
): ImportantDate[] {
	if (listImportantDates && listImportantDates.length > 0) {
		return listImportantDates.filter(
			item =>
				typeof item.date !== 'string' &&
				formatStandard(item.date) === currentDate
		)
	}
	return []
}

/**
 * Mengambil array warna dari tanggal penting yang cocok dengan tanggal yang diberikan.
 *
 * @param {ImportantDate[]} listImportantDates - Daftar tanggal penting.
 * @param {Date} date - Tanggal yang ingin diperiksa.
 * @returns {string[]} - Array warna dari tanggal penting yang cocok.
 */
export function getColorDate(
	listImportantDates: ImportantDate[],
	date: DateValue
): string[] {
	if (date) {
		const currentDate = formatStandard(date)
		const selectedDates = selectedImportantDate(listImportantDates, currentDate)

		const colors = selectedDates.flatMap(item => item.color)

		return colors
	}

	return []
}

/**
 * Mengambil array tooltips dari tanggal penting yang cocok dengan tanggal yang diberikan.
 * Duplikasi dalam tooltips akan dihilangkan.
 *
 * @param {ImportantDate[]} listImportantDates - Daftar tanggal penting.
 * @param {Date} date - Tanggal yang ingin diperiksa.
 * @returns {string[]} - Array tooltips dari tanggal penting yang cocok.
 */
export function getTooltipDate(
	listImportantDates: ImportantDate[],
	date: DateValue
): string[] {
	if (date) {
		const currentDate = formatStandard(date)
		const selectedDates = selectedImportantDate(listImportantDates, currentDate)

		const tooltips = selectedDates
			.map(item => item.tooltip)
			.filter((tooltip): tooltip is string => typeof tooltip === 'string')

		return tooltips
	}

	return []
}

export function datePagingFunction(currentDate: DateValue, destDate: DateValue) {
	if (!destDate) return currentDate
	return currentDate.set({ month: destDate.month, year: destDate.year })
}
 
export function getNextPage(date: DateValue, months: number) {
	return date.add({ months })
}
