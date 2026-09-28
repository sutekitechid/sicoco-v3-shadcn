<script setup lang="ts">
import { Button } from '../button'

/**
 * Handle the delete button for the upload component
 *
 * @emits click - Emits when the delete button is clicked
 *
 * @example
 * <UploadDeleteButton @click="onClickDeleteFile" />
 */
interface Props {
	dataCy?: string
	dataTestid?: string
	ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
	dataCy: '',
	dataTestid: '',
	ariaLabel: 'Hapus berkas',
})

const emits = defineEmits<{
	click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
	emits('click', event)
}
</script>

<template>
	<Button
		type="button"
		size="sm"
		outlined
		variant="danger"
		:data-cy="`${props.dataCy}-file-delete-button`"
		:data-testid="`${props.dataTestid || props.dataCy}-file-delete-button`"
		:aria-label="props.ariaLabel"
		@click="handleClick"
	>
		<template #icon-left>
			<i class="si-trash-alt" />
		</template>
	</Button>
</template>
