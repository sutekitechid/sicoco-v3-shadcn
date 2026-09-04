<template>
	<div class="flex min-w-0 items-center gap-3" :style="wrapperStyle">
		<UploadFileIcon :file="file" :metadata="metadata" />
		<div class="min-w-0 text-left">
			<p class="truncate text-label-lg font-medium text-main">{{ fileName }}</p>
			<p v-if="fileSize" class="text-label-md text-secondary">
				{{ fileSize }}
			</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
/**
 * Component that displays the file details like file name and file size for the upload component
 *
 * @props file - The file object
 *
 * @example
 * <UploadFileDetail :file="file" />
 */
import { computed } from 'vue'
import { UploadFileIcon } from '.'
import { getFilenameFromUrl, getFilesizeLabel } from '../../utils/file'
import type { UploadFile, UploadFileMetadata } from './types'

const props = defineProps<{
	file: UploadFile
	metadata?: UploadFileMetadata
}>()

const fileName = computed(() => {
	if (typeof props.file !== 'string') return props.file.name
	return props.metadata?.name || getFilenameFromUrl(props.file)
})

const fileSize = computed(() => {
	if (typeof props.metadata?.size === 'number') return getFilesizeLabel(props.metadata.size)
	if (typeof props.file === 'string') return ''
	return getFilesizeLabel(props.file.size)
})

const wrapperStyle = computed(() => {
	return {
		maxWidth: '100%',
	}
})
</script>

<style scoped></style>
