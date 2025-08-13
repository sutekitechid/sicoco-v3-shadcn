<template>
	<div class="flex gap-4" :style="wrapperStyle">
		<UploadFileIcon :file="file" />
		<div class="text-sm text-left w-full">
			<p class="font-semibold truncate">
				{{ file.name }}
			</p>
			<p class="text-neutral-60">
				{{ getFilesizeLabel(file.size) }}
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
import { getFilesizeLabel } from '../../utils/file'

defineProps<{
	file: File
}>()

const wrapperStyle = computed(() => {
	return {
		maxWidth: 'calc(100% - 7.5rem)',
	}
})
</script>

<style scoped></style>
