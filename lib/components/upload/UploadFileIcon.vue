<script setup lang="ts">
/**
 * Component that displays the file icon based on the file type
 *
 * @props file - The file object
 *
 * @example
 * <UploadFileIcon :file="file" />
 */
import { computed } from 'vue'
import { getFilenameFromUrl, getFileTypeIcon } from '../../utils/file'
import type { UploadFile, UploadFileMetadata } from './types'

const props = defineProps<{
	file: UploadFile
	metadata?: UploadFileMetadata
}>()

const fileForIcon = computed<File>(() => {
	if (typeof props.file !== 'string') return props.file
	return {
		name: props.metadata?.name || getFilenameFromUrl(props.file),
		type: props.metadata?.type || '',
	} as File
})
</script>

<template>
	<img :src="getFileTypeIcon(fileForIcon)" alt="" />
</template>
