<script setup lang="ts">
import { computed } from 'vue'
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
	to?: string
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
	to: ''
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

const isRouterLink = computed(() => {
	return props.as === 'router-link'
})

const computedAsChild = computed(() => {
	if (isRouterLink.value) return true
	return props.asChild
})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="computedAsChild"
		:class="
			cn(
				buttonVariants({ variant, size, outlined, disabled }),
				props.class
			)
		"
		:disabled="props.disabled"
		@click="onClick"
	>
		<RouterLink v-if="isRouterLink" :to="props.to">
			<div>
				<slot />
			</div>
		</RouterLink>
		<slot v-else />
	</Primitive>
</template>

<style scoped>
a {
	@apply hover:!text-primary-700;
}
</style>
