<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { AccordionContent, type AccordionContentProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * AccordionContent is a wrapper component for the content inside an accordion item.
 * It supports animations and transitions for open/close states.
 *
 * @example
 * <AccordionContent class="custom-class">
 *   <p>This is the content of the accordion.</p>
 * </AccordionContent>
 *
 * @props {string} [class] - Additional custom CSS classes for styling the content.
 */
const props = defineProps<
	AccordionContentProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Computed properties to separate forwarded props from custom props.
 * This ensures that the `class` property is handled separately.
 * @returns {object} Delegated props excluding `class`.
 */
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
	return delegated
})
</script>

<template>
	<AccordionContent
		v-bind="delegatedProps"
		:class="
			cn(
				'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
				props.class
			)
		"
	>
		<div :class="cn('pb-4 pt-0', props.class)">
			<slot />
		</div>
	</AccordionContent>
</template>
