import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'

const tailwindSource = readFileSync(
	resolve(__dirname, '../lib/config/tailwind.css'),
	'utf-8',
)
const editorSource = readFileSync(
	resolve(__dirname, '../lib/components/rich-editor/RichTextEditor.vue'),
	'utf-8',
)

/**
 * Smoke tests for the global heading typography.
 *
 * The styles in `lib/config/tailwind.css` use `!important` so they override
 * Quill's defaults (which are loaded dynamically inside the editor). The
 * dropdown preview in the rich editor overrides Quill's picker-item font-sizes
 * to stay in sync with the global typography.
 *
 * These tests lock in the mapping so a refactor doesn't accidentally drop
 * a heading or break the dropdown ↔ editor parity.
 */
describe('global heading typography in lib/config/tailwind.css', () => {
	it('h1 uses text-heading-xl and font-bold', () => {
		const block = extractRule(tailwindSource, 'h1')
		expect(block).not.toBeNull()
		expect(block).toMatch(/!text-heading-xl/)
		expect(block).toMatch(/!font-bold/)
	})

	it('h2 uses text-heading-lg and font-bold', () => {
		const block = extractRule(tailwindSource, 'h2')
		expect(block).not.toBeNull()
		expect(block).toMatch(/!text-heading-lg/)
		expect(block).toMatch(/!font-bold/)
	})

	it('h3 uses text-heading-md and font-bold', () => {
		const block = extractRule(tailwindSource, 'h3')
		expect(block).not.toBeNull()
		expect(block).toMatch(/!text-heading-md/)
		expect(block).toMatch(/!font-bold/)
	})

	it('h4 uses text-heading-sm and font-semibold', () => {
		const block = extractRule(tailwindSource, 'h4')
		expect(block).not.toBeNull()
		expect(block).toMatch(/!text-heading-sm/)
		expect(block).toMatch(/!font-semibold/)
	})

	it('h5 uses text-title-lg and font-semibold', () => {
		const block = extractRule(tailwindSource, 'h5')
		expect(block).not.toBeNull()
		expect(block).toMatch(/!text-title-lg/)
		expect(block).toMatch(/!font-semibold/)
	})

	it('h6 uses text-title-md and font-semibold', () => {
		const block = extractRule(tailwindSource, 'h6')
		expect(block).not.toBeNull()
		expect(block).toMatch(/!text-title-md/)
		expect(block).toMatch(/!font-semibold/)
	})

	it('all heading rules are inside the @layer base block', () => {
		const layerMatch = tailwindSource.match(
			/@layer\s+base\s*\{([\s\S]*?)\n\}/,
		)
		expect(layerMatch).not.toBeNull()
		const baseLayerBody = layerMatch![1]
		for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
			expect(baseLayerBody).toMatch(
				new RegExp(`\\b${tag}\\s*\\{[^}]*text-(heading|title)-`),
			)
		}
	})
})

describe('header dropdown preview overrides in RichTextEditor.vue', () => {
	const map: Array<[string, string, RegExp]> = [
		['1', 'h1 → text-heading-xl', /data-value="1"[\s\S]*?!text-heading-xl/],
		['2', 'h2 → text-heading-lg', /data-value="2"[\s\S]*?!text-heading-lg/],
		['3', 'h3 → text-heading-md', /data-value="3"[\s\S]*?!text-heading-md/],
		['4', 'h4 → text-heading-sm', /data-value="4"[\s\S]*?!text-heading-sm/],
		['5', 'h5 → text-title-lg', /data-value="5"[\s\S]*?!text-title-lg/],
		['6', 'h6 → text-title-md', /data-value="6"[\s\S]*?!text-title-md/],
	]

	for (const [value, label, pattern] of map) {
		it(`overrides picker-item[data-value="${value}"] (${label})`, () => {
			expect(editorSource).toMatch(pattern)
		})
	}

	it('h1-h3 dropdown items use font-bold', () => {
		for (const v of ['1', '2', '3']) {
			const re = new RegExp(
				`data-value="${v}"[\\s\\S]*?!font-bold`,
			)
			expect(editorSource).toMatch(re)
		}
	})

	it('h4-h6 dropdown items use font-semibold', () => {
		for (const v of ['4', '5', '6']) {
			const re = new RegExp(
				`data-value="${v}"[\\s\\S]*?!font-semibold`,
			)
			expect(editorSource).toMatch(re)
		}
	})
})

/**
 * Extract the body of the first CSS rule whose selector matches `selector`
 * within `source`. Returns null if not found.
 */
function extractRule(source: string, selector: string): string | null {
	const re = new RegExp(`\\b${selector}\\s*\\{`)
	const match = re.exec(source)
	if (!match) return null
	const start = match.index + match[0].length
	let depth = 1
	for (let i = start; i < source.length; i++) {
		const ch = source[i]
		if (ch === '{') depth++
		else if (ch === '}') {
			depth--
			if (depth === 0) return source.slice(start, i)
		}
	}
	return null
}
