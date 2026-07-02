import { describe, it, expect } from 'vitest'
import { buildComponentLookup, inferComponentFromPrefix } from '../../src/parsers/snippet-inferrer.js'

const KNOWN = [
	'SButton',
	'SInput',
	'SAlert',
	'SAccordion',
	'SBadge',
	'SBreadcrumb',
	'SCalendar',
	'SCard',
	'SCarousel',
	'SCheckbox',
	'SCheckboxGroup',
	'SDialog',
	'SDropdown',
	'SDatePicker',
	'STimePicker',
	'SRangeCalendar',
	'SRichTextEditor',
	'SFormInput',
	'SPinInput',
	'SDataTable',
	'STabs',
	'SStepper',
	'SSkeleton',
	'STextarea',
]

describe('buildComponentLookup', () => {
	it('builds a lookup keyed by lowercased name without leading S', () => {
		const lookup = buildComponentLookup(KNOWN)
		expect(lookup.size).toBe(KNOWN.length)
		expect(lookup.get('button')).toBe('SButton')
		expect(lookup.get('datepicker')).toBe('SDatePicker')
		expect(lookup.get('richtexteditor')).toBe('SRichTextEditor')
	})

	it('preserves original casing in the value', () => {
		const lookup = buildComponentLookup(['SDatePicker'])
		expect(lookup.get('datepicker')).toBe('SDatePicker')
	})

	it('handles empty input', () => {
		expect(buildComponentLookup([]).size).toBe(0)
	})
})

describe('inferComponentFromPrefix', () => {
	const lookup = buildComponentLookup(KNOWN)

	it('matches single-word component names', () => {
		expect(inferComponentFromPrefix('sibutton', lookup)).toBe('SButton')
		expect(inferComponentFromPrefix('sialert', lookup)).toBe('SAlert')
		expect(inferComponentFromPrefix('sitabs', lookup)).toBe('STabs')
	})

	it('matches compound component names regardless of internal PascalCase', () => {
		expect(inferComponentFromPrefix('sidatepicker', lookup)).toBe('SDatePicker')
		expect(inferComponentFromPrefix('sirichtexteditor', lookup)).toBe('SRichTextEditor')
		expect(inferComponentFromPrefix('sirangecalendar', lookup)).toBe('SRangeCalendar')
		expect(inferComponentFromPrefix('sicheckboxgroup', lookup)).toBe('SCheckboxGroup')
		expect(inferComponentFromPrefix('siforminput', lookup)).toBe('SFormInput')
		expect(inferComponentFromPrefix('sipininput', lookup)).toBe('SPinInput')
		expect(inferComponentFromPrefix('sitimepicker', lookup)).toBe('STimePicker')
		expect(inferComponentFromPrefix('sidatatable', lookup)).toBe('SDataTable')
	})

	it('strips the variant suffix after `:` or `.`', () => {
		expect(inferComponentFromPrefix('sibutton:primary', lookup)).toBe('SButton')
		expect(inferComponentFromPrefix('sidatepicker:required', lookup)).toBe('SDatePicker')
		expect(inferComponentFromPrefix('sirichtexteditor:full', lookup)).toBe(
			'SRichTextEditor',
		)
	})

	it('returns undefined for utility snippets that are not components', () => {
		// si-formatcurrency, si-filetype, si-cn are all utility snippets.
		expect(inferComponentFromPrefix('si-formatcurrency', lookup)).toBeUndefined()
		expect(inferComponentFromPrefix('si-filetype', lookup)).toBeUndefined()
		expect(inferComponentFromPrefix('si-cn', lookup)).toBeUndefined()
	})

	it('returns undefined for unknown prefixes', () => {
		expect(inferComponentFromPrefix('si-unknown', lookup)).toBeUndefined()
		expect(inferComponentFromPrefix('', lookup)).toBeUndefined()
	})

	it('falls back to prefix match when no exact match', () => {
		// Hypothetical: a snippet prefix that extends a component name.
		// e.g. "sibuttonspecial" should still map to SButton.
		expect(inferComponentFromPrefix('sibuttonspecial', lookup)).toBe('SButton')
	})
})
