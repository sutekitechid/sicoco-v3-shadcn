<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { ToastClose, type ToastCloseProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	ToastCloseProps & {
		class?: HTMLAttributes['class']
	}
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})
</script>

<template>
	<ToastClose
		v-bind="delegatedProps"
		:class="
			cn(
				'absolute right-2 top-2 rounded-lg p-1 text-neutral-950/50 opacity-0 transition-opacity hover:text-neutral-950 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
				props.class
			)
		"
	>
		<i class="si-x" />
	</ToastClose>
</template>
