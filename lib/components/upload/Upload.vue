<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import { computed, ref } from 'vue'
import { cn } from '../../utils/tw-merge'
import { checkFileType, getFilesizeLabel, mimeTypeEnum } from '../../utils/file'
import { useLibraryI18n } from '../../i18n'
import BaseInput from '../base-input'
import { Spinner } from '../spinner'
import {
	checkMaxSize,
	uploadContainerVariants,
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
		fileTypes: () => [
			mimeTypeEnum.jpeg,
			mimeTypeEnum.png,
			mimeTypeEnum.pdf,
			mimeTypeEnum.mp4,
			mimeTypeEnum.zip,
		],
		maxSize: 50 * 1024 * 1024,
		description: undefined,
		failureTitle: undefined,
		failureDescription: undefined,
		loadingTitle: undefined,
		loadingDescription: undefined,
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
const { t } = useLibraryI18n()
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
const uploadLabel = computed(() => props.label ?? t('upload.dropzonePrefix'))
const chooseFileLabel = computed(() => t('upload.chooseFile'))
const descriptionLabel = computed(() => props.description ?? t('upload.description', {
	formats: formatFileTypes(props.fileTypes),
	size: formatFileSize(props.maxSize),
}))
const failureTitleLabel = computed(() => props.failureTitle ?? t('upload.failureTitle'))
const failureDescriptionLabel = computed(() => props.failureDescription ?? t('upload.failureDescription'))
const loadingTitleLabel = computed(() => props.loadingTitle ?? t('upload.loadingTitle'))
const loadingDescriptionLabel = computed(() => props.loadingDescription ?? t('upload.loadingDescription'))

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

function formatFileTypes(fileTypes: string[] | undefined) {
	if (!fileTypes?.length) return ''

	return fileTypes.map(fileType => {
		const entry = Object.entries(mimeTypeEnum).find(([, mimeType]) => mimeType === fileType)
		if (entry?.[0] === 'jpg' || entry?.[0] === 'jpeg') return 'JPEG'
		if (entry) return entry[0].toUpperCase()
		return fileType.replace(/^\./, '').split('/').pop()?.toUpperCase() ?? fileType
	}).join(', ')
}

function formatFileSize(size: number | undefined) {
	if (!size) return ''
	return getFilesizeLabel(size)
		.replace(/\.0(?=[A-Z])/, '')
		.replace(/(?<=\d)(?=[A-Z])/, ' ')
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
						<p class="text-label-lg font-medium text-primary-default">{{ loadingTitleLabel }}</p>
						<p class="text-label-md text-secondary">{{ loadingDescriptionLabel }}</p>
					</div>
				</div>

				<UploadFailure
					v-else-if="uploadFailed"
					:class="cn(uploadVariants({ state: 'failed' }), props.class)"
					:disabled="disabled"
					:title="failureTitleLabel"
					:description="failureDescriptionLabel"
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
					:class="cn(uploadContainerVariants({ invalid: dirty && invalid }), props.class)"
				>
					<div
						:class="uploadVariants({ state: isDragging ? 'dragging' : 'default', disabled: !canEdit })"
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
								{{ uploadLabel }} <span class="text-primary-default">{{ chooseFileLabel }}</span>
							</div>
							<slot v-else name="label" />
							<p class="text-label-md text-secondary">{{ descriptionLabel }}</p>
						</div>
					</div>
				</div>
			</template>

			<div
				v-if="slots.default"
				role="button"
				:tabindex="canEdit ? 0 : -1"
				:aria-disabled="!canEdit"
				:aria-label="label || chooseFileLabel"
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
