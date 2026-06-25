<script setup lang="ts">
/**
 * CarouselPaginationDots renders one indicator dot per scroll snap.
 * Clicking a dot scrolls the carousel to that snap position.
 *
 * ## Customizing individual dots
 * Use the `#dot` scoped slot to override the dot element:
 *
 * ```vue
 * <CarouselPaginationDots>
 *   <template #dot="{ index, isActive, scrollTo }">
 *     <button
 *       :class="['inline-block h-1 rounded-full transition-all',
 *                isActive ? 'w-6 bg-primary' : 'w-2 bg-neutral-700']"
 *       @click="scrollTo"
 *     />
 *   </template>
 * </CarouselPaginationDots>
 * ```
 */
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { useCarousel } from './types'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const carousel = useCarousel()

const { currentSnap, totalSnaps, scrollTo } = carousel

const dots = computed(() => Array.from({ length: totalSnaps.value }, (_, i) => i))
</script>

<template>
	<div
		role="tablist"
		aria-label="Carousel pagination"
		:class="cn('flex items-center gap-1.5', props.class)"
	>
		<slot
			v-for="index in dots"
			:key="index"
			name="dot"
			:index="index"
			:is-active="currentSnap === index"
			:scroll-to="() => scrollTo(index)"
		>
			<button
				role="tab"
				:aria-label="`Go to slide ${index + 1}`"
				:aria-selected="currentSnap === index"
				:class="
					cn(
						'h-2 rounded-full bg-neutral-700 transition-all duration-200',
						currentSnap === index
							? 'w-4 bg-primary'
							: 'w-2 hover:bg-neutral-900',
					)
				"
				type="button"
				@click="scrollTo(index)"
			/>
		</slot>
	</div>
</template>
