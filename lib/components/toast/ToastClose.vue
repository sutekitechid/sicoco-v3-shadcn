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
				'absolute right-2 top-2 rounded-lg p-1 text-neutral-500 transition-[visibility] hover:text-main dark:text-neutral-700 dark:hover:text-neutral-700 focus:visible focus:outline-hidden focus:ring-2',
				props.class
			)
		"
	>
		<i class="si-heroicon-solid-x-mark" />
	</ToastClose>
</template>
