import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'
import type { EmblaCarouselType } from 'embla-carousel'

export interface CarouselContext {
	emblaRef: Ref<HTMLElement | null>
	emblaApi: Readonly<Ref<EmblaCarouselType | undefined>>
	hasPrev: Ref<boolean>
	hasNext: Ref<boolean>
	currentSnap: Ref<number>
	totalSnaps: Ref<number>
	scrollPrev: () => void
	scrollNext: () => void
	scrollTo: (index: number) => void
	itemsPerView: Ref<number>
	orientation: Ref<'horizontal' | 'vertical'>
	gap: Ref<number>
	/** Whether the carousel loops infinitely. */
	loop: Ref<boolean>
}

export const CAROUSEL_KEY = Symbol('Carousel') as InjectionKey<CarouselContext>

export const CAROUSEL_ORIENTATION = {
	HORIZONTAL: 'horizontal',
	VERTICAL: 'vertical',
} as const

export function useCarousel() {
	const context = inject(CAROUSEL_KEY)
	if (!context) {
		throw new Error('useCarousel() must be called inside a <Carousel> component.')
	}
	return context
}
