<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
import BaseInput from '../base-input'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import RichEditorErrorMessage from './RichEditorErrorMessage.vue'
import { maxLength, requiredIf } from '@vuelidate/validators'
import Tooltip from '../tooltip/Tooltip.vue'
import TooltipContent from '../tooltip/TooltipContent.vue'

/**
 * Props for the RichTextEditor component.
 *
 * @prop {string} [id='editor'] - The unique identifier for the editor.
 * @prop {string} [modelValue] - The value of the editor's content.
 * @prop {boolean} [readOnly=false] - Whether the editor is in read-only mode.
 * @prop {string} [placeholder=''] - Placeholder text displayed when the editor is empty.
 * @prop {Object} [options] - Additional configuration options for the editor.
 * @prop {Record<string, any>} [customValidators] - Custom validation rules for the editor's content.
 * @prop {number} [maxlength=1000] - Maximum number of characters allowed in the editor.
 * @prop {boolean} [required=false] - Whether the editor's content is required.
 * @prop {(file: File) => string | Promise<string>} [imageUploadHandler] - Function to handle image uploads, returning a URL or a Promise resolving to a URL.
 * @prop {(file: File) => string | Promise<string>} [videoUploadHandler] - Function to handle video uploads, returning a URL or a Promise resolving to a URL.
 */
const props = withDefaults(
	defineProps<{
		id?: string
		modelValue?: string
		readOnly?: boolean
		placeholder?: string
		options?: object
		customValidators?: Record<string, unknown>
		maxlength?: number
		required?: boolean
		attachmentsToolbar?: boolean
		dataCy?: string
		imageUploadHandler?: (file: File) => string | Promise<string>
		videoUploadHandler?: (file: File) => string | Promise<string>
		attachmentUploadHandler?: (file: File) => string | Promise<string>
	}>(),
	{
		readOnly: false,
		placeholder: '',
		required: false,
		attachmentsToolbar: false,
		maxlength: null,
	},
)

const editorId = props.id || uniqueId('editor-')
const toolbarId = `toolbar-${editorId}`
let observer: MutationObserver | null = null

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
 *     - `bindings` {Object}: Custom keyboard bindings for the better table module.
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
		},
		readOnly: props.readOnly,
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

let quill = null
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

	Quill.register('modules/magicUrl', MagicUrl)
	Quill.register('modules/imageUploader', ImageUploader)
	Quill.register('modules/videoUploader', VideoUploader)
	Quill.register('modules/attachmentUploader', AttachmentUploader)
	Quill.register('formats/video', VideoBlot)
	Quill.register({ 'modules/tableUI': QuillTableUI }, true)
	Quill.register('modules/emoji-toolbar', ToolbarEmoji, true)
	Quill.register('modules/emoji-textarea', TextAreaEmoji, true)

	const container = document.getElementById(editorId)
	quill = new Quill(container, options.value)

	quill.on('text-change', () => {
		modelValue.value = quill.getSemanticHTML().replace(/&nbsp;/g, ' ')
		contentLength.value = quill.getLength()
		contentText.value = removeSingleLineBreaks(quill.getText())
	})

	const delta = quill.clipboard.convert({ html: modelValue.value })
	quill.setContents(delta, 'silent')

	contentLength.value = quill.getLength()
	contentText.value = removeSingleLineBreaks(quill.getText())
	styleEmojiTabPanel()

	// Adjust tooltip position if it goes out of bounds
	// Observe tooltip visibility changes and adjust position when .ql-hidden is removed
	const tooltip = container.querySelector(
		`#${editorId} .ql-tooltip`,
	) as HTMLElement

	if (tooltip) {
		observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'class'
				) {
					if (!tooltip.classList.contains('ql-hidden')) {
						adjustTooltipPosition(container, tooltip)
					}
				}
			}
		})
		observer.observe(tooltip, { attributes: true, attributeFilter: ['class'] })
	}
})

/** Adjust .ql-tooltip position if out of bounds
 */
function adjustTooltipPosition(container: HTMLElement, tooltip: HTMLElement) {
	const containerRect = container.getBoundingClientRect()
	const tooltipRect = tooltip.getBoundingClientRect()
	const scrollX = window.scrollX || window.pageXOffset
	const left = tooltipRect.left - containerRect.left

	if (left < 0) {
		// if the tooltip is too far left, set it to 0px
		tooltip.style.left = '0px'
		tooltip.style.right = ''
	} else if (tooltipRect.right > containerRect.right + scrollX) {
		// if the tooltip is too far right, set it to 10px from the right edge
		tooltip.style.right = '10px'
		tooltip.style.left = ''
	} else {
		// otherwise, set it to the calculated left position
		// handle case where tooltip is too far right before, so we need to reset right
		tooltip.style.left = `${left}px`
		tooltip.style.right = ''
	}
}

onUnmounted(() => {
	if (quill) {
		quill.off('text-change')
		quill = null
	}

	// destroy MutationObserver if it exists
	if (observer) {
		observer.disconnect()
		observer = null
	}
})

watch(
	() => contentLength.value,
	newLength => {
		if (props.maxlength && newLength > props.maxlength) {
			const excessLength = newLength - props.maxlength - 1
			quill.deleteText(props.maxlength, excessLength, 'user')
			contentLength.value = quill.getLength()
			contentText.value = removeSingleLineBreaks(quill.getText())
		}
	},
)

function removeSingleLineBreaks(text: string) {
	return text.replace(/(\r\n|\n|\r)/gm, '')
}

function insertTable() {
	const tableModule = quill?.getModule('table')
	if (tableModule) {
		tableModule.insertTable(1, 3)
	}
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
		:focus-function="() => quill.focus()"
	>
		<template #default="{ validate }">
			<div class="editor-container rounded">
				<div :id="toolbarId" class="rounded-t">
					<select class="ql-header mr-5 border-r border-neutral-700">
						<option value="1">Header 1</option>
						<option value="2">Header 2</option>
						<option value="3">Header 3</option>
						<option value="4">Header 4</option>
						<option value="5">Header 5</option>
						<option value="6">Header 6</option>
						<option value="">Normal</option>
					</select>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-bold"></button>
						</template>
						<TooltipContent variant="black">Bold</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-italic"></button>
						</template>
						<TooltipContent variant="black">Italic</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-underline"></button>
						</template>
						<TooltipContent variant="black">Underline</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-strike mr-5"></button>
						</template>
						<TooltipContent variant="black">Strikethrough</TooltipContent>
					</Tooltip>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-align" value=""></button>
						</template>
						<TooltipContent variant="black">Align Left</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-align" value="center"></button>
						</template>
						<TooltipContent variant="black">Align Center</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-align" value="right"></button>
						</template>
						<TooltipContent variant="black">Align Right</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="ql-align mr-5"
								value="justify"
							></button>
						</template>
						<TooltipContent variant="black">Justify</TooltipContent>
					</Tooltip>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-list" value="ordered"></button>
						</template>
						<TooltipContent variant="black">Ordered List</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="ql-list mr-5"
								value="bullet"
							></button>
						</template>
						<TooltipContent variant="black">Bullet List</TooltipContent>
					</Tooltip>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-script" value="sub"></button>
						</template>
						<TooltipContent variant="black">Subscript</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="ql-script mr-5"
								value="super"
							></button>
						</template>
						<TooltipContent variant="black">Superscript</TooltipContent>
					</Tooltip>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-clean mr-5"></button>
						</template>
						<TooltipContent variant="black">Clear Formatting</TooltipContent>
					</Tooltip>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-link"></button>
						</template>
						<TooltipContent variant="black">Enter Link</TooltipContent>
					</Tooltip>

					<div v-if="props.attachmentsToolbar">
						<Tooltip trigger="hover">
							<template #trigger>
								<button type="button" class="ql-image"></button>
							</template>
							<TooltipContent variant="black">Insert Image</TooltipContent>
						</Tooltip>
						<Tooltip trigger="hover">
							<template #trigger>
								<button type="button" class="ql-video"></button>
							</template>
							<TooltipContent variant="black">Insert Video</TooltipContent>
						</Tooltip>
						<Tooltip trigger="hover">
							<template #trigger>
								<button type="button" class="ql-attachment" value="attachment">
									<div class="-mt-0.5">
										<i class="si-attachment" />
									</div>
								</button>
							</template>
							<TooltipContent variant="black">Insert Attachment</TooltipContent>
						</Tooltip>
					</div>

					<Tooltip trigger="hover">
						<template #trigger>
							<button
								type="button"
								class="!-my-[0.1rem] mr-5"
								@click="insertTable"
							>
								<i class="si-table" />
							</button>
						</template>
						<TooltipContent variant="black">Insert Table</TooltipContent>
					</Tooltip>

					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-blockquote"></button>
						</template>
						<TooltipContent variant="black">Blockquote</TooltipContent>
					</Tooltip>
					<Tooltip trigger="hover">
						<template #trigger>
							<button type="button" class="ql-code-block"></button>
						</template>
						<TooltipContent variant="black">Code Block</TooltipContent>
					</Tooltip>
					<div class="ql-formats !float-left"></div>
				</div>

				<div
					:id="editorId"
					:data-cy="dataCy"
					class="rounded-b"
					@input="validate"
				></div>

				<div
					v-if="props.maxlength && !props.readOnly"
					class="float-end text-sm text-neutral-500"
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
	</BaseInput>
</template>

<style scoped>
.ql-tooltip {
	@apply bg-neutral-950 z-50;
	/* left: 30% !important;
	transform: translateX(-50%); */
}

.input__has-error .editor-container {
	@apply border border-danger-500/60 focus-visible:ring-danger-200/40 focus-visible:border-danger-500/60;
}
</style>
