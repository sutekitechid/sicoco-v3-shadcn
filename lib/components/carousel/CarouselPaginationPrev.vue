<script setup lang="ts">
/**
 * CarouselPaginationPrev renders a "previous" navigation button.
 * It auto-reads `hasPrev` from the parent Carousel context, but you
 * can override `disabled` explicitly via prop.
 *
 * Can be used standalone alongside CarouselPaginationNext and
 * CarouselPaginationDots for fully custom layouts, or composed inside
 * CarouselPagination.
 */
import { inject, computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Button } from '../button'
import { CAROUSEL_KEY } from './types'

const props = defineProps<{
	class?: HTMLAttributes['class']
	disabled?: boolean
}>()

const carousel = inject(CAROUSEL_KEY)

const isDisabled = computed(
	() => props.disabled ?? !carousel?.hasPrev.value,
)

function handleClick() {
	carousel?.scrollPrev()
}
</script>

<template>
	<Button
		:class="cn('size-9 rounded-full p-0', props.class)"
		:disabled="isDisabled"
		outlined
		aria-label="Go to previous slide"
		@click="handleClick"
	>
		<slot>
			<i class="si-chevron-left text-base" />
		</slot>
	</Button>
</template>
