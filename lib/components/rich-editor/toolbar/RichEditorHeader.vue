<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { Dropdown, DropdownItem } from '../../dropdown'
import Tooltip from '../../tooltip/Tooltip.vue'
import TooltipContent from '../../tooltip/TooltipContent.vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillInstance = any

const props = defineProps<{
	quill: QuillInstance | null
	disabled?: boolean
}>()

type HeaderLevel = '' | '1' | '2' | '3' | '4' | '5' | '6'
const currentHeader = ref<HeaderLevel>('')

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null)

const options: { value: HeaderLevel; label: string; class: string }[] = [
	{ value: '1', label: 'Header 1', class: 'text-heading-xl' },
	{ value: '2', label: 'Header 2', class: 'text-heading-lg' },
	{ value: '3', label: 'Header 3', class: 'text-heading-md' },
	{ value: '4', label: 'Header 4', class: 'text-heading-sm' },
	{ value: '5', label: 'Header 5', class: 'text-title-lg' },
	{ value: '6', label: 'Header 6', class: 'text-title-md' },
	{ value: '', label: 'Normal', class: 'text-label-md'  },
]

const labelMap: Record<HeaderLevel, string> = options.reduce(
	(acc, opt) => {
		acc[opt.value] = opt.label
		return acc
	},
	{} as Record<HeaderLevel, string>,
)

function handleSelect(value: HeaderLevel) {
	props.quill?.format?.('header', value || false, 'user')
	currentHeader.value = value
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
					currentHeader.value = ''
					return
				}
				const format = newQuill.getFormat?.(range) as
					| { header?: HeaderLevel | number }
					| undefined
				const header = format?.header
				currentHeader.value =
					header === undefined || header === null
						? ''
						: (String(header) as HeaderLevel)
			}
			newQuill.on?.('selection-change', selectionHandler)
		}
	},
	{ immediate: true },
)

onUnmounted(() => {
	if (props.quill && selectionHandler) {
		props.quill.off?.('selection-change', selectionHandler)
	}
})
</script>

<template>
	<Dropdown ref="dropdownRef" :disabled="disabled" :scrollable="false">
		<template #trigger>
			<Tooltip trigger="hover" class="ql-header-tooltip">
				<template #trigger>
					<div
						class="ql-header flex items-center gap-1"
					>
						<span>{{ labelMap[currentHeader] }}</span>
						<i class="si-heroicon-outline-chevron-down text-label-sm"></i>
					</div>
				</template>
				<TooltipContent variant="black">Header Style</TooltipContent>
			</Tooltip>
		</template>

		<DropdownItem
			v-for="opt in options"
			:key="opt.value || 'normal'"
			:value="opt.value"
			@select="handleSelect"
		>
			<span :class="opt.class">
				{{ opt.label }}
			</span>
		</DropdownItem>
	</Dropdown>
</template>
