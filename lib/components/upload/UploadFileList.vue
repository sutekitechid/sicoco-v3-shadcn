<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { Button } from '../button'
import { UploadDeleteButton, UploadFileItem, UploadViewButton } from '.'
import type { UploadFile, UploadFileMetadata } from './types'

interface Props {
	files: UploadFile[]
	multiple?: boolean
	canEdit?: boolean
	dataCy?: string
	dataTestid?: string
	fileMetadata?: Record<string, UploadFileMetadata>
	class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const emits = defineEmits<{
	add: []
	replace: []
	delete: [index: number]
	view: [file: UploadFile]
}>()

const slots = defineSlots<{
	'file-detail'?: (props: { file: UploadFile; metadata?: UploadFileMetadata; index: number }) => unknown
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
</script>

<template>
	<Primitive as="div" :class="cn('flex w-full flex-col overflow-hidden', props.class)">
		<div class="w-full max-h-80 overflow-y-auto p-4">
			<div class="flex flex-col gap-2">
				<UploadFileItem v-for="(file, index) in files" :key="getFileKey(file, index)" :file="file" :metadata="getFileMetadata(file)">
					<template v-if="slots['file-detail']" #details>
						<slot name="file-detail" :file="file" :metadata="getFileMetadata(file)" :index="index" />
					</template>
					<template #actions>
						<UploadViewButton
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="`Lihat ${getFileName(file)}`"
							@click="emits('view', file)"
						/>
						<UploadDeleteButton
							v-if="canEdit"
							:data-cy="dataCy"
							:data-testid="dataTestid ?? dataCy"
							:aria-label="`Hapus ${getFileName(file)}`"
							@click="emits('delete', index)"
						/>
					</template>
				</UploadFileItem>
			</div>
		</div>
		<div v-if="canEdit" class="sticky bottom-0 z-10 flex w-full flex-col gap-2 border-t border-main bg-white p-4 sm:flex-row">
			<Button v-if="multiple" type="button" class="flex-1" @click="emits('add')">Tambah Berkas</Button>
			<Button type="button" class="flex-1" variant="secondary-primary" @click="emits('replace')">Unggah Ulang</Button>
		</div>
	</Primitive>
</template>
