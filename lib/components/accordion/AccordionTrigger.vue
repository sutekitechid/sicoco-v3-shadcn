<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { ChevronDown } from 'lucide-vue-next'
import {
	AccordionHeader,
	AccordionTrigger,
	type AccordionTriggerProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * Props for the AccordionTrigger component.
 * - `class`: Additional CSS classes that can be applied to the element.
 */
const props = defineProps<
	AccordionTriggerProps & { class?: HTMLAttributes['class'] }
>()

/**
 * Computes and returns the props to be forwarded to the AccordionTrigger component.
 * This will exclude the `class` prop.
 */
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})
</script>

<template>
	<AccordionHeader class="flex">
		<AccordionTrigger
			v-bind="delegatedProps"
			:class="
				cn(
					'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
					props.class
				)
			"
		>
			<slot />
			<slot name="icon">
				<ChevronDown
					class="h-4 w-4 shrink-0 transition-transform duration-200"
				/>
			</slot>
		</AccordionTrigger>
	</AccordionHeader>
</template>
