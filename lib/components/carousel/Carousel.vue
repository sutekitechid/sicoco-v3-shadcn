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
 * @props modelValue     - Index of the active slide (v-model supported)
 * @props orientation    - Scroll axis: 'horizontal' (default) or 'vertical'
 * @props itemsPerView   - Number of slides visible at once (default: 1)
 * @props loop           - Whether to loop infinitely (default: false)
 * @props gap            - Gap between slides in pixels (default: 16)
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
	onMounted,
	toRef,
} from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '../../utils/tw-merge'
import { CAROUSEL_KEY, CAROUSEL_ORIENTATION } from './types'

interface Props {
	class?: HTMLAttributes['class']
	modelValue?: number
	orientation?: typeof CAROUSEL_ORIENTATION[keyof typeof CAROUSEL_ORIENTATION]
	itemsPerView?: number
	loop?: boolean
	gap?: number
	plugins?: EmblaPluginType[]
	autoplay?: number
	opts?: Partial<EmblaOptionsType>
	pauseOnHover?: boolean
}

const emit = defineEmits<{
	'update:modelValue': [index: number]
}>()

const props = withDefaults(defineProps<Props>(), {
	orientation: CAROUSEL_ORIENTATION.HORIZONTAL,
	itemsPerView: 1,
	loop: false,
	gap: 16,
	pauseOnHover: true,
})

const emblaOptions = computed<EmblaOptionsType>(() => ({
	axis: props.orientation === CAROUSEL_ORIENTATION.VERTICAL ? 'y' : 'x',
	loop: props.loop,
	align: 'start',
	...props.opts,
}))

const pluginList = computed(() => {
	if (props.autoplay) {
		return [Autoplay({ delay: props.autoplay, stopOnInteraction: false, stopOnFocusIn: false }), ...(props.plugins ?? [])]
	}
	return props.plugins ?? []
})

const [emblaRef, emblaApi] = emblaCarouselVue(emblaOptions, pluginList)

function pauseAutoplay() {
	if (!props.autoplay) return
	const autoplay = emblaApi.value?.plugins()?.autoplay
	if (!autoplay) return
	autoplay.stop()
}

function resumeAutoplay() {
	if (!props.autoplay) return
	const autoplay = emblaApi.value?.plugins()?.autoplay
	if (!autoplay) return
	autoplay.play()
}

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
	emit('update:modelValue', currentSnap.value)
}

watch(emblaApi, (api) => {
	if (!api) return
	updateScrollState()
	api.on('select', updateScrollState)
	api.on('reInit', updateScrollState)
})

// Sync external modelValue → scroll
watch(
	() => props.modelValue,
	(index) => {
		if (index == null || !emblaApi.value) return
		if (emblaApi.value.selectedScrollSnap() !== index) {
			emblaApi.value.scrollTo(index)
		}
	}
)

function handleVisibilityChange() {
	if (document.hidden) {
		pauseAutoplay()
	} else {
		resumeAutoplay()
	}
}

onMounted(() => {
	document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
	document.removeEventListener('visibilitychange', handleVisibilityChange)
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
	pauseAutoplay,
	resumeAutoplay,
	itemsPerView: computed(() => {
		const val = props.itemsPerView ?? 1
		if (import.meta.env.DEV && val <= 0) {
			console.warn(`[Carousel] itemsPerView must be greater than 0, got ${val}. Clamping to 0.1.`)
		}
		return Math.max(0.1, val)
	}),
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
		@mouseenter="pauseOnHover && pauseAutoplay()"
		@mouseleave="pauseOnHover && resumeAutoplay()"
		@focusin="pauseOnHover && pauseAutoplay()"
		@focusout="pauseOnHover && resumeAutoplay()"
	>
		<slot />
	</div>
</template>
