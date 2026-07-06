<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import Tooltip from '../../tooltip/Tooltip.vue'
import TooltipContent from '../../tooltip/TooltipContent.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any

const props = defineProps<{
	quill: QuillInstance | null
}>()

const canUndo = ref(false)
let handler: (() => void) | null = null

function readCanUndo() {
	const history = props.quill?.getModule?.('history') as
		| { stack: { undo: unknown[] } }
		| undefined
	if (history) {
		canUndo.value = history.stack.undo.length > 0
	}
}

function undo() {
	props.quill?.getModule?.('history')?.undo()
	readCanUndo()
}

watch(
	() => props.quill,
	(newQuill, oldQuill) => {
		if (oldQuill && handler) {
			oldQuill.off?.('text-change', handler)
		}
		if (newQuill) {
			handler = () => readCanUndo()
			newQuill.on?.('text-change', handler)
			readCanUndo()
		}
	},
	{ immediate: true }
)

onUnmounted(() => {
	if (props.quill && handler) {
		props.quill.off?.('text-change', handler)
	}
})
</script>

<template>
	<div>
		<Tooltip trigger="hover">
			<template #trigger>
				<button
					type="button"
					class="ql-undo text-title-sm"
					:class="{ 'opacity-50 cursor-not-allowed': !canUndo }"
					:disabled="!canUndo"
					@click="undo"
				>
					<i class="si-rt-undo" />
				</button>
			</template>
			<TooltipContent variant="black">Undo (Ctrl+Z)</TooltipContent>
		</Tooltip>
	</div>
</template>
