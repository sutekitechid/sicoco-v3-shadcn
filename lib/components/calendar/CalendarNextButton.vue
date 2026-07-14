<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarNext, type CalendarNextProps, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { type DateValue } from '@internationalized/date'
import { generateDataCy } from '.'
import Button from '../button/Button.vue';
import { getNextPage } from '../../utils/date-picker'

const props = withDefaults(
	defineProps<
		CalendarNextProps & {
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

const calendarContext = inject('CalendarContext', null)

const nextButtonDataCy = computed(() => {
	return generateDataCy(calendarContext?.props?.dataCy, 'calendar-next-button')
})

const nextButtonDataTestid = computed(() => {
	return generateDataCy(
		calendarContext?.props?.dataTestid ?? calendarContext?.props?.dataCy,
		'calendar-next-button',
	)
})
</script>

<template>
	<Button size="sm" outlined variant="neutral" as-child class="min-w-7 w-7 h-7">
		<CalendarNext
			:class="
				cn(
					'flex items-center',
					props.class
				)
			"
			v-bind="forwardedProps"
			:data-cy="nextButtonDataCy"
			:data-testid="nextButtonDataTestid"
			:next-page="(date: DateValue) => getNextPage(date, props.months)"
		>
			<slot>
				<i :class="[props.icon, 'text-label-lg']" />
			</slot>
		</CalendarNext>
	</Button>
</template>
