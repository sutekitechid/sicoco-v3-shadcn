import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { toPX } from '../lib/utils/to-px'

// =============================================
// Client-side tests (happy-dom provides document)
// =============================================

describe('toPX - client-side', () => {
	test('returns 1 for "px" unit', () => {
		expect(toPX('px')).toBe(1)
	})

	test('converts "128px" to 128', () => {
		expect(toPX('128px')).toBe(128)
	})

	test('converts "1.5px" to 1.5', () => {
		expect(toPX('1.5px')).toBe(1.5)
	})

	test('converts "0px" to 0', () => {
		expect(toPX('0px')).toBe(0)
	})

	test('converts number input directly', () => {
		expect(toPX(48)).toBe(48)
		expect(toPX(0)).toBe(0)
	})

	test('returns null for null input', () => {
		expect(toPX(null)).toBeNull()
	})

	test('returns null for undefined input', () => {
		expect(toPX(undefined)).toBeNull()
	})

	test('returns null for empty string', () => {
		expect(toPX('')).toBeNull()
	})

	test('returns null for unknown unit', () => {
		expect(toPX('foo')).toBeNull()
	})

	test('returns null for unknown unit with number', () => {
		expect(toPX('10xyz')).toBeNull()
	})

	test('converts "rem" unit using document.documentElement font-size', () => {
		// happy-dom default font-size is 16px
		const result = toPX('rem')
		expect(typeof result).toBe('number')
		expect(result).toBeGreaterThan(0)
	})

	test('converts "1rem" correctly', () => {
		const remPx = toPX('rem') as number
		expect(toPX('1rem')).toBe(remPx)
	})

	test('converts "2rem" correctly', () => {
		const remPx = toPX('rem') as number
		expect(toPX('2rem')).toBe(2 * remPx)
	})

	test('converts "em" unit', () => {
		const result = toPX('em')
		expect(typeof result).toBe('number')
		expect(result).toBeGreaterThan(0)
	})

	test('converts "vh" using window.innerHeight', () => {
		const result = toPX('1vh')
		expect(result).toBe(window.innerHeight / 100)
	})

	test('converts "vw" using window.innerWidth', () => {
		const result = toPX('1vw')
		expect(result).toBe(window.innerWidth / 100)
	})

	test('converts "vmin"', () => {
		const result = toPX('1vmin')
		expect(result).toBe(Math.min(window.innerWidth, window.innerHeight) / 100)
	})

	test('converts "vmax"', () => {
		const result = toPX('1vmax')
		expect(result).toBe(Math.max(window.innerWidth, window.innerHeight) / 100)
	})

	test('converts "in" using cached pixels-per-inch', () => {
		const result = toPX('1in')
		expect(typeof result).toBe('number')
		expect(result).toBeGreaterThan(0)
	})

	test('converts "cm" relative to "in"', () => {
		const inch = toPX('1in') as number
		expect(toPX('1cm')).toBeCloseTo(inch / 2.54, 5)
	})

	test('converts "mm" relative to "in"', () => {
		const inch = toPX('1in') as number
		expect(toPX('1mm')).toBeCloseTo(inch / 25.4, 5)
	})

	test('converts "pt" relative to "in"', () => {
		const inch = toPX('1in') as number
		expect(toPX('1pt')).toBeCloseTo(inch / 72, 5)
	})

	test('converts "pc" relative to "in"', () => {
		const inch = toPX('1in') as number
		expect(toPX('1pc')).toBeCloseTo(inch / 6, 5)
	})

	test('is case-insensitive', () => {
		expect(toPX('128PX')).toBe(128)
		expect(toPX('2REM')).toBe(toPX('2rem'))
	})

	test('trims whitespace', () => {
		expect(toPX('  128px  ')).toBe(128)
	})
})

// =============================================
// SSR path tests (document === 'undefined')
// =============================================

describe('toPX - SSR (document is not defined)', () => {
	let originalDocument: typeof globalThis.document

	beforeEach(() => {
		originalDocument = globalThis.document
		// @ts-expect-error - simulate SSR environment
		delete globalThis.document
	})

	afterEach(() => {
		globalThis.document = originalDocument
	})

	test('does not throw when document is undefined', () => {
		expect(() => toPX('40rem')).not.toThrow()
	})

	test('returns correct value for px in SSR', () => {
		expect(toPX('px')).toBe(1)
		expect(toPX('128px')).toBe(128)
	})

	test('returns fallback 16 for rem in SSR', () => {
		expect(toPX('rem')).toBe(16)
		expect(toPX('1rem')).toBe(16)
		expect(toPX('2rem')).toBe(32)
	})

	test('returns fallback 16 for em in SSR', () => {
		expect(toPX('em')).toBe(16)
		expect(toPX('2em')).toBe(32)
	})

	test('returns fallback 96 for in in SSR', () => {
		expect(toPX('in')).toBe(96)
		expect(toPX('1in')).toBe(96)
	})

	test('returns fallback for cm, mm, pt, pc in SSR', () => {
		expect(toPX('1cm')).toBeCloseTo(96 / 2.54, 5)
		expect(toPX('1mm')).toBeCloseTo(96 / 25.4, 5)
		expect(toPX('1pt')).toBeCloseTo(96 / 72, 5)
		expect(toPX('1pc')).toBeCloseTo(96 / 6, 5)
	})

	test('returns number directly in SSR', () => {
		expect(toPX(48)).toBe(48)
	})

	test('returns null for null/undefined/empty in SSR', () => {
		expect(toPX(null)).toBeNull()
		expect(toPX(undefined)).toBeNull()
		expect(toPX('')).toBeNull()
	})

	test('returns null for unknown unit in SSR', () => {
		expect(toPX('foo')).toBeNull()
		expect(toPX('10xyz')).toBeNull()
	})
})
