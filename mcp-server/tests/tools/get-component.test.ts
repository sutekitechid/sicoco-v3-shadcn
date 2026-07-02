import { describe, it, expect } from 'vitest'
import type { ComponentMeta, SnippetMeta } from '../../src/types.js'
import { fuzzySearch } from '../../src/utils/fuzzy-match.js'
import { validateSfc } from '../../src/utils/sfc-validator.js'

const components: Record<string, ComponentMeta> = {
	SButton: {
		name: 'SButton',
		importPath: '@sutekitechid/sicoco-v3-next',
		sourcePath: 'lib/components/button/Button.vue',
		category: 'form',
		description: 'Sicoco Button with multiple variants and sizes.',
		props: [
			{ name: 'variant', type: 'ButtonVariants["variant"]', required: false, default: '"default"' },
			{ name: 'size', type: 'ButtonVariants["size"]', required: false, default: '"default"' },
			{ name: 'disabled', type: 'boolean', required: false, default: 'false' },
		],
		emits: [{ name: 'click', payload: 'MouseEvent' }],
		slots: [],
		variants: [
			{ name: 'variant', values: ['primary', 'danger', 'success'], default: 'default' },
			{ name: 'size', values: ['sm', 'md', 'lg'], default: 'default' },
		],
		relatedSnippets: ['sibutton:primary'],
		isSubComponent: false,
	},
	SDatePicker: {
		name: 'SDatePicker',
		importPath: '@sutekitechid/sicoco-v3-next',
		sourcePath: 'lib/components/date-picker/DatePicker.vue',
		category: 'form',
		description: 'Sicoco DatePicker for single date and range selection.',
		props: [
			{ name: 'modelValue', type: 'DateValue | null', required: false },
			{ name: 'dateRange', type: 'boolean', required: false, default: 'false' },
			{ name: 'required', type: 'boolean', required: false, default: 'false' },
		],
		emits: [],
		slots: [],
		variants: [],
		relatedSnippets: ['sidatepicker'],
		isSubComponent: false,
	},
}

const snippets: Record<string, SnippetMeta> = {
	'sibutton:primary': {
		prefix: 'sibutton:primary',
		name: 'SButton Primary',
		description: 'Sicoco Button with primary variant',
		body: '<SButton variant="primary">$1</SButton>',
		component: 'SButton',
		category: 'form',
	},
	'sidatepicker:required': {
		prefix: 'sidatepicker:required',
		name: 'SDatePicker Required',
		description: 'Sicoco DatePicker with required validation',
		body: '<SDatePicker v-model="$1" required>...</SDatePicker>',
		component: 'SDatePicker',
		category: 'form',
	},
}

describe('tool data helpers', () => {
	it('fuzzySearch finds the SButton snippet by use-case', () => {
		const results = fuzzySearch(
			Object.values(snippets),
			'primary',
			(s) => `${s.prefix} ${s.description}`,
		)
		expect(results[0]?.item.prefix).toBe('sibutton:primary')
	})

	it('validateSfc warns on unknown prop', () => {
		const sfc = `<template><SButton foo="bar" /></template>`
		const issues = validateSfc(sfc, {
			components: {
				SButton: {
					name: 'SButton',
					props: components.SButton!.props.map((p) => ({
						name: p.name,
						type: p.type,
						required: p.required,
					})),
				},
			},
		})
		expect(issues.length).toBeGreaterThan(0)
		expect(issues[0]?.message).toContain('foo')
	})
})
