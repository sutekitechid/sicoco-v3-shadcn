<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { useLibraryI18n } from '../../i18n'
import { Button } from '../button'
import { Spinner } from '../spinner'
import {
	UploadDeleteButton,
	UploadDownloadButton,
	UploadFileItem,
	UploadViewButton,
} from '.'
import type { UploadFile, UploadFileMetadata } from './types'

interface Props {
	files: UploadFile[]
	multiple?: boolean
	canEdit?: boolean
	readonly?: boolean
	canDelete?: boolean
	canView?: boolean
	canDownload?: boolean
	failedFiles?: UploadFile[]
	retryingFiles?: UploadFile[]
	dataCy?: string
	dataTestid?: string
	fileMetadata?: Record<string, UploadFileMetadata>
	class?: HTMLAttributes['class']
	addLabel: string
	replaceLabel: string
}

const props = withDefaults(defineProps<Props>(), {
	canDelete: true,
	canView: true,
})
const { t } = useLibraryI18n()

const emits = defineEmits<{
	add: []
	replace: []
	delete: [index: number]
	download: [file: UploadFile]
	retryFile: [file: UploadFile]
	retryFailed: []
	skip: []
	view: [file: UploadFile]
}>()

const slots = defineSlots<{
	'file-detail'?: (props: {
		file: UploadFile
		metadata?: UploadFileMetadata
		index: number
	}) => unknown
}>()

function getFileMetadata(file: UploadFile) {
	if (typeof file !== 'string') return undefined
	return props.fileMetadata?.[file]
}

function getFileKey(file: UploadFile, index: number) {
	if (typeof file === 'string') return `${file}-${index}`
	return `${file.name}-${file.lastModified}-${index}`
}

function getFileName(file: UploadFile) {
	if (typeof file === 'string') return file
	return file.name
}

function getViewFileLabel(file: UploadFile) {
	return t('upload.viewFile', { name: getFileName(file) })
}

function getDownloadFileLabel(file: UploadFile) {
	return t('upload.downloadFile', { name: getFileName(file) })
}

function getDeleteFileLabel(file: UploadFile) {
	return t('upload.deleteFile', { name: getFileName(file) })
}

function isFailedFile(file: UploadFile) {
	return props.failedFiles?.includes(file) ?? false
}

function isRetryingFile(file: UploadFile) {
	return props.retryingFiles?.includes(file) ?? false
}

const failedFileCount = computed(() =>
	props.files.filter(file => isFailedFile(file)).length,
)
</script>

<template>
	<Primitive
		as="div"
		:class="cn('flex w-full flex-col overflow-hidden', props.class)"
	>
		<div
			v-if="failedFileCount"
			class="flex flex-col items-center gap-1 px-4 pt-5 text-center pb-4"
		>
			<i class="si-heroicon-solid-exclamation-triangle text-warning-default before:text-heading-lg" />
			<p class="text-label-lg font-medium text-main">
				{{ t('upload.partialFailureTitle') }}
			</p>
			<p class="text-label-md text-secondary">
				{{
					t('upload.partialFailureDescription', {
						failed: failedFileCount,
						total: files.length,
					})
				}}
			</p>
		</div>
		<div
			:class="
				cn('w-full max-h-80 overflow-y-auto', props.readonly ? 'p-0' : 'p-4')
			"
		>
			<div class="flex flex-col gap-2">
				<UploadFileItem
					v-for="(file, index) in files"
					:key="getFileKey(file, index)"
					:file="file"
					:metadata="getFileMetadata(file)"
					:failed="isFailedFile(file)"
				>
					<template
						v-if="slots['file-detail']"
						#details
					>
						<slot
							name="file-detail"
							:file="file"
							:metadata="getFileMetadata(file)"
							:index="index"
						/>
					</template>
					<template #actions>
						<Button
							v-if="isFailedFile(file)"
							type="button"
							size="sm"
							outlined
							:disabled="isRetryingFile(file)"
							class="border-main text-main"
							:aria-label="t('upload.retryFile', { name: getFileName(file) })"
							@click="emits('retryFile', file)"
						>
							<template #icon-left>
								<Spinner v-if="isRetryingFile(file)" size="sm" />
								<i v-else class="si-heroicon-solid-arrow-path" />
							</template>
						</Button>
						<UploadDownloadButton
							v-if="!isFailedFile(file) && canDownload"
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="getDownloadFileLabel(file)"
							@click="emits('download', file)"
						/>
						<UploadViewButton
							v-if="!isFailedFile(file) && canView"
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="getViewFileLabel(file)"
							@click="emits('view', file)"
						/>
						<UploadDeleteButton
							v-if="!isFailedFile(file) && canEdit && canDelete"
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="getDeleteFileLabel(file)"
							@click="emits('delete', index)"
						/>
					</template>
				</UploadFileItem>
			</div>
		</div>
		<div
			v-if="canEdit"
			class="sticky bottom-0 z-10 flex w-full flex-col gap-3 border-t border-main bg-white p-3 sm:flex-row"
		>
			<Button
				v-if="failedFileCount"
				type="button"
				class="flex-1"
				variant="secondary-primary"
				@click="emits('skip')"
			>
				{{ t('upload.skipAndFinish') }}
			</Button>
			<Button
				v-if="failedFileCount"
				type="button"
				class="flex-1"
				@click="emits('retryFailed')"
			>
				{{ t('upload.retryFailed') }}
			</Button>
			<Button
				v-if="!failedFileCount"
				type="button"
				class="flex-1"
				variant="secondary-primary"
				@click="emits('replace')"
			>
				{{ replaceLabel }}
			</Button>
			<Button
				v-if="!failedFileCount && multiple"
				type="button"
				class="flex-1"
				@click="emits('add')"
			>
				{{ addLabel }}
			</Button>
		</div>
	</Primitive>
</template>
