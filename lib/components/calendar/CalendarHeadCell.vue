<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarHeadCell,
	type CalendarHeadCellProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	CalendarHeadCellProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarHeadCell
		:class="
			cn('rounded-lg text-xs text-neutral-950 dark:text-neutral-500 font-semibold', props.class)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</CalendarHeadCell>
</template>
