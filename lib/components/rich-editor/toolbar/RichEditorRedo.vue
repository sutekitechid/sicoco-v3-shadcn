<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import Tooltip from '../../tooltip/Tooltip.vue'
import TooltipContent from '../../tooltip/TooltipContent.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any

const props = defineProps<{
	quill: QuillInstance | null
}>()

const canRedo = ref(false)
let handler: (() => void) | null = null

function readCanRedo() {
	const history = props.quill?.getModule?.('history') as
		| { stack: { redo: unknown[] } }
		| undefined
	if (history) {
		canRedo.value = history.stack.redo.length > 0
	}
}

function redo() {
	props.quill?.getModule?.('history')?.redo()
	readCanRedo()
}

watch(
	() => props.quill,
	(newQuill, oldQuill) => {
		if (oldQuill && handler) {
			oldQuill.off?.('text-change', handler)
		}
		if (newQuill) {
			handler = () => readCanRedo()
			newQuill.on?.('text-change', handler)
			readCanRedo()
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
					class="ql-redo text-title-sm"
					:class="{ 'opacity-50 cursor-not-allowed': !canRedo }"
					:disabled="!canRedo"
					@click="redo"
				>
					<i class="si-rt-redo" />
				</button>
			</template>
			<TooltipContent variant="black">Redo (Ctrl+Y)</TooltipContent>
		</Tooltip>
	</div>
</template>
