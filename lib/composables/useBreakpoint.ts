import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useEventListener } from '@vueuse/core'
import { Breakpoint } from '../utils/viewport'

/**
 * Reactive viewport breakpoint detection.
 *
 * Returns a `Ref<boolean>` for `isMobile` that updates automatically when the
 * window is resized. The value defaults to `false` during SSR so server-rendered
 * output always matches the desktop branch; the real measurement happens in
 * `onMounted` on the client.
 *
 * @example
 * const { isMobile } = useBreakpoint()
 * // -> render <Mobile /> when isMobile.value is true
 */
export function useBreakpoint() {
	const isMobile = ref(false)
	const isTablet = ref(false)
	const isDesktop = ref(false)

	function update() {
		if (typeof window === 'undefined') return
		const width = window.innerWidth
		isMobile.value = width < Breakpoint.MD
		isTablet.value = width >= Breakpoint.MD && width < Breakpoint.LG
		isDesktop.value = width >= Breakpoint.LG
	}

	onMounted(() => {
		update()
	})

	useEventListener('resize', update)

	onBeforeUnmount(() => {
		// useEventListener cleans up itself; this is a defensive placeholder
		// in case future enhancements need explicit teardown.
	})

	return {
		isMobile,
		isTablet,
		isDesktop,
	}
}
