<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

import BaseInput from '../base-input'
import isEmpty from 'lodash/isEmpty'
import RichEditorErrorMessage from './RichEditorErrorMessage.vue'
import { maxLength, requiredIf } from '@vuelidate/validators'

import MagicUrl from 'quill-magic-url'
import QuillBetterTable from 'quill-better-table'
import 'quill-better-table/dist/quill-better-table.css'
import ImageUploader from './modules/uploader/ImageUploader'
import VideoUploader from './modules/uploader/VideoUploader'
import VideoBlot from './modules/uploader/blots/video'
import { ToolbarEmoji, TextAreaEmoji } from '@windmillcode/quill-emoji'
import '@windmillcode/quill-emoji/quill-emoji.css'

Quill.register('modules/magicUrl', MagicUrl)
Quill.register('modules/imageUploader', ImageUploader)
Quill.register('modules/videoUploader', VideoUploader)
Quill.register('formats/video', VideoBlot)
Quill.register('modules/magicUrl', MagicUrl)
Quill.register({ 'modules/better-table': QuillBetterTable }, true)
Quill.register('modules/emoji-toolbar', ToolbarEmoji, true)
Quill.register('modules/emoji-textarea', TextAreaEmoji, true)

const props = withDefaults(
	defineProps<{
		id?: string
		modelValue?: string
		readOnly?: boolean
		placeholder?: string
		options?: Object
		customValidators?: Record<string, any>
		maxlength?: number
		required?: boolean
		imageUploadHandler?: (file: File) => string | Promise<string>
		videoUploadHandler?: (file: File) => string | Promise<string>
	}>(),
	{
		id: 'editor',
		readOnly: false,
		placeholder: '',
		maxlength: 1000,
		required: false,
	}
)

const options = computed(() => {
	return {
		theme: 'snow',
		// formats,
		modules: {
			toolbar: '#toolbar',
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
			table: false,
			'better-table': {
				operationMenu: {
					items: {
						unmergeCells: {
							text: 'Another unmerge cells name',
						},
					},
				},
			},
			keyboard: {
				bindings: QuillBetterTable.keyboardBindings,
			},
			'emoji-toolbar': true,
			'emoji-textarea': true,
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
	const rules: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}

	if (props.maxlength !== undefined) {
		rules.modelValue.maxlength = maxLength(props.maxlength)
	}

	return rules
})

const useValidation = computed(() => {
	return !isEmpty(rules.value.modelValue)
})

onMounted(() => {
	const container = document.getElementById('editor')
	quill = new Quill(container, options.value)

	quill.on('text-change', () => {
		modelValue.value = quill.getSemanticHTML()
		contentLength.value = quill.getLength()
		contentText.value = removeSingleLineBreaks(quill.getText())
	})

	const delta = quill.clipboard.convert({ html: modelValue.value })
	quill.setContents(delta, 'silent')

	contentLength.value = quill.getLength()
	contentText.value = removeSingleLineBreaks(quill.getText())
	styleEmojiTabPanel()
})

function removeSingleLineBreaks(text: string) {
	return text.replace(/(\r\n|\n|\r)/gm, '')
}

function insertTable() {
	const tableModule = quill?.getModule('better-table')
	if (tableModule) {
		tableModule.insertTable(3, 3)
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
			<div id="toolbar">
				<select class="ql-header">
					<option value="1">Header 1</option>
					<option value="2">Header 2</option>
					<option value="3">Header 3</option>
					<option value="4">Header 4</option>
					<option value="5">Header 5</option>
					<option value="6">Header 6</option>
					<option value="">Normal</option>
				</select>
				<button class="ql-bold"></button>
				<button class="ql-italic"></button>
				<button class="ql-underline"></button>
				<button class="ql-strike"></button>
				<button class="ql-blockquote"></button>
				<button class="ql-code-block"></button>
				<button class="ql-list" value="ordered"></button>
				<button class="ql-list" value="bullet"></button>
				<button class="ql-link"></button>
				<button class="ql-clean"></button>
				<button class="ql-align" value=""></button>
				<button class="ql-align" value="center"></button>
				<button class="ql-align" value="right"></button>
				<button class="ql-align" value="justify"></button>
				<button class="ql-script" value="sub"></button>
				<button class="ql-script" value="super"></button>
				<button class="ql-image"></button>
				<button class="ql-video"></button>
				<button class="!-my-[0.1rem]" @click="insertTable">
					<i class="si-table" />
				</button>
				<div class="ql-formats !float-left"></div>
			</div>

			<div :id="props.id" @input="validate"></div>

			<div v-if="props.maxlength && !props.readOnly" class="float-end text-sm">
				{{ contentLength - 1 }}/{{ props.maxlength }}
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
