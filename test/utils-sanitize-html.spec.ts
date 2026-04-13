import { test, expect } from 'vitest'
import { useSanitizeHtml } from '../lib/utils/sanitize-html'

test('useSanitizeHtml removes script tags', () => {
	const result = useSanitizeHtml('<script>alert("xss")</script>')
	expect(result).not.toContain('<script>')
})

test('useSanitizeHtml removes event handler attributes', () => {
	const result = useSanitizeHtml('<div onclick="alert(1)">click me</div>')
	expect(result).not.toContain('onclick')
})

test('useSanitizeHtml preserves allowed tags', () => {
	const result = useSanitizeHtml('<p>Hello world</p>')
	expect(result).toContain('<p')
	expect(result).toContain('Hello world')
})

test('useSanitizeHtml preserves h1 through h6 tags', () => {
	const result = useSanitizeHtml('<h1>Title</h1><h2>Sub</h2>')
	expect(result).toContain('<h1')
	expect(result).toContain('<h2')
})

test('useSanitizeHtml preserves ul and li tags', () => {
	const result = useSanitizeHtml('<ul><li>Item</li></ul>')
	expect(result).toContain('<ul')
	expect(result).toContain('<li')
})

test('useSanitizeHtml preserves ol and li tags', () => {
	const result = useSanitizeHtml('<ol><li>One</li></ol>')
	expect(result).toContain('<ol')
})

test('useSanitizeHtml applies tailwind class to ol tags', () => {
	const result = useSanitizeHtml('<ol><li>Item</li></ol>')
	expect(result).toContain('list-decimal')
})

test('useSanitizeHtml applies tailwind class to ul tags', () => {
	const result = useSanitizeHtml('<ul><li>Item</li></ul>')
	expect(result).toContain('list-disc')
})

test('useSanitizeHtml accepts custom options to override defaults', () => {
	const result = useSanitizeHtml('<p>Hello</p><b>World</b>', {
		allowedTags: ['b'],
	})
	expect(result).not.toContain('<p>')
	expect(result).toContain('<b>')
})

test('useSanitizeHtml strips unknown tags', () => {
	const result = useSanitizeHtml('<mycustomtag>content</mycustomtag>')
	expect(result).not.toContain('<mycustomtag>')
	expect(result).toContain('content')
})

test('useSanitizeHtml preserves blockquote tag with class', () => {
	const result = useSanitizeHtml('<blockquote>Quote</blockquote>')
	expect(result).toContain('<blockquote')
	expect(result).toContain('Quote')
})

test('useSanitizeHtml handles empty string input', () => {
	expect(useSanitizeHtml('')).toBe('')
})
