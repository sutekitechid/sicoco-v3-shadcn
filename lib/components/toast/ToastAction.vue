<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { ToastAction, type ToastActionProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<
	ToastActionProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})
</script>

<template>
	<ToastAction
		v-bind="delegatedProps"
		:class="
			cn(
				'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-neutral-100 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
				props.class
			)
		"
	>
		<slot />
	</ToastAction>
</template>
