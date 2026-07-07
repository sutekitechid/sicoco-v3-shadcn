<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import {
	AccordionItem,
	type AccordionItemProps,
	useForwardProps,
} from 'reka-ui'
import { computed, provide, type HTMLAttributes } from 'vue'

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
	const { ...delegated } = props
	return delegated
})

/**
 * Forwarded props that include all other props to be passed down to the `AccordionItem` element.
 */
const forwardedProps = useForwardProps(delegatedProps)

provide('accordionItem', forwardedProps)

/**
 * Toggles the accordion item when the user clicks anywhere on the item area.
 * Skips clicks on the trigger button itself (it already toggles on click) and on
 * any nested interactive elements (links, inputs, etc.) so they keep their own
 * behavior. Delegates to the trigger's native click so reka-ui's internal state
 * is updated through its own toggle pipeline.
 */
const handleItemClick = (event: MouseEvent) => {
	const target = event.target as HTMLElement | null
	if (target?.closest('button, a, input, textarea, select, label')) {
		return
	}

	const itemEl = event.currentTarget as HTMLElement | null
	const trigger = itemEl?.querySelector<HTMLButtonElement>('button')
	trigger?.click()
}
</script>

<template>
	<AccordionItem
		v-bind="forwardedProps"
		:class="
			cn(
				'border border-neutral-400 rounded-lg data-[state=closed]:hover:border-primary-500 data-[state=closed]:hover:bg-primary-50 data-[disabled]:bg-disabled data-[disabled]:hover:bg-disabled data-[disabled]:hover:border-neutral-400',
				props.class
			)
		"
		@click="handleItemClick"
	>
		<slot />
	</AccordionItem>
</template>
