<script setup lang="ts">
/**
 * CardFooter component is used to display the footer section of a `Card`.
 * It provides a default layout and styling for the footer, but supports custom styling through the `class` property.
 *
 * @component
 *
 * @example
 * <Card>
 *   <CardFooter class="bg-gray-200 p-4">
 *     <p>Footer content goes here.</p>
 *   </CardFooter>
 * </Card>
 *
 * @props {string} class - Additional custom CSS classes for styling the footer.
 *
 * @slot default - Slot for the footer content to be displayed.
 */

import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<div :class="cn('flex items-center p-6 pt-0', props.class)">
		<slot />
	</div>
</template>
