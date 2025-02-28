<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarPrev,
	type CalendarPrevProps,
	useForwardProps,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	CalendarPrevProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarPrev
		:class="
			cn(
				'h-7 w-7 flex items-center justify-center p-0 rounded-full border-1 border-neutral-30',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot>
			<i class="h-4 w-4 si-chevron-left text-stroke-0.5" />
		</slot>
	</CalendarPrev>
</template>
