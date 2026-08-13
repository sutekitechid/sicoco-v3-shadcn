<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { ToastViewport, type ToastViewportProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import { getToastPosition, type ToastVariantPosition } from '.'


const props = withDefaults(
	defineProps<
		ToastViewportProps & {
			class?: HTMLAttributes['class']
			position: ToastVariantPosition
		}
	>(),
	{
		position: 'top-right',
	}
)

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})
</script>

<template>
	<ToastViewport
		v-bind="delegatedProps"
		:class="
			cn(
				'fixed z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]',
				props.class,
				getToastPosition(position)
			)
		"
	/>
</template>
