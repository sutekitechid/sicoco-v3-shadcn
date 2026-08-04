<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants } from '.'

interface Props extends PrimitiveProps {
	variant?: ButtonVariants['variant']
	size?: ButtonVariants['size']
	class?: HTMLAttributes['class']
	rounded?: boolean
	outlined?: boolean
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
})

const emits = defineEmits(['click'])

const isClassDisabled = computed(() => {
  const cls = props.class
  if (typeof cls === 'string') return /\bdisabled\b/.test(cls)
  return false
})

const computedDisabled = computed(() => props.disabled || isClassDisabled.value)

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
				buttonVariants({ variant, size, rounded, outlined, disabled: computedDisabled }),
				props.class
			)
		"
		@click="onClick"
	>
		<slot />
	</Primitive>
</template>
