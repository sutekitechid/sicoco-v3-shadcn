<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { ToastDescription, type ToastDescriptionProps } from 'reka-ui'
import { computed, inject, type HTMLAttributes, type Ref } from 'vue'
import type { ToastProps } from '.'

const props = defineProps<
	ToastDescriptionProps & { class?: HTMLAttributes['class'] }
>()

const variant = inject<Ref<ToastProps['variant']>>('toastVariant')

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})
</script>

<template>
	<ToastDescription
		:class="cn('text-label-md', variant === 'neutral' ? 'text-secondary' : 'text-main', props.class)"
		v-bind="delegatedProps"
	>
		<slot />
	</ToastDescription>
</template>
