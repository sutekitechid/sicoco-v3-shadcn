<script setup lang="ts">
/**
 * CardContent component is a subcomponent designed to structure the content area within a `Card`.
 * It provides default padding and supports custom styles via the `class` property.
 *
 * @example
 * <Card>
 *   <CardContent class="text-gray-700">
 *     This is the content area of the card.
 *   </CardContent>
 * </Card>
 *
 * @props {string} class - Additional custom CSS classes for styling the content area.
 *
 * @slot default - Slot for the content to be displayed inside the card content area.
 */

import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<div :class="cn('p-6 pt-0', props.class)">
		<slot />
	</div>
</template>
