import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'

const editorSource = readFileSync(
	resolve(__dirname, '../lib/components/rich-editor/RichTextEditor.vue'),
	'utf-8',
)

/**
 * Smoke tests for the header dropdown preview sizes in RichTextEditor.vue.
 *
 * Quill's snow theme sets `font-size` per `data-value` to give a visual
 * preview of the heading size inside the header picker. The editor overrides
 * those defaults to match the design system's heading typography tokens
 * (text-heading-* / text-title-*). `!important` is required because Quill's
 * CSS is loaded dynamically after the component's <style>.
 *
 * These tests lock in the mapping so a refactor doesn't accidentally drop
 * a heading or break the dropdown ↔ editor parity.
 */
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
