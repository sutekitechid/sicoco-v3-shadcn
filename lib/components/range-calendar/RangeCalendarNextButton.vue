<script lang="ts" setup>
import { type DateValue } from '@internationalized/date'
import {
	RangeCalendarNext,
	type RangeCalendarNextProps,
	useForwardProps,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { generateDataCy } from '../calendar'
import Button from '../button/Button.vue'
import { getNextPage } from '../../utils/date-picker'

const props = withDefaults(
	defineProps<
		RangeCalendarNextProps & {
			class?: HTMLAttributes['class']
			months?: number
			icon?: string
		}
	>(),
	{
		months: 1,
		icon: 'si-heroicon-solid-chevron-right'
	}
)

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
	<Button size="sm" outlined variant="primary" type="button" class="min-w-7 w-7! h-7 border-main hover:border-primary-main!">
		<RangeCalendarNext
			:class="
				cn(
					'flex items-center justify-center',
					props.class
				)
			"
			v-bind="forwardedProps"
			:data-cy="nextButtonDataCy"
			:data-testid="nextButtonDataTestid"
			:next-page="(date: DateValue) => getNextPage(date, props.months)"
			class="hover:cursor-pointer"
		>
			<slot>
				<i :class="[props.icon, 'text-label-lg text-secondary hover:text-primary-main']" />
			</slot>
		</RangeCalendarNext>
	</Button>
</template>
