import { useThrottleFn } from '@vueuse/core'

/**
 * Composable for handling horizontal scroll synchronization between
 * header, virtual scroll container, and footer components
 */
export function useDataTableScrollSync() {
	/**
	 * Sync horizontal scroll from header to virtual container
	 * @param {HTMLElement} tableVirtualWrapper - Virtual scroll wrapper element
	 * @param {number} scrollLeft - Scroll position
	 */
	function syncHorizontalScrollToVirtual(tableVirtualWrapper, scrollLeft) {
		if (tableVirtualWrapper) {
			tableVirtualWrapper.scrollToLeft(scrollLeft)
		}
	}

	/**
	 * Sync horizontal scroll from virtual container to header
	 * @param {Object} dataTableScrollWrapper - Header scroll wrapper ref
	 * @param {number} scrollLeft - Scroll position
	 */
	function syncHorizontalScrollToHeader(dataTableScrollWrapper, scrollLeft) {
		if (dataTableScrollWrapper && dataTableScrollWrapper.scrollContainer) {
			const headerScrollContainer = dataTableScrollWrapper.scrollContainer
			if (headerScrollContainer.scrollLeft !== scrollLeft) {
				headerScrollContainer.scrollLeft = scrollLeft
			}
		}
	}

	/**
	 * Sync horizontal scroll from header/virtual to footer
	 * @param {Object} footerScrollWrapper - Footer scroll wrapper ref
	 * @param {number} scrollLeft - Scroll position
	 */
	function syncHorizontalScrollToFooter(footerScrollWrapper, scrollLeft) {
		if (footerScrollWrapper && footerScrollWrapper.footerScrollWrapper && footerScrollWrapper.footerScrollWrapper.scrollContainer) {
			const footerScrollContainer = footerScrollWrapper.footerScrollWrapper.scrollContainer
			if (footerScrollContainer.scrollLeft !== scrollLeft) {
				footerScrollContainer.scrollLeft = scrollLeft
			}
		}
	}

	/**
	 * Sync horizontal scroll from footer to header and virtual container
	 * @param {Object} dataTableScrollWrapper - Header scroll wrapper ref
	 * @param {HTMLElement} tableVirtualWrapper - Virtual scroll wrapper element
	 * @param {number} scrollLeft - Scroll position
	 */
	function syncHorizontalScrollFromFooter(dataTableScrollWrapper, tableVirtualWrapper, scrollLeft) {
		// Sync to header
		if (dataTableScrollWrapper && dataTableScrollWrapper.scrollContainer) {
			const headerScrollContainer = dataTableScrollWrapper.scrollContainer
			if (headerScrollContainer.scrollLeft !== scrollLeft) {
				headerScrollContainer.scrollLeft = scrollLeft
			}
		}
	}

	/**
	 * Setup scroll synchronization between header, virtual container, and footer
	 * @param {Object} dataTableScrollWrapper - Header scroll wrapper ref
	 * @param {HTMLElement} tableVirtualWrapper - Virtual scroll wrapper element
	 * @param {Object} footerScrollWrapper - Footer scroll wrapper ref
	 * @param {Object} syncFunctions - Object containing sync function references
	 */
	function setupScrollSynchronization(dataTableScrollWrapper, tableVirtualWrapper, footerScrollWrapper, syncFunctions) {
		// Ensure both containers are available
		if (!dataTableScrollWrapper || !tableVirtualWrapper) {
			return
		}
		
		// Throttled sync functions untuk performance
		const throttledSyncToVirtual = useThrottleFn((scrollLeft) => {
			syncFunctions.syncHorizontalScrollToVirtual(scrollLeft)
		}, 0) // ~60fps
		
		const throttledSyncToHeader = useThrottleFn((scrollLeft) => {
			syncFunctions.syncHorizontalScrollToHeader(scrollLeft)
		}, 0) // ~60fps
		
		const throttledSyncFromFooter = useThrottleFn((scrollLeft) => {
			syncFunctions.syncHorizontalScrollFromFooter(scrollLeft)
		}, 0) // ~60fps
		
		// Add event listeners for scroll synchronization
		const headerScrollContainer = dataTableScrollWrapper.scrollContainer
		if (headerScrollContainer) {
			headerScrollContainer.addEventListener('scroll', (e) => {
				throttledSyncToVirtual(e.target.scrollLeft)
			}, { passive: true })
		}
		
		if (tableVirtualWrapper) {
			tableVirtualWrapper.addEventListener('scroll', (e) => {
				throttledSyncToHeader(e.target.scrollLeft)
			}, { passive: true })
		}
		
		// Add footer scroll synchronization
		if (footerScrollWrapper && footerScrollWrapper.footerScrollWrapper && footerScrollWrapper.footerScrollWrapper.scrollContainer) {
			const footerScrollContainer = footerScrollWrapper.footerScrollWrapper.scrollContainer
			footerScrollContainer.addEventListener('scroll', (e) => {
				throttledSyncFromFooter(e.target.scrollLeft)
			}, { passive: true })
		}
	}

	return {
		syncHorizontalScrollToVirtual,
		syncHorizontalScrollToHeader,
		syncHorizontalScrollToFooter,
		syncHorizontalScrollFromFooter,
		setupScrollSynchronization,
	}
}
