import { cva, type VariantProps } from 'class-variance-authority'

export { default as RichTextEditor } from './RichTextEditor.vue'
export { default as RichEditorErrorMessage } from './RichEditorErrorMessage.vue'
export { RICH_EDITOR_KEYBOARD_BINDINGS } from './keyboard-bindings'

export type EditorState = 'default' | 'disabled' | 'readonly'

export type RichEditorToolbarItem =
	| 'undo'
	| 'redo'
	| 'header'
	| 'alignment'
	| 'color'
	| 'bold'
	| 'italic'
	| 'underline'
	| 'strike'
	| 'subscript'
	| 'superscript'
	| 'clean'
	| 'list-ordered'
	| 'list-bullet'
	| 'link'
	| 'image'
	| 'video'
	| 'attachment'
	| 'table'
	| 'blockquote'
	| 'code-block'
	| 'horizontal-rule'

export const RICH_EDITOR_TOOLBAR_ITEMS: RichEditorToolbarItem[] = [
	'undo',
	'redo',
	'header',
	'alignment',
	'color',
	'bold',
	'italic',
	'underline',
	'strike',
	'subscript',
	'superscript',
	'clean',
	'list-ordered',
	'list-bullet',
	'link',
	'image',
	'video',
	'attachment',
	'table',
	'blockquote',
	'code-block',
	'horizontal-rule',
]

/**
 * Default toolbar items rendered by {@link RichTextEditor}.
 *
 * Contains every item in {@link RICH_EDITOR_TOOLBAR_ITEMS} except
 * `'attachment'`. Consumers who need the attachment button must opt in
 * explicitly, e.g. by spreading this constant and appending `'attachment'`.
 */
export const DEFAULT_RICH_EDITOR_TOOLBAR_ITEMS: RichEditorToolbarItem[] =
	RICH_EDITOR_TOOLBAR_ITEMS.filter(item => item !== 'attachment' && item !== 'image' && item !== 'video')

export const richEditorToolbarVariants = cva('', {
	variants: {
		state: {
			default: 'bg-neutral-50 dark:bg-neutral-100',
			disabled: '!bg-disabled cursor-not-allowed',
			readonly: '!bg-disabled',
		},
	},
	defaultVariants: {
		state: 'default',
	},
})

export const richEditorContainerVariants = cva('', {
	variants: {
		state: {
			default: 'bg-neutral-50 dark:bg-neutral-100 focus-within:shadow-primary focus-within:border-primary-default',
			disabled: '!bg-disabled !cursor-not-allowed focus-within:!bg-disabled focus-within:border-main',
			readonly: '!bg-disabled focus-within:!bg-disabled focus-within:border-main',
		},
	},
	defaultVariants: {
		state: 'default',
	},
})

export const richEditorVariants = cva('text-body-md', {
	variants: {
		state: {
			default: 'text-main dark:text-neutral-500',
			disabled: 'text-disabled',
			readonly: '!text-main',
		},
	},
	defaultVariants: {
		state: 'default',
	},
})

export type RichEditorToolbarVariants = VariantProps<
	typeof richEditorToolbarVariants
>
export type RichEditorContainerVariants = VariantProps<
	typeof richEditorContainerVariants
>
export type RichEditorVariants = VariantProps<typeof richEditorVariants>
