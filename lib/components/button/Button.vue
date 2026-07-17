<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type ButtonVariants, buttonVariants } from '.'
import ButtonContent from './ButtonContent.vue'

interface Props extends PrimitiveProps {
	variant?: ButtonVariants['variant']
	size?: ButtonVariants['size']
	class?: HTMLAttributes['class']
	outlined?: boolean
	disabled?: boolean
	to?: string
	iconLeft?: string
	iconRight?: string
}

const props = withDefaults(defineProps<Props>(), {
	as: 'button',
	to: '',
})

const slots = useSlots()

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

const hasLeftIcon = computed(() =>
	Boolean(props.iconLeft || slots['icon-left'])
)

const hasRightIcon = computed(() =>
	Boolean(props.iconRight || slots['icon-right'])
)

const hasText = computed(() => Boolean(slots.default))

const content = computed<NonNullable<ButtonVariants['content']>>(() => {
	if (!hasText.value && (hasLeftIcon.value || hasRightIcon.value)) {
		return 'iconOnly'
	}

	if (hasLeftIcon.value && hasRightIcon.value) return 'iconBoth'
	if (hasLeftIcon.value) return 'iconLeft'
	if (hasRightIcon.value) return 'iconRight'

	return 'default'
})
</script>

<template>
	<Primitive
		:as="as"
		:as-child="computedAsChild"
		:class="
			cn(
				buttonVariants({
					variant,
					size,
					outlined,
					disabled,
					content,
				}),
				props.class
			)
		"
		:disabled="props.disabled"
		@click="onClick"
	>
		<RouterLink v-if="isRouterLink" :to="props.to">
			<ButtonContent :size="size" :icon-left="iconLeft" :icon-right="iconRight">
				<slot />
				<template #icon-left>
					<slot name="icon-left" />
				</template>
				<template #icon-right>
					<slot name="icon-right" />
				</template>
			</ButtonContent>
		</RouterLink>
		<ButtonContent
			v-else
			:size="size"
			:icon-left="iconLeft"
			:icon-right="iconRight"
		>
			<slot />
			<template #icon-left>
				<slot name="icon-left" />
			</template>
			<template #icon-right>
				<slot name="icon-right" />
			</template>
		</ButtonContent>
	</Primitive>
</template>

<style scoped>
a {
	@apply hover:!text-primary-700;
}
</style>
