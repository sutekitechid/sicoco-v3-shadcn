<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { AccordionContent, type AccordionContentProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * Props for the AccordionContent component.
 * - `class`: Additional CSS classes that can be applied to the element.
 */
const props = defineProps<
	AccordionContentProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Defines props that are forwarded to the AccordionContent element.
 * Props having values from outside the component (e.g., `class`) will be separated.
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
