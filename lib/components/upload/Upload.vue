<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import { computed, ref } from 'vue'
import { cn } from '../../utils/tw-merge'
import { checkFileType } from '../../utils/file'
import BaseInput from '../base-input'
import { Spinner } from '../spinner'
import {
	checkMaxSize,
	uploadInputVariants,
	uploadVariants,
	UploadErrorMessage,
	UploadFailure,
	UploadFileList,
	UploadIcon,
} from '.'
import type { UploadFile, UploadFileMetadata } from './types'

type UploadValue = UploadFile | UploadFile[] | null
type Validate = () => unknown

const props = withDefaults(
	defineProps<{
		modelValue?: UploadValue
		required?: boolean
		customValidators?: Record<string, unknown>
		disabled?: boolean
		dataCy?: string
		dataTestid?: string
		label?: string
		description?: string
		maxSize?: number
		class?: string
		fileTypes?: string[]
		readonly?: boolean
		multiple?: boolean
		uploadFailed?: boolean
		failureTitle?: string
		failureDescription?: string
		loading?: boolean
		loadingTitle?: string
		loadingDescription?: string
		fileMetadata?: Record<string, UploadFileMetadata>
	}>(),
	{
		modelValue: null,
		description: 'Format: JPEG, PNG, PDF, MP4, dan ZIP dengan maksimal 50 MB',
		failureTitle: 'Gagal mengunggah berkas',
		failureDescription: 'Ukuran berkas terlalu besar atau format tidak didukung',
		loadingTitle: 'Mengunggah...',
		loadingDescription: 'Mohon tunggu sebentar, sedang memproses berkas Anda.',
	}
)

const emits = defineEmits<{
	'update:modelValue': [value: UploadValue]
	back: []
	retry: []
	view: [file: UploadFile]
}>()

const computedValue = useVModel(props, 'modelValue', emits)
const slots = defineSlots<{
	default?: (props: { invalid: boolean; dirty: boolean }) => unknown
	label?: () => unknown
	required?: () => unknown
	maxSize?: () => unknown
	fileType?: () => unknown
	errors?: (props: { validation: unknown }) => unknown
	'file-detail'?: (props: { file: UploadFile; metadata?: UploadFileMetadata; index: number }) => unknown
}>()

const inputFile = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const dragDepth = ref(0)
const replaceFiles = ref(false)

const files = computed<UploadFile[]>(() => {
	if (!computedValue.value) return []
	return Array.isArray(computedValue.value)
		? computedValue.value
		: [computedValue.value]
})

const hasFiles = computed(() => files.value.length > 0)
const canEdit = computed(() => !(props.disabled || props.readonly || props.loading))
const uploadLabel = computed(() => props.label || 'Seret atau')

const rules = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}

	if (props.maxSize) {
		result.modelValue.maxSize = () =>
			files.value.every(file => typeof file === 'string' || checkMaxSize(file, props.maxSize as number))
	}

	if (props.fileTypes) {
		result.modelValue.fileType = () =>
			files.value.every(file => typeof file === 'string' || checkFileType(file, props.fileTypes))
	}

	return result
})

const useValidation = computed(() => !isEmpty(rules.value))

function openFilePicker(replace = false) {
	if (!canEdit.value) return
	replaceFiles.value = replace
	inputFile.value?.click()
}

function handleFileChange(event: Event, validate: Validate) {
	const input = event.target as HTMLInputElement
	setFiles(Array.from(input.files || []), validate, replaceFiles.value)
	replaceFiles.value = false
}

function handleDragEnter(event: DragEvent) {
	if (!hasFilePayload(event)) return
	event.preventDefault()
	if (!canEdit.value) return
	dragDepth.value += 1
	isDragging.value = true
}

function handleDragOver(event: DragEvent) {
	if (!hasFilePayload(event)) return
	event.preventDefault()
	if (!canEdit.value) return
	if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
}

function handleDragLeave(event: DragEvent) {
	if (!canEdit.value) return
	event.preventDefault()
	dragDepth.value -= 1
	if (dragDepth.value > 0) return
	dragDepth.value = 0
	isDragging.value = false
}

function handleDrop(event: DragEvent, validate: Validate) {
	if (!hasFilePayload(event)) return
	event.preventDefault()
	if (!canEdit.value) return
	dragDepth.value = 0
	isDragging.value = false
	setFiles(Array.from(event.dataTransfer?.files || []), validate, false)
}

function hasFilePayload(event: DragEvent) {
	return Array.from(event.dataTransfer?.types || []).includes('Files')
}

function setFiles(newFiles: File[], validate: Validate, replace: boolean) {
	if (!newFiles.length) return
	const selectedFiles = props.multiple
		? replace
			? newFiles
			: [...files.value, ...newFiles]
		: newFiles[0]
	computedValue.value = selectedFiles
	validate()
	if (inputFile.value) inputFile.value.value = ''
}

function deleteFile(index: number) {
	if (!canEdit.value) return
	if (!props.multiple) {
		computedValue.value = null
		return
	}

	computedValue.value = files.value.filter((_, fileIndex) => fileIndex !== index)
}

function handleDropzoneKeydown(event: KeyboardEvent) {
	if (event.key !== 'Enter' && event.key !== ' ') return
	event.preventDefault()
	openFilePicker()
}
</script>

<template>
	<BaseInput
		:model-value="computedValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => inputFile?.focus()"
		class="relative"
	>
		<template #default="{ validate, dirty, invalid }">
			<input
				ref="inputFile"
				:data-cy="dataCy"
				:data-testid="props.dataTestid ?? dataCy"
				:disabled="disabled || readonly || loading"
				:accept="fileTypes?.join(',') || ''"
				:multiple="multiple"
				type="file"
				:class="cn(uploadInputVariants({ disabled: !canEdit }))"
				@change="handleFileChange($event, validate)"
			/>

			<template v-if="!slots.default">
				<div
					v-if="loading"
					:class="cn(uploadVariants({ state: 'loading' }), props.class)"
				>
					<Spinner />
					<div class="flex flex-col items-center gap-1 text-center">
						<p class="text-label-lg font-medium text-primary-default">{{ loadingTitle }}</p>
						<p class="text-label-md text-secondary">{{ loadingDescription }}</p>
					</div>
				</div>

				<UploadFailure
					v-else-if="uploadFailed"
					:class="cn(uploadVariants({ state: 'failed' }), props.class)"
					:disabled="disabled"
					:title="failureTitle"
					:description="failureDescription"
					@back="emits('back')"
					@retry="emits('retry')"
				/>

				<UploadFileList
					v-else-if="hasFiles"
					:class="cn(uploadVariants({ state: 'selected', disabled: !canEdit, invalid: dirty && invalid }), props.class)"
					:files="files"
					:multiple="multiple"
					:can-edit="canEdit"
					:data-cy="dataCy"
					:data-testid="props.dataTestid ?? dataCy"
					:file-metadata="fileMetadata"
					@add="openFilePicker(false)"
					@replace="openFilePicker(true)"
					@delete="deleteFile"
					@view="emits('view', $event)"
				>
					<template v-if="slots['file-detail']" #file-detail="slotProps">
						<slot name="file-detail" v-bind="slotProps" />
					</template>
				</UploadFileList>

				<div
					v-else
					class="rounded-lg border border-main p-3"
				>
					<div
						:class="cn(uploadVariants({ state: isDragging ? 'dragging' : 'default', disabled: !canEdit, invalid: dirty && invalid }), props.class)"
						role="button"
						:tabindex="canEdit ? 0 : -1"
						@keydown="handleDropzoneKeydown"
						@dragenter="handleDragEnter"
						@dragover="handleDragOver"
						@dragleave="handleDragLeave"
						@drop="handleDrop($event, validate)"
						@click="openFilePicker()"
					>
						<UploadIcon :disabled="!canEdit" />
						<div class="flex flex-col items-center gap-1 text-center">
							<div v-if="!slots.label" class="text-label-lg font-medium text-main">
								{{ uploadLabel }} <span class="text-primary-default">pilih berkas</span>
							</div>
							<slot v-else name="label" />
							<p class="text-label-md text-secondary">{{ description }}</p>
						</div>
					</div>
				</div>
			</template>

			<div
				v-if="slots.default"
				role="button"
				:tabindex="canEdit ? 0 : -1"
				:aria-disabled="!canEdit"
				:aria-label="label || 'Pilih berkas'"
				@keydown="handleDropzoneKeydown"
				@click="openFilePicker()"
			>
				<slot :invalid="invalid" :dirty="dirty" />
			</div>
		</template>

		<template #errors="{ validation }">
			<UploadErrorMessage :validation="validation">
				<template #required><slot name="required" /></template>
				<template #maxSize><slot name="maxSize" /></template>
				<template #fileType><slot name="fileType" /></template>
				<template #errors><slot name="errors" :validation="validation" /></template>
			</UploadErrorMessage>
		</template>
	</BaseInput>
</template>
