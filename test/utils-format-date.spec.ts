import { test, expect, vi } from 'vitest'
import { CalendarDate } from '@internationalized/date'
import {
	DateFormatEnum,
	useFormatDate,
} from '../lib/components/date-picker/index'
vi.mock('../lib/utils/format-date', () => ({
	formatStandard: vi.fn(
		(value) => `Standard: ${value.toString()}`
	),
	formatShort: vi.fn(
		(value, locale) => `Short: ${value.toString()} (${locale})`
	),
	formatWithMonthName: vi.fn(
		(value, locale) => `MonthName: ${value.toString()} (${locale})`
	),
	formatWithShortMonthName: vi.fn(
		(value, locale) => `ShortMonthName: ${value.toString()} (${locale})`
	),
	formatFull: vi.fn((value, locale) => `Full: ${value.toString()} (${locale})`),
}))

// Test cases
test('returns formatted date for STANDARD format', () => {
	const date = new CalendarDate(2023, 5, 10)
	const result = useFormatDate(DateFormatEnum.STANDARD, date)
	expect(result).toBe(`Standard: ${date.toString()}`)
})

test('returns formatted date for SHORT format', () => {
	const date = new CalendarDate(2023, 5, 10)
	const result = useFormatDate(DateFormatEnum.SHORT, date, 'en-US')
	expect(result).toBe(`Short: ${date.toString()} (en-US)`)
})

test('returns formatted date for WITH_MONTH_NAME format', () => {
	const date = new CalendarDate(2023, 5, 10)
	const result = useFormatDate(DateFormatEnum.WITH_MONTH_NAME, date, 'en-US')
	expect(result).toBe(`MonthName: ${date.toString()} (en-US)`)
})

test('returns formatted date for WITH_SHORT_MONTH_NAME format', () => {
	const date = new CalendarDate(2023, 5, 10)
	const result = useFormatDate(
		DateFormatEnum.WITH_SHORT_MONTH_NAME,
		date,
		'en-US'
	)
	expect(result).toBe(`ShortMonthName: ${date.toString()} (en-US)`)
})

test('returns formatted date for FULL format', () => {
	const date = new CalendarDate(2023, 5, 10)
	const result = useFormatDate(DateFormatEnum.FULL, date, 'en-US')
	expect(result).toBe(`Full: ${date.toString()} (en-US)`)
})

test('defaults to STANDARD format if formatDate is unrecognized', () => {
	const date = new CalendarDate(2023, 5, 10)
	const result = useFormatDate('INVALID_FORMAT', date)
	expect(result).toBe(`Standard: ${date.toString()}`)
})
