<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import {
	AccordionHeader,
	AccordionTrigger,
	type AccordionTriggerProps,
} from 'reka-ui'
import { computed, useSlots, type HTMLAttributes } from 'vue'

/**
 * AccordionTrigger represents the clickable trigger for an accordion item.
 * It displays the title and can include an optional icon.
 *
 * @example
 * <AccordionTrigger>
 *   <template #default>
 * 		<Button>Trigger</Button>
 * 	</template>
 * </AccordionTrigger>
 *
 * @props {string} [class] - Additional CSS classes for custom styling.
 * @slots
 * - `default`: The primary content for the trigger, usually the component.
 * - `label`: The label content for the trigger, usually the label as a text.
 * - `icon`: Optional slot for providing a custom icon. Defaults to a downward chevron.

 */
const props = withDefaults(
	defineProps<
		AccordionTriggerProps & { class?: HTMLAttributes['class'] } & {}
	>(),
	{
		class: '',
	}
)
/**
 * Computes and returns the props to be forwarded to the AccordionTrigger component.
 * Excludes the `class` prop for separate management.
 * @returns {object} Delegated props excluding `class`.
 */
const delegatedProps = computed(() => {
	const { ...delegated } = props
	return delegated
})

/**
 * Vue slots.
 */
const slots = useSlots()
</script>

<template>
	<AccordionHeader class="flex">
		<AccordionTrigger
			v-bind="delegatedProps"
			:class="
				cn(
					'w-full [&[data-state=open]>div>i]:rotate-180 transition-all text-main text-body-lg font-medium px-4 py-3 disabled:cursor-not-allowed disabled:text-disabled',
					props.class
				)
			"
		>
			<slot v-if="slots.default" />
			<div
				v-else
				class="flex flex-1 items-center justify-between disabled:bg-disabled disabled:text-disabled"
			>
				<slot name="label" />
				<slot name="icon">
					<i
						class="h-4 w-4 shrink-0 transition-transform duration-200 si-chevron-down"
					/>
				</slot>
			</div>
		</AccordionTrigger>
	</AccordionHeader>
</template>
