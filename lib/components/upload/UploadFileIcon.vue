<template>
	<img :src="getFileTypeIcon(file)" alt="" />
</template>

<script lang="ts" setup>
/**
 * Component that displays the file icon based on the file type
 *
 * @props file - The file object
 *
 * @example
 * <UploadFileIcon :file="file" />
 */
import { getFileTypeIcon } from '../../utils/file'

defineProps<{
	file: File
}>()
</script>
