import { describe, expect, test } from 'vitest'
import { CalendarDate } from '@internationalized/date'
import {
	buildCalendarDate,
	isValidDateParts,
	isValidDay,
	isValidMonth,
	isValidYear,
	partsFromModelValue,
	sanitizeAndPad,
	sanitizeDigits,
} from '../lib/utils/editable-date-picker'

describe('isValidDay', () => {
	test('rejects empty string', () => {
		expect(isValidDay('')).toBe(false)
	})

	test('rejects non-digits', () => {
		expect(isValidDay('ab')).toBe(false)
		expect(isValidDay('1a')).toBe(false)
	})

	test('rejects out-of-range days', () => {
		expect(isValidDay('00')).toBe(false)
		expect(isValidDay('32')).toBe(false)
		expect(isValidDay('99')).toBe(false)
	})

	test('accepts 01-28 for any month', () => {
		expect(isValidDay('01')).toBe(true)
		expect(isValidDay('15')).toBe(true)
		expect(isValidDay('28')).toBe(true)
	})

	test('respects month max days', () => {
		expect(isValidDay('31', '01')).toBe(true)
		expect(isValidDay('31', '02')).toBe(false)
		expect(isValidDay('29', '02')).toBe(true)
	})

	test('respects leap year for Feb 29', () => {
		expect(isValidDay('29', '02', '2024')).toBe(true)
		expect(isValidDay('29', '02', '2023')).toBe(false)
	})
})

describe('isValidMonth', () => {
	test('accepts 01-12', () => {
		expect(isValidMonth('01')).toBe(true)
		expect(isValidMonth('06')).toBe(true)
		expect(isValidMonth('12')).toBe(true)
	})

	test('rejects invalid months', () => {
		expect(isValidMonth('00')).toBe(false)
		expect(isValidMonth('13')).toBe(false)
		expect(isValidMonth('ab')).toBe(false)
	})
})

describe('isValidYear', () => {
	test('requires exactly 4 digits', () => {
		expect(isValidYear('202')).toBe(false)
		expect(isValidYear('20245')).toBe(false)
	})

	test('accepts year within range', () => {
		expect(isValidYear('2024')).toBe(true)
		expect(isValidYear('1900', [1900, 2100])).toBe(true)
		expect(isValidYear('2100', [1900, 2100])).toBe(true)
	})

	test('rejects year outside range', () => {
		expect(isValidYear('1899', [1900, 2100])).toBe(false)
		expect(isValidYear('2101', [1900, 2100])).toBe(false)
	})

	test('accepts any 4-digit year when no range is provided', () => {
		// When `yearsRange` is not provided, the function does not enforce a
		// default range — any 4-digit numeric year is considered valid. The
		// caller is expected to pass an explicit `yearsRange` when bounds
		// are required (e.g. via the `DatePicker` `yearsRange` prop).
		expect(isValidYear('1899')).toBe(true)
		expect(isValidYear('1900')).toBe(true)
		expect(isValidYear('2100')).toBe(true)
		expect(isValidYear('2101')).toBe(true)
	})
})

describe('isValidDateParts', () => {
	test('rejects empty parts', () => {
		expect(isValidDateParts({ day: '', month: '08', year: '2024' })).toBe(false)
	})

	test('accepts a valid date', () => {
		expect(isValidDateParts({ day: '15', month: '08', year: '2024' })).toBe(true)
	})

	test('rejects impossible date', () => {
		expect(isValidDateParts({ day: '31', month: '02', year: '2024' })).toBe(false)
	})

	test('honours yearsRange', () => {
		expect(
			isValidDateParts({ day: '15', month: '08', year: '1900' }, [2000, 2100])
		).toBe(false)
	})
})

describe('buildCalendarDate', () => {
	test('builds a CalendarDate from valid parts', () => {
		const date = buildCalendarDate({
			day: '15',
			month: '08',
			year: '2024',
		})
		expect(date).toBeInstanceOf(CalendarDate)
		expect((date as CalendarDate).year).toBe(2024)
	})

	test('returns null for invalid parts', () => {
		expect(
			buildCalendarDate({ day: '31', month: '02', year: '2024' })
		).toBeNull()
	})
})

describe('partsFromModelValue', () => {
	test('returns empty strings for null', () => {
		expect(partsFromModelValue(null)).toEqual({
			day: '',
			month: '',
			year: '',
		})
	})

	test('extracts padded parts from a CalendarDate', () => {
		const parts = partsFromModelValue(new CalendarDate(2024, 8, 5))
		expect(parts).toEqual({ day: '05', month: '08', year: '2024' })
	})
})

describe('sanitizeAndPad', () => {
	test('strips non-digits and pads', () => {
		expect(sanitizeAndPad('1a2b', 2)).toBe('12')
		expect(sanitizeAndPad('1', 2)).toBe('01')
		expect(sanitizeAndPad('', 2)).toBe('')
	})

	test('truncates to max length', () => {
		expect(sanitizeAndPad('12345', 4)).toBe('1234')
	})
})

describe('sanitizeDigits', () => {
	test('strips non-digits without padding', () => {
		expect(sanitizeDigits('1a2b', 4)).toBe('12')
		expect(sanitizeDigits('12345', 4)).toBe('1234')
	})
})
