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
	<Input
		v-model="cyNumberInput"
		placeholder="Cypress Number Input"
		:max="100"
		:min="0"
		data-cy="cypress-text-number-input"
		class="my-5"
		type="numeric"
		decimal
		max-fraction-digits="2"
	>
		<template #maxValue> Max Value: 100 </template>
	</Input>

	<Button @click="submit">Submit</Button>
	{{ render }}
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'

const cyNumericFractionDigits = ref('')
const cyTextMaxLength = ref('')
const cyNumberInput = ref(82.9)
const render = ref()

function submit() {
	render.value = cyNumberInput.value
}
</script>
