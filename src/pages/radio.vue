<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">States</h3>
			<div class="flex flex-wrap items-center gap-6">
				<RadioGroup v-model="defaultSelected">
					<RadioGroupItem value="default" data-cy="radio-default" data-testid="radio-default">
						Default (unchecked)
					</RadioGroupItem>
					<RadioGroupItem value="selected" data-cy="radio-selected" data-testid="radio-selected">
						Selected
					</RadioGroupItem>
					<RadioGroupItem value="disabled" disabled data-cy="radio-disabled" data-testid="radio-disabled">
						Disabled
					</RadioGroupItem>
				</RadioGroup>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants</h3>
			<div class="flex flex-wrap items-center gap-6">
				<RadioGroup v-model="variantSelected">
					<RadioGroupItem value="default" variant="default">Default</RadioGroupItem>
					<RadioGroupItem value="primary" variant="primary">Primary</RadioGroupItem>
					<RadioGroupItem value="success" variant="success">Success</RadioGroupItem>
					<RadioGroupItem value="warning" variant="warning">Warning</RadioGroupItem>
					<RadioGroupItem value="danger" variant="danger">Danger</RadioGroupItem>
				</RadioGroup>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Selected States</h3>
			<div class="flex flex-wrap items-center gap-6">
				<RadioGroup v-model="selectedDemo">
					<RadioGroupItem :value="{ id: 1 }" data-cy="radio-obj-selected" data-testid="radio-obj-selected">
						Object value (selected)
					</RadioGroupItem>
				</RadioGroup>
				<RadioGroup v-model="selectedDemo2">
					<RadioGroupItem value="a" data-cy="radio-string-selected" data-testid="radio-string-selected">
						String value (selected)
					</RadioGroupItem>
				</RadioGroup>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Disabled States</h3>
			<div class="flex flex-wrap items-center gap-6">
				<RadioGroup v-model="disabledDemo">
					<RadioGroupItem value="x" disabled>Disabled unchecked</RadioGroupItem>
				</RadioGroup>
				<RadioGroup v-model="disabledDemo2">
					<RadioGroupItem value="y" disabled>Disabled checked</RadioGroupItem>
				</RadioGroup>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Invalid (with SFormInput)</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Klik Submit tanpa memilih opsi untuk memunculkan state invalid.
			</p>
			<FormInput @submit="onValidSubmit">
				<RadioGroup
					v-model="invalidSelected"
					required
					data-cy="radio-group-invalid"
					data-testid="radio-group-invalid"
				>
					<RadioGroupItem
						value="option1"
						variant="primary"
						data-cy="radio-invalid"
						data-testid="radio-invalid"
					>
						Option 1
					</RadioGroupItem>
					<RadioGroupItem value="option2" variant="success">Option 2</RadioGroupItem>
					<RadioGroupItem value="option3" variant="danger">Option 3</RadioGroupItem>
					<template #required>
						<p class="text-danger-500 text-sm mt-1">Anda harus memilih salah satu opsi</p>
					</template>
				</RadioGroup>
				<Button type="submit" data-cy="radio-submit" data-testid="radio-submit">
					Submit
				</Button>
			</FormInput>
			<p
				v-if="lastSubmitResult"
				class="text-sm text-success-700 mt-2"
				data-cy="radio-submit-result"
				data-testid="radio-submit-result"
			>
				{{ lastSubmitResult }}
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import { RadioGroup, RadioGroupItem } from '@/components/radio'
import { FormInput } from '@/components/form-input'

const defaultSelected = ref<string | null>('selected')
const variantSelected = ref<string | null>('primary')
const selectedDemo = ref<{ id: number } | null>({ id: 1 })
const selectedDemo2 = ref<string | null>('a')
const disabledDemo = ref<string | null>(null)
const disabledDemo2 = ref<string | null>('y')
const invalidSelected = ref<string | null>(null)
const lastSubmitResult = ref('')

function onValidSubmit(valid: boolean) {
	lastSubmitResult.value = valid
		? `Form valid! Selected: ${invalidSelected.value}`
		: 'Form invalid, pilih salah satu opsi'
}
</script>
