import { readFileSync } from 'fs'
import { resolve } from 'path'
import { describe, it, expect } from 'vitest'

const editorSource = readFileSync(
	resolve(__dirname, '../lib/components/rich-editor/RichTextEditor.vue'),
	'utf-8',
)
const indexSource = readFileSync(
	resolve(__dirname, '../lib/components/rich-editor/index.ts'),
	'utf-8',
)
const blotSource = readFileSync(
	resolve(__dirname, '../lib/components/rich-editor/modules/horizontal-rule.js'),
	'utf-8',
)

/**
 * Verifies the wiring of the horizontal rule toolbar item. The actual
 * save/load round-trip (insertEmbed → getSemanticHTML → clipboard.convert
 * → setContents) is not exercised in jsdom, but the wiring is:
 *
 *   1. The HR Blot is registered as 'formats/hr' so Quill's clipboard
 *      `matchBlot` default matcher recognises <hr> tags when loading HTML.
 *   2. The toolbar handler in `options.toolbar.handlers` calls
 *      `quill.insertEmbed(idx, 'hr', true, 'user')`, so the resulting Delta
 *      contains `{ insert: { hr: true } }`.
 *   3. When Quill renders that Delta back to the editor it produces an
 *      <hr> DOM node, and `getSemanticHTML()` round-trips the same tag.
 *
 * Combined with the default Clipboard `matchBlot` in quill/modules/clipboard.js
 * (which queries `scroll.query(node)` for every ELEMENT_NODE), a Blot
 * registered with `tagName = 'hr'` is sufficient for save/load symmetry.
 */
describe('horizontal-rule toolbar item wiring', () => {
	it("registers the HR blot as 'formats/hr' in onMounted", () => {
		expect(editorSource).toMatch(
			/await\s+import\(['"]\.\/modules\/horizontal-rule\.js['"]\)/,
		)
		expect(editorSource).toMatch(
			/Quill\.register\(\s*['"]formats\/hr['"]\s*,\s*HorizontalRuleBlot\s*\)/,
		)
	})

	it("declares 'horizontal-rule' in the toolbar handlers", () => {
		expect(editorSource).toMatch(/['"]horizontal-rule['"]\s*:\s*function\s*\(/)
	})

	it('handler inserts a newline, the hr embed, and moves the cursor', () => {
		// Extract the handler body
		const match = editorSource.match(
			/['"]horizontal-rule['"]\s*:\s*function\s*\(\s*\)\s*\{([\s\S]*?)\n\s{4}\}/,
		)
		expect(match).not.toBeNull()
		const body = match![1]
		expect(body).toMatch(/this\.quill\.insertText\([^)]*['"]\\n['"]/)
		expect(body).toMatch(
			/this\.quill\.insertEmbed\([^)]*['"]hr['"][^)]*true/,
		)
		expect(body).toMatch(/this\.quill\.setSelection\(/)
	})

	it('exposes a button in the toolbar using si-rt-horizontal-rule', () => {
		expect(editorSource).toMatch(
			/ql-horizontal-rule[^"]*si-rt-horizontal-rule/,
		)
	})

	it('button is gated by isVisible("horizontal-rule")', () => {
		expect(editorSource).toMatch(
			/isVisible\(['"]horizontal-rule['"]\)/,
		)
	})

	it("adds 'horizontal-rule' to the RichEditorToolbarItem type and whitelist", () => {
		// Appears in the union type (either mid-union with `| 'next'` or last entry before `\n]`)
		expect(indexSource).toMatch(
			/['"]horizontal-rule['"]\s*(?:\|\s*['"][^'"]+['"]|\s*,?\s*\n\s*\])/,
		)
		// Appears in the RICH_EDITOR_TOOLBAR_ITEMS array
		expect(indexSource).toMatch(
			/['"]horizontal-rule['"]\s*,?\s*\n\s*\]/,
		)
	})

	it('the HR Blot extends BlockEmbed and uses tagName "hr"', () => {
		expect(blotSource).toMatch(
			/const\s+BlockEmbed\s*=\s*Quill\.import\(\s*['"]blots\/block\/embed['"]\s*\)/,
		)
		expect(blotSource).toMatch(/class\s+HorizontalRuleBlot\s+extends\s+BlockEmbed/)
		expect(blotSource).toMatch(/HorizontalRuleBlot\.blotName\s*=\s*['"]hr['"]/)
		expect(blotSource).toMatch(/HorizontalRuleBlot\.tagName\s*=\s*['"]hr['"]/)
	})
})
