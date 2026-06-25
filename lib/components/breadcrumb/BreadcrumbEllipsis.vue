<script lang="ts" setup>
/**
 * BreadcrumbEllipsis component is used to add an ellipsis after the first item if there are more than 3 items.
 * @slot default - Content to be displayed inside the ellipsis
 *
 * @props class - Additional classes
 *
 * @example
 * <BreadcrumbEllipsis />
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<span
		aria-hidden="true"
		:class="
			cn(
				'flex h-9 w-9 items-center justify-center text-neutral-500',
				props.class
			)
		"
	>
		<slot>
			<i class="si-more-horizontal"></i>
		</slot>
		<span class="sr-only">More</span>
	</span>
</template>
