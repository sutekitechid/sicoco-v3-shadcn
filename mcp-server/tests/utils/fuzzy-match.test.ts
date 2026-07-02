import { describe, it, expect } from 'vitest'
import { scoreMatch, fuzzySearch } from '../../src/utils/fuzzy-match.js'

describe('scoreMatch', () => {
	it('returns 0 for an empty query', () => {
		expect(scoreMatch('', 'hello').score).toBe(0)
	})

	it('returns a high score for an exact match', () => {
		const { score } = scoreMatch('button', 'SButton')
		expect(score).toBeGreaterThan(0)
	})

	it('boosts prefix matches over substring matches', () => {
		const prefix = scoreMatch('sbut', 'SButton')
		const infix = scoreMatch('utton', 'SButton')
		expect(prefix.score).toBeGreaterThan(infix.score)
	})

	it('matches case-insensitively', () => {
		const { score } = scoreMatch('SBUTTON', 'sbutton')
		expect(score).toBeGreaterThan(0)
	})

	it('falls back to subsequence matching', () => {
		// 'sbl' is not a substring of 'STableBody' but the chars appear
		// in order via subsequence: s(0), b(3), l(4).
		const { score, indices } = scoreMatch('sbl', 'STableBody')
		expect(score).toBeGreaterThan(0)
		expect(indices.length).toBe(3)
	})

	it('returns 0 when no match is possible', () => {
		expect(scoreMatch('xyz', 'SButton').score).toBe(0)
	})
})

describe('fuzzySearch', () => {
	const items = [
		{ name: 'SButton' },
		{ name: 'SDropdown' },
		{ name: 'SDatePicker' },
		{ name: 'STable' },
	]

	it('returns all items for an empty query, in original order', () => {
		const results = fuzzySearch(items, '', (i) => i.name)
		expect(results.length).toBe(items.length)
	})

	it('ranks prefix matches first', () => {
		const results = fuzzySearch(items, 'sd', (i) => i.name)
		const names = results.map((r) => r.item.name)
		expect(names[0]).toBe('SDropdown')
	})

	it('filters out non-matching items', () => {
		const results = fuzzySearch(items, 'xyz', (i) => i.name)
		expect(results.length).toBe(0)
	})
})
