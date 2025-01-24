<script setup lang="ts">
/**
 * 'Alert' is a UI component that displays a visual indicator of a message
 * or status, such as success, warning, error, or informational alerts.
 * It includes an optional icon and a close button to dismiss the alert.
 *
 * @example
 * <Alert variant="success">Operation successful!</Alert>
 */

import { ref, computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type AlertVariants, alertVariants, alertVariantsIcon } from '.'

/**
 * Props for the Alert component.
 *
 * @property {HTMLAttributes['class']} class - Additional CSS classes for custom styling.
 * @property {AlertVariants['variant']} variant - Defines the type of alert (e.g., 'success', 'warning').
 */
const props = defineProps<{
	class?: HTMLAttributes['class']
	variant?: AlertVariants['variant']
}>()

/**
 * State to control the visibility of the alert.
 * Initially set to `true` to show the alert.
 */
const visible = ref(true)

/**
 * Handles the close action for the alert.
 * This function hides the alert by setting `visible` to `false`.
 */
const onClose = () => {
	visible.value = false
}
</script>

<template>
	<div
		:class="cn(alertVariants({ variant: props.variant }), props.class)"
		role="alert"
		v-if="visible"
	>
		<div class="flex justify-between items-center w-full">
			<div class="flex gap-3 items-center">
				<i
					:class="
						cn(alertVariantsIcon({ variant: props.variant }), props.class)
					"
				/>
				<slot />
			</div>
			<i class="si-x cursor-pointer" @click="onClose" />
		</div>
	</div>
</template>
