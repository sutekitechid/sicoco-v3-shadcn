<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { X } from 'lucide-vue-next'
import { ToastClose, type ToastCloseProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	ToastCloseProps & {
		class?: HTMLAttributes['class']
	}
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})
</script>

<template>
	<ToastClose
		v-bind="delegatedProps"
		:class="
			cn(
				'absolute right-2 top-2 rounded-md p-1 text-neutral-100/50 opacity-0 transition-opacity hover:text-neutral-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100',
				props.class
			)
		"
	>
		<X class="h-4 w-4" />
	</ToastClose>
</template>
