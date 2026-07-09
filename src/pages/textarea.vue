<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Basic</h3>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					id="textarea-basic"
					placeholder="Tulis sesuatu di sini..."
					:rows="4"
					data-cy="textarea-basic"
				/>
				<Textarea
					v-model="basicValue"
					id="textarea-controlled"
					placeholder="Controlled textarea"
					:rows="4"
					data-cy="textarea-controlled"
				/>
				<p class="text-sm text-neutral-600">
					Live value:
					<span class="font-mono">{{ basicValue || '(kosong)' }}</span>
				</p>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Sizes (rows)</h3>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					v-model="smallSize"
					placeholder="Small (rows=2)"
					:rows="2"
					data-cy="textarea-size-sm"
				/>
				<Textarea
					v-model="mediumSize"
					placeholder="Medium (rows=4)"
					:rows="4"
					data-cy="textarea-size-md"
				/>
				<Textarea
					v-model="largeSize"
					placeholder="Large (rows=8)"
					:rows="8"
					data-cy="textarea-size-lg"
				/>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">With Character Counter</h3>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					v-model="maxLengthValue"
					placeholder="Maks 100 karakter..."
					:rows="4"
					:maxlength="100"
					data-cy="textarea-maxlength"
				/>
				<p class="text-sm text-neutral-600">
					Counter otomatis muncul di pojok kanan saat
					<code>maxlength</code> diisi.
				</p>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">With Hint</h3>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					v-model="hintValue"
					placeholder="Ceritakan pengalamanmu..."
					:rows="4"
					data-cy="textarea-hint"
				>
					<template #hint>
						Minimal 20 karakter, maksimal 500 karakter.
					</template>
				</Textarea>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Disabled</h3>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					v-model="disabledValue"
					placeholder="Disabled textarea"
					:rows="4"
					disabled
					data-cy="textarea-disabled"
				/>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">With Field</h3>
			<div class="flex flex-col gap-4 max-w-md">
				<Field
					label="Deskripsi"
					description="Ceritakan produk Anda secara singkat."
					required
					for="textarea-field-basic"
				>
					<Textarea
						v-model="fieldValue"
						id="textarea-field-basic"
						placeholder="Tulis deskripsi produk..."
						:rows="3"
						required
						data-cy="textarea-field-basic"
					/>
				</Field>

				<Field
					label="Catatan"
					description="Maksimal 200 karakter."
					for="textarea-field-counter"
				>
					<Textarea
						v-model="fieldCounterValue"
						id="textarea-field-counter"
						placeholder="Tambahkan catatan..."
						:rows="3"
						:maxlength="200"
						data-cy="textarea-field-counter"
					/>
				</Field>

				<Field for="textarea-field-disabled">
					<template #label>
						<span class="block text-label-lg font-medium text-neutral-950">
							Diskusi (Read-only)
						</span>
					</template>
					<template #description>
						<span class="block text-label-md text-neutral-700">
							Field ini hanya bisa dibaca.
						</span>
					</template>
					<Textarea
						v-model="fieldDisabledValue"
						id="textarea-field-disabled"
						:rows="3"
						readonly
						data-cy="textarea-field-disabled"
					/>
				</Field>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Validation (with FormInput)</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Klik Submit tanpa mengisi atau dengan teks &lt; 10 karakter untuk
				memunculkan state invalid.
			</p>
			<FormInput @submit="onValidSubmit">
				<Textarea
					v-model="validationValue"
					id="textarea-validation"
					placeholder="Tulis minimal 10 karakter..."
					:rows="4"
					required
					:minlength="10"
					data-cy="textarea-validation"
				>
					<template #required>
						Field ini wajib diisi
					</template>
					<template #minlength>
						Minimal 10 karakter
					</template>
				</Textarea>
				<Button
					type="submit"
					data-cy="textarea-submit"
					data-testid="textarea-submit"
				>
					Submit
				</Button>
			</FormInput>
			<p
				v-if="lastSubmitResult"
				class="text-sm text-success-700 mt-2"
				data-cy="textarea-submit-result"
				data-testid="textarea-submit-result"
			>
				{{ lastSubmitResult }}
			</p>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import Textarea from '@/components/text-area/Textarea.vue'
import Field from '@/components/field/Field.vue'
import { FormInput } from '@/components/form-input'

const basicValue = ref('')
const smallSize = ref('')
const mediumSize = ref('')
const largeSize = ref('')
const maxLengthValue = ref('')
const hintValue = ref('')
const disabledValue = ref('Ini tidak bisa diedit karena disabled.')
const fieldValue = ref('')
const fieldCounterValue = ref('')
const fieldDisabledValue = ref('Field ini read-only karena atribut readonly.')
const validationValue = ref('')
const lastSubmitResult = ref('')

function onValidSubmit(valid: boolean) {
	lastSubmitResult.value = valid
		? `Form valid! Isi: "${validationValue.value}"`
		: 'Form invalid, perbaiki field di atas'
}
</script>
