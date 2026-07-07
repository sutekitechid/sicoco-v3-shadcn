<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">States</h3>
			<div class="flex flex-wrap items-center gap-6">
				<Checkbox data-cy="checkbox-default" data-testid="checkbox-default">
					Default (unchecked)
				</Checkbox>
				<Checkbox
					v-model="selected"
					value="option1"
					data-cy="checkbox-selected"
					data-testid="checkbox-selected"
				>
					Selected
				</Checkbox>
				<Checkbox
					:model-value="true"
					disabled
					data-cy="checkbox-disabled"
					data-testid="checkbox-disabled"
				>
					Disabled (checked)
				</Checkbox>
				<Checkbox
					disabled
					data-cy="checkbox-disabled-unchecked"
					data-testid="checkbox-disabled-unchecked"
				>
					Disabled (unchecked)
				</Checkbox>
				<Checkbox
					:model-value="true"
					indeterminate
					data-cy="checkbox-indeterminate"
					data-testid="checkbox-indeterminate"
				>
					Indeterminate
				</Checkbox>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Sizes</h3>
			<div class="flex flex-wrap items-center gap-6">
				<Checkbox size="sm" :model-value="true">Small</Checkbox>
				<Checkbox size="md" :model-value="true">Medium</Checkbox>
				<Checkbox size="lg" :model-value="true">Large</Checkbox>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Variants</h3>
			<div class="flex flex-wrap items-center gap-6">
				<Checkbox variant="default" :model-value="true">Default</Checkbox>
				<Checkbox variant="primary" :model-value="true">Primary</Checkbox>
				<Checkbox variant="success" :model-value="true">Success</Checkbox>
				<Checkbox variant="warning" :model-value="true">Warning</Checkbox>
				<Checkbox variant="danger" :model-value="true">Danger</Checkbox>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Invalid (with SFormInput)</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Klik Submit untuk memunculkan state invalid. Field harus dicentang
				terlebih dahulu untuk dianggap valid.
			</p>
			<FormInput @submit="onValidSubmit">
				<CheckboxGroup
					:value="invalidOptions"
					required
					data-cy="checkbox-group-invalid"
					data-testid="checkbox-group-invalid"
				>
					<div class="flex flex-col gap-2">
						<Checkbox
							v-model="invalidOptions"
							value="agree"
							variant="primary"
							data-cy="checkbox-invalid"
							data-testid="checkbox-invalid"
						>
							Saya menyetujui syarat dan ketentuan
						</Checkbox>
						<Checkbox
							v-model="invalidOptions"
							value="subscribe"
							variant="success"
							data-cy="checkbox-invalid-2"
							data-testid="checkbox-invalid-2"
						>
							Berlangganan newsletter
						</Checkbox>
					</div>
					<template #required>
						<p class="text-danger-500 text-sm mt-1">
							Anda harus menyetujui syarat dan ketentuan
						</p>
					</template>
				</CheckboxGroup>
				<Button type="submit" data-cy="checkbox-submit" data-testid="checkbox-submit">
					Submit
				</Button>
			</FormInput>
			<p
				v-if="lastSubmitResult"
				class="text-sm text-success-700 mt-2"
				data-cy="checkbox-submit-result"
				data-testid="checkbox-submit-result"
			>
				{{ lastSubmitResult }}
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import Checkbox from '@/components/checkbox/Checkbox.vue'
import { CheckboxGroup } from '@/components/checkbox'
import { FormInput } from '@/components/form-input'

const selected = ref(true)
const invalidOptions = ref<string[]>([])
const lastSubmitResult = ref('')

function onValidSubmit(valid: boolean) {
	lastSubmitResult.value = valid
		? `Form valid! Selected: ${invalidOptions.value.join(', ')}`
		: 'Form invalid, cek field yang ditandai merah'
}
</script>
