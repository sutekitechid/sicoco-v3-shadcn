<script lang="ts" setup>
import { buttonVariants } from '../button/index'
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarPrev,
	type RangeCalendarPrevProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	RangeCalendarPrevProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<RangeCalendarPrev
		:class="
			cn(
				'h-8 w-8 flex items-center justify-center p-0 rounded-full border-1 border-neutral-30',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot>
			<i class="h-4 w-4 si-chevron-left text-stroke-0.5" />
		</slot>
	</RangeCalendarPrev>
</template>
