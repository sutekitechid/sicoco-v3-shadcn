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
	return props.tooltip ?? []
})

const colorDate = computed(() => {
	return props.color ?? []
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
			<div class="flex w-full tablet:w-10 flex-col items-center">
				<CalendarCellTrigger
					ref="calendarCellTrigger"
					:class="
						cn(
							'w-full tablet:w-10.5 h-10.5 font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm hover:bg-primary-subtle',
							'[&[data-today]:not([data-selected])]:border [&[data-today]:not([data-selected])]:border-primary-default [&[data-today]:not([data-selected])]:text-main dark:text-neutral-500',
							// Selected
							'data-selected:bg-primary-default data-selected:text-white dark:text-neutral-500 dark:data-selected:text-neutral-700 data-selected:hover:bg-primary-default data-selected:hover:text-white dark:data-selected:hover:text-neutral-700 data-selected:focus:bg-primary-default data-selected:focus:text-white dark:data-selected:focus:text-neutral-700 ',
							// Disabled
							'data-disabled:text-disabled',
							// Unavailable
							'data-unavailable:text-neutral-500 data-unavailable:line-through ',
							// Outside months
							'data-outside-view:text-neutral-500 [&[data-outside-view][data-selected]]:bg-neutral-300 [&[data-outside-view][data-selected]]:text-neutral-500',
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
					class="flex w-full items-center justify-center"
				>
					<div
						v-for="(color, index) in colorDate"
						class="flex border-b-4 items-center w-full"
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
						class="si-minus text-stroke-2"
						:style="`color: ${colorDate[index]} ;`"
					/>
					<span>{{ tooltip }}</span>
				</li>
			</ul>
		</TooltipContent>
	</Tooltip>
</template>
