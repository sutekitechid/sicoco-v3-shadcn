import { onMounted, onUnmounted } from 'vue'

export interface UseRichEditorQuillTooltipOptions {
	editorId: string
}

/**
 * Watches a Quill editor's tooltip element and adjusts its horizontal position
 * so it stays within the editor container when shown.
 *
 * Must be called from a component's `<script setup>` (relies on Vue lifecycle
 * hooks). Idempotent within a single component instance.
 */
export function useRichEditorQuillTooltip(
	options: UseRichEditorQuillTooltipOptions,
) {
	let observer: MutationObserver | null = null

	function adjustTooltipPosition(
		container: HTMLElement,
		tooltip: HTMLElement,
	) {
		const containerRect = container.getBoundingClientRect()
		const tooltipRect = tooltip.getBoundingClientRect()
		const scrollX = window.scrollX || window.pageXOffset
		const left = tooltipRect.left - containerRect.left

		if (left < 0) {
			tooltip.style.left = '0px'
			tooltip.style.right = ''
		} else if (tooltipRect.right > containerRect.right + scrollX) {
			tooltip.style.right = '10px'
			tooltip.style.left = ''
		} else {
			tooltip.style.left = `${left}px`
			tooltip.style.right = ''
		}
	}

	onMounted(() => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return

		const container = document.getElementById(options.editorId)
		if (!container) return

		const tooltip = container.querySelector(
			'.ql-tooltip',
		) as HTMLElement | null
		if (!tooltip) return

		observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'class'
				) {
					if (!tooltip.classList.contains('ql-hidden')) {
						adjustTooltipPosition(container, tooltip)
					}
				}
			}
		})
		observer.observe(tooltip, {
			attributes: true,
			attributeFilter: ['class'],
		})
	})

	onUnmounted(() => {
		if (observer) {
			observer.disconnect()
			observer = null
		}
	})
}
