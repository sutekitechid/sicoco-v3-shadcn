<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarCell,
	type RangeCalendarCellProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarCellProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarCell
		:class="
			cn(
				'relative w-full text-center focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-primary-50 first:[&:has([data-selected])]:rounded-l last:[&:has([data-selected])]:rounded-r [&:has([data-selected][data-selection-end])]:rounded-r [&:has([data-selected][data-selection-start])]:rounded-l [&:has([data-selected][data-selection-start])]:text-neutral-100 [&:has([data-selected])]:text-primary-500 [&:has([data-selected][data-selection-end])]:text-neutral-100 before:absolute before:w-8 before:z-0 before:last:[&:has([data-selected])]:hidden before:[&:has([data-selected])]:bg-primary-50 before:[&:has([data-selection-end])]:hidden before:h-full before:-mt-px',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<div class="relative inset-0 z-1">
			<slot />
		</div>
	</RangeCalendarCell>
</template>
