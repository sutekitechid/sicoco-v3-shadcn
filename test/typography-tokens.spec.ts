import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

const tailwindCss = readFileSync(resolve(process.cwd(), 'lib/config/tailwind.css'), 'utf8')

const typographyTokens = [
	'display-xl', 'display-lg', 'display-md', 'display-sm',
	'heading-xl', 'heading-lg', 'heading-md', 'heading-sm',
	'title-lg', 'title-md', 'title-sm',
	'body-lg', 'body-md', 'body-sm',
	'label-lg', 'label-md', 'label-sm',
	'caption-md', 'caption-sm',
]

describe('responsive typography tokens', () => {
	test('keeps the root font size accessible', () => {
		expect(tailwindCss).toMatch(/html\s*\{\s*font-size:\s*100%;/)
	})

	test('uses mobile-first tablet and desktop breakpoints', () => {
		expect(tailwindCss).toContain('@media (min-width: 48rem)')
		expect(tailwindCss).toContain('@media (min-width: 64rem)')
	})

	test.each(typographyTokens)('%s defines rem values at every breakpoint', (token) => {
		const matches = tailwindCss.match(new RegExp(`--text-${token}:\\s*[^;]+;`, 'g'))
		const lineHeightMatches = tailwindCss.match(new RegExp(`--text-${token}--line-height:\\s*[^;]+;`, 'g'))

		// Tailwind's theme value and the runtime mobile value are both required,
		// followed by the Tablet and Desktop overrides.
		expect(matches).toHaveLength(4)
		expect(lineHeightMatches).toHaveLength(4)
		matches?.forEach(match => expect(match).toMatch(/:\s*[\d.]+rem;/))
		lineHeightMatches?.forEach(match => expect(match).toMatch(/:\s*[\d.]+rem;/))
	})

	test('uses body-md as the responsive document default', () => {
		expect(tailwindCss).toMatch(/body\s*\{\s*font-size:\s*var\(--text-body-md\);\s*line-height:\s*var\(--text-body-md--line-height\);/)
	})
})
