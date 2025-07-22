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
		<div class="flex items-center">
			<Dropdown v-model="dropdown" placeholder="Select Max Value">
				<DropdownItem
					v-for="item in list"
					:key="item.value"
					:value="item.value"
				>
					<span>{{ item.label }}</span>
				</DropdownItem>
			</Dropdown>
			<Dropdown v-model="dropdownMin" placeholder="Select Min Value">
				<DropdownItem
					v-for="item in minList"
					:key="item.value"
					:value="item.value"
				>
					<span>{{ item.label }}</span>
				</DropdownItem>
			</Dropdown>
		</div>

		{{ `min: ${minValue} | max: ${maxValue}` }}
		<Input
			v-model="numberInput"
			placeholder="Input Number"
			type="number"
			:max="maxValue"
			:min="minValue"
		>
			<template #maxValue> Maximum value is {{ maxValue }} </template>
			<template #minValue> Minimum value is {{ minValue }} </template>
		</Input>

		<p>hint and validation message</p>
		<Input v-model="studentId" :exact-length="3" required>
			<template #required>
				<p>Harus diisi woy</p>
			</template>
			<template #exactLength>
				<p>Harus 3 karakter woi</p>
			</template>
			<template #hint>
				<p>Pokoknya harus 3 karakter</p>
			</template>
		</Input>

		validation message only
		<Input v-model="studentName" required>
			<template #required>
				<p>Harus diisi weee</p>
			</template>
		</Input>

		<Button type="submit">Submit</Button>
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
			:min="-10"
			required
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
	</FormInput>

	<Button @click="cyNumericRef.focus()" data-cy="focus-cypress-numeric">
		Focus Cypress Numeric
	</Button>

	<PinInput
		v-model="pinInput"
		:handle-complete="handleComplete"
		label="Pin Input"
		required
		placeholder="○"
	/>
	<Toaster position="bottom-right" />
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'
import Textarea from '@/components/text-area/Textarea.vue'
import FormInput from '@/components/form-input/FormInput.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import PinInput from '@/components/pin-input/PinInput.vue'
import { Toaster, useToast } from '@/components/toast'

const cyNumericFractionDigits = ref('')
const cyTextMaxLength = ref('')
const pinInput = ref()
const { toast } = useToast()
function handleComplete(e: string[]) {
	toast({
		title: 'Hello World',
		description: pinInput.value.join(''),
		variant: 'success',
		indefinite: true,
	})
}
const cyCurrency = ref('')
const cyNumeric = ref('')
const cyTextArea = ref(undefined)
const numberInput = ref('')
const dropdown = ref('')
const dropdownMin = ref('')
const list = [
	{ label: 'Max 1', value: 1 },
	{ label: 'Max 2', value: 2 },
	{ label: 'Max 3', value: 3 },
	{ label: 'Max 4', value: 4 },
	{ label: 'Max 5', value: 5 },
	{ label: 'Max 6', value: 6 },
	{ label: 'Max 7', value: 7 },
	{ label: 'Max 8', value: 8 },
	{ label: 'Max 9', value: 9 },
	{ label: 'Max 10', value: 10 },
]

const minList = [
	{ label: 'Min 1', value: 1 },
	{ label: 'Min 2', value: 2 },
	{ label: 'Min 3', value: 3 },
	{ label: 'Min 4', value: 4 },
	{ label: 'Min 5', value: 5 },
	{ label: 'Min 6', value: 6 },
	{ label: 'Min 7', value: 7 },
	{ label: 'Min 8', value: 8 },
	{ label: 'Min 9', value: 9 },
	{ label: 'Min 10', value: 10 },
]
const maxValue = computed(() => {
	return dropdown.value ? Number(dropdown.value) : 0
})

const minValue = computed(() => {
	return dropdownMin.value ? Number(dropdownMin.value) : 0
})

const cyNumericRef = ref<HTMLInputElement | null>(null)

watch([cyCurrency, cyNumeric, cyTextMaxLength, cyNumericFractionDigits], () => {
	console.log('cyCurrency', cyCurrency.value)
	console.log('cyNumeric', cyNumeric.value)
	console.log('cyTextMaxLength', cyTextMaxLength.value)
	console.log('cyNumericFractionDigits', cyNumericFractionDigits.value)
})

const studentId = ref('')
const studentName = ref('')

/**
 * ATTENTION: The following tests are commented out because they do not work in Cypress.
 * They are left here for your reference for manual testing.
 * Make sure to test them manually in the browser after you fix any bugs.
 */
// describe('Handle input copy paste on number typed', () => {
// 	it('[PASTE] Input field should trigger event prevent default if user input more than 1 dots', () => {
// 		let textToPaste = '1.2'
// 		const dataCy = '[data-cy="cypress-numeric-max-fraction-digits"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1.2')
// 		// remove input value
// 		cy.get(dataCy).clear()

// 		textToPaste = '1.2.3'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1.23')

// 		cy.get(dataCy).clear()

// 		textToPaste = '1.23.4'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1.23')

// 		cy.get(dataCy).clear()

// 		textToPaste = '1.234.5'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '1.23')
// 	})

// 	it('[PASTE] Input field should trigger event prevent default if user input more than 100', () => {
// 		let textToPaste = '100'
// 		const dataCy = '[data-cy="cypress-numeric-max-value"]'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '100')
// 		cy.get(dataCy).clear()

// 		textToPaste = '1001'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '100')

// 		cy.get(dataCy).clear()

// 		textToPaste = '100.1'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '100')

// 		cy.get(dataCy).clear()

// 		textToPaste = '101.1'
// 		checkHandleInputCopyPaste(dataCy, textToPaste, '100')
// 	})
// })
</script>
