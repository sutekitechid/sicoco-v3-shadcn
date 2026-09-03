<script setup lang="ts">
/**
 * ImageCropperZoom - Custom zoom slider with minus/plus icons and rotate button.
 * Uses direct mouse/touch position mapping for accurate zoom sync.
 *
 * @prop {number} modelValue - Normalized zoom level (0 = max size, 1 = min size).
 */
import { ref, onMounted, onUnmounted, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { imageCropperZoomVariants } from './index'

interface Props {
	modelValue?: number
	class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0,
})

const emits = defineEmits<{
	'update:modelValue': [value: number]
	rotate: []
}>()

const focus = ref(false)
const lineRef = ref<HTMLElement | null>(null)

function onDrag(e: MouseEvent | TouchEvent) {
	if (!focus.value || !lineRef.value) return

	const position = 'touches' in e ? e.touches[0].clientX : e.clientX
	const { left, width } = lineRef.value.getBoundingClientRect()
	const zoom = Math.min(1, Math.max(0, (position - left) / width))

	emits('update:modelValue', zoom)

	if (e.cancelable) {
		e.preventDefault()
	}
}

function onStop() {
	focus.value = false
}

function onStart(e: MouseEvent | TouchEvent) {
	focus.value = true
	onDrag(e)
}

onMounted(() => {
	window.addEventListener('mouseup', onStop, { passive: true })
	window.addEventListener('mousemove', onDrag, { passive: false })
	window.addEventListener('touchmove', onDrag, { passive: false })
	window.addEventListener('touchend', onStop, { passive: true })
})

onUnmounted(() => {
	window.removeEventListener('mouseup', onStop)
	window.removeEventListener('mousemove', onDrag)
	window.removeEventListener('touchmove', onDrag)
	window.removeEventListener('touchend', onStop)
})
</script>

<template>
	<div :class="cn(imageCropperZoomVariants(), props.class)">
		<svg
			class="h-4 w-4 shrink-0 text-neutral-500"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
			<line x1="8" y1="11" x2="14" y2="11" />
		</svg>

		<div
			ref="lineRef"
			class="relative flex h-5 w-full cursor-pointer items-center"
			@mousedown="onStart"
			@touchstart="onStart"
		>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
				<div
					class="h-full rounded-full bg-primary-default transition-none"
					:style="{ width: `${modelValue * 100}%` }"
				/>
			</div>
			<div
				class="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-default bg-white shadow-sm transition-[box-shadow] hover:ring-4 hover:ring-primary-subtle"
				:class="{ 'ring-4 ring-primary-subtle': focus }"
				:style="{ left: `${modelValue * 100}%` }"
			/>
		</div>

		<svg
			class="h-4 w-4 shrink-0 text-neutral-500"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
			<line x1="11" y1="8" x2="11" y2="14" />
			<line x1="8" y1="11" x2="14" y2="11" />
		</svg>

		<button
			type="button"
			class="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-main text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-main"
			@click="emits('rotate')"
		>
			<i class="si-heroicon-solid-arrow-path-rounded-square text-title-sm" />
		</button>
	</div>
</template>
