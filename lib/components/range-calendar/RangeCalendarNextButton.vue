<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarNext,
	type RangeCalendarNextProps,
	useForwardProps,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '../calendar'

const props = defineProps<
	RangeCalendarNextProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)

const rangeCalendarContext = inject('RangeCalendarContext', null)

const nextButtonDataCy = computed(() => {
	return generateDataCy(
		rangeCalendarContext?.props?.dataCy,
		'range-calendar-next-button'
	)
})

const nextButtonDataTestid = computed(() => {
	return generateDataCy(
		rangeCalendarContext?.props?.dataTestid ?? rangeCalendarContext?.props?.dataCy,
		'range-calendar-next-button'
	)
})
</script>

<template>
	<RangeCalendarNext
		:class="
			cn(
				'h-8 w-8 flex items-center justify-center p-0 rounded-full border-1 border-neutral-400',
				props.class
			)
		"
		v-bind="forwardedProps"
		:data-cy="nextButtonDataCy"
		:data-testid="nextButtonDataTestid"
	>
		<slot>
			<i class="h-4 w-4 si-chevron-right text-stroke-0.5" />
		</slot>
	</RangeCalendarNext>
</template>
