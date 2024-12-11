<script setup lang="ts">
/**
 * CardTitle component is used to display the title within a `Card`.
 * It provides a default text style for the title but supports custom styling through the `class` property.
 *
 * @component
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle class="text-blue-700">Card Title</CardTitle>
 *   </CardHeader>
 * </Card>
 *
 * @props {string} class - Additional custom CSS classes for styling the title.
 *
 * @slot default - Slot for the title text to be displayed.
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<h3
		:class="
			cn('text-2xl font-semibold leading-none tracking-tight', props.class)
		"
	>
		<slot />
	</h3>
</template>
