<script setup lang="ts">
/**
 * Card component is a container that provides a styled wrapper for content.
 * It supports custom styles through the `class` property and includes a default slot for custom content.
 *
 * @example
 * <Card class="w-[350px]">
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card Description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     This is the card content.
 *   </CardContent>
 *   <CardFooter class="flex justify-between px-6 pb-6">
 *     Card Footer
 *   </CardFooter>
 * </Card>
 *
 * @props {string} class - Additional custom CSS classes for styling the card.
 *
 * @slot default - Slot for the content to be rendered inside the card.
 */

import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<div
		:class="
			cn(
				'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
				props.class
			)
		"
	>
		<slot />
	</div>
</template>
