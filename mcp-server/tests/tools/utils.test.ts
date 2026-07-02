import { describe, it, expect } from 'vitest'
import type { SnippetMeta, UtilMeta } from '../../src/types.js'
import { fuzzySearch } from '../../src/utils/fuzzy-match.js'

const utils: Record<string, UtilMeta> = {
	cn: {
		name: 'cn',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'merge',
		description: 'Merge Tailwind class names.',
		parameters: [
			{ name: '...inputs', type: 'ClassValue[]', required: true },
		],
		returnType: 'string',
		relatedSnippets: ['si-cn'],
	},
	formatCurrency: {
		name: 'formatCurrency',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'currency',
		description: 'Format a number as a localized currency string.',
		parameters: [
			{ name: 'value', type: 'string | number | null | undefined', required: true },
		],
		returnType: 'string',
		relatedSnippets: ['si-formatcurrency'],
	},
	checkFileType: {
		name: 'checkFileType',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'file',
		description: 'Check whether a File matches allowed MIME types.',
		parameters: [
			{ name: 'file', type: 'File | null', required: true },
			{ name: 'allowedTypes', type: 'string[] | undefined', required: true },
		],
		returnType: 'boolean',
		relatedSnippets: ['si-filetype'],
	},
	getTotalPages: {
		name: 'getTotalPages',
		importPath: '@sutekitechid/sicoco-v3-next',
		category: 'pagination',
		description: 'Compute total page count from total data and per-page.',
		parameters: [
			{ name: 'totalData', type: 'number', required: true },
			{ name: 'perPage', type: 'number | string', required: true },
		],
		returnType: 'number',
		relatedSnippets: ['si-totalpages'],
	},
}

function search(query: string) {
	return fuzzySearch(
		Object.values(utils),
		query,
		(u) => `${u.name} ${u.description} ${u.category} ${u.parameters.map((p) => p.name).join(' ')}`,
	)
}

describe('utils search', () => {
	it('finds the currency util when searching "currency"', () => {
		const r = search('currency')
		expect(r[0]?.item.name).toBe('formatCurrency')
	})

	it('finds the merge util when searching "class"', () => {
		const r = search('tailwind class')
		expect(r[0]?.item.name).toBe('cn')
	})

	it('finds the file util by parameter name "file"', () => {
		const r = search('check file type')
		expect(r[0]?.item.name).toBe('checkFileType')
	})

	it('finds the pagination util by "page"', () => {
		const r = search('page')
		expect(r[0]?.item.name).toBe('getTotalPages')
	})

	it('returns empty for unrelated query', () => {
		expect(search('xyz123 no match').length).toBe(0)
	})
})

describe('util metadata', () => {
	it('every util has at least one parameter', () => {
		for (const u of Object.values(utils)) {
			expect(u.parameters.length).toBeGreaterThan(0)
		}
	})

	it('every required parameter has no default', () => {
		for (const u of Object.values(utils)) {
			for (const p of u.parameters) {
				if (p.required) {
					expect(p.default).toBeUndefined()
				}
			}
		}
	})

	it('every util has a non-empty return type', () => {
		for (const u of Object.values(utils)) {
			expect(u.returnType.length).toBeGreaterThan(0)
		}
	})
})
