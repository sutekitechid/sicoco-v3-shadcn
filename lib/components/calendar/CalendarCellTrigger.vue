<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarCellTrigger,
	type CalendarCellTriggerProps,
	useForwardProps,
} from 'reka-ui'
import { computed, inject, ref, type HTMLAttributes } from 'vue'
import { Tooltip, TooltipContent } from '../tooltip/index'
import { calendarCellClasses } from '.'

const props = defineProps<
	CalendarCellTriggerProps & { class?: HTMLAttributes['class'] } & {
		color?: string[]
	} & { tooltip?: string[] } & { readonly?: boolean }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const tooltipDate = computed(() => {
	return props.tooltip
})

const colorDate = computed(() => {
	return props.color
})

const isImportantDate = computed(() => {
	return colorDate.value.length !== 0 && tooltipDate.value.length !== 0
})

const forwardedProps = useForwardProps(delegatedProps)

const calendarContext = inject('CalendarContext', null)

const showOutsideViewDates = computed(() => {
	return calendarContext?.props.showOutsideViewDates
})

const calendarCellTrigger = ref()

const isDateOutsideView = computed(() => {
	if (showOutsideViewDates.value) {
		return false
	}
	if (!calendarCellTrigger.value) {
		return true
	}
	// check if "data-outside-view" is present
	return calendarCellTrigger.value.$el.dataset.outsideView !== undefined
})
</script>

<template>
	<Tooltip trigger="hover">
		<template #trigger>
			<div class="flex flex-col items-center">
				<CalendarCellTrigger
					ref="calendarCellTrigger"
					:class="
						cn(
							'h-9 w-9 p-0 font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs hover:bg-neutral-10',
							'[&[data-today]:not([data-selected])]:border [&[data-today]:not([data-selected])]:border-primary-100 [&[data-today]:not([data-selected])]:text-neutral-100',
							// Selected
							'data-[selected]:bg-primary-100 data-[selected]:text-primary-10 data-[selected]:opacity-100 data-[selected]:hover:bg-primary-100 data-[selected]:hover:text-primary-10 data-[selected]:focus:bg-primary-100 data-[selected]:focus:text-primary-10 ',
							// Disabled
							'data-[disabled]:text-neutral-60 data-[disabled]:opacity-50 ',
							// Unavailable
							'data-[unavailable]:text-neutral-60 data-[unavailable]:line-through ',
							// Outside months
							'data-[outside-view]:text-neutral-60 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-neutral-10 [&[data-outside-view][data-selected]]:text-neutral-60 [&[data-outside-view][data-selected]]:opacity-30',
							calendarCellClasses({
								readonly: props.readonly,
								important: isImportantDate,
								showOutsideViewDates,
							}),
							props.class
						)
					"
					v-bind="forwardedProps"
				>
					<slot />
				</CalendarCellTrigger>
				<div
					v-if="!isDateOutsideView"
					class="flex items-center justify-center w-full"
				>
					<div
						v-for="(color, index) in colorDate"
						class="border-b-4 items-center w-full"
						:style="`border-color: ${color} ;`"
					></div>
				</div>
			</div>
		</template>
		<TooltipContent
			v-if="tooltipDate.length !== 0 && !isDateOutsideView"
			position="bottom"
		>
			<ul>
				<li
					v-for="(tooltip, index) in tooltipDate"
					:key="index"
					class="flex items-center gap-2"
				>
					<i
						class="si-minus w-4 h-4 text-stroke-2"
						:style="`color: ${colorDate[index]} ;`"
					/>
					<span>{{ tooltip }}</span>
				</li>
			</ul>
		</TooltipContent>
	</Tooltip>
</template>
