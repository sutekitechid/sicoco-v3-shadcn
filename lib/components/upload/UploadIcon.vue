<template>
	<div :class="cn(uploadIconOuterContainerVariants({ disabled }))">
		<div
			class="h-8 w-8 bg-neutral-100 flex items-center justify-center rounded-full"
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
import { uploadIconOuterContainerVariants } from '.'

defineProps<{
	disabled?: boolean
}>()
</script>
