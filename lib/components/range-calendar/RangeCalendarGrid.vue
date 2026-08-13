<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarGrid,
	type RangeCalendarGridProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarGridProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarGrid
		:class="cn('border-collapse space-y-1', props.class)"
		v-bind="forwardedProps"
	>
		<slot />
	</RangeCalendarGrid>
</template>
