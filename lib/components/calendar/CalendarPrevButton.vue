<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarPrev, type CalendarPrevProps, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '.'

const props = defineProps<
	CalendarPrevProps & { class?: HTMLAttributes['class'] }
>()

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
	<CalendarPrev
		:class="
			cn(
				'h-8 w-8 flex items-center justify-center p-0 rounded border-1 border-main',
				props.class
			)
		"
		v-bind="forwardedProps"
		:data-cy="prevButtonDataCy"
		:data-testid="prevButtonDataTestid"
	>
		<slot>
			<i class="h-4 w-4 si-heroicon-solid-chevron-left text-stroke-0.5" />
		</slot>
	</CalendarPrev>
</template>
