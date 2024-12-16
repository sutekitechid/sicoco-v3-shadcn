import { Date, ImportantDate } from './date-picker-types'

/**
 * Formatasi tanggal dari objek Date ke format 'DD/MM/YYYY'.
 *
 * @param {Date} date - Objek Date yang ingin diformat.
 * @returns {string} - Tanggal yang telah diformat dalam bentuk 'DD/MM/YYYY'.
 */
export function formattingDateSlash(date: Date): string {
	const formattedDay = date.day.toString().padStart(2, '0')
	const formattedMonth = date.month.toString().padStart(2, '0')
	const formattedYear = date.year.toString().padStart(2, '0')

	return `${formattedDay}/${formattedMonth}/${formattedYear}`
}

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
		return listImportantDates.filter(item => item.date === currentDate)
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
	date: Date
): string[] {
	if (date) {
		const currentDate = formattingDateSlash(date)
		const selectedDates = selectedImportantDate(listImportantDates, currentDate)

		const colors = selectedDates.map(item => item.color)

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
	date: Date
): string[] {
	if (date) {
		const currentDate = formattingDateSlash(date)
		const selectedDates = selectedImportantDate(listImportantDates, currentDate)

		const tooltips = selectedDates.map(item => item.tooltip)

		return Array.from(new Set(tooltips))
	}

	return []
}
