<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarPrev,
	type RangeCalendarPrevProps,
	useForwardProps,
} from 'radix-vue'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '../calendar'

const props = defineProps<
	RangeCalendarPrevProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)

const rangeCalendarContext = inject('RangeCalendarContext', null)

const prevButtonDataCy = computed(() => {
	return generateDataCy(
		rangeCalendarContext?.props?.dataCy,
		'range-calendar-prev-button'
	)
})
</script>

<template>
	<RangeCalendarPrev
		:class="
			cn(
				'h-8 w-8 flex items-center justify-center p-0 rounded-full border-1 border-neutral-30',
				props.class
			)
		"
		v-bind="forwardedProps"
		:data-cy="prevButtonDataCy"
	>
		<slot>
			<i class="h-4 w-4 si-chevron-left text-stroke-0.5" />
		</slot>
	</RangeCalendarPrev>
</template>
