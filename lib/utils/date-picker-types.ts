import { CalendarDate } from '@internationalized/date'
/**
 * Interface yang mewakili tanggal dalam objek.
 *
 * @interface Date
 * @property {number} year - Tahun dari tanggal.
 * @property {number} month - Bulan dari tanggal, dalam rentang 1 hingga 12.
 * @property {number} day - Hari dari tanggal, dalam rentang 1 hingga 31.
 */
export interface Date {
	year: number
	month: number
	day: number
}

/**
 * Interface yang mewakili tanggal penting dengan atribut tambahan seperti warna dan tooltips.
 *
 * @interface ImportantDate
 * @property {string} date - Tanggal dalam format string 'YYYY/MM/DD'.
 * @property {string[]} color - Array warna yang terkait dengan tanggal penting.
 * @property {string[]} tooltip - Array dari string tooltips yang terkait dengan tanggal penting.
 */
export interface ImportantDate {
	date: string | CalendarDate
	color: string[] | string
	tooltip: string[] | string
}
