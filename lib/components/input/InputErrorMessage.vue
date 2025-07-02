<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.required?.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.minLength?.$invalid">
			<slot name="minLength" />
		</div>
		<div v-else-if="validation.minValue?.$invalid">
			<slot name="minValue" />
		</div>
		<div v-else-if="validation.maxValue?.$invalid">
			<slot name="maxValue" />
		</div>
		<div v-else-if="validation.exactLength?.$invalid">
			<slot name="exactLength" />
		</div>
		<div v-else-if="validation.email?.$invalid">
			<slot name="email" />
		</div>
		<div v-else-if="validation.url?.$invalid">
			<slot name="url" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" v-bind="{ validation }" />
		</div>
		<div v-else-if="validation.maxFractionDigits.$invalid">
			<slot name="maxFractionDigits" />
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
	minLength?: string
	maxLength?: string
	minValue?: string
	maxValue?: string
	exactLength?: string
	email?: string
	url?: string
	maxFractionDigits?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()
</script>
