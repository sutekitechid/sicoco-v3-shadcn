<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.maxlength && validation.maxlength.$invalid">
			<slot name="maxlength" />
		</div>
		<div v-else-if="validation.required.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" :validation="validation" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
import BaseInputErrorMessage from '../base-input-error-message'
import type { Validation } from '../../types/validation'

defineProps<{
	validation: Validation
}>()

defineSlots<{
	maxlength?: string
	required?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()
</script>
