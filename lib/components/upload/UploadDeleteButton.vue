<template>
	<button
		class="p-3 cursor-pointer hover:bg-neutral-10 rounded"
		:data-cy="`${dataCy}-file-delete-button`"
		@click="onClick"
	>
		<i class="si-trash-alt text-neutral-60"></i>
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

defineProps({
	dataCy: {
		type: String,
		default: '',
	},
})
</script>
