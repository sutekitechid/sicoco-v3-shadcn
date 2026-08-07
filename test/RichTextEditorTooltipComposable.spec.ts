import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'

const composablePath = resolve(
	__dirname,
	'../lib/components/rich-editor/composables/use-rich-editor-quill-tooltip.ts',
)
const composableSource = readFileSync(composablePath, 'utf-8')

const editorPath = resolve(
	__dirname,
	'../lib/components/rich-editor/RichTextEditor.vue',
)
const editorSource = readFileSync(editorPath, 'utf-8')

const deletedComponentPath = resolve(
	__dirname,
	'../lib/components/rich-editor/toolbar/RichEditorQuillTooltip.vue',
)

/**
 * Smoke tests guarding the refactor of `RichEditorQuillTooltip.vue` from a
 * headless component into a composable. These verify:
 *  - the composable file exists with the expected exports,
 *  - `RichTextEditor.vue` calls the composable and no longer references the
 *    old component (import or template usage),
 *  - the old `.vue` file has been deleted.
 */
describe('useRichEditorQuillTooltip composable', () => {
	it('exists at the expected path', () => {
		expect(existsSync(composablePath)).toBe(true)
	})

	it('exports a `useRichEditorQuillTooltip` function', () => {
		expect(composableSource).toMatch(
			/export\s+function\s+useRichEditorQuillTooltip\s*\(/,
		)
	})

	it('exports a `UseRichEditorQuillTooltipOptions` interface with editorId', () => {
		expect(composableSource).toMatch(
			/export\s+interface\s+UseRichEditorQuillTooltipOptions\s*\{[\s\S]*editorId:\s*string[\s\S]*\}/,
		)
	})

	it('accepts an options object with editorId', () => {
		expect(composableSource).toMatch(
			/options:\s*UseRichEditorQuillTooltipOptions/,
		)
	})

	it('uses Vue lifecycle hooks onMounted and onUnmounted', () => {
		expect(composableSource).toMatch(/\bonMounted\(/)
		expect(composableSource).toMatch(/\bonUnmounted\(/)
	})

	it('observes the .ql-tooltip class attribute via MutationObserver', () => {
		expect(composableSource).toContain('MutationObserver')
		expect(composableSource).toContain("'.ql-tooltip'")
		expect(composableSource).toMatch(/attributeFilter:\s*\[\s*['"]class['"]/)
	})
})

describe('RichTextEditor.vue refactor', () => {
	it('imports the composable from composables/use-rich-editor-quill-tooltip', () => {
		expect(editorSource).toMatch(
			/import\s*\{\s*useRichEditorQuillTooltip\s*\}\s*from\s*['"]\.\/composables\/use-rich-editor-quill-tooltip['"]/,
		)
	})

	it('invokes the composable with the editorId', () => {
		expect(editorSource).toMatch(
			/useRichEditorQuillTooltip\(\s*\{\s*editorId\s*\}\s*\)/,
		)
	})

	it('does not import the old RichEditorQuillTooltip component', () => {
		expect(editorSource).not.toMatch(
			/from\s+['"]\.\/toolbar\/RichEditorQuillTooltip\.vue['"]/,
		)
	})

	it('does not use the <RichEditorQuillTooltip> tag in its template', () => {
		expect(editorSource).not.toMatch(/<RichEditorQuillTooltip[\s>]/)
	})
})

describe('RichEditorQuillTooltip.vue deletion', () => {
	it('the old component file has been removed', () => {
		expect(existsSync(deletedComponentPath)).toBe(false)
	})
})
