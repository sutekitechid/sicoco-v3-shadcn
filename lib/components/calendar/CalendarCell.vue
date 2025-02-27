<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarCell,
	type CalendarCellProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { readonlyClass } from '.'

const props = defineProps<
	CalendarCellProps & { class?: HTMLAttributes['class'] } & {
		readonly?: boolean
	}
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarCell
		:class="
			cn(
				'relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-neutral-10 [&:has([data-selected][data-outside-view])]:bg-neutral-100/50 [&:has([data-selected])]:text-neutral-10',
				readonlyClass(props.readonly),
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</CalendarCell>
</template>
