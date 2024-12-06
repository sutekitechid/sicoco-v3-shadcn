<template>
	<BaseInputErrorMessage
		:invalid="validation.$invalid"
		class="text-sm cursor-text"
	>
		<div v-if="validation.required?.$invalid">Wajib diisi</div>
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
	required?: string
}>()
</script>
