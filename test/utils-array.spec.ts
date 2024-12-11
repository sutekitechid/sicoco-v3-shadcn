import { toggleArrayValue } from '../lib/utils/array'
import { test, expect } from 'vitest'

test('adds a value not in the array', () => {
	const array = [1, 2, 3]
	const result = toggleArrayValue(array, 4)
	expect(result).toEqual([1, 2, 3, 4])
})

test('removes a value already in the array', () => {
	const array = [1, 2, 3]
	const result = toggleArrayValue(array, 2)
	expect(result).toEqual([1, 3])
})

test('adds an object not in the array', () => {
	const array = [{ id: 1 }, { id: 2 }]
	const result = toggleArrayValue(array, { id: 3 })
	expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
})

test('removes an object already in the array', () => {
	const array = [{ id: 1 }, { id: 2 }]
	const result = toggleArrayValue(array, { id: 2 })
	expect(result).toEqual([{ id: 1 }])
})

test('handles an empty array by adding a value', () => {
	const array: number[] = []
	const result = toggleArrayValue(array, 1)
	expect(result).toEqual([1])
})

test('does not modify the original array reference', () => {
	const array = [1, 2, 3]
	const originalArray = [...array]
	toggleArrayValue(array, 4)
	expect(array).not.toBe(originalArray)
})
