import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import RichTextEditor from '../lib/components/rich-editor/RichTextEditor.vue'

const globalStubs = {
	Tooltip: {
		template: '<div><slot name="trigger" /><slot /></div>',
	},
	TooltipContent: {
		template: '<div><slot /></div>',
	},
}

const editorSource = readFileSync(
	resolve(
		__dirname,
		'../lib/components/rich-editor/keyboard-bindings.ts',
	),
	'utf-8',
)

describe('RichTextEditor.vue - keyboard shortcut tooltips', () => {
	it('shows Alt+Shift+5 hint for strikethrough', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).toContain('Strikethrough (Alt+Shift+5)')
	})

	it('shows Ctrl+, hint for subscript', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).toContain('Subscript (Ctrl+,)')
	})

	it('shows Ctrl+. hint for superscript', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).toContain('Superscript (Ctrl+.)')
	})

	it('shows Ctrl+\\ hint for clear formatting', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).toContain('Clear Formatting (Ctrl+\\)')
	})

	it('keeps ordered list tooltip at Ctrl+Shift+7', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).toContain('Ordered List (Ctrl+Shift+7)')
	})

	it('keeps bullet list tooltip at Ctrl+Shift+8', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).toContain('Bullet List (Ctrl+Shift+8)')
	})

	it('does not show the old strike shortcut hint', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).not.toContain('Strikethrough (Ctrl+Shift+X)')
	})

	it('does not show the old subscript shortcut hint', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).not.toContain('Subscript (Ctrl+Shift+<)')
	})

	it('does not show the old superscript shortcut hint', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).not.toContain('Superscript (Ctrl+Shift+>)')
	})

	it('does not show the old clear formatting shortcut hint', () => {
		const wrapper = mount(RichTextEditor, { global: { stubs: globalStubs } })
		expect(wrapper.text()).not.toContain(
			'Clear Formatting (Ctrl+Shift+Space)',
		)
	})
})

/**
 * Quill's keyboard.match checks `binding.key === evt.key || binding.key === evt.which`.
 * For shifted digit keys (Ctrl+Shift+7, Ctrl+Shift+8, Alt+Shift+5), `evt.key` is the
 * shifted character ("&", "*", "%" on US layout), so a string `key: '7'` will never match.
 * Quill's `evt.which` is the keyCode (55, 56, 53 respectively), which is layout-independent
 * and only matches a numeric `binding.key`. These smoke tests lock in the numeric keyCodes
 * so a future refactor doesn't accidentally regress to the broken string form.
 */
describe('keyboard-bindings.ts - keyboard binding keyCodes (regression guard)', () => {
	it('uses keyCode 55 for the ordered list binding (Ctrl+Shift+7)', () => {
		const block = extractBindingBlock(editorSource, 'list-ordered')
		expect(block).not.toBeNull()
		expect(block).toMatch(/\bkey:\s*55\b/)
		expect(block).not.toMatch(/\bkey:\s*['"]7['"]/)
	})

	it('uses keyCode 56 for the bullet list binding (Ctrl+Shift+8)', () => {
		const block = extractBindingBlock(editorSource, 'list-bullet')
		expect(block).not.toBeNull()
		expect(block).toMatch(/\bkey:\s*56\b/)
		expect(block).not.toMatch(/\bkey:\s*['"]8['"]/)
	})

	it('uses keyCode 53 for the strikethrough binding (Alt+Shift+5)', () => {
		const block = extractBindingBlock(editorSource, 'strike')
		expect(block).not.toBeNull()
		expect(block).toMatch(/\bkey:\s*53\b/)
		expect(block).not.toMatch(/\bkey:\s*['"]5['"]/)
		expect(block).not.toMatch(/\bkey:\s*5\s*[,\n]/)
	})

	it('ordered list binding has shortKey + shiftKey modifiers', () => {
		const block = extractBindingBlock(editorSource, 'list-ordered')
		expect(block).toMatch(/shortKey:\s*true/)
		expect(block).toMatch(/shiftKey:\s*true/)
	})

	it('bullet list binding has shortKey + shiftKey modifiers', () => {
		const block = extractBindingBlock(editorSource, 'list-bullet')
		expect(block).toMatch(/shortKey:\s*true/)
		expect(block).toMatch(/shiftKey:\s*true/)
	})
})

function extractBindingBlock(source: string, name: string): string | null {
	// Scope to the RICH_EDITOR_KEYBOARD_BINDINGS object so we don't
	// accidentally match the same identifier in JSDoc comments above it.
	const bindingsStart = source.indexOf('RICH_EDITOR_KEYBOARD_BINDINGS = {')
	if (bindingsStart === -1) return null
	const searchFrom = bindingsStart
	// Try both unquoted (e.g. `strike:`) and quoted (e.g. `'list-ordered':`) forms.
	const candidates = [`${name}: {`, `'${name}': {`]
	let start = -1
	for (const candidate of candidates) {
		start = source.indexOf(candidate, searchFrom)
		if (start !== -1) break
	}
	if (start === -1) return null
	let depth = 0
	const i = source.indexOf('{', start)
	for (let k = i; k < source.length; k++) {
		const ch = source[k]
		if (ch === '{') depth++
		else if (ch === '}') {
			depth--
			if (depth === 0) return source.slice(start, k + 1)
		}
	}
	return null
}
