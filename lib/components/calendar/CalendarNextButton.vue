<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarNext, type CalendarNextProps, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '.'
import Button from '../button/Button.vue';

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
	<Button size="sm" outlined variant="neutral" as-child>
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
		>
			<slot>
				<i class="si-heroicon-solid-chevron-right text-body-lg" />
			</slot>
		</CalendarNext>
	</Button>
</template>
