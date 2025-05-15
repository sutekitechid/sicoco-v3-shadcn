<template>
	<div class="flex gap-4" :style="wrapperStyle">
		<UploadFileIcon :file="file" />
		<div class="text-sm text-left w-full">
			<div class="flex">
				<div class="min-w-0 basis-8/12">
					<p class="font-semibold overflow-hidden text-ellipsis truncate">
						{{ file.name }}
					</p>
				</div>
			</div>
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

const props = defineProps<{
	file: File
}>()

const wrapperStyle = computed(() => {
	return {
		maxWidth: 'calc(100% - 2.5rem)',
	}
})
</script>

<style scoped></style>
