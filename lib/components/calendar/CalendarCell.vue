<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarCell, type CalendarCellProps, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { calendarCellClasses } from '.'

const props = defineProps<
	CalendarCellProps & { class?: HTMLAttributes['class'] } & {
		readonly?: boolean
	}
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarCell
		:class="
			cn(
				'relative h-9 w-9 p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-neutral-100 [&:has([data-selected][data-outside-view])]:bg-neutral-950/50 [&:has([data-selected])]:text-neutral-100',
				calendarCellClasses({
					readonly: props.readonly,
				}),
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</CalendarCell>
</template>
