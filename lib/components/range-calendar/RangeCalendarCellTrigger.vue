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
							'w-full h-10.5 font-normal inline-flex items-center justify-center gap-2 whitespace-nowrap hover:bg-neutral-300',
							'[&[data-today]:not([data-selected])]:border [&[data-today]:not([data-selected])]:border-primary-default [&[data-today]:not([data-selected])]:text-main dark:text-neutral-500 ',
							// Selection Start
							'data-selection-start:bg-primary-default data-selection-start:rounded-l-sm data-selection-start:text-white dark:text-neutral-500 dark:data-selection-start:text-neutral-700 data-selection-start:hover:bg-primary-default data-selection-start:hover:text-white dark:data-selection-start:hover:text-neutral-700 data-selection-start:focus:bg-primary-default data-selection-start:focus:text-white dark:data-selection-start:focus:text-neutral-700 dark:data-selection-start:bg-primary-200',
							// Selection End
							'data-selection-end:bg-primary-default data-selection-end:rounded-r-sm data-selection-end:text-white dark:data-selection-end:text-neutral-700 data-selection-end:hover:bg-primary-default data-selection-end:hover:text-white dark:data-selection-end:hover:text-neutral-700 data-selection-end:focus:bg-primary-default data-selection-end:focus:text-white dark:text-neutral-500 dark:data-selection-end:focus:text-neutral-700',
							// Outside months
							'data-outside-view:text-neutral-500 [&[data-outside-view][data-selected]]:bg-primary-subtle [&[data-outside-view][data-selected]]:text-neutral-500',
							// Disabled
							'data-disabled:text-disabled',
							// Unavailable
							'data-unavailable:text-neutral-100 data-unavailable:line-through ',
							props.class
						)
					"
					v-bind="forwardedProps"
				>
					<slot />
				</RangeCalendarCellTrigger>
				<div v-if="colorDate?.length > 0" class="flex items-center justify-center h-2 w-full">
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
