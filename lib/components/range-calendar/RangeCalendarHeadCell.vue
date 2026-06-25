<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarHeadCell,
	type RangeCalendarHeadCellProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarHeadCellProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarHeadCell
		:class="
			cn('w-9 rounded-md text-xs text-neutral-950 font-semibold', props.class)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</RangeCalendarHeadCell>
</template>
