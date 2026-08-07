<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarHeader,
	type CalendarHeaderProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	CalendarHeaderProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarHeader
		:class="
			cn('relative flex w-fit tablet:w-full items-center justify-between font-medium', props.class)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</CalendarHeader>
</template>
