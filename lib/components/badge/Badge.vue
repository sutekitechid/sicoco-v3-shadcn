<script setup lang="ts">
/**
 * 'Badge' are a numerical indicator of how many items are associated with a link.
 *
 * @example
 * <Badge variant="primary" size="small" closeable>Primary</Badge>
 *
 */
import {
	Comment,
	computed,
	Fragment,
	getCurrentInstance,
	ref,
	Text,
	useSlots,
	type HTMLAttributes,
	type VNode,
} from 'vue'
import { cn } from '../../utils/tw-merge'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import { type BadgeVariants, badgeVariants } from './index'
import BadgeCloseIcon from './BadgeCloseIcon.vue'

/**
 * Define props for the Badge component with default values.
 * @props {string} [variant='primary'] - Defines the style variant of the badge.
 * @props {string} [class='custom-class'] - ]dditional custom CSS classes.
 * @props {boolean} [rounded=false] `rounded` - Whether the badge should have rounded corners.
 * @props {boolean} [closeable=false] `closeable` - Whether the badge includes a close button.
 */
interface Props extends PrimitiveProps {
		variant?: BadgeVariants['variant']
		class?: HTMLAttributes['class']
		rounded?: boolean
		closeable?: boolean
		size?: BadgeVariants['size']
}

const props = withDefaults(
	defineProps<Props>(),
	{
		as: 'div',
		rounded: true,
		closeable: false,
		size: 'medium'
	}
)

/**
 * Emits events for the Badge component.
 * @emits {function} close(value: boolean) - Triggered when the close button is clicked.
 */
const emits = defineEmits<(event: 'close', e?: Event) => void>()

/** Controls the visibility of the badge. */
const visible = ref(true)

const instance = getCurrentInstance()
const hasParentCloseListener = !!instance?.vnode.props?.onClose
const slots = useSlots()

const hasText = computed(() =>
	slots.default?.().some(hasRenderableContent) ?? false
)

const content = computed<NonNullable<BadgeVariants['content']>>(() => {
	if (!hasText.value && slots['icon-left']) return 'iconOnly'
	if (slots['icon-left']) return 'iconLeft'

	return 'default'
})

/**
 * Handles the close action for the badge.
 * Emits the `close` event and hides the badge.
 * @param event - The click event triggered by the close button.
 */
const onClose = (event: Event) => {
	emits('close', event)
	if (!hasParentCloseListener) {
		visible.value = false
	}
}

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
</script>

<template>
	<!-- Badge container -->
	<Primitive
		v-if="visible"
		:as="as"
		:as-child="asChild"
		:class="
			cn(
				badgeVariants({
					variant,
					rounded,
					closeable,
					size,
					content,
				}),
				props.class
			)
		"
	>
		<slot name="icon-left" />
		<slot />
		<BadgeCloseIcon
			v-if="props.closeable"
			:variant="props.variant"
			:size="props.size"
			@click="onClose"
		/>
	</Primitive>
</template>
