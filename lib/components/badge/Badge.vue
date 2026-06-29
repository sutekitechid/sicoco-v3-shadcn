<script setup lang="ts">
/**
 * 'Badge' are a numerical indicator of how many items are associated with a link.
 *
 * @example
 * <Badge variant="primary" size="small" closeable>Primary</Badge>
 *
 */
import { ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type BadgeVariants, badgeVariants } from './index'
import BadgeCloseIcon from './BadgeCloseIcon.vue'

/**
 * Define props for the Badge component with default values.
 * @props {string} [variant='primary'] - Defines the style variant of the badge.
 * @props {string} [class='custom-class'] - ]dditional custom CSS classes.
 * @props {boolean} [rounded=false] `rounded` - Whether the badge should have rounded corners.
 * @props {boolean} [closeable=false] `closeable` - Whether the badge includes a close button.
 */
const props = withDefaults(
	defineProps<{
		variant?: BadgeVariants['variant']
		class?: HTMLAttributes['class']
		rounded?: boolean
		closeable?: boolean
		size?: BadgeVariants['size']
	}>(),
	{
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

/**
 * Handles the close action for the badge.
 * Emits the `close` event and hides the badge.
 * @param event - The click event triggered by the close button.
 */
const onClose = (event: Event) => {
	emits('close', event)
	visible.value = false
}
</script>

<template>
	<!-- Badge container -->
	<div
		v-if="visible"
		:class="
			cn(
				badgeVariants({
					variant,
					rounded,
					closeable,
					size,
				}),
				props.class
			)
		"
	>
		<!-- Slot for custom content -->
		<span class="-translate-y-px">
			<slot />
		</span>
		 <!-- Optional close icon -->
		<BadgeCloseIcon
			v-if="props.closeable"
			:variant="props.variant"
			:size="props.size"
			@click="onClose"
		/>
	</div>
</template>

<style scoped>
i.icon-sm::before {
	font-size: 12px;
	line-height: 1;
}
i.icon-md::before {
	font-size: 14px;
	line-height: 1;
}
</style>
