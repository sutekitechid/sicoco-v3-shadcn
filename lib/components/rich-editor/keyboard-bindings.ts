/**
 * Custom Quill keyboard bindings for the rich text editor.
 *
 * Notes on numeric `key` values:
 * - `strike` (53, Alt+Shift+5), `list-ordered` (55, Ctrl+Shift+7) and
 *   `list-bullet` (56, Ctrl+Shift+8) use the numeric keyCode because
 *   `evt.key` on a US keyboard yields the shifted character ("%", "&",
 *   "*") for those key combinations and would not match a digit string.
 *   Quill's `evt.which` is layout-independent and matches a numeric
 *   `binding.key` only.
 * - `shortKey: true` maps to `Cmd` on Mac and `Ctrl` on Windows/Linux.
 */
export const RICH_EDITOR_KEYBOARD_BINDINGS = {
	strike: {
		// keyCode 53 = "5" key. Use number so it matches `evt.which`
		// (numeric) instead of `evt.key` (which is "%" with Alt+Shift on
		// US layout).
		key: 53,
		altKey: true,
		shiftKey: true,
		handler: function () {
			const range = this.quill.getSelection()
			if (!range) return true
			const format = this.quill.getFormat(range) as {
				strike?: boolean
			}
			this.quill.format('strike', !format.strike, 'user')
			return false
		},
	},
	subscript: {
		key: ',',
		shortKey: true,
		handler: function () {
			this.quill.format('script', 'sub', 'user')
			return false
		},
	},
	superscript: {
		key: '.',
		shortKey: true,
		handler: function () {
			this.quill.format('script', 'super', 'user')
			return false
		},
	},
	clean: {
		key: '\\',
		shortKey: true,
		handler: function () {
			const range = this.quill.getSelection()
			if (!range || range.length === 0) return true
			this.quill.removeFormat(
				range.index,
				range.length,
				'user',
			)
			return false
		},
	},
	'align-left': {
		key: 'L',
		shortKey: true,
		shiftKey: true,
		handler: function () {
			this.quill.format('align', false, 'user')
			return false
		},
	},
	'align-center': {
		key: 'E',
		shortKey: true,
		shiftKey: true,
		handler: function () {
			this.quill.format('align', 'center', 'user')
			return false
		},
	},
	'align-right': {
		key: 'R',
		shortKey: true,
		shiftKey: true,
		handler: function () {
			this.quill.format('align', 'right', 'user')
			return false
		},
	},
	'align-justify': {
		key: 'J',
		shortKey: true,
		shiftKey: true,
		handler: function () {
			this.quill.format('align', 'justify', 'user')
			return false
		},
	},
	'list-ordered': {
		// keyCode 55 = "7" key. Use number so it matches `evt.which`
		// instead of `evt.key` (which is "&" with Shift on US layout).
		key: 55,
		shortKey: true,
		shiftKey: true,
		handler: function () {
			this.quill.format('list', 'ordered', 'user')
			return false
		},
	},
	'list-bullet': {
		// keyCode 56 = "8" key. Use number so it matches `evt.which`
		// instead of `evt.key` (which is "*" with Shift on US layout).
		key: 56,
		shortKey: true,
		shiftKey: true,
		handler: function () {
			this.quill.format('list', 'bullet', 'user')
			return false
		},
	},
} as const
