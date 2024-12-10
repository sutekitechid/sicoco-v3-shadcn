<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.required?.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.maxSize?.$invalid">
			<slot name="maxSize" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * Component that handles the input validation error messages
 *
 * @props validation - The validation object
 *
 * @slot required - Slot for the required error message
 *
 * @example
 * <UploadErrorMessage :validation="validation">
 * 	<template #required>
 * 		This field is required
 * 	</template>
 * <template #errors>
 * 	Invalid file
 * </template>
 * </UploadErrorMessage>
 */
import BaseInputErrorMessage from '../base-input-error-message'

defineProps<{
	validation: any
}>()

const slots = defineSlots<{
	required?: string
}>()
</script>
