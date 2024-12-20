<script setup lang="ts">
/**
 * AccordionRoot is a wrapper component for creating accessible and customizable accordions.
 * It uses Radix Vue's `AccordionRoot` as the base.
 *
 * @example
 * ```vue
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionHeader>Item 1</AccordionHeader>
 *     <AccordionContent>Content for Item 1</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionHeader>Item 2</AccordionHeader>
 *     <AccordionContent>Content for Item 2</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
import {
	AccordionRoot,
	type AccordionRootEmits,
	type AccordionRootProps,
	useForwardPropsEmits,
} from 'radix-vue'

/**
 * Define props for the AccordionRoot component.
 * @props {"single" | "multiple"} [type='single'] - The type of accordion. Determines whether a single or multiple items can be open simultaneously.
 * @props {boolean} [collapsible=true] - Whether items can be collapsed when clicked again.
 */
const props = withDefaults(defineProps<AccordionRootProps>(), {
	type: 'single',
	collapsible: true,
})

/**
 * Emits events for the AccordionRoot component.
 * @emits {function} onChange(value: string | string[] | undefined) - Emitted when the open items change.
 */
const emits = defineEmits<AccordionRootEmits>()

/**
 * Forward props and emits to the underlying AccordionRoot component.
 */
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<AccordionRoot v-bind="forwarded">
		<slot />
	</AccordionRoot>
</template>
