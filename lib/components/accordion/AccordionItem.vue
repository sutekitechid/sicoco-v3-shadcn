<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import {
	AccordionItem,
	type AccordionItemProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * Props for the AccordionItem component.
 * - `class`: Additional CSS classes that can be applied to the element.
 */
const props = defineProps<
	AccordionItemProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Computes and returns the props to be forwarded to the AccordionItem component.
 * This will exclude the `class` prop.
 */
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

/**
 * Forwarded props that include all other props to be passed down to the `AccordionItem` element.
 */
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<AccordionItem v-bind="forwardedProps" :class="cn('border-b', props.class)">
		<slot />
	</AccordionItem>
</template>
