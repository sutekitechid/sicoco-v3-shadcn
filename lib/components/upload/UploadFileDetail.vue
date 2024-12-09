<template>
	<div class="flex gap-4 w-full">
		<UploadFileIcon :file="file" />
		<div class="text-sm text-left w-full">
			<div class="flex">
				<div class="min-w-0 basis-8/12">
					<p class="font-semibold truncate">
						{{ file.name }}
					</p>
				</div>
			</div>
			<p class="text-grey-60">
				{{ getFilesizeLabel(file.size) }}
			</p>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { UploadFileIcon } from '.'
import { getFilesizeLabel } from '../../utils/file'

const props = defineProps<{
	file: File
}>()
</script>
