<script setup lang="ts">
import Tooltip from '../../tooltip/Tooltip.vue'
import TooltipContent from '../../tooltip/TooltipContent.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any

const props = defineProps<{
	quill: QuillInstance | null
}>()

function insertTable() {
	if (!props.quill) return
	if (!props.quill.hasFocus?.()) {
		props.quill.focus?.()
	}
	const tableModule = props.quill.getModule?.('table')
	tableModule?.insertTable?.(1, 3)
}
</script>

<template>
	<div>
		<Tooltip trigger="hover">
			<template #trigger>
				<button
					type="button"
					class="text-label-lg"
					@click="insertTable"
				>
					<i class="si-table" />
				</button>
			</template>
			<TooltipContent variant="black">Insert Table</TooltipContent>
		</Tooltip>
	</div>
</template>
