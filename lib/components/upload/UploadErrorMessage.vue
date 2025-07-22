<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.required?.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.maxSize?.$invalid">
			<slot name="maxSize" />
		</div>
		<div v-else-if="validation.fileType?.$invalid">
			<slot name="fileType" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" :validation="validation" />
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
import type { Validation } from '../../types/validation'

defineProps<{
	validation: Validation
}>()

defineSlots<{
	required?: string
	maxSize?: string
	fileType?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()
</script>
