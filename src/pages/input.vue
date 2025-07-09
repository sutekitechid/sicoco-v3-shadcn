<template>
	<FormInput>
		<Textarea
			v-model="cyTextArea"
			id="cypress-textarea"
			placeholder="Cypress Textarea"
			:rows="4"
			:cols="50"
			:maxlength="10"
		/>

		<Button type="submit">Submit</Button>
	</FormInput>

	<Input
		v-model="cyNumericFractionDigits"
		placeholder="Cypress Numeric max fraction digits"
		type="number"
		:max-fraction-digits="2"
		data-cy="cypress-numeric-max-fraction-digits"
	/>
	<Input
		v-model="cyNumericFractionDigits"
		placeholder="Cypress Numeric max value"
		type="number"
		:max-fraction-digits="2"
		:max="100"
		:min="10"
		data-cy="cypress-numeric-max-value"
	/>
	<Input
		v-model="cyTextMaxLength"
		placeholder="Cypress Text max length"
		:max-length="10"
		data-cy="cypress-text-max-length"
	/>
	<Input
		v-model="cyCurrency"
		placeholder="Cypress Currency"
		type="currency"
		:max="1000000"
		data-cy="cypress-currency"
	/>
	<Input
		v-model="cyNumeric"
		placeholder="Cypress Numeric"
		type="numeric"
		data-cy="cypress-numeric"
		ref="cyNumericRef"
		:max-length="10"
	/>
	<Button @click="cyNumericRef.focus()" data-cy="focus-cypress-numeric">
		Focus Cypress Numeric
	</Button>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'
import Textarea from '@/components/text-area/Textarea.vue'
import FormInput from '@/components/form-input/FormInput.vue'

const cyNumericFractionDigits = ref(98)
const cyTextMaxLength = ref('')
const cyCurrency = ref('')
const cyNumeric = ref('')
const cyTextArea = ref(undefined)

const cyNumericRef = ref<HTMLInputElement | null>(null)

watch([cyCurrency, cyNumeric, cyTextMaxLength, cyNumericFractionDigits], () => {
	console.log('cyCurrency', cyCurrency.value)
	console.log('cyNumeric', cyNumeric.value)
	console.log('cyTextMaxLength', cyTextMaxLength.value)
	console.log('cyNumericFractionDigits', cyNumericFractionDigits.value)
})
</script>
