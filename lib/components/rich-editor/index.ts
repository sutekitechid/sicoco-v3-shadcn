import { cva, type VariantProps } from 'class-variance-authority'

export { default as RichTextEditor } from './RichTextEditor.vue'
export { default as RichEditorErrorMessage } from './RichEditorErrorMessage.vue'

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

export const richEditorToolbarVariants = cva('rounded-t', {
	variants: {
		state: {
			default: 'bg-neutral-50 dark:bg-neutral-100',
			disabled: '!bg-neutral-300 cursor-not-allowed',
			readonly: '!bg-neutral-300',
		},
	},
	defaultVariants: {
		state: 'default',
	},
})

export const richEditorContainerVariants = cva('rounded-b-lg', {
	variants: {
		state: {
			default: 'bg-neutral-50 dark:bg-neutral-100',
			disabled: '!bg-neutral-300 !cursor-not-allowed',
			readonly: '!bg-neutral-300',
		},
	},
	defaultVariants: {
		state: 'default',
	},
})

export const richEditorVariants = cva('', {
	variants: {
		state: {
			default: 'text-neutral-950 dark:text-neutral-500',
			disabled: '!text-neutral-600',
			readonly: '!text-neutral-950',
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
