<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { useLibraryI18n } from '../../i18n'
import { Button } from '../button'
import { UploadDeleteButton, UploadFileItem, UploadViewButton } from '.'
import type { UploadFile, UploadFileMetadata, UploadItem } from './types'

interface Props {
	files?: UploadFile[]
	items?: UploadItem[]
	multiple?: boolean
	canEdit?: boolean
	dataCy?: string
	dataTestid?: string
	fileMetadata?: Record<string, UploadFileMetadata>
	class?: HTMLAttributes['class']
	addLabel: string
	replaceLabel: string
}

const props = defineProps<Props>()
const { t } = useLibraryI18n()

const emits = defineEmits<{
	add: []
	replace: []
	delete: [index: number]
	view: [file: UploadFile]
	retry: [index: number]
}>()

const slots = defineSlots<{
	'file-detail'?: (props: { file: UploadFile; metadata?: UploadFileMetadata; index: number }) => unknown
}>()

function getFileMetadata(file: UploadFile) {
	if (typeof file !== 'string') return undefined
	return props.fileMetadata?.[file]
}

const displayItems = computed<UploadItem[]>(() => {
	if (props.items) return props.items
	return (props.files || []).map((file, index) => ({
		id: getFileKey(file, index),
		file,
		status: 'success',
	}))
})

const failedItems = computed(() => displayItems.value.filter(item => item.status === 'failed'))

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

function getDeleteFileLabel(file: UploadFile) {
	return t('upload.deleteFile', { name: getFileName(file) })
}
</script>

<template>
	<Primitive as="div" :class="cn('flex w-full flex-col overflow-hidden', props.class)">
		<div v-if="failedItems.length" class="flex flex-col items-center gap-1 px-4 pt-4 text-center">
			<i class="si-heroicon-solid-exclamation-triangle before:text-heading-xl text-warning-default" />
			<p class="text-label-lg font-medium text-main">{{ t('upload.partialFailureTitle') }}</p>
			<p class="text-body-md text-secondary">
				{{ t('upload.partialFailureDescription', { failedCount: failedItems.length, totalCount: displayItems.length }) }}
			</p>
		</div>
		<div class="w-full max-h-80 overflow-y-auto p-4">
			<div class="flex flex-col gap-2">
				<UploadFileItem
					v-for="(item, index) in displayItems"
					:key="item.id"
					:file="item.file"
					:metadata="item.metadata ?? getFileMetadata(item.file)"
					:status="item.status"
					:error="item.error"
				>
					<template v-if="slots['file-detail']" #details>
						<slot name="file-detail" :file="item.file" :metadata="item.metadata ?? getFileMetadata(item.file)" :index="index" />
					</template>
					<template #actions>
						<UploadViewButton
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="getViewFileLabel(item.file)"
							@click="emits('view', item.file)"
						/>
						<UploadDeleteButton
							v-if="canEdit"
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="getDeleteFileLabel(item.file)"
							@click="emits('delete', index)"
						/>
					</template>
				</UploadFileItem>
			</div>
		</div>
		<div v-if="canEdit" class="sticky bottom-0 z-10 flex w-full flex-col gap-3 border-t border-main bg-white p-3 sm:flex-row">
			<Button type="button" class="flex-1" variant="secondary-primary" @click="emits('replace')">{{ replaceLabel }}</Button>
			<Button v-if="multiple" type="button" class="flex-1" @click="emits('add')">{{ addLabel }}</Button>
		</div>
	</Primitive>
</template>
