<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import {
	AccordionHeader,
	AccordionTrigger,
	type AccordionTriggerProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * AccordionTrigger represents the clickable trigger for an accordion item.
 * It displays the title and can include an optional icon.
 *
 * @example
 * <AccordionTrigger>
 *   <template #default>Item Title</template>
 *   <template #icon>
 *     <ChevronDown />
 *   </template>
 * </AccordionTrigger>
 *
 * @props {string} [class] - Additional CSS classes for custom styling.
 * @slots
 * - `default`: The primary content for the trigger, usually the title.
 * - `icon`: Optional slot for providing a custom icon. Defaults to a downward chevron.
 */
const props = defineProps<
	AccordionTriggerProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Computes and returns the props to be forwarded to the AccordionTrigger component.
 * Excludes the `class` prop for separate management.
 * @returns {object} Delegated props excluding `class`.
 */
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props
	return delegated
})
</script>

<template>
	<!-- Accordion Header -->
	<AccordionHeader class="flex">
		<!-- Accordion Trigger -->
		<AccordionTrigger
			v-bind="delegatedProps"
			:class="
				cn(
					'flex flex-1 items-center justify-between py-4 px-4 font-medium text-sm transition-all [&[data-state=open]>i]:rotate-180 border rounded-lg mb-2 data-[state=open]:bg-primary-10 data-[state=open]:border-primary-20',
					props.class
				)
			"
		>
			<!-- Slot for the main content -->
			<slot />
			<!-- Slot for the icon, with a default chevron icon -->
			<slot name="icon">
				<i
					class="h-4 w-4 shrink-0 transition-transform duration-200 si-chevron-down"
				/>
			</slot>
		</AccordionTrigger>
	</AccordionHeader>
</template>
