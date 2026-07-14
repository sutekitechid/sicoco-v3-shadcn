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
	<Button outlined variant="neutral" size="sm">
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
		>
			<slot>
				<i class="si-heroicon-outline-chevron-left" />
			</slot>
		</RangeCalendarPrev>
	</Button>
</template>
