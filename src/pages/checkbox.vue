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
			<h3 class="font-semibold text-lg mb-3">Select All</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Pola umum untuk memilih atau mengosongkan banyak item sekaligus.
				Centang "Select All" untuk mencentang semua; status indeterminate
				ditampilkan ketika hanya sebagian item yang dipilih.
			</p>
			<div class="flex flex-col gap-2 max-w-sm">
				<Checkbox
					:model-value="selectAllChecked"
					:indeterminate="selectAllIndeterminate"
					variant="primary"
					@update:model-value="toggleSelectAll"
					data-cy="checkbox-select-all"
					data-testid="checkbox-select-all"
				>
					Select All
				</Checkbox>
				<div class="ml-6 flex flex-col gap-2 border-l border-neutral-200 pl-4">
					<Checkbox
						v-for="item in selectableItems"
						:key="item.value"
						:model-value="selectAllSelected.includes(item.value)"
						@update:model-value="toggleItem(item.value)"
						:data-cy="`checkbox-select-all-${item.value}`"
						:data-testid="`checkbox-select-all-${item.value}`"
					>
						{{ item.label }}
					</Checkbox>
				</div>
				<p
					class="text-xs text-neutral-500 mt-2"
					data-cy="checkbox-select-all-summary"
					data-testid="checkbox-select-all-summary"
				>
					{{ selectAllSelected.length }} of {{ selectableItems.length }} selected
				</p>
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
						Anda harus menyetujui syarat dan ketentuan
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
import { computed, ref } from 'vue'
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

const selectableItems = [
	{ value: 'apple', label: 'Apple' },
	{ value: 'banana', label: 'Banana' },
	{ value: 'cherry', label: 'Cherry' },
	{ value: 'durian', label: 'Durian' },
]

const selectAllSelected = ref<string[]>(['apple'])

const selectAllChecked = computed(
	() => selectAllSelected.value.length === selectableItems.length
)
const selectAllIndeterminate = computed(
	() =>
		selectAllSelected.value.length > 0 &&
		selectAllSelected.value.length < selectableItems.length
)

function toggleSelectAll(checked: boolean | string | number | object | unknown[] | null) {
	if (checked) {
		selectAllSelected.value = selectableItems.map(item => item.value)
	} else {
		selectAllSelected.value = []
	}
}

function toggleItem(value: string) {
	const current = selectAllSelected.value
	if (current.includes(value)) {
		selectAllSelected.value = current.filter(v => v !== value)
	} else {
		selectAllSelected.value = [...current, value]
	}
}
</script>
