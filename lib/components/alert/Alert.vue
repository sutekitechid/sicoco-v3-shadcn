<script setup lang="ts">
/**
 * 'Alert' is a UI component that displays a visual indicator of a message
 * or status, such as success, warning, error, or informational alerts.
 * It includes an optional icon and a close button to dismiss the alert.
 *
 * @example
 * <Alert variant="success" :closable="false">Operation successful!</Alert>
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
const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		variant?: AlertVariants['variant']
		closable?: boolean
		bordered?: boolean
		outlined?: boolean
	}>(),
	{
		variant: 'success',
		closable: true,
	}
)

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
		:class="cn(alertVariants({ variant, outlined, bordered }), props.class)"
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
			<i v-if="closable" class="si-x cursor-pointer" @click="onClose" />
		</div>
	</div>
</template>
