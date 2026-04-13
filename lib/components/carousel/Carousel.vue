<script setup lang="ts">
/**
 * Carousel is the root context provider for the carousel system.
 * It initializes the embla carousel instance and provides shared state
 * to all child components via provide/inject.
 *
 * ## Architecture & Flexible Positioning
 * The carousel uses provide/inject so `CarouselPagination` (and its
 * primitives) can be placed **anywhere** in the Carousel component tree.
 * Position it above, below, beside, or overlaid on the slides using CSS:
 *
 * ```vue
 * <!-- Pagination below -->
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem v-for="item in items" :key="item.id">...</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPagination class="mt-4 flex justify-center" />
 * </Carousel>
 *
 * <!-- Pagination overlaid at bottom-center -->
 * <Carousel class="relative">
 *   <CarouselContent>
 *     <CarouselItem v-for="item in items" :key="item.id">...</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPagination class="absolute bottom-3 inset-x-0 flex justify-center z-10" />
 * </Carousel>
 *
 * <!-- Prev/Next on sides, dots below (individual primitives) -->
 * <Carousel class="relative px-10">
 *   <CarouselPaginationPrev class="absolute left-0 top-1/2 -translate-y-1/2" />
 *   <CarouselContent>
 *     <CarouselItem v-for="item in items" :key="item.id">...</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPaginationNext class="absolute right-0 top-1/2 -translate-y-1/2" />
 *   <CarouselPaginationDots class="flex justify-center mt-3" />
 * </Carousel>
 * ```
 *
 * @props orientation    - Scroll axis: 'horizontal' (default) or 'vertical'
 * @props itemsPerView   - Number of slides visible at once (default: 1)
 * @props loop           - Whether to loop infinitely (default: false)
 * @props gap            - Gap between slides in pixels (default: 16)
 * @props autoplay       - Auto-advance interval in ms. 0 = disabled (default: 0)
 * @props pauseOnHover   - Pause autoplay when pointer is over the carousel (default: true)
 * @props plugins        - Embla plugin array
 * @props opts           - Additional EmblaOptionsType overrides
 */
import {
	type HTMLAttributes,
	type Ref,
	provide,
	ref,
	computed,
	watch,
	onBeforeUnmount,
	toRef,
	onMounted,
} from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { cn } from '../../utils/tw-merge'
import { CAROUSEL_KEY, CAROUSEL_ORIENTATION } from './types'

interface Props {
	class?: HTMLAttributes['class']
	orientation?: typeof CAROUSEL_ORIENTATION[keyof typeof CAROUSEL_ORIENTATION]
	itemsPerView?: number
	loop?: boolean
	gap?: number
	autoplay?: number
	pauseOnHover?: boolean
	plugins?: EmblaPluginType[]
	opts?: Partial<EmblaOptionsType>
}

const props = withDefaults(defineProps<Props>(), {
	orientation: CAROUSEL_ORIENTATION.HORIZONTAL,
	itemsPerView: 1,
	loop: false,
	gap: 16,
	autoplay: 0,
	pauseOnHover: true,
})

const emblaOptions = computed<EmblaOptionsType>(() => ({
	axis: props.orientation === CAROUSEL_ORIENTATION.VERTICAL ? 'y' : 'x',
	loop: props.loop,
	align: 'start',
	...props.opts,
}))

const pluginList = computed(() => props.plugins ?? [])

const [emblaRef, emblaApi] = emblaCarouselVue(emblaOptions, pluginList)

const hasPrev = ref(false)
const hasNext = ref(false)
const currentSnap = ref(0)
const totalSnaps = ref(0)

function updateScrollState() {
	if (!emblaApi.value) return
	hasPrev.value = emblaApi.value.canScrollPrev()
	hasNext.value = emblaApi.value.canScrollNext()
	currentSnap.value = emblaApi.value.selectedScrollSnap()
	totalSnaps.value = emblaApi.value.scrollSnapList().length
}

watch(emblaApi, (api) => {
	if (!api) return
	updateScrollState()
	api.on('select', updateScrollState)
	api.on('reInit', updateScrollState)
})

// ── Autoplay ────────────────────────────────────────────────────────────────
let autoplayTimer: ReturnType<typeof setInterval> | null = null
const paused = ref(false)

function startAutoplay() {
	if (!props.autoplay || autoplayTimer) return
	autoplayTimer = setInterval(() => {
		if (paused.value || !emblaApi.value) return
		if (emblaApi.value.canScrollNext()) {
			emblaApi.value.scrollNext()
		} else {
			// reset to first when loop=false and reached the end
			emblaApi.value.scrollTo(0)
		}
	}, props.autoplay)
}

function stopAutoplay() {
	if (autoplayTimer) {
		clearInterval(autoplayTimer)
		autoplayTimer = null
	}
}

onMounted(() => startAutoplay())

onBeforeUnmount(() => {
	stopAutoplay()
	emblaApi.value?.destroy()
})

provide(CAROUSEL_KEY, {
	emblaRef: emblaRef as Ref<HTMLElement | null>,
	emblaApi,
	hasPrev,
	hasNext,
	currentSnap,
	totalSnaps,
	scrollPrev: () => emblaApi.value?.scrollPrev(),
	scrollNext: () => emblaApi.value?.scrollNext(),
	scrollTo: (index) => emblaApi.value?.scrollTo(index),
	itemsPerView: toRef(props, 'itemsPerView'),
	orientation: toRef(props, 'orientation'),
	gap: toRef(props, 'gap'),
	loop: toRef(props, 'loop'),
})
</script>

<template>
	<div
		:class="cn('relative', props.class)"
		role="region"
		aria-roledescription="carousel"
		@mouseenter="pauseOnHover && (paused = true)"
		@mouseleave="pauseOnHover && (paused = false)"
		@focusin="pauseOnHover && (paused = true)"
		@focusout="pauseOnHover && (paused = false)"
	>
		<slot />
	</div>
</template>
