<script lang="ts" setup>
import {
	RangeCalendarPrev,
	type RangeCalendarPrevProps,
	useForwardProps,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { type DateValue } from '@internationalized/date'
import { cn } from '../../utils/tw-merge'
import { generateDataCy } from '../calendar'
import Button from '../button/Button.vue'
import { getNextPage } from '../../utils/date-picker'

const props = withDefaults(
	defineProps<
		RangeCalendarPrevProps & {
			class?: HTMLAttributes['class']
			months?: number
			icon?: string
		}
	>(),
	{
		months: -1,
		icon: 'si-heroicon-solid-chevron-left'
	}
)

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

const prevButtonDataTestid = computed(() => {
	return generateDataCy(
		rangeCalendarContext?.props?.dataTestid ?? rangeCalendarContext?.props?.dataCy,
		'range-calendar-prev-button'
	)
})
</script>

<template>
	<Button size="sm" outlined variant="primary" type="button" class="min-w-7 w-7! h-7 border-main hover:border-primary-main!">
		<RangeCalendarPrev
			:class="
				cn(
					'flex items-center justify-center',
					props.class
				)
			"
			v-bind="forwardedProps"
			:data-cy="prevButtonDataCy"
			:data-testid="prevButtonDataTestid"
			:prev-page="(date: DateValue) => getNextPage(date, props.months)"
			class="hover:cursor-pointer"
		>
			<slot>
				<i :class="[props.icon, 'text-label-lg text-secondary hover:text-primary-main']" />
			</slot>
		</RangeCalendarPrev>
	</Button>
</template>
