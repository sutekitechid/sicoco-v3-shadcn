<script setup lang="ts">
import { Button } from '../button'

interface Props {
	dataCy?: string
	dataTestid?: string
	ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
	dataCy: '',
	dataTestid: '',
	ariaLabel: 'Lihat berkas',
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
		class="border-main text-main"
		:data-cy="`${props.dataCy}-file-view-button`"
		:data-testid="`${props.dataTestid || props.dataCy}-file-view-button`"
		:aria-label="props.ariaLabel"
		@click="handleClick"
	>
		<template #icon-left>
			<i class="si-heroicon-solid-eye" />
		</template>
	</Button>
</template>
