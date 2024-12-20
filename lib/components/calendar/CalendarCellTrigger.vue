<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarCellTrigger,
	type CalendarCellTriggerProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import { Tooltip, TooltipContent } from '../tooltip/index'

const props = defineProps<
	CalendarCellTriggerProps & { class?: HTMLAttributes['class'] } & {
		color?: string[]
	} & { tooltip?: string[] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

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
</script>

<template>
	<Tooltip>
		<template #trigger>
			<div class="flex flex-col items-center">
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
							isImportantDate ? 'font-bold' : '',
							props.class
						)
					"
					v-bind="forwardedProps"
				>
					<slot />
				</CalendarCellTrigger>
				<div class="flex items-center justify-center h-2 w-full">
					<div
						v-for="(color, index) in colorDate"
						class="border-b-2 items-center w-full"
						:style="`border-color: ${color} ;`"
					></div>
				</div>
			</div>
		</template>
		<TooltipContent position="bottom" v-if="tooltipDate.length !== 0">
			<ul>
				<li
					class="flex items-center gap-2"
					v-for="(tooltip, index) in tooltipDate"
					:key="index"
				>
					<i
						class="si-minus w-4 h-4"
						:style="`color: ${colorDate[index]} ; -webkit-text-stroke: 2px`"
					/>
					<span>{{ tooltip }}</span>
				</li>
			</ul>
		</TooltipContent>
	</Tooltip>
</template>
