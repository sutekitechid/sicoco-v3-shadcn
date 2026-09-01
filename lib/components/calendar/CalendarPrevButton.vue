<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarPrev, type CalendarPrevProps, DateValue, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '.'
import Button from '../button/Button.vue';
import { getNextPage } from '../../utils/date-picker'

const props = withDefaults(
	defineProps<
		CalendarPrevProps & {
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

const calendarContext = inject('CalendarContext', null)

const prevButtonDataCy = computed(() => {
	return generateDataCy(calendarContext?.props?.dataCy, 'calendar-prev-button')
})

const prevButtonDataTestid = computed(() => {
	return generateDataCy(
		calendarContext?.props?.dataTestid ?? calendarContext?.props?.dataCy,
		'calendar-prev-button',
	)
})
</script>

<template>
	<Button size="sm" outlined variant="primary" type="button" class="min-w-7 w-7! h-7 border-main hover:border-primary-main!">
		<CalendarPrev
			:class="
				cn(
					'flex items-center',
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
				<i :class="[props.icon, 'text-body-lg text-secondary hover:text-primary-main']" />
			</slot>
		</CalendarPrev>
	</Button>
</template>
