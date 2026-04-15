import { test, expect } from 'vitest'
import { cn } from '../lib/utils/tw-merge'

test('cn merges two class strings', () => {
	expect(cn('foo', 'bar')).toBe('foo bar')
})

test('cn deduplicates conflicting tailwind classes', () => {
	expect(cn('p-4', 'p-8')).toBe('p-8')
})

test('cn handles conditional falsy values', () => {
	expect(cn('foo', false && 'bar', null, undefined, 'baz')).toBe('foo baz')
})

test('cn handles an object of class conditions', () => {
	expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
})

test('cn handles an array of classes', () => {
	expect(cn(['foo', 'bar'])).toBe('foo bar')
})

test('cn returns an empty string when no arguments are provided', () => {
	expect(cn()).toBe('')
})

test('cn merges tailwind utilities correctly when overriding', () => {
	expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
})
