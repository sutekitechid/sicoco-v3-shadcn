<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarCellTrigger,
	type CalendarCellTriggerProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	CalendarCellTriggerProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarCellTrigger
		:class="
			cn(
				'h-9 w-9 p-0 font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm hover:bg-neutral-10',
				'[&[data-today]:not([data-selected])]:bg-neutral-5 [&[data-today]:not([data-selected])]:text-neutral-100',
				// Selected
				'data-[selected]:bg-neutral-100 data-[selected]:text-neutral-5 data-[selected]:opacity-100 data-[selected]:hover:bg-neutral-100 data-[selected]:hover:text-neutral-5 data-[selected]:focus:bg-neutral-100 data-[selected]:focus:text-neutral-5 ',
				// Disabled
				'data-[disabled]:text-neutral-60 data-[disabled]:opacity-50 ',
				// Unavailable
				'data-[unavailable]:text-neutral-60 data-[unavailable]:line-through ',
				// Outside months
				'data-[outside-view]:text-neutral-60 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-neutral-10 [&[data-outside-view][data-selected]]:text-neutral-60 [&[data-outside-view][data-selected]]:opacity-30',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</CalendarCellTrigger>
</template>
