<template>
	<div :class="cn(uploadIconVariants({ disabled }))">
		<div
			class="h-8 w-8 bg-grey-20 flex items-center justify-center rounded-full"
		>
			<i class="si-upload-cloud text-xl"></i>
		</div>
	</div>
</template>

<script setup lang="ts">
/**
 * Component that displays the upload icon for the upload component
 *
 * @props disabled - If the upload is disabled
 *
 * @example
 * <UploadIcon :disabled="disabled" />
 */
import { cn } from '../../utils/tw-merge'
import { uploadIconVariants } from '.'

const props = defineProps<{
	disabled?: boolean
}>()
</script>
