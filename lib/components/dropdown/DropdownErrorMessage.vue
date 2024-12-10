<template>
	<BaseInputErrorMessage
		:invalid="validation.$invalid"
		class="text-sm cursor-text"
	>
		<div v-if="validation.required?.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * This component acts as a wrapper around error messages and integrates with a validation object.
 * It provides slots for customizing error messages for required fields and other validation errors.
 *
 * @component
 *
 * @template
 * ```vue
 * <template #errors="{ validation }">
 *   <DropdownErrorMessage :validation="validation">
 *     <template #required>
 *       <slot name="required" :validation="validation" />
 *     </template>
 *     <template #errors>
 *       <slot name="errors" :validation="validation" />
 *     </template>
 *   </DropdownErrorMessage>
 * </template>
 * ```
 *
 * @props
 * @property {any} validation - A validation object (e.g., from Vuelidate or other validation library)
 * that contains `$invalid` and `required?.$invalid` properties.
 *
 * @slots
 * @slot required - Content to display when the `required` validation rule is invalid.
 * @slot errors - Content to display for other validation errors when `$invalid` is `true`.
 *
 * @example
 * ```vue
 * <template #errors="{ validation }">
 *   <DropdownErrorMessage :validation="validation">
 *     <template #required>
 *       <div>This dropdown is required!</div>
 *     </template>
 *     <template #errors>
 *       <div>Please select a valid option!</div>
 *     </template>
 *   </DropdownErrorMessage>
 * </template>
 * ```
 */
import BaseInputErrorMessage from '../base-input-error-message'

defineProps<{
	validation: any
}>()
</script>
