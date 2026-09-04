<template>
	<div>
		<i class="si-heroicon-solid-arrow-up-tray before:text-heading-lg"></i>
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

defineProps<{
	disabled?: boolean
}>()
</script>
