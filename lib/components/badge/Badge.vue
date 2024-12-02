<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type BadgeVariants, badgeVariants } from './index'
import BadgeCloseIcon from './BadgeCloseIcon.vue'

/**
 * Define props for the Badge component with default values.
 * - `type`: Defines the style variant of the badge.
 * - `class`: Additional custom CSS classes.
 * - `rounded`: Whether the badge should have rounded corners.
 * - `closeable`: Whether the badge includes a close button.
 */
const props = withDefaults(
	defineProps<{
		type?: BadgeVariants['type']
		class?: HTMLAttributes['class']
		rounded?: boolean
		closeable?: boolean
		size?: BadgeVariants['size']
	}>(),
	{
		rounded: false,
		closeable: false,
	}
)

/**
 * Emits events for the Badge component.
 * - `close`: Triggered when the close button is clicked.
 */
const emit = defineEmits<{
	(event: 'close', e?: Event): void
}>()

/** Controls the visibility of the badge. */
const visible = ref(true)

/**
 * Handles the close action for the badge.
 * Emits the `close` event and hides the badge.
 * @param event - The click event triggered by the close button.
 */
const onClose = (event: Event) => {
	emit('close', event)
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
					type: props.type,
					rounded: props.rounded,
					size: props.size,
				}),
				props.class
			)
		"
	>
		<!-- Slot for custom content -->
		<slot />
		<!-- Optional close icon -->
		<BadgeCloseIcon
			v-if="props.closeable"
			:type="props.type"
			:size="props.size"
			@click="onClose"
		/>
	</div>
</template>
