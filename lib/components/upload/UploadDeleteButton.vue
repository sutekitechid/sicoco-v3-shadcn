<template>
	<button
		class="p-3 cursor-pointer hover:bg-grey-10 rounded z-[999]"
		@click="onClick"
	>
		<i class="si-trash-alt text-grey-60"></i>
	</button>
</template>

<script setup lang="ts">
/**
 * Handle the delete button for the upload component
 *
 * @emits click - Emits when the delete button is clicked
 *
 * @example
 * <UploadDeleteButton @click="onClickDeleteFile" />
 */
const emits = defineEmits(['click'])
const onClick = () => {
	emits('click')
}
</script>
