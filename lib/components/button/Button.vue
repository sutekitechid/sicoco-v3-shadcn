<script setup lang="ts">
import {
	Comment,
	computed,
	Fragment,
	Text,
	useSlots,
	type VNode,
} from 'vue'
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

const isClassDisabled = computed(() => {
  const cls = props.class
  if (typeof cls === 'string') return /\bdisabled\b/.test(cls)
  return false
})

const computedDisabled = computed(() => props.disabled || isClassDisabled.value)

function onClick(event: MouseEvent) {
	if (computedDisabled.value) {
		event.preventDefault()
		event.stopPropagation()
		return
	}

	emits('click', event)
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

const hasText = computed(() =>
	slots.default?.().some(hasRenderableContent) ?? false
)

function hasRenderableContent(node: VNode): boolean {
	if (node.type === Comment) return false

	if (node.type === Text) {
		return typeof node.children === 'string' && node.children.trim().length > 0
	}

	if (node.type === Fragment && Array.isArray(node.children)) {
		return node.children.some(child =>
			typeof child === 'string'
				? child.trim().length > 0
				: hasRenderableContent(child as VNode)
		)
	}

	return true
}

const content = computed<NonNullable<ButtonVariants['content']>>(() => {
	if (!hasText.value && (hasLeftIcon.value || hasRightIcon.value)) {
		return 'iconOnly'
	}

	if (hasLeftIcon.value && hasRightIcon.value) return 'iconBoth'
	if (hasLeftIcon.value) return 'iconLeft'
	if (hasRightIcon.value) return 'iconRight'

	return 'default'
})

const hasLinkText = computed(() => {
	return Boolean(props.variant?.startsWith('link-') && hasText.value)
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
					disabled: computedDisabled,
					content,
				}),
				props.class
			)
		"
		:disabled="computedDisabled"
		@click.capture="onClick"
	>
		<RouterLink v-if="isRouterLink" :to="props.to">
			<ButtonContent
				:size="size"
				:icon-left="iconLeft"
				:icon-right="iconRight"
				:text-border="hasLinkText"
			>
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
			:text-border="hasLinkText"
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

<style>
	@reference "../../config/tailwind.css";
[class*="button-xs"] [class*="si-"] {
	@apply text-label-lg;
}
[class*="button-xs-icon-only"] [class*="si-"] {
	@apply text-title-sm;
}
[class*="button-sm"] [class*="si-"] {
	@apply text-title-sm;
}
[class*="button-md"] [class*="si-"],
[class*="button-lg"] [class*="si-"] {
	@apply text-title-lg;
}
button [class*="si-"]::before {
	font-size: inherit;
}
</style>

<style scoped>
	@reference "../../config/tailwind.css";

a {
	@apply hover:!text-primary-700;
}
</style>
