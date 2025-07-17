<template>
	<FormInput>
		<!-- <Textarea
			v-model="cyTextArea"
			id="cypress-textarea"
			placeholder="Cypress Textarea"
			:rows="4"
			:cols="50"
			:maxlength="10"
		/> -->
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
import { ref, computed, watch } from 'vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'
import Textarea from '@/components/text-area/Textarea.vue'
import FormInput from '@/components/form-input/FormInput.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'

const cyNumericFractionDigits = ref('')
const cyTextMaxLength = ref('')
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
</script>
