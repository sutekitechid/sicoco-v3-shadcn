<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarHeadCell,
	type CalendarHeadCellProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	CalendarHeadCellProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarHeadCell
		:class="
			cn('w-9 rounded-md text-xs text-neutral-100 font-semibold', props.class)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</CalendarHeadCell>
</template>
