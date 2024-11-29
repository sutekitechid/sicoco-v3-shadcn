<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

/**
 * Props definition for the Skeleton component.
 */
interface SkeletonProps {
	/**
	 * Additional classes for customizing the appearance of the skeleton component.
	 * For example, you can define height, width, or margin with Tailwind CSS utilities.
	 *
	 * @example "h-8 w-32"
	 */
	class?: HTMLAttributes['class']
}

/** Define props for the Skeleton component. */
const props = defineProps<SkeletonProps>()
</script>

<template>
	<div :class="cn('animate-pulse rounded-md bg-slate-100 ', props.class)" />
</template>
