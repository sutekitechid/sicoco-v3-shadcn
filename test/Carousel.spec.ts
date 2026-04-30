/**
 * Carousel.spec.ts
 *
 * Unit tests for the Carousel component system.
 *
 * ## Mock Strategy
 * `embla-carousel-vue` is mocked because embla requires real browser layout APIs
 * (getBoundingClientRect, offsetWidth, etc.) that happy-dom cannot fully satisfy.
 * We expose a controllable mock API ref so each test can drive snap state
 * deterministically by mutating `mockModule.api` and triggering embla's `select` event.
 *
 * ## Disabled-button testing
 * Button.vue guards clicks via its own `onClick` handler (when `disabled`, it
 * calls `event.stopPropagation()` and returns before emitting `click`). The
 * native `disabled` attribute is NOT forwarded to the <button> element because
 * `disabled` is consumed as a component prop. Disabled state is therefore tested
 * **behaviourally** — a trigger('click') on the rendered button must not invoke
 * the carousel scroll methods.
 */

import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent } from 'vue'

/**
 * ContextReader is a minimal helper component that mounts inside a <Carousel>
 * and exposes the injected context values as data-* attributes so tests can
 * assert state without depending on any particular child component's rendering.
 */
const ContextReader = defineComponent({
	setup() {
		const { hasPrev, hasNext, currentSnap, totalSnaps } = useCarousel()
		return { hasPrev, hasNext, currentSnap, totalSnaps }
	},
	template: `
		<div
			data-testid="context-reader"
			:data-has-prev="String(hasPrev)"
			:data-has-next="String(hasNext)"
			:data-current-snap="currentSnap"
			:data-total-snaps="totalSnaps"
		/>
	`,
})

// ── Mock embla-carousel-vue ──────────────────────────────────────────────────
// `vi.hoisted` ensures these variables are initialised before the vi.mock
// factory runs (vi.mock calls are hoisted above all imports).
const mockModule = vi.hoisted(() => ({
	emblaApiRef: null as any,
	eventHandlers: {} as Record<string, Array<() => void>>,
	api: null as any,
	autoplayPlugin: null as any,
}))

vi.mock('embla-carousel-vue', async () => {
	const { shallowRef, readonly } = await import('vue')
	// Store the reactive ref on mockModule so tests can set .value later.
	mockModule.emblaApiRef = shallowRef<any>(undefined)
	return {
		default: () => [shallowRef(null), readonly(mockModule.emblaApiRef)],
	}
})

// Mock embla-carousel-autoplay so the plugin is a no-op in jsdom, but we can
// still spy on stop() / play() via mockModule.autoplayPlugin.
vi.mock('embla-carousel-autoplay', () => {
	return {
		default: () => ({}), // factory returns a plain object (plugin shape)
	}
})

// ── Component & type imports (after mocks are declared) ──────────────────────
import Carousel from '../lib/components/carousel/Carousel.vue'
import CarouselContent from '../lib/components/carousel/CarouselContent.vue'
import CarouselItem from '../lib/components/carousel/CarouselItem.vue'
import CarouselPagination from '../lib/components/carousel/CarouselPagination.vue'
import CarouselPaginationPrev from '../lib/components/carousel/CarouselPaginationPrev.vue'
import CarouselPaginationNext from '../lib/components/carousel/CarouselPaginationNext.vue'
import CarouselPaginationDots from '../lib/components/carousel/CarouselPaginationDots.vue'
import { useCarousel } from '../lib/components/carousel/types'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Creates a fresh mock autoplay plugin. */
function makeAutoplayPlugin() {
	const plugin = {
		name: 'autoplay',
		stop: vi.fn(),
		play: vi.fn(),
	}
	mockModule.autoplayPlugin = plugin
	return plugin
}

/** Creates a fresh mock embla API. Field overrides let individual tests control state. */
function makeApi(overrides: Record<string, any> = {}) {
	const autoplay = makeAutoplayPlugin()
	return {
		canScrollPrev: vi.fn(() => false),
		canScrollNext: vi.fn(() => true),
		selectedScrollSnap: vi.fn(() => 0),
		scrollSnapList: vi.fn(() => [0, 0.333, 0.667]),
		scrollPrev: vi.fn(),
		scrollNext: vi.fn(),
		scrollTo: vi.fn(),
		on: vi.fn((event: string, handler: () => void) => {
			if (!mockModule.eventHandlers[event]) mockModule.eventHandlers[event] = []
			mockModule.eventHandlers[event].push(handler)
		}),
		destroy: vi.fn(),
		plugins: vi.fn(() => ({ autoplay })),
		...overrides,
	}
}

/** Fires all registered handlers for the given embla event name. */
function triggerEmblaEvent(event: string) {
	mockModule.eventHandlers[event]?.forEach(h => h())
}

/**
 * Mounts a Carousel with 3 slide items.
 * @param props   Props forwarded to <Carousel>
 * @param slotExtra  Additional slot markup appended after <CarouselContent> (e.g., pagination)
 */
function mountCarousel(props: Record<string, unknown> = {}, slotExtra = '') {
	return mount(Carousel, {
		props,
		slots: {
			default: `
				<CarouselContent>
					<CarouselItem>Slide 1</CarouselItem>
					<CarouselItem>Slide 2</CarouselItem>
					<CarouselItem>Slide 3</CarouselItem>
				</CarouselContent>
				${slotExtra}
			`,
		},
		global: {
			components: {
				CarouselContent,
				CarouselItem,
				CarouselPagination,
				CarouselPaginationPrev,
				CarouselPaginationNext,
				CarouselPaginationDots,
				ContextReader,
			},
		},
	})
}

/**
 * Simulates embla finishing its DOM initialization (normally happens inside the
 * embla-carousel-vue directive after the viewport element is mounted).
 * Setting emblaApiRef.value triggers the `watch(emblaApi, ...)` watcher in
 * Carousel.vue, which calls updateScrollState() and attaches event listeners.
 */
async function initEmbla(apiOverrides: Record<string, any> = {}) {
	mockModule.api = makeApi(apiOverrides)
	mockModule.emblaApiRef.value = mockModule.api
	await nextTick()
}

// ── Setup / Teardown ─────────────────────────────────────────────────────────

beforeEach(() => {
	mockModule.eventHandlers = {}
	mockModule.api = null
	mockModule.autoplayPlugin = null
	if (mockModule.emblaApiRef) {
		mockModule.emblaApiRef.value = undefined
	}
})

afterEach(() => {
	vi.restoreAllMocks()
})

// ── Tests ────────────────────────────────────────────────────────────────────

describe('Carousel', () => {

	// ── Rendering ─────────────────────────────────────────────────────────────

	describe('rendering', () => {
		test('renders root element with role="region" and aria-roledescription="carousel"', () => {
			const wrapper = mountCarousel()
			const root = wrapper.find('[role="region"]')
			expect(root.exists()).toBe(true)
			expect(root.attributes('aria-roledescription')).toBe('carousel')
		})

		test('renders slot content', () => {
			const wrapper = mountCarousel()
			expect(wrapper.text()).toContain('Slide 1')
			expect(wrapper.text()).toContain('Slide 2')
			expect(wrapper.text()).toContain('Slide 3')
		})

		test('forwards class prop to root element', () => {
			const wrapper = mountCarousel({ class: 'my-custom-carousel' })
			expect(wrapper.classes()).toContain('my-custom-carousel')
		})
	})

	// ── Snap state ────────────────────────────────────────────────────────────

	describe('snap state', () => {
		test('reflects hasPrev=false / hasNext=true when embla api becomes ready', async () => {
			const wrapper = mountCarousel({ loop: false }, '<ContextReader />')

			await initEmbla({
				canScrollPrev: vi.fn(() => false),
				canScrollNext: vi.fn(() => true),
				selectedScrollSnap: vi.fn(() => 0),
				scrollSnapList: vi.fn(() => [0, 0.5, 1]),
			})

			const reader = wrapper.find('[data-testid="context-reader"]')
			expect(reader.attributes('data-has-prev')).toBe('false')
			expect(reader.attributes('data-has-next')).toBe('true')
			expect(reader.attributes('data-current-snap')).toBe('0')
			expect(reader.attributes('data-total-snaps')).toBe('3')
		})

		test('updates hasPrev / hasNext / currentSnap when embla fires "select"', async () => {
			const wrapper = mountCarousel({ loop: false }, '<ContextReader />')

			const api = makeApi({
				canScrollPrev: vi.fn(() => false),
				canScrollNext: vi.fn(() => true),
				selectedScrollSnap: vi.fn(() => 0),
				scrollSnapList: vi.fn(() => [0, 0.5, 1]),
			})
			mockModule.api = api
			mockModule.emblaApiRef.value = api
			await nextTick()

			const reader = wrapper.find('[data-testid="context-reader"]')
			expect(reader.attributes('data-has-prev')).toBe('false')
			expect(reader.attributes('data-current-snap')).toBe('0')

			// Simulate advancing to snap 1.
			api.canScrollPrev.mockReturnValue(true)
			api.canScrollNext.mockReturnValue(true)
			api.selectedScrollSnap.mockReturnValue(1)
			triggerEmblaEvent('select')
			await nextTick()

			expect(reader.attributes('data-has-prev')).toBe('true')
			expect(reader.attributes('data-current-snap')).toBe('1')
		})
	})

	// ── Prev / Next disabled state (loop=false) ────────────────────────────
	// We test the hasPrev/hasNext reactive state rather than Button's click
	// interception, which is Button.vue's own concern.

	describe('prev / next disabled state (loop=false)', () => {
		test('hasPrev is false at the first snap', async () => {
			const wrapper = mountCarousel({ loop: false }, '<ContextReader />')
			await initEmbla({ canScrollPrev: vi.fn(() => false) })

			expect(wrapper.find('[data-testid="context-reader"]').attributes('data-has-prev')).toBe('false')
		})

		test('clicking next when not at last snap calls scrollNext', async () => {
			const wrapper = mountCarousel({ loop: false }, '<CarouselPaginationNext />')
			await initEmbla({ canScrollNext: vi.fn(() => true) })

			await wrapper.findComponent(CarouselPaginationNext).find('button').trigger('click')
			expect(mockModule.api.scrollNext).toHaveBeenCalledOnce()
		})

		test('hasNext is false at the last snap', async () => {
			const wrapper = mountCarousel({ loop: false }, '<ContextReader />')
			await initEmbla({ canScrollNext: vi.fn(() => false) })

			expect(wrapper.find('[data-testid="context-reader"]').attributes('data-has-next')).toBe('false')
		})

		test('hasPrev transitions false → true after advancing off the first snap', async () => {
			const wrapper = mountCarousel({ loop: false }, '<ContextReader />')

			const api = makeApi({ canScrollPrev: vi.fn(() => false) })
			mockModule.api = api
			mockModule.emblaApiRef.value = api
			await nextTick()

			const reader = wrapper.find('[data-testid="context-reader"]')
			expect(reader.attributes('data-has-prev')).toBe('false')

			// Navigate to snap 1 — hasPrev should flip to true.
			api.canScrollPrev.mockReturnValue(true)
			triggerEmblaEvent('select')
			await nextTick()

			expect(reader.attributes('data-has-prev')).toBe('true')
		})

		test('hasNext transitions true → false when reaching the last snap', async () => {
			const wrapper = mountCarousel({ loop: false }, '<ContextReader />')

			const api = makeApi({ canScrollNext: vi.fn(() => true) })
			mockModule.api = api
			mockModule.emblaApiRef.value = api
			await nextTick()

			const reader = wrapper.find('[data-testid="context-reader"]')
			expect(reader.attributes('data-has-next')).toBe('true')

			// Navigate to last snap — hasNext should flip to false.
			api.canScrollNext.mockReturnValue(false)
			triggerEmblaEvent('select')
			await nextTick()

			expect(reader.attributes('data-has-next')).toBe('false')
		})
	})

	// ── Dot indicators ────────────────────────────────────────────────────────

	describe('CarouselPaginationDots', () => {
		test('renders one dot per scroll snap', async () => {
			const wrapper = mountCarousel({}, '<CarouselPaginationDots />')
			await initEmbla({ scrollSnapList: vi.fn(() => [0, 0.5, 1]) })

			const dots = wrapper.findComponent(CarouselPaginationDots).findAll('[role="tab"]')
			expect(dots).toHaveLength(3)
		})

		test('marks the current snap dot as aria-selected="true"', async () => {
			const wrapper = mountCarousel({}, '<CarouselPaginationDots />')
			await initEmbla({
				selectedScrollSnap: vi.fn(() => 1),
				scrollSnapList: vi.fn(() => [0, 0.5, 1]),
			})

			const dots = wrapper.findComponent(CarouselPaginationDots).findAll('[role="tab"]')
			expect(dots[1].attributes('aria-selected')).toBe('true')
			expect(dots[0].attributes('aria-selected')).toBe('false')
			expect(dots[2].attributes('aria-selected')).toBe('false')
		})

		test('updates active dot when embla fires "select"', async () => {
			const wrapper = mountCarousel({}, '<CarouselPaginationDots />')
			const api = makeApi({
				selectedScrollSnap: vi.fn(() => 0),
				scrollSnapList: vi.fn(() => [0, 0.5, 1]),
			})
			mockModule.api = api
			mockModule.emblaApiRef.value = api
			await nextTick()

			api.selectedScrollSnap.mockReturnValue(2)
			triggerEmblaEvent('select')
			await nextTick()

			const dots = wrapper.findComponent(CarouselPaginationDots).findAll('[role="tab"]')
			expect(dots[2].attributes('aria-selected')).toBe('true')
		})

		test('clicking a dot calls scrollTo with the correct snap index', async () => {
			const wrapper = mountCarousel({}, '<CarouselPaginationDots />')
			await initEmbla({ scrollSnapList: vi.fn(() => [0, 0.5, 1]) })

			const dots = wrapper.findComponent(CarouselPaginationDots).findAll('[role="tab"]')
			await dots[2].trigger('click')
			expect(mockModule.api.scrollTo).toHaveBeenCalledWith(2)
		})
	})

	// ── Autoplay ──────────────────────────────────────────────────────────────

	describe('autoplay', () => {
		test('includes Autoplay plugin when autoplay prop is set', async () => {
			// The pluginList computed includes Autoplay when autoplay > 0.
			// We verify this by checking that plugins() on the api is accessible
			// (i.e. the mock api is set up with a plugins() fn returning autoplay).
			mountCarousel({ autoplay: 200 })
			await initEmbla()
			expect(mockModule.api.plugins).toBeDefined()
			expect(mockModule.api.plugins().autoplay).toBeDefined()
		})

		test('does not call plugins() when autoplay=0 (disabled)', async () => {
			mountCarousel({ autoplay: 0 })
			await initEmbla()
			// pauseAutoplay / resumeAutoplay guard on props.autoplay — plugins() never called
			expect(mockModule.api.plugins).not.toHaveBeenCalled()
		})

		test('destroys embla on unmount', async () => {
			const wrapper = mountCarousel({ autoplay: 200 })
			await initEmbla()
			wrapper.unmount()
			expect(mockModule.api.destroy).toHaveBeenCalledOnce()
		})
	})

	// ── Pause on hover ────────────────────────────────────────────────────────

	describe('pause on hover (pauseOnHover=true)', () => {
		test('calls autoplay.stop() on mouseenter and autoplay.play() on mouseleave', async () => {
			const wrapper = mountCarousel({ autoplay: 200, pauseOnHover: true })
			await initEmbla()

			const root = wrapper.find('[role="region"]')

			await root.trigger('mouseenter')
			expect(mockModule.autoplayPlugin.stop).toHaveBeenCalledOnce()
			expect(mockModule.autoplayPlugin.play).not.toHaveBeenCalled()

			await root.trigger('mouseleave')
			expect(mockModule.autoplayPlugin.play).toHaveBeenCalledOnce()
		})

		test('does not call autoplay.stop() when pauseOnHover=false', async () => {
			const wrapper = mountCarousel({ autoplay: 200, pauseOnHover: false })
			await initEmbla()

			await wrapper.find('[role="region"]').trigger('mouseenter')
			expect(mockModule.autoplayPlugin.stop).not.toHaveBeenCalled()
		})
	})

	// ── Pause on focus ────────────────────────────────────────────────────────

	describe('pause on focus (pauseOnHover=true)', () => {
		test('calls autoplay.stop() on focusin and autoplay.play() on focusout', async () => {
			const wrapper = mountCarousel({ autoplay: 200, pauseOnHover: true })
			await initEmbla()

			const root = wrapper.find('[role="region"]')

			await root.trigger('focusin')
			expect(mockModule.autoplayPlugin.stop).toHaveBeenCalledOnce()
			expect(mockModule.autoplayPlugin.play).not.toHaveBeenCalled()

			await root.trigger('focusout')
			expect(mockModule.autoplayPlugin.play).toHaveBeenCalledOnce()
		})

		test('does not call autoplay.stop() on focus when pauseOnHover=false', async () => {
			const wrapper = mountCarousel({ autoplay: 200, pauseOnHover: false })
			await initEmbla()

			await wrapper.find('[role="region"]').trigger('focusin')
			expect(mockModule.autoplayPlugin.stop).not.toHaveBeenCalled()
		})
	})

	// ── useCarousel error boundary ────────────────────────────────────────────

	describe('useCarousel', () => {
		test('throws a descriptive error when called outside a <Carousel>', () => {
			const Orphan = defineComponent({
				setup() {
					useCarousel()
				},
				template: '<div />',
			})

			expect(() => mount(Orphan)).toThrow(
				'useCarousel() must be called inside a <Carousel> component.',
			)
		})
	})

	// ── CarouselPagination ────────────────────────────────────────────────────

	describe('CarouselPagination', () => {

		// ── Named-slot path: no slots provided ──────────────────────────────

		test('renders default CarouselPaginationPrev and CarouselPaginationNext when no slots are provided', async () => {
			const wrapper = mountCarousel({}, '<CarouselPagination />')
			await initEmbla()

			expect(wrapper.findComponent(CarouselPaginationPrev).exists()).toBe(true)
			expect(wrapper.findComponent(CarouselPaginationNext).exists()).toBe(true)
		})

		// ── Named-slot path: #indicator ──────────────────────────────────────

		test('renders #indicator slot content alongside default prev/next fallbacks', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination>
					<template #indicator>
						<span data-testid="indicator-content">dots</span>
					</template>
				</CarouselPagination>
			`)
			await initEmbla()

			expect(wrapper.find('[data-testid="indicator-content"]').exists()).toBe(true)
			expect(wrapper.findComponent(CarouselPaginationPrev).exists()).toBe(true)
			expect(wrapper.findComponent(CarouselPaginationNext).exists()).toBe(true)
		})

		test('#indicator slot receives currentSnap, totalSnaps, and a scrollTo function', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination>
					<template #indicator="{ currentSnap, totalSnaps, scrollTo }">
						<button
							data-testid="dot"
							:data-snap="currentSnap"
							:data-total="totalSnaps"
							@click="scrollTo(2)"
						/>
					</template>
				</CarouselPagination>
			`)
			await initEmbla({
				selectedScrollSnap: vi.fn(() => 1),
				scrollSnapList: vi.fn(() => [0, 0.5, 1]),
			})

			const dot = wrapper.find('[data-testid="dot"]')
			expect(dot.attributes('data-snap')).toBe('1')
			expect(dot.attributes('data-total')).toBe('3')

			await dot.trigger('click')
			expect(mockModule.api.scrollTo).toHaveBeenCalledWith(2)
		})

		// ── Named-slot path: #prev override ──────────────────────────────────

		test('custom #prev slot replaces the default CarouselPaginationPrev', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination>
					<template #prev>
						<button data-testid="custom-prev">Custom Prev</button>
					</template>
				</CarouselPagination>
			`)
			await initEmbla()

			expect(wrapper.find('[data-testid="custom-prev"]').exists()).toBe(true)
			expect(wrapper.findComponent(CarouselPaginationPrev).exists()).toBe(false)
			// #next fallback should still be present
			expect(wrapper.findComponent(CarouselPaginationNext).exists()).toBe(true)
		})

		test('#prev slot receives scrollPrev and hasPrev props', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination>
					<template #prev="{ scrollPrev, hasPrev }">
						<button
							data-testid="custom-prev"
							:data-has-prev="String(hasPrev)"
							@click="scrollPrev"
						/>
					</template>
				</CarouselPagination>
			`)
			await initEmbla({ canScrollPrev: vi.fn(() => true) })

			const btn = wrapper.find('[data-testid="custom-prev"]')
			expect(btn.attributes('data-has-prev')).toBe('true')

			await btn.trigger('click')
			expect(mockModule.api.scrollPrev).toHaveBeenCalledOnce()
		})

		// ── Named-slot path: #next override ──────────────────────────────────

		test('custom #next slot replaces the default CarouselPaginationNext', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination>
					<template #next>
						<button data-testid="custom-next">Custom Next</button>
					</template>
				</CarouselPagination>
			`)
			await initEmbla()

			expect(wrapper.find('[data-testid="custom-next"]').exists()).toBe(true)
			expect(wrapper.findComponent(CarouselPaginationNext).exists()).toBe(false)
			// #prev fallback should still be present
			expect(wrapper.findComponent(CarouselPaginationPrev).exists()).toBe(true)
		})

		test('#next slot receives scrollNext and hasNext props', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination>
					<template #next="{ scrollNext, hasNext }">
						<button
							data-testid="custom-next"
							:data-has-next="String(hasNext)"
							@click="scrollNext"
						/>
					</template>
				</CarouselPagination>
			`)
			await initEmbla({ canScrollNext: vi.fn(() => true) })

			const btn = wrapper.find('[data-testid="custom-next"]')
			expect(btn.attributes('data-has-next')).toBe('true')

			await btn.trigger('click')
			expect(mockModule.api.scrollNext).toHaveBeenCalledOnce()
		})

		// ── Default scoped slot path ──────────────────────────────────────────

		test('default scoped slot renders content and suppresses the named-slot layout', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination v-slot="{ hasPrev, hasNext, currentSnap, totalSnaps }">
					<span
						data-testid="custom-layout"
						:data-has-prev="String(hasPrev)"
						:data-has-next="String(hasNext)"
						:data-snap="currentSnap"
						:data-total="totalSnaps"
					/>
				</CarouselPagination>
			`)
			await initEmbla({
				canScrollPrev: vi.fn(() => false),
				canScrollNext: vi.fn(() => true),
				selectedScrollSnap: vi.fn(() => 0),
				scrollSnapList: vi.fn(() => [0, 0.5, 1]),
			})

			const span = wrapper.find('[data-testid="custom-layout"]')
			expect(span.exists()).toBe(true)
			expect(span.attributes('data-has-prev')).toBe('false')
			expect(span.attributes('data-has-next')).toBe('true')
			expect(span.attributes('data-snap')).toBe('0')
			expect(span.attributes('data-total')).toBe('3')

			// Named-slot fallback buttons must NOT be present
			expect(wrapper.findComponent(CarouselPaginationPrev).exists()).toBe(false)
			expect(wrapper.findComponent(CarouselPaginationNext).exists()).toBe(false)
		})

		test('default scoped slot exposes scrollPrev, scrollNext, and scrollTo as callable functions', async () => {
			const wrapper = mountCarousel({}, `
				<CarouselPagination v-slot="{ scrollPrev, scrollNext, scrollTo }">
					<button data-testid="btn-prev" @click="scrollPrev" />
					<button data-testid="btn-next" @click="scrollNext" />
					<button data-testid="btn-to"   @click="scrollTo(2)" />
				</CarouselPagination>
			`)
			await initEmbla()

			await wrapper.find('[data-testid="btn-prev"]').trigger('click')
			expect(mockModule.api.scrollPrev).toHaveBeenCalledOnce()

			await wrapper.find('[data-testid="btn-next"]').trigger('click')
			expect(mockModule.api.scrollNext).toHaveBeenCalledOnce()

			await wrapper.find('[data-testid="btn-to"]').trigger('click')
			expect(mockModule.api.scrollTo).toHaveBeenCalledWith(2)
		})
	})
})
