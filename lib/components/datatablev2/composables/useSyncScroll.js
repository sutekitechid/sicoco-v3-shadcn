import { watch } from 'vue'

/**
 * Composable for handling horizontal scroll synchronization between
 * header, body (virtual scroll), and footer components of DataTable
 */
export function useSyncScroll() {
	// State for preventing sync loops
	let isSyncingHeader = false
	let isSyncingBody = false
	let isSyncingFooter = false
	
	// State for tracking pointer position
	let isPointerOverHeader = false
	let isPointerOverBody = false
	let isPointerOverFooter = false

	/**
	 * Synchronize header scroll to body and footer
	 */
	function syncHeaderScroll(headerRef, virtualScrollRef, footerRef) {
		if (!isSyncingHeader && !isPointerOverBody && !isPointerOverFooter) {
			isSyncingBody = true
			isSyncingFooter = true
			requestAnimationFrame(() => {
				if (virtualScrollRef.value?.virtualWrapper) {
					virtualScrollRef.value.virtualWrapper.scrollLeft = headerRef.value.scrollLeft
				}
				if (footerRef.value) {
					footerRef.value.scrollLeft = headerRef.value.scrollLeft
				}
				isSyncingBody = false
				isSyncingFooter = false
			})
		}
	}

	/**
	 * Synchronize body (virtual scroll) scroll to header and footer
	 */
	function syncBodyScroll(headerRef, virtualScrollRef, footerRef) {
		if (!isSyncingBody && !isPointerOverHeader && !isPointerOverFooter) {
			isSyncingHeader = true
			isSyncingFooter = true
			requestAnimationFrame(() => {
				if (headerRef.value) {
					headerRef.value.scrollLeft = virtualScrollRef.value.virtualWrapper.scrollLeft
				}
				if (footerRef.value) {
					footerRef.value.scrollLeft = virtualScrollRef.value.virtualWrapper.scrollLeft
				}
				isSyncingHeader = false
				isSyncingFooter = false
			})
		}
	}

	/**
	 * Synchronize footer scroll to header and body
	 */
	function syncFooterScroll(headerRef, virtualScrollRef, footerRef) {
		if (!isSyncingFooter && !isPointerOverHeader && !isPointerOverBody) {
			isSyncingHeader = true
			isSyncingBody = true
			requestAnimationFrame(() => {
				if (headerRef.value) {
					headerRef.value.scrollLeft = footerRef.value.scrollLeft
				}
				if (virtualScrollRef.value?.virtualWrapper) {
					virtualScrollRef.value.virtualWrapper.scrollLeft = footerRef.value.scrollLeft
				}
				isSyncingHeader = false
				isSyncingBody = false
			})
		}
	}

	/**
	 * Set pointer over header state
	 */
	function pointerOverHeader() {
		isPointerOverBody = false
		isPointerOverFooter = false
		isPointerOverHeader = true
	}

	/**
	 * Set pointer over body state
	 */
	function pointerOverBody() {
		isPointerOverHeader = false
		isPointerOverFooter = false
		isPointerOverBody = true
	}

	/**
	 * Set pointer over footer state
	 */
	function pointerOverFooter() {
		isPointerOverHeader = false
		isPointerOverBody = false
		isPointerOverFooter = true
	}

	/**
	 * Setup scroll synchronization for virtual scroll element
	 * @param {Ref} virtualScrollRef - Reference to virtual scroll component
	 * @param {Ref} headerRef - Reference to header scroll container
	 * @param {Ref} footerRef - Reference to footer scroll container
	 */
	function setupVirtualScrollSync(virtualScrollRef, headerRef, footerRef) {
		watch(virtualScrollRef, () => {
			if (virtualScrollRef.value) {
				virtualScrollRef.value.virtualWrapper.addEventListener('scroll', () => {
					syncBodyScroll(headerRef, virtualScrollRef, footerRef)
				})
				virtualScrollRef.value.virtualWrapper.addEventListener('pointerover', pointerOverBody)
			}
		})
	}

	return {
		// Sync functions
		syncHeaderScroll,
		syncBodyScroll,
		syncFooterScroll,
		
		// Pointer tracking functions
		pointerOverHeader,
		pointerOverBody,
		pointerOverFooter,
		
		// Setup function
		setupVirtualScrollSync
	}
}
