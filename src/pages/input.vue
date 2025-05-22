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
		v-model="cyNumericFractionDigitsMinZero"
		type="number"
		decimal
		max-fraction-digits="2"
		class="w-[6.1rem]"
		:max="100"
		:min="0"
	></Input>
	<Input
		v-model="cyNumericFractionDigitsMinZero2"
		type="number"
		decimal
		max-fraction-digits="2"
		class="w-[6.1rem]"
		:max="100"
		:min="0"
	></Input>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/input/Input.vue'

const cyNumericFractionDigits = ref('')
const cyTextMaxLength = ref('')

const cyNumericFractionDigitsMinZero = ref('')
const cyNumericFractionDigitsMinZero2 = ref('')
</script>
