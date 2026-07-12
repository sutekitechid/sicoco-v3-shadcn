<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarNext,
	type RangeCalendarNextProps,
	useForwardProps,
} from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '../calendar'
import Button from '../button/Button.vue'

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
				'h-8 w-8 flex items-center justify-center p-0',
				props.class
			)
		"
		v-bind="forwardedProps"
		:data-cy="nextButtonDataCy"
		:data-testid="nextButtonDataTestid"
	>
		<slot>
			<Button outlined variant="neutral" size="sm">
				<i class="si-heroicon-outline-chevron-right" />
			</Button>
		</slot>
	</RangeCalendarNext>
</template>
