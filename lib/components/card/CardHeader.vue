<script setup lang="ts">
/**
 * CardHeader component is used to display the header section of a `Card`.
 * It provides a default layout and styling for the header, but supports custom styling through the `class` property.
 *
 * @component
 *
 * @example
 * <Card>
 *   <CardHeader class="bg-blue-500 p-4">
 *     <h2 class="text-white">Card Title</h2>
 *   </CardHeader>
 * </Card>
 *
 * @props {string} class - Additional custom CSS classes for styling the header.
 *
 * @slot default - Slot for the header content to be displayed.
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<div :class="cn('flex flex-col gap-y-1.5 p-4', props.class)">
		<slot />
	</div>
</template>
