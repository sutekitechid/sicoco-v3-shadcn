<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import {
	AccordionItem,
	type AccordionItemProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * AccordionItem is a container for an accordion section, encapsulating
 * the trigger and content. It supports forwarding of props and custom styling.
 *
 * @example
 * <AccordionItem class="custom-class">
 *   <AccordionTrigger>Item 1</AccordionTrigger>
 *   <AccordionContent>This is the content for item 1.</AccordionContent>
 * </AccordionItem>
 *
 * @props {string} [class] - Additional custom CSS classes for styling the AccordionItem.
 */
const props = defineProps<
	AccordionItemProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Computes and returns the props to be forwarded to the AccordionItem component.
 * This excludes the `class` prop to allow for custom class handling.
 * @returns {object} Delegated props without `class`.
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
	<AccordionItem v-bind="forwardedProps" :class="cn('', props.class)">
		<slot />
	</AccordionItem>
</template>
