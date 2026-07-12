<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarHeading,
	type CalendarHeadingProps,
	useForwardProps,
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	CalendarHeadingProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<CalendarHeading
		v-slot="{ headingValue }"
		:class="cn('font-medium', props.class)"
		v-bind="forwardedProps"
	>
		<slot :heading-value>
			{{ headingValue }}
		</slot>
	</CalendarHeading>
</template>
