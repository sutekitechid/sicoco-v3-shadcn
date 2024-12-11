<script setup lang="ts">
/**
 * CardDescription component is a subcomponent used to display descriptive text within a `Card`.
 * It provides a default text style and supports custom styling through the `class` property.
 *
 * @component
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription class="italic">This is a description for the card.</CardDescription>
 *   </CardHeader>
 * </Card>
 *
 * @props {string} class - Additional custom CSS classes for styling the description text.
 *
 * @slot default - Slot for the descriptive text to be displayed.
 */

import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<p :class="cn('text-sm text-slate-500 dark:text-slate-400', props.class)">
		<slot />
	</p>
</template>
