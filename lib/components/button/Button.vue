<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants } from '.'

interface Props extends PrimitiveProps {
	variant?: ButtonVariants['variant']
	size?: ButtonVariants['size']
	class?: HTMLAttributes['class']
	outlined?: boolean
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
})

const emits = defineEmits(['click'])

const onClick = (event: MouseEvent) => {
	if (props.disabled) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	return emits('click', event)
}
</script>

<template>
	<Primitive
		:as="as"
		:as-child="asChild"
		:class="
			cn(
				buttonVariants({ variant, size, outlined, disabled }),
				props.class
			)
		"
		:disabled="props.disabled"
		@click="onClick"
	>
		<slot />
	</Primitive>
</template>
