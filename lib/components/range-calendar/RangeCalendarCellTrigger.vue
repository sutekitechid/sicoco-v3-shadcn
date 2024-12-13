<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarCellTrigger,
	type RangeCalendarCellTriggerProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarCellTriggerProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarCellTrigger
		:class="
			cn(
				'h-9 w-9 p-0 font-normal data-[selected]:opacity-100 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm hover:bg-neutral-10',
				'[&[data-today]:not([data-selected])]:bg-neutral-5 [&[data-today]:not([data-selected])]:text-neutral-100 ',
				// Selection Start
				'data-[selection-start]:bg-neutral-100 data-[selection-start]:text-neutral-5 data-[selection-start]:hover:bg-neutral-100 data-[selection-start]:hover:text-neutral-5 data-[selection-start]:focus:bg-neutral-100 data-[selection-start]:focus:text-neutral-5 dark:data-[selection-start]:bg-slate-50',
				// Selection End
				'data-[selection-end]:bg-neutral-100 data-[selection-end]:text-neutral-5 data-[selection-end]:hover:bg-neutral-100 data-[selection-end]:hover:text-neutral-5 data-[selection-end]:focus:bg-neutral-100 data-[selection-end]:focus:text-neutral-5',
				// Outside months
				'data-[outside-view]:text-neutral-60 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-slate-100/50 [&[data-outside-view][data-selected]]:text-neutral-60 [&[data-outside-view][data-selected]]:opacity-30 ',
				// Disabled
				'data-[disabled]:text-neutral-60 data-[disabled]:opacity-50 0',
				// Unavailable
				'data-[unavailable]:text-neutral-5 data-[unavailable]:line-through ',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</RangeCalendarCellTrigger>
</template>
