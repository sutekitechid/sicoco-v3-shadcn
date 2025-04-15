<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.maxlength.$invalid">
			<slot name="maxlength" />
		</div>
		<div v-else-if="validation.required.$invalid">
			<slot name="required" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
import BaseInputErrorMessage from '../base-input-error-message'

defineProps<{
	validation: any
}>()

const slots = defineSlots<{
	maxlength?: string
	required?: string
	errors?: string
}>()
</script>
