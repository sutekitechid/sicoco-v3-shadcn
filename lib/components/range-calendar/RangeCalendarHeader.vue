<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarHeader,
	type RangeCalendarHeaderProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarHeaderProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarHeader
		:class="
			cn('relative flex w-full items-center justify-between pt-1', props.class)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</RangeCalendarHeader>
</template>
