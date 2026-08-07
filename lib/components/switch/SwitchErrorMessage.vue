<template>
	<BaseInputErrorMessage :invalid="validation.$invalid">
		<div v-if="validation.required?.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" :validation="validation" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * Component that handles the input validation error messages
 */
import BaseInputErrorMessage from '../base-input-error-message'
import type { Validation } from '../../types/validation'

defineProps<{
	validation: Validation
}>()

defineSlots<{
	required?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()
</script>
