<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarPrev,
	type RangeCalendarPrevProps,
	useForwardProps,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '../calendar'
import Button from '../button/Button.vue'

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

const prevButtonDataTestid = computed(() => {
	return generateDataCy(
		rangeCalendarContext?.props?.dataTestid ?? rangeCalendarContext?.props?.dataCy,
		'range-calendar-prev-button'
	)
})
</script>

<template>
	<RangeCalendarPrev
		:class="
			cn(
				'h-8 w-8 flex items-center justify-center p-0',
				props.class
			)
		"
		v-bind="forwardedProps"
		:data-cy="prevButtonDataCy"
		:data-testid="prevButtonDataTestid"
	>
		<slot>
			<Button outlined variant="neutral" size="sm">
				<i class="si-heroicon-outline-chevron-left" />
			</Button>
		</slot>
	</RangeCalendarPrev>
</template>
