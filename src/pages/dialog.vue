<template>
	<Button
		type="button"
		@click="isActive = true"
	>
		Open Dialog
	</Button>
	<Dialog :open="isActive">
		<DialogContent class="w-1/2">
			<h2>Dialog Title</h2>
			<p>This is the content of the dialog.</p>

			<div class="space-y-4">
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
					:min="0"
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
					:min="0"
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
					:min="0"
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
				<Button
					type="button"
					@click="isActive = false"
					>Close Dialog</Button
				>
			</div>
		</DialogContent>
	</Dialog>

	<div class="w-1/2 mt-8">
		<Input
			v-model="password"
			type="password"
			name="password"
			placeholder="The icon eye is anomaly"
		/>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import Dialog from '@/components/dialog/Dialog.vue'
import DialogContent from '@/components/dialog/DialogContent.vue'
import Input from '@/components/input/Input.vue'

const isActive = ref(false)
const cyNumericFractionDigits = ref('')
const cyTextMaxLength = ref('')
const cyCurrency = ref('')
const cyNumeric = ref('')

const cyNumericRef = ref<HTMLInputElement | null>(null)

const password = ref('')
</script>
