<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import ImageUploader from 'quill-image-uploader'
Quill.register('modules/imageUploader', ImageUploader)

import MagicUrl from 'quill-magic-url'
Quill.register('modules/magicUrl', MagicUrl)

import QuillBetterTable from 'quill-better-table'
Quill.register({ 'modules/better-table': QuillBetterTable }, true)

import BaseInput from '../base-input'
import isEmpty from 'lodash/isEmpty'
import RichEditorErrorMessage from './RichEditorErrorMessage.vue'
import { maxLength } from '@vuelidate/validators'

const props = withDefaults(
	defineProps<{
		modelValue?: string
		toolbar?: 'full' | 'essential' | 'minimal' | String | Array<string> | Object
		readOnly?: boolean
		placeholder?: string
		options?: Object
		contentType?: 'delta' | 'text' | 'html'
		customValidators?: Record<string, any>
		maxlength?: number
		imageUploadHandler?: (file: File) => string | Promise<string>
	}>(),
	{
		readOnly: false,
		placeholder: '',
		contentType: 'html',
		maxlength: 1000,
	}
)

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
	(e: 'upload', file: File): void
	(e: 'focus'): void
	(e: 'blur'): void
}>()

const modelValue = useVModel(props, 'modelValue', emits)

const toolbar = computed(() => {
	return (
		props.toolbar || [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', { color: [] }],
			[
				{ align: [] },
				{ list: 'ordered' },
				{ list: 'bullet' },
				{ direction: 'rtl' },
			],
			['link', 'image'],
		]
	)
})

const modules = computed(() => {
	return [
		{
			name: 'imageUploader',
			module: ImageUploader,
			options: {
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
		},
		{
			name: 'magicUrl',
			module: MagicUrl,
		},
		// {
		// 	name: 'better-table',
		// 	module: QuillBetterTable,
		// 	options: {
		// 		operationMenu: {
		// 			items: {
		// 				insertColumnRight: { text: 'Insert column right' },
		// 				insertColumnLeft: { text: 'Insert column left' },
		// 				insertRowUp: { text: 'Insert row above' },
		// 				insertRowDown: { text: 'Insert row below' },
		// 				deleteColumn: { text: 'Delete column' },
		// 				deleteRow: { text: 'Delete row' },
		// 				deleteTable: { text: 'Delete table' },
		// 				unmergeCells: { text: 'Another unmerge cells name' },
		// 			},
		// 			keyboard: {
		// 				bindings: QuillBetterTable.keyboardBindings,
		// 			},
		// 		},
		// 	},
		// },
	]
})

const rules = computed(() => {
	const rules: Record<string, any> = {
		modelValue: {
			...props.customValidators,
		},
	}

	if (props.maxlength !== undefined) {
		rules.modelValue.maxlength = maxLength(props.maxlength)
	}

	return rules
})

/**
 * Menentukan apakah validasi harus diaktifkan.
 *
 * @returns {ComputedRef<boolean>} - True jika validasi diaktifkan, false jika dinonaktifkan.
 *
 */
const useValidation = computed(() => {
	return !isEmpty(rules.value.modelValue)
})

const richEditorRef = ref<InstanceType<typeof QuillEditor> | null>(null)
</script>

<template>
	<BaseInput
		:model-value="modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => richEditorRef.focus()"
	>
		<template #default="{ validate }">
			<QuillEditor
				v-model:content="modelValue"
				:toolbar="toolbar"
				:contentType="props.contentType"
				:readOnly="props.readOnly"
				:placeholder="props.placeholder"
				:modules="modules"
				:maxLength="props.maxlength"
				theme="snow"
				@blur="validate"
			/>
			<div v-if="props.maxlength" class="float-end text-sm">
				{{ modelValue.length }}/{{ props.maxlength }}
			</div>
		</template>
		<template #errors="{ validation }">
			<RichEditorErrorMessage :validation="validation">
				<template #maxlength>
					<slot name="maxlength" />
				</template>
			</RichEditorErrorMessage>
		</template>
	</BaseInput>
</template>
