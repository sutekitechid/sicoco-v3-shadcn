<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarGridRow,
	type RangeCalendarGridRowProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarGridRowProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarGridRow
		:class="cn('flex w-full', props.class)"
		v-bind="forwardedProps"
	>
		<slot />
	</RangeCalendarGridRow>
</template>
