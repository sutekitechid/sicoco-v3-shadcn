<script setup lang="ts">
import { Comment, computed, useSlots } from 'vue'
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
	icon?: string
	iconPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
	to: '',
	iconPosition: 'left',
})

const emits = defineEmits(['click'])
const slots = useSlots()

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

const hasDefaultSlotContent = computed(() => {
	const nodes = slots.default?.()

	return nodes?.some((node) => {
		if (node.type === Comment) return false
		if (typeof node.children === 'string') return node.children.trim().length > 0
		if (Array.isArray(node.children)) return node.children.length > 0

		return true
	}) ?? false
})

const hasIcon = computed(() => {
	return Boolean(props.icon || slots.icon)
})

const computedContent = computed<ButtonVariants['content']>(() => {
	if (!hasIcon.value) return 'default'
	if (!hasDefaultSlotContent.value) return 'iconOnly'

	return props.iconPosition === 'right' ? 'iconRight' : 'iconLeft'
})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="computedAsChild"
		:class="
			cn(
				buttonVariants({ variant, size, content: computedContent, outlined, disabled }),
				props.class
			)
		"
		:disabled="props.disabled"
		@click="onClick"
	>
		<RouterLink v-if="isRouterLink" :to="props.to">
			<div class="inline-flex items-center gap-2">
				<slot v-if="hasIcon && iconPosition === 'left'" name="icon">
					<i :class="icon" />
				</slot>
				<slot />
				<slot v-if="hasIcon && iconPosition === 'right'" name="icon">
					<i :class="icon" />
				</slot>
			</div>
		</RouterLink>
		<template v-else>
			<slot v-if="hasIcon && iconPosition === 'left'" name="icon">
				<i :class="icon" />
			</slot>
			<slot />
			<slot v-if="hasIcon && iconPosition === 'right'" name="icon">
				<i :class="icon" />
			</slot>
		</template>
	</Primitive>
</template>

<style scoped>
a {
	@apply hover:!text-primary-700;
}
</style>
