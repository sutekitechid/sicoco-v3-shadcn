import { describe, it, expect } from 'vitest'
import { fuzzySearch } from '../../src/utils/fuzzy-match.js'
import type { ComponentMeta, SnippetMeta } from '../../src/types.js'

const components: Record<string, ComponentMeta> = {
	SDatePicker: {
		name: 'SDatePicker',
		importPath: '@sutekitechid/sicoco-v3-next',
		sourcePath: 'lib/components/date-picker/DatePicker.vue',
		category: 'form',
		description: 'Sicoco DatePicker',
		props: [],
		emits: [],
		slots: [],
		variants: [],
		relatedSnippets: [],
		isSubComponent: false,
	},
}

const snippets: Record<string, SnippetMeta> = {
	'sidatepicker': {
		prefix: 'sidatepicker',
		name: 'SDatePicker Basic',
		description: 'Basic SDatePicker',
		body: '<SDatePicker v-model="$1" />',
		component: 'SDatePicker',
		category: 'form',
	},
	'sidatepicker:required': {
		prefix: 'sidatepicker:required',
		name: 'SDatePicker Required',
		description: 'SDatePicker with required validation',
		body: '<SDatePicker v-model="$1" required>...</SDatePicker>',
		component: 'SDatePicker',
		category: 'form',
	},
	'sidatepicker:disabled': {
		prefix: 'sidatepicker:disabled',
		name: 'SDatePicker Disabled',
		description: 'Disabled SDatePicker',
		body: '<SDatePicker v-model="$1" disabled />',
		component: 'SDatePicker',
		category: 'form',
	},
}

function pickBest(component: string, useCase: string) {
	const candidates = Object.values(snippets).filter((s) => s.component === component)
	if (candidates.length === 0) return null
	if (!useCase) return candidates[0]
	return fuzzySearch(candidates, useCase, (s) => `${s.prefix} ${s.description}`)[0]?.item ?? candidates[0]
}

describe('generate_code behavior', () => {
	it('picks the required snippet when use-case mentions "required validation"', () => {
		const result = pickBest('SDatePicker', 'required validation')
		expect(result?.prefix).toBe('sidatepicker:required')
	})

	it('picks the disabled snippet when use-case mentions "disabled"', () => {
		const result = pickBest('SDatePicker', 'disabled')
		expect(result?.prefix).toBe('sidatepicker:disabled')
	})

	it('falls back to the first snippet when no use-case is provided', () => {
		const result = pickBest('SDatePicker', '')
		expect(result?.prefix).toBe('sidatepicker')
	})

	it('returns null when no snippets exist for a component', () => {
		const result = pickBest('SUnknown', 'whatever')
		expect(result).toBeNull()
	})
})
