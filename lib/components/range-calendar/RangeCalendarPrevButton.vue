<script lang="ts" setup>
import { buttonVariants } from '../button/index'
import { cn } from '../../utils/tw-merge'
import { ChevronLeft } from 'lucide-vue-next'
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
				buttonVariants({ variant: 'primary' }),
				'h-7 w-7 flex items-center justify-center p-0 rounded-full',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot>
			<ChevronLeft class="h-4 w-4" />
		</slot>
	</RangeCalendarPrev>
</template>
