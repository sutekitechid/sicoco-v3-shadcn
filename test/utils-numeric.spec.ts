import { test, expect } from 'vitest'
import { isNumeric, convertToNumber } from '../lib/utils/numeric'

test('isNumeric returns true for a numeric string', () => {
	expect(isNumeric('12345')).toBe(true)
})

test('isNumeric returns false for a non-numeric string', () => {
	expect(isNumeric('abc')).toBe(false)
})

test('isNumeric returns false for an alphanumeric string', () => {
	expect(isNumeric('123abc')).toBe(false)
})

test('isNumeric returns null for an empty string', () => {
	expect(isNumeric('')).toBeNull()
})

test('isNumeric returns false for a string with decimal point', () => {
	expect(isNumeric('12.34')).toBe(false)
})

test('convertToNumber returns undefined for undefined', () => {
	expect(convertToNumber(undefined as unknown as string)).toBeUndefined()
})

test('convertToNumber returns undefined for null', () => {
	expect(convertToNumber(null as unknown as string)).toBeUndefined()
})

test('convertToNumber returns undefined for empty string', () => {
	expect(convertToNumber('')).toBeUndefined()
})

test('convertToNumber converts a numeric string to number', () => {
	expect(convertToNumber('42')).toBe(42)
})

test('convertToNumber converts a string with commas to number', () => {
	expect(convertToNumber('1,5')).toBe(1.5)
})

test('convertToNumber returns the number as-is when already a number', () => {
	expect(convertToNumber(100)).toBe(100)
})

test('convertToNumber returns 0 for NaN result', () => {
	expect(convertToNumber('not-a-number')).toBe(0)
})
