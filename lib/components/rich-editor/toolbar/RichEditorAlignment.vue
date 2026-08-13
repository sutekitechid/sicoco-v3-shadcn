<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { Dropdown } from '../../dropdown'
import Tooltip from '../../tooltip/Tooltip.vue'
import TooltipContent from '../../tooltip/TooltipContent.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any

const props = defineProps<{
	quill: QuillInstance | null
	disabled?: boolean
}>()

type Alignment = '' | 'center' | 'right' | 'justify'
const currentAlignment = ref<Alignment>('')

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null)

const iconMap: Record<Alignment, string> = {
	'': 'si-rt-text-align-left',
	center: 'si-rt-text-align-center',
	right: 'si-rt-text-align-right',
	justify: 'si-rt-text-align-justify',
}

const options: {
	value: Alignment
	label: string
	icon: string
	shortcut: string
}[] = [
	{ value: '', label: 'Align Left', icon: iconMap[''], shortcut: 'Ctrl+Shift+L' },
	{
		value: 'center',
		label: 'Align Center',
		icon: iconMap.center,
		shortcut: 'Ctrl+Shift+E',
	},
	{
		value: 'right',
		label: 'Align Right',
		icon: iconMap.right,
		shortcut: 'Ctrl+Shift+R',
	},
	{
		value: 'justify',
		label: 'Justify',
		icon: iconMap.justify,
		shortcut: 'Ctrl+Shift+J',
	},
]

function handleSelect(value: Alignment) {
	props.quill?.format?.('align', value || false, 'user')
	currentAlignment.value = value
	dropdownRef.value?.closeDropdown?.()
	props.quill?.focus?.()
}

let selectionHandler: ((range: unknown) => void) | null = null

watch(
	() => props.quill,
	(newQuill, oldQuill) => {
		if (oldQuill && selectionHandler) {
			oldQuill.off?.('selection-change', selectionHandler)
		}
		if (newQuill) {
			selectionHandler = (range: unknown) => {
				if (!range) {
					currentAlignment.value = ''
					return
				}
				const format = newQuill.getFormat?.(range) as
					| { align?: Alignment }
					| undefined
				currentAlignment.value = format?.align ?? ''
			}
			newQuill.on?.('selection-change', selectionHandler)
		}
	},
	{ immediate: true }
)

onUnmounted(() => {
	if (props.quill && selectionHandler) {
		props.quill.off?.('selection-change', selectionHandler)
	}
})
</script>

<template>
	<Dropdown ref="dropdownRef" v-model="currentAlignment" :disabled="disabled">
		<template #trigger>
			<Tooltip trigger="hover">
				<template #trigger>
					<div class="ql-align flex items-center">
						<i :class="[iconMap[currentAlignment]]" />
						<i class="si-heroicon-outline-chevron-down text-label-sm"></i>
					</div>
				</template>
				<TooltipContent variant="black">Text Alignment</TooltipContent>
			</Tooltip>
		</template>

		<div class="flex gap-1 p-1">
			<Tooltip
				v-for="opt in options"
				:key="opt.value || 'left'"
				trigger="hover"
			>
				<template #trigger>
					<button
						type="button"
						class="p-1.5 rounded-sm hover:bg-neutral-100"
						:class="{ 'bg-neutral-200': currentAlignment === opt.value }"
						@click="handleSelect(opt.value)"
					>
						<i :class="opt.icon" />
					</button>
				</template>
				<TooltipContent variant="black"
					>{{ opt.label }} ({{ opt.shortcut }})</TooltipContent
				>
			</Tooltip>
		</div>
	</Dropdown>
</template>
