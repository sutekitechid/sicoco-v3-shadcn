<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.required?.$invalid">
			<slot name="required" />
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
			<slot name="errors" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * Component that handles the input validation error messages
 */
import BaseInputErrorMessage from '../base-input-error-message'

defineProps<{
	validation: any
	min?: number
	max?: number
	exactLength?: number
}>()

const slots = defineSlots<{
	required?: string
	minValue?: string
	maxValue?: string
	exactLength?: string
	email?: string
}>()
</script>
