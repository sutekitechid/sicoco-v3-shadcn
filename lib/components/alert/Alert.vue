<script setup lang="ts">
/**
 * 'Alert' is a UI component that displays a visual indicator of a message
 * or status, such as success, warning, error, or informational alerts.
 * It includes an optional icon and a close button to dismiss the alert.
 *
 * @example
 * <Alert variant="success" :closable="false">Operation successful!</Alert>
 */

import { ref, type HTMLAttributes } from 'vue'
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
		hasIcon?: boolean
	}>(),
	{
		variant: 'success',
		closable: true,
		hasIcon: true,
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
		v-if="visible"
		:class="cn(alertVariants({ variant, outlined, bordered }), props.class)"
		role="alert"
	>
		<div class="flex justify-between items-center w-full">
			<div class="flex gap-3 items-start justify-start w-full">
				<i
					v-if="hasIcon"
					:class="
						cn(alertVariantsIcon({ variant: props.variant }), props.class)
					"
				/>
				<span class="my-auto w-full">
					<slot />
				</span>
			</div>
			<i v-if="closable" class="si-heroicon-solid-x-mark cursor-pointer mb-auto" @click="onClose" />
		</div>
	</div>
</template>
