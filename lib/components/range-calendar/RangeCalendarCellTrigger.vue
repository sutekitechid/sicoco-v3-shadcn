<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarCellTrigger,
	type RangeCalendarCellTriggerProps,
	useForwardProps,
} from 'radix-vue'
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
							'h-9 w-9 p-0 font-normal data-[selected]:opacity-100 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs hover:bg-neutral-10',
							'[&[data-today]:not([data-selected])]:border [&[data-today]:not([data-selected])]:border-primary-100 [&[data-today]:not([data-selected])]:text-neutral-100 ',
							// Selection Start
							'data-[selection-start]:bg-primary-100 data-[selection-start]:text-primary-10 data-[selection-start]:hover:bg-primary-100 data-[selection-start]:hover:text-primary-10 data-[selection-start]:focus:bg-primary-100 data-[selection-start]:focus:text-primary-10 dark:data-[selection-start]:bg-primary-50',
							// Selection End
							'data-[selection-end]:bg-primary-100 data-[selection-end]:text-primary-10 data-[selection-end]:hover:bg-primary-100 data-[selection-end]:hover:text-primary-10 data-[selection-end]:focus:bg-primary-100 data-[selection-end]:focus:text-primary-10',
							// Outside months
							'data-[outside-view]:text-neutral-60 data-[outside-view]:opacity-50 [&[data-outside-view][data-selected]]:bg-primary-10 [&[data-outside-view][data-selected]]:text-neutral-60 [&[data-outside-view][data-selected]]:opacity-30 ',
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
