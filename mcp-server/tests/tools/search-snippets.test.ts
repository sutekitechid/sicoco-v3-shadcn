import { describe, it, expect } from 'vitest'
import { fuzzySearch } from '../../src/utils/fuzzy-match.js'
import type { SnippetMeta } from '../../src/types.js'

const snippets: Record<string, SnippetMeta> = {
	'siinput:email': {
		prefix: 'siinput:email',
		name: 'SInput Email',
		description: 'Sicoco Input with email validation',
		body: '',
		component: 'SInput',
		category: 'form',
	},
	'siinput:required': {
		prefix: 'siinput:required',
		name: 'SInput Required',
		description: 'Sicoco Input with required validation',
		body: '',
		component: 'SInput',
		category: 'form',
	},
	'sidatepicker:required': {
		prefix: 'sidatepicker:required',
		name: 'SDatePicker Required',
		description: 'Sicoco DatePicker with required validation',
		body: '',
		component: 'SDatePicker',
		category: 'form',
	},
	'sibutton:danger': {
		prefix: 'sibutton:danger',
		name: 'SButton Danger',
		description: 'Sicoco Button with danger variant',
		body: '',
		component: 'SButton',
		category: 'form',
	},
}

describe('search_snippets behavior', () => {
	it('ranks validation-related snippets first when searching "required validation"', () => {
		const results = fuzzySearch(
			Object.values(snippets),
			'required validation',
			(s) => `${s.prefix} ${s.description}`,
		)
		const prefixes = results.map((r) => r.item.prefix)
		expect(prefixes[0]).toContain('required')
	})

	it('narrows to a single component when filtered', () => {
		const items = Object.values(snippets).filter((s) => s.component === 'SInput')
		const results = fuzzySearch(items, 'email', (s) => s.description)
		expect(results.length).toBe(1)
		expect(results[0]?.item.prefix).toBe('siinput:email')
	})

	it('returns no results for an unmatchable query', () => {
		const results = fuzzySearch(
			Object.values(snippets),
			'this is gibberish xyz123',
			(s) => s.description,
		)
		expect(results.length).toBe(0)
	})
})
