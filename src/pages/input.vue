<template>
	<Input
		v-model="cyNumericFractionDigits"
		placeholder="Cypress Numeric max fraction digits"
		type="numeric"
		decimal
		:max-fraction-digits="2"
		data-cy="cypress-numeric-max-fraction-digits"
	/>
	<Input
		v-model="cyTextMaxLength"
		placeholder="Cypress Text max length"
		:max-length="10"
		data-cy="cypress-text-max-length"
	/>

	<PinInput v-model="pinInput" @complete="handleComplete" label="Pin Input" />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/input/Input.vue'
import PinInput from '@/components/pin-input/PinInput.vue'

const cyNumericFractionDigits = ref('')
const cyTextMaxLength = ref('')
const pinInput = ref()
function handleComplete(e: string[]) {
	// eslint-disable-next-line no-alert
	alert(e.join(''))
}
</script>
