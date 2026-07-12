<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarNext, type CalendarNextProps, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '.'

const props = defineProps<
	CalendarNextProps & { class?: HTMLAttributes['class'] }
>()

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
	<CalendarNext
		:class="
			cn(
				'h-8 w-8 flex items-center justify-center p-0 rounded border-1 border-main',
				props.class
			)
		"
		v-bind="forwardedProps"
		:data-cy="nextButtonDataCy"
		:data-testid="nextButtonDataTestid"
	>
		<slot>
			<i class="h-4 w-4 si-heroicon-solid-chevron-right text-stroke-0.5" />
		</slot>
	</CalendarNext>
</template>
