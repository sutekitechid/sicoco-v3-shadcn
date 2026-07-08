<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import BaseInput from '../base-input'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import RichEditorErrorMessage from './RichEditorErrorMessage.vue'
import RichEditorUndo from './toolbar/RichEditorUndo.vue'
import RichEditorRedo from './toolbar/RichEditorRedo.vue'
import RichEditorAlignment from './toolbar/RichEditorAlignment.vue'
import RichEditorColor from './toolbar/RichEditorColor.vue'
import RichEditorTable from './toolbar/RichEditorTable.vue'
import RichEditorHeader from './toolbar/RichEditorHeader.vue'
import { useRichEditorQuillTooltip } from './composables/use-rich-editor-quill-tooltip'
import {
	richEditorContainerVariants,
	richEditorToolbarVariants,
	richEditorVariants,
	DEFAULT_RICH_EDITOR_TOOLBAR_ITEMS,
	RICH_EDITOR_TOOLBAR_ITEMS,
	RICH_EDITOR_KEYBOARD_BINDINGS,
	type EditorState,
	type RichEditorToolbarItem,
} from './index'
import { maxLength, requiredIf } from '@vuelidate/validators'
import Tooltip from '../tooltip/Tooltip.vue'
import TooltipContent from '../tooltip/TooltipContent.vue'

/**
 * Props for the RichTextEditor component.
 *
 * @prop {string} [id='editor'] - The unique identifier for the editor.
 * @prop {string} [modelValue] - The value of the editor's content.
 * @prop {boolean} [readOnly=false] - Whether the editor is in read-only mode.
 * @prop {boolean} [disabled=false] - Whether the editor is in disabled state.
 * @prop {string} [placeholder=''] - Placeholder text displayed when the editor is empty.
 * @prop {Object} [options] - Additional configuration options for the editor.
 * @prop {Record<string, any>} [customValidators] - Custom validation rules for the editor's content.
 * @prop {number} [maxlength=1000] - Maximum number of characters allowed in the editor.
 * @prop {boolean} [required=false] - Whether the editor's content is required.
 * @prop {boolean} [attachmentsToolbar=false] - Whether to show the attachment toolbar (image, video, attachment) when `toolbarItems` is not provided.
 * @prop {RichEditorToolbarItem[]} [toolbarItems] - Whitelist of toolbar items to display. When omitted or empty, all items are shown.
 * @prop {(file: File) => string | Promise<string>} [imageUploadHandler] - Function to handle image uploads, returning a URL or a Promise resolving to a URL.
 * @prop {(file: File) => string | Promise<string>} [videoUploadHandler] - Function to handle video uploads, returning a URL or a Promise resolving to a URL.
 */
const props = withDefaults(
	defineProps<{
		id?: string
		modelValue?: string
		readonly?: boolean
		disabled?: boolean
		placeholder?: string
		options?: object
		customValidators?: Record<string, unknown>
		maxlength?: number
		required?: boolean
		attachmentsToolbar?: boolean
		toolbarItems?: RichEditorToolbarItem[]
		dataCy?: string
		dataTestid?: string
		imageUploadHandler?: (file: File) => string | Promise<string>
		videoUploadHandler?: (file: File) => string | Promise<string>
		attachmentUploadHandler?: (file: File) => string | Promise<string>
	}>(),
	{
		readonly: false,
		disabled: false,
		placeholder: '',
		required: false,
		attachmentsToolbar: false,
		maxlength: null,
		toolbarItems: () => DEFAULT_RICH_EDITOR_TOOLBAR_ITEMS,
	},
)

const editorId = props.id || uniqueId('editor-')
const toolbarId = `toolbar-${editorId}`

useRichEditorQuillTooltip({ editorId })

/**
 * Computed property `options` that defines the configuration for the rich text editor.
 *
 * @returns {Object} Configuration object for the editor.
 *
 * Properties:
 * - `theme` {string}: The theme of the editor. Default is 'snow'.
 * - `modules` {Object}: Defines the modules and their configurations for the editor.
 *   - `toolbar` {string}: Selector for the toolbar element.
 *   - `magicUrl` {boolean}: Enables automatic hyperlinking of URLs. Default is true.
 *   - `imageUploader` {Object}: Configuration for image uploading.
 *     - `upload` {Function}: A function that handles image uploads. Accepts a `File` object and returns a Promise resolving to the uploaded image URL.
 *   - `videoUploader` {Object}: Configuration for video uploading.
 *     - `upload` {Function}: A function that handles video uploads. Accepts a `File` object and returns a Promise resolving to the uploaded video URL.
 *   - `table` {boolean}: Enables or disables the table module. Default is false.
 *   - `better-table` {Object}: Configuration for the better table module.
 *     - `operationMenu` {Object}: Customizes the operation menu for table actions.
 *       - `items` {Object}: Defines custom menu items.
 *         - `unmergeCells` {Object}: Customizes the "unmerge cells" menu item.
 *           - `text` {string}: The display text for the "unmerge cells" action.
 *   - `keyboard` {Object}: Configuration for keyboard bindings.
 *     - `bindings` {Object}: Custom keyboard bindings (see `RICH_EDITOR_KEYBOARD_BINDINGS`):
 *       strike (Alt+Shift+5), subscript (Ctrl+,), superscript (Ctrl+.),
 *       clear formatting (Ctrl+\), align left/center/right/justify (Ctrl+Shift+L/E/R/J),
 *       ordered list (Ctrl+Shift+7), and bullet list (Ctrl+Shift+8).
 *       Note: `shortKey` maps to `Cmd` on Mac and `Ctrl` on Windows/Linux.
 *   - `emoji-toolbar` {boolean}: Enables the emoji toolbar module. Default is true.
 *   - `emoji-textarea` {boolean}: Enables the emoji textarea module. Default is true.
 * - `readOnly` {boolean}: Determines if the editor is in read-only mode. Value is derived from `props.readOnly`.
 * - `placeholder` {string}: Placeholder text for the editor. Value is derived from `props.placeholder`.
 */
const options = computed(() => {
	return {
		theme: 'snow',
		modules: {
			toolbar: {
				container: `#${toolbarId}`,
				handlers: {
					attachment: function () {
						this.quill.getModule('attachmentUploader').selectLocalFile()
					},
					'horizontal-rule': function () {
						const range = this.quill.getSelection()
						if (!range) return
						this.quill.insertText(range.index, '\n', 'user')
						this.quill.insertEmbed(range.index + 1, 'hr', true, 'user')
						this.quill.setSelection(range.index + 2, 'user')
					},
				},
			},
			magicUrl: true,
			imageUploader: {
				upload: (file: File) => {
					return new Promise(async (resolve, reject) => {
						try {
							const imageUrl = await props.imageUploadHandler(file)
							resolve(imageUrl)
						} catch (error) {
							reject(error)
						}
					})
				},
			},
			videoUploader: {
				upload: (file: File) => {
					return new Promise(async (resolve, reject) => {
						try {
							const videoUrl = await props.videoUploadHandler(file)
							resolve(videoUrl)
						} catch (error) {
							reject(error)
						}
					})
				},
			},
			attachmentUploader: {
				upload: (file: File) => {
					return new Promise(async (resolve, reject) => {
						try {
							const attachmentUrl = await props.attachmentUploadHandler(file)
							resolve(attachmentUrl)
						} catch (error) {
							reject(error)
						}
					})
				},
			},
			table: true,
			tableUI: true,
			keyboard: {
				bindings: RICH_EDITOR_KEYBOARD_BINDINGS,
			},
		},
		readOnly: props.disabled || props.readonly,
		placeholder: props.placeholder,
	}
})

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
	(e: 'upload', file: File): void
	(e: 'focus'): void
	(e: 'blur'): void
}>()

const modelValue = useVModel(props, 'modelValue', emits)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any
const quill = shallowRef<QuillInstance | null>(null)
const contentLength = ref(0)
const contentText = ref('')

const rules = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rules: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}

	if (props.maxlength) {
		rules.modelValue.maxlength = maxLength(props.maxlength)
	}

	return rules
})

const useValidation = computed(() => {
	return !isEmpty(rules.value.modelValue)
})

const editorState = computed<EditorState>(() => {
	if (props.disabled) return 'disabled'
	if (props.readonly) return 'readonly'
	return 'default'
})

/**
 * Map of toolbar item identifiers to their visibility state.
 *
 * - When `toolbarItems` is provided (non-empty), it is used as the whitelist.
 * - When `toolbarItems` is omitted/empty, all items are visible.
 */
const visibilityMap = computed<Record<RichEditorToolbarItem, boolean>>(() => {
	const map = {} as Record<RichEditorToolbarItem, boolean>
	const whitelist =
		props.toolbarItems && props.toolbarItems.length > 0
			? new Set(props.toolbarItems)
			: new Set<RichEditorToolbarItem>(RICH_EDITOR_TOOLBAR_ITEMS)
	for (const item of RICH_EDITOR_TOOLBAR_ITEMS) {
		map[item] = whitelist.has(item)
	}
	return map
})

function isVisible(item: RichEditorToolbarItem): boolean {
	return visibilityMap.value[item]
}

/**
 * Lifecycle hook that initializes the Quill rich text editor when the component is mounted.
 *
 * - Retrieves the container element for the editor using its ID.
 * - Initializes a new Quill instance with the provided options.
 * - Sets up a listener for the `text-change` event to update the following reactive properties:
 *   - `modelValue`: Stores the semantic HTML content of the editor.
 *   - `contentLength`: Tracks the length of the content in the editor.
 *   - `contentText`: Stores the plain text content of the editor with single line breaks removed.
 * - Converts the initial `modelValue` into a Quill Delta object and sets it as the editor's content silently.
 * - Updates the `contentLength` and `contentText` properties after initialization.
 * - Calls the `styleEmojiTabPanel` function to apply custom styles to the emoji tab panel.
 */
onMounted(async () => {
	if (typeof window === 'undefined' || typeof document === 'undefined') return

	// Dynamic import Quill and all browser-only modules
	const Quill = (await import('quill')).default
	await import('quill/dist/quill.core.css')
	await import('quill/dist/quill.snow.css')
	const MagicUrl = (await import('quill-magic-url')).default
	const { ToolbarEmoji, TextAreaEmoji } =
		await import('@windmillcode/quill-emoji')
	await import('@windmillcode/quill-emoji/quill-emoji.css')
	const QuillTableUI = (await import('quill-table-ui')).default
	await import('quill-table-ui/dist/index.css')
	const ImageUploader = (await import('./modules/uploader/ImageUploader'))
		.default
	const VideoUploader = (await import('./modules/uploader/VideoUploader'))
		.default
	const AttachmentUploader = (
		await import('./modules/uploader/AttachmentUploader')
	).default
	const VideoBlot = (await import('./modules/uploader/blots/video')).default
	const HorizontalRuleBlot = (await import('./modules/horizontal-rule.js'))
		.default

	Quill.register('modules/magicUrl', MagicUrl)
	Quill.register('modules/imageUploader', ImageUploader)
	Quill.register('modules/videoUploader', VideoUploader)
	Quill.register('modules/attachmentUploader', AttachmentUploader)
	Quill.register('formats/video', VideoBlot)
	Quill.register('formats/hr', HorizontalRuleBlot)
	Quill.register({ 'modules/tableUI': QuillTableUI }, true)
	Quill.register('modules/emoji-toolbar', ToolbarEmoji, true)
	Quill.register('modules/emoji-textarea', TextAreaEmoji, true)

	const container = document.getElementById(editorId)
	quill.value = new Quill(container, options.value)

	quill.value.on('text-change', () => {
		modelValue.value = quill.value
			.getSemanticHTML()
			.replace(/&nbsp;/g, ' ')
		contentLength.value = quill.value.getLength()
		contentText.value = removeSingleLineBreaks(quill.value.getText())
	})

	const delta = quill.value.clipboard.convert({ html: modelValue.value })
	quill.value.setContents(delta, 'silent')

	contentLength.value = quill.value.getLength()
	contentText.value = removeSingleLineBreaks(quill.value.getText())
	styleEmojiTabPanel()
})

onUnmounted(() => {
	if (quill.value) {
		quill.value.off('text-change')
		quill.value = null
	}
})

watch(
	() => contentLength.value,
	newLength => {
		if (props.maxlength && newLength > props.maxlength) {
			const excessLength = newLength - props.maxlength - 1
			quill.value.deleteText(props.maxlength, excessLength, 'user')
			contentLength.value = quill.value.getLength()
			contentText.value = removeSingleLineBreaks(quill.value.getText())
		}
	},
)

function removeSingleLineBreaks(text: string) {
	return text.replace(/(\r\n|\n|\r)/gm, '')
}

function styleEmojiTabPanel() {
	const observer = new MutationObserver(() => {
		const emojiTextArea = document.querySelector('#textarea-emoji')
		if (emojiTextArea) {
			emojiTextArea.setAttribute('class', 'my-7')
			const tabPanel = emojiTextArea.querySelector('#tab-panel')
			if (tabPanel) {
				;(tabPanel as HTMLElement).classList.add('!gap-2')
			}
		}
	})

	observer.observe(document.body, { childList: true, subtree: true })
}
</script>

<template>
	<BaseInput
		:model-value="contentText"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => quill.value?.focus()"
		class="rich-text-editor"
	>
		<template #default="{ validate }">
			<div
				class="ql-editor-container rounded"
				:class="richEditorContainerVariants({ state: editorState })"
			>
				<div
					:id="toolbarId"
					class="rounded-t rich-editor-toolbar flex flex-wrap gap-1"
					:class="richEditorToolbarVariants({ state: editorState })"
					:data-state="editorState"
				>
					<RichEditorUndo v-if="visibilityMap.undo" :quill="quill" />
					<RichEditorRedo v-if="visibilityMap.redo" :quill="quill" class="mr-3" />

					<RichEditorHeader
						v-if="visibilityMap.header"
						:quill="quill"
						:disabled="disabled"
						class="mr-3"
					/>

					<RichEditorAlignment
						v-if="visibilityMap.alignment"
						:quill="quill"
						:disabled="disabled"
					/>

					<RichEditorColor
						v-if="visibilityMap.color"
						:quill="quill"
						:disabled="disabled"
					/>

					<Tooltip v-if="visibilityMap.bold" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-bold si-rt-text-bold text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Bold (Ctrl+B)</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap.italic" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-italic si-rt-text-italic text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Italic (Ctrl+I)</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap.underline" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-underline si-rt-text-underline text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Underline (Ctrl+U)</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap.strike" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-strike si-rt-text-strikethrough text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Strikethrough (Alt+Shift+5)</TooltipContent>
					</Tooltip>

					<Tooltip v-if="visibilityMap.subscript" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-script text-title-md" value="sub"></button>
						</template>
						<TooltipContent variant="black">Subscript (Ctrl+,)</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap.superscript" trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="ql-script text-title-md"
								value="super"
							></button>
						</template>
						<TooltipContent variant="black">Superscript (Ctrl+.)</TooltipContent>
					</Tooltip>

					<Tooltip v-if="visibilityMap.clean" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-clean si-rt-text-clear-format text-title-sm mr-3"></button>
						</template>
						<TooltipContent variant="black">Clear Formatting (Ctrl+\)</TooltipContent>
					</Tooltip>

					<Tooltip v-if="visibilityMap['list-bullet']" trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="ql-list si-rt-list-bullet text-title-sm"
								value="bullet"
							></button>
						</template>
						<TooltipContent variant="black">Bullet List (Ctrl+Shift+8)</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap['list-ordered']" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-list si-rt-list-numbered text-title-sm mr-3" value="ordered"></button>
						</template>
						<TooltipContent variant="black">Ordered List (Ctrl+Shift+7)</TooltipContent>
					</Tooltip>

					<Tooltip v-if="visibilityMap.link" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-link si-rt-link text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Enter Link (Ctrl+K)</TooltipContent>
					</Tooltip>

					<Tooltip v-if="visibilityMap.image" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-image si-rt-image text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Insert Image</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap.video" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-video text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Insert Video</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap.attachment" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-attachment text-label-lg" value="attachment">
								<i class="si-attachment" />
							</button>
						</template>
						<TooltipContent variant="black">Insert Attachment</TooltipContent>
					</Tooltip>

					<RichEditorTable v-if="visibilityMap.table" :quill="quill" class="mr-3" />

					<Tooltip v-if="visibilityMap.blockquote" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-blockquote si-rt-quotes text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Blockquote</TooltipContent>
					</Tooltip>
					<Tooltip v-if="visibilityMap['code-block']" trigger="hover">
						<template #trigger>
							<button type="button" class="ql-code-block si-rt-code text-title-sm"></button>
						</template>
						<TooltipContent variant="black">Code Block</TooltipContent>
					</Tooltip>
					<Tooltip v-if="isVisible('horizontal-rule')" trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="ql-horizontal-rule si-rt-horizontal-rule text-title-sm"
							></button>
						</template>
						<TooltipContent variant="black">Horizontal Line</TooltipContent>
					</Tooltip>
					<div class="ql-formats !float-left"></div>
				</div>

				<div
					:id="editorId"
					:data-cy="dataCy"
					:data-testid="props.dataTestid ?? dataCy"
					class="rounded-b"
					:class="richEditorVariants({ state: editorState })"
					@input="validate"
				></div>

				<div
					v-if="props.maxlength && !props.readonly && !props.disabled"
					class="float-end text-sm text-neutral-700"
				>
					{{ contentLength - 1 }}/{{ props.maxlength }}
				</div>
			</div>
		</template>
		<template #errors="{ validation }">
			<RichEditorErrorMessage :validation="validation">
				<template #required>
					<slot name="required" />
				</template>
				<template #maxlength>
					<slot name="maxlength" />
				</template>
			</RichEditorErrorMessage>
		</template>
		<template #hint>
			<slot name="hint" />
		</template>
	</BaseInput>
</template>

<style>
.rich-editor-toolbar button,
.rich-editor-toolbar .ql-picker {
	@apply rounded-sm !h-7 !min-w-7;
}

.rich-editor-toolbar[data-state="default"] button:not(:disabled):hover,
.rich-editor-toolbar[data-state="default"] .ql-picker:hover {
	@apply bg-primary-50 !text-neutral-950;
}

.rich-editor-toolbar[data-state="default"] button.ql-active {
	@apply bg-primary-500 !text-neutral-50;
}

.rich-editor-toolbar[data-state="default"] button.ql-active > svg path {
	@apply !fill-neutral-50;
}

.rich-editor-toolbar:not([data-state="default"]) button .ql-picker,
.rich-editor-toolbar:not([data-state="default"]) button {
	@apply !bg-disabled;
}

.rich-editor-toolbar:not([data-state="default"]) .ql-picker:hover,
.rich-editor-toolbar:not([data-state="default"]) button:hover,
.rich-editor-toolbar:not([data-state="default"]) button:focus {
	@apply !cursor-not-allowed !text-neutral-950;
}

.rich-editor-toolbar[data-state="disabled"],
.rich-editor-toolbar[data-state="disabled"] * {
	cursor: not-allowed;
}

.ql-tooltip {
	@apply bg-neutral-950 z-50;
	/* left: 30% !important;
	transform: translateX(-50%); */
}

.ql-editor-container {
	@apply border border-transparent;
}

.rich-text-editor.input__has-error {
	@apply shadow-danger rounded-lg;
}

.ql-toolbar.ql-snow,.ql-container.ql-snow {
	@apply border-neutral-400;
}

.input__has-error .ql-toolbar {
	@apply !border-danger-500;
}

.input__has-error .ql-container {
	@apply !border-danger-500;
}

.ql-toolbar {
	@apply !rounded-t-lg;
}

.ql-snow.ql-toolbar button {
	@apply !w-fit !p-1 !flex items-center;
}

.ql-snow.ql-toolbar button:not(.ql-script):not(.ql-video):not(.ql-attachment):not(.ql-format) > svg {
	@apply !hidden;
}

.ql-snow.ql-toolbar button > svg {
	@apply !w-4 !h-4;
}

.ql-container,.ql-editor {
	@apply !rounded-b-lg text-body-md;
}

.ql-editor-container {
	@apply text-neutral-950 dark:text-neutral-500 !rounded-lg;
}

.ql-editor {
	@apply !min-h-28 !p-3;
}

.ql-editor.ql-blank::before {
	@apply text-neutral-600 dark:!text-neutral-500 !not-italic;
}

.ql-editor hr {
	@apply border-0 border-t border-neutral-950 my-4;
}

.ql-snow .ql-stroke {
	@apply !stroke-neutral-950 dark:!stroke-neutral-500;
}

.ql-snow .ql-fill {
	@apply !fill-neutral-950 dark:!fill-neutral-500;
}

.ql-snow .ql-picker-label {
	@apply !text-neutral-950 dark:!text-neutral-500;
}

.ql-blank::before {
	@apply text-neutral-950 dark:text-neutral-500;
}

/*
 * Header dropdown preview sizes.
 *
 * Quill's snow theme sets `font-size` per data-value to give a visual preview
 * of the heading size in the header picker. We override them to match the
 * global heading typography defined in lib/config/tailwind.css, so the
 * dropdown preview matches what the user will actually see in the editor.
 *
 * `!important` is needed because Quill's CSS is loaded dynamically in
 * onMounted (after this component's <style>), so without it the cascade
 * would let Quill's defaults win.
 *
 * Note: the picker container is 24px tall, so very large sizes (h1=40px) may
 * overflow vertically inside the dropdown — this is intentional for an
 * accurate preview.
 */
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
	@apply !text-heading-xl !font-bold;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
	@apply !text-heading-lg !font-bold;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
	@apply !text-heading-md !font-bold;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
	@apply !text-heading-sm !font-semibold;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
	@apply !text-title-lg !font-semibold;
}
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
	@apply !text-title-md !font-semibold;
}
</style>
