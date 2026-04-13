<script setup lang="ts">
/**
 * CarouselContent is the embla viewport element.
 * It must be placed inside a <Carousel> and wraps all <CarouselItem> slides.
 * It binds the embla viewport ref injected from the parent Carousel context.
 *
 * The `class` prop can be used to constrain height for vertical carousels.
 */
import type { HTMLAttributes, ComponentPublicInstance } from 'vue'
import { cn } from '../../utils/tw-merge'
import { CAROUSEL_ORIENTATION, useCarousel } from './types'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const ctx = useCarousel()
const { orientation, gap } = ctx

/** Bind the DOM element to embla's viewport ref outside the template
 *  to avoid Vue's auto-unwrap of Ref<HTMLElement> in template scope. */
function bindViewport(el: Element | ComponentPublicInstance | null) {
	ctx.emblaRef.value = el as HTMLElement | null
}
</script>

<template>
	<div
		:ref="bindViewport"
		:class="cn('overflow-hidden', props.class)"
	>
		<div
			class="flex"
			:class="{ 'flex-col': orientation === CAROUSEL_ORIENTATION.VERTICAL }"
			:style="{
				marginLeft: orientation === CAROUSEL_ORIENTATION.HORIZONTAL ? `-${gap}px` : undefined,
				marginTop: orientation === CAROUSEL_ORIENTATION.VERTICAL ? `-${gap}px` : undefined,
			}"
		>
			<slot />
		</div>
	</div>
</template>
