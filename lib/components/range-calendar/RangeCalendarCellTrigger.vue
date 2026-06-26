<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarCellTrigger,
	type RangeCalendarCellTriggerProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { Tooltip, TooltipContent } from '../tooltip/index'

const props = defineProps<
	RangeCalendarCellTriggerProps & { class?: HTMLAttributes['class'] } & {
		color?: string[]
	} & { tooltip?: string[] }
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

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<Tooltip>
		<template #trigger>
			<div class="flex flex-col items-center">
				<RangeCalendarCellTrigger
					:class="
						cn(
							'h-9 w-9 p-0 font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-xs hover:bg-neutral-100',
							'[&[data-today]:not([data-selected])]:border [&[data-today]:not([data-selected])]:border-primary-500 [&[data-today]:not([data-selected])]:text-neutral-950 ',
							// Selection Start
							'data-[selection-start]:bg-primary-500 data-[selection-start]:text-primary-50 data-[selection-start]:hover:bg-primary-500 data-[selection-start]:hover:text-primary-50 data-[selection-start]:focus:bg-primary-500 data-[selection-start]:focus:text-primary-50 dark:data-[selection-start]:bg-primary-200',
							// Selection End
							'data-[selection-end]:bg-primary-500 data-[selection-end]:text-primary-50 data-[selection-end]:hover:bg-primary-500 data-[selection-end]:hover:text-primary-50 data-[selection-end]:focus:bg-primary-500 data-[selection-end]:focus:text-primary-50',
							// Outside months
							'data-[outside-view]:text-neutral-500 [&[data-outside-view][data-selected]]:bg-primary-50 [&[data-outside-view][data-selected]]:text-neutral-500',
							// Disabled
							'data-[disabled]:text-neutral-500 0',
							// Unavailable
							'data-[unavailable]:text-neutral-100 data-[unavailable]:line-through ',
							props.class
						)
					"
					v-bind="forwardedProps"
				>
					<slot />
				</RangeCalendarCellTrigger>
				<div class="flex items-center justify-center h-2 w-full">
					<div
						v-for="(color, index) in colorDate"
						class="border-b-2 items-center w-full"
						:style="`border-color: ${color} ;`"
					></div>
				</div>
			</div>
		</template>
		<TooltipContent v-if="tooltipDate.length !== 0" position="bottom">
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
