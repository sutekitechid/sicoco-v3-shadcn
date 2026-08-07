<script setup lang="ts">
/**
 * CarouselPagination adalah convenience wrapper yang menyatukan
 * CarouselPaginationPrev, slot tengah (bebas — bisa dots, angka, thumbnail, dll.),
 * dan CarouselPaginationNext ke dalam satu komponen.
 *
 * ## Slot API
 *
 * ### #default — layout penuh custom (semua state diekspos):
 * ```vue
 * <CarouselPagination
 *   v-slot="{ scrollPrev, scrollNext, scrollTo, hasPrev, hasNext, currentSnap, totalSnaps }"
 *   class="mt-4 flex items-center justify-between"
 * >
 *   <button :disabled="!hasPrev" @click="scrollPrev">←</button>
 *   <span>{{ currentSnap + 1 }} / {{ totalSnaps }}</span>
 *   <button :disabled="!hasNext" @click="scrollNext">→</button>
 * </CarouselPagination>
 * ```
 *
 * ### #prev / #next — override tombol navigasi saja:
 * ```vue
 * <CarouselPagination>
 *   <template #prev="{ scrollPrev, hasPrev }">
 *     <MyButton @click="scrollPrev" :disabled="!hasPrev">Prev</MyButton>
 *   </template>
 * </CarouselPagination>
 * ```
 *
 * ### #indicator — area tengah bebas (dots, angka, thumbnail, dll.):
 * ```vue
 * <!-- Dots standar -->
 * <CarouselPagination>
 *   <template #indicator="{ currentSnap, totalSnaps, scrollTo }">
 *     <button
 *       v-for="i in totalSnaps" :key="i"
 *       :class="['w-2 h-2 rounded-full', currentSnap === i - 1 ? 'bg-primary' : 'bg-neutral-700']"
 *       @click="scrollTo(i - 1)"
 *     />
 *   </template>
 * </CarouselPagination>
 *
 * <!-- Angka -->
 * <CarouselPagination>
 *   <template #indicator="{ currentSnap, totalSnaps }">
 *     <span>{{ currentSnap + 1 }} / {{ totalSnaps }}</span>
 *   </template>
 * </CarouselPagination>
 *
 * <!-- Thumbnail -->
 * <CarouselPagination>
 *   <template #indicator="{ currentSnap, scrollTo }">
 *     <img
 *       v-for="(item, i) in items" :key="i"
 *       :src="item.thumb"
 *       :class="['w-10 h-10 cursor-pointer rounded', currentSnap === i ? 'ring-2 ring-primary' : '']"
 *       @click="scrollTo(i)"
 *     />
 *   </template>
 * </CarouselPagination>
 * ```
 */
import { useSlots, computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { useCarousel } from './types'
import CarouselPaginationPrev from './CarouselPaginationPrev.vue'
import CarouselPaginationNext from './CarouselPaginationNext.vue'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const slots = useSlots()

const carousel = useCarousel()
const { hasPrev, hasNext, currentSnap, totalSnaps, scrollPrev, scrollNext, scrollTo } = carousel

/** If the user provides a default scoped slot, render it with all state exposed. */
const hasDefaultSlot = computed(() => !!slots.default)
</script>

<template>
	<div
		:class="cn('flex items-center gap-2', props.class)"
	>
		<!-- Full custom layout via default scoped slot -->
		<slot
			v-if="hasDefaultSlot"
			:scroll-prev="scrollPrev"
			:scroll-next="scrollNext"
			:scroll-to="scrollTo"
			:has-prev="hasPrev"
			:has-next="hasNext"
			:current-snap="currentSnap"
			:total-snaps="totalSnaps"
		/>

		<!-- Named-slot composition (default renderers used unless overridden) -->
		<template v-else>
			<slot
				name="prev"
				:scroll-prev="scrollPrev"
				:has-prev="hasPrev"
			>
				<CarouselPaginationPrev />
			</slot>

			<!--
				#indicator — area tengah bebas, tidak ada default.
				Isi sesuai kebutuhan design: dots, angka, thumbnail, dll.
			-->
			<slot
				name="indicator"
				:scroll-to="scrollTo"
				:current-snap="currentSnap"
				:total-snaps="totalSnaps"
			/>

			<slot
				name="next"
				:scroll-next="scrollNext"
				:has-next="hasNext"
			>
				<CarouselPaginationNext />
			</slot>
		</template>
	</div>
</template>
