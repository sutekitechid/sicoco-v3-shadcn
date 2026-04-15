<script setup lang="ts">
/**
 * CarouselItem is an individual slide inside <CarouselContent>.
 * Its width (or height for vertical) is automatically calculated from the
 * `itemsPerView` and `gap` values provided by the parent <Carousel>.
 *
 * Use the `class` prop to add custom styles (e.g. `pl-4` for extra spacing).
 *
 * @example
 * <CarouselItem class="rounded-lg overflow-hidden">
 *   <img src="..." class="w-full h-48 object-cover" />
 * </CarouselItem>
 */
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { CAROUSEL_ORIENTATION, useCarousel } from './types'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const { itemsPerView, gap, orientation } = useCarousel()

const itemStyle = computed(() => {
	const sizePercent = `calc(${100 / itemsPerView.value}%)`
	if (orientation.value === CAROUSEL_ORIENTATION.HORIZONTAL) {
		return {
			flex: `0 0 ${sizePercent}`,
			minWidth: 0,
			paddingLeft: `${gap.value}px`,
		}
	}
	return {
		flex: `0 0 ${sizePercent}`,
		minHeight: 0,
		paddingTop: `${gap.value}px`,
	}
})
</script>

<template>
	<div
		role="group"
		aria-roledescription="slide"
		:style="itemStyle"
		:class="props.class"
	>
		<slot />
	</div>
</template>
