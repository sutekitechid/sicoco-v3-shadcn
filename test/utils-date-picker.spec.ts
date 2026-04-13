import { test, expect } from 'vitest'
import { CalendarDate } from '@internationalized/date'
import {
	selectedImportantDate,
	getColorDate,
	getTooltipDate,
} from '../lib/utils/date-picker'
import type { ImportantDate } from '../lib/utils/date-picker-types'

const date20231210 = new CalendarDate(2023, 12, 10)
const date20231215 = new CalendarDate(2023, 12, 15)

const importantDates: ImportantDate[] = [
	{ date: date20231210, color: ['red', 'blue'], tooltip: 'Holiday' },
	{ date: date20231215, color: 'green', tooltip: 'Meeting' },
]

test('selectedImportantDate returns matching dates', () => {
	const result = selectedImportantDate(importantDates, '10-12-2023')
	expect(result).toHaveLength(1)
	expect(result[0].color).toEqual(['red', 'blue'])
})

test('selectedImportantDate returns empty array when no match found', () => {
	const result = selectedImportantDate(importantDates, '01-01-2023')
	expect(result).toHaveLength(0)
})

test('selectedImportantDate returns empty array when list is empty', () => {
	const result = selectedImportantDate([], '10-12-2023')
	expect(result).toHaveLength(0)
})

test('selectedImportantDate skips entries with string date values', () => {
	const mixed: ImportantDate[] = [
		{ date: '2023-12-10', color: 'yellow', tooltip: 'String date' },
		{ date: date20231210, color: ['red'], tooltip: 'CalendarDate' },
	]
	const result = selectedImportantDate(mixed, '10-12-2023')
	expect(result).toHaveLength(1)
	expect(result[0].tooltip).toBe('CalendarDate')
})

test('getColorDate returns colors for a matching date', () => {
	const colors = getColorDate(importantDates, date20231210)
	expect(colors).toContain('red')
	expect(colors).toContain('blue')
})

test('getColorDate returns empty array when date has no match', () => {
	const unmatched = new CalendarDate(2023, 1, 1)
	const colors = getColorDate(importantDates, unmatched)
	expect(colors).toEqual([])
})

test('getColorDate returns empty array when date is falsy', () => {
	const colors = getColorDate(importantDates, null as unknown as CalendarDate)
	expect(colors).toEqual([])
})

test('getTooltipDate returns tooltip strings for a matching date', () => {
	const tooltips = getTooltipDate(importantDates, date20231210)
	expect(tooltips).toContain('Holiday')
})

test('getTooltipDate returns empty array when no match', () => {
	const unmatched = new CalendarDate(2023, 1, 1)
	const tooltips = getTooltipDate(importantDates, unmatched)
	expect(tooltips).toEqual([])
})

test('getTooltipDate returns empty array when date is falsy', () => {
	const tooltips = getTooltipDate(importantDates, null as unknown as CalendarDate)
	expect(tooltips).toEqual([])
})

test('getTooltipDate filters out non-string tooltip values', () => {
	// Intentionally using an array tooltip to test that only string tooltips are returned.
	// The type cast mimics a runtime scenario where the tooltip field holds an array.
	const mixedTooltip = [
		{ date: date20231210, color: 'red', tooltip: ['array-tooltip'] },
	] as unknown as ImportantDate[]
	const tooltips = getTooltipDate(mixedTooltip, date20231210)
	// tooltip is an array, not a string, so it should be filtered out
	expect(tooltips).toHaveLength(0)
})
