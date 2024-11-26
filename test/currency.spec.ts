import { test, expect } from 'vitest'
import { formatCurrency } from '../lib/utils/currency'

test('formatCurrency number', () => {
  expect(formatCurrency(1000)).toBe('1.000')
})

test('formatCurrency string', () => {
  expect(formatCurrency('1000')).toBe('1.000')
})

test('formatCurrency null', () => {
  expect(formatCurrency(null)).toBe('')
})

test('formatCurrency undefined', () => {
  expect(formatCurrency(undefined)).toBe('')
})
