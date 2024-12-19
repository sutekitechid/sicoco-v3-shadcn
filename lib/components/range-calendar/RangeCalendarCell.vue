<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarCell,
	type RangeCalendarCellProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarCellProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarCell
		:class="
			cn(
				'relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-neutral-10 first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-outside-view])]:bg-neutral-100/50 [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md [&:has([data-selected][data-selection-start])]:text-neutral-10 [&:has([data-selected][data-selection-end])]:text-neutral-10',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</RangeCalendarCell>
</template>
