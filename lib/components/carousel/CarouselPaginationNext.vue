<script setup lang="ts">
/**
 * CarouselPaginationNext renders a "next" navigation button.
 * It auto-reads `hasNext` from the parent Carousel context, but you
 * can override `disabled` explicitly via prop.
 *
 * Can be used standalone alongside CarouselPaginationPrev and
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
	() => props.disabled ?? !carousel?.hasNext.value,
)

function handleClick() {
	carousel?.scrollNext()
}
</script>

<template>
	<Button
		:class="cn('size-9 rounded-full p-0', props.class)"
		:disabled="isDisabled"
		outlined
		aria-label="Go to next slide"
		@click="handleClick"
	>
		<slot>
			<i class="si-chevron-right text-base" />
		</slot>
	</Button>
</template>
