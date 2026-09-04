<script setup lang="ts">
/**
 * ImageCropperZoom - Zoom slider with minus/plus icons and rotate button.
 * Uses Slider component for UI with custom mouse/touch overlay for accurate zoom sync.
 *
 * @prop {number} modelValue - Normalized zoom level (0 = max size, 1 = min size).
 */
import { ref, onMounted, onUnmounted, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { imageCropperZoomVariants } from './index'
import { Slider } from '../slider'
import Button from '../button/Button.vue'

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

function onSliderUpdate(value: number | number[]) {
	const zoom = Array.isArray(value) ? value[0] : value
	emits('update:modelValue', zoom)
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
		<i class="si-heroicon-solid-magnifying-glass-minus text-title-sm shrink-0 text-neutral-500" />

		<div
			ref="lineRef"
			class="relative w-full"
			@mousedown="onStart"
			@touchstart="onStart"
		>
			<Slider
				:model-value="modelValue"
				:min="0"
				:max="1"
				:step="0.01"
				aria-label="Zoom level"
				@update:model-value="onSliderUpdate"
			/>
			<div class="absolute inset-0 cursor-pointer" tabindex="-1" />
		</div>

		<i class="si-heroicon-solid-magnifying-glass-plus text-title-sm shrink-0 text-neutral-500" />

		<Button
			variant="neutral"
			size="xs"
			@click="emits('rotate')"
		>
			<template #icon-left>
				<i class="si-heroicon-solid-arrow-path-rounded-square" />
			</template>
		</Button>
	</div>
</template>
