<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import { CalendarPrev, type CalendarPrevProps, useForwardProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes } from 'vue'
import { generateDataCy } from '.'
import Button from '../button/Button.vue';

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
	<Button size="sm" outlined variant="neutral" as-child>
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
		>
			<slot>
				<i class="si-heroicon-solid-chevron-left text-body-lg" />
			</slot>
		</CalendarPrev>
	</Button>
</template>
