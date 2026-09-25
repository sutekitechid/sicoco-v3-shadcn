<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-1">Basic Usage</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan textarea tanpa binding untuk input sederhana atau dengan
				<code>v-model</code> untuk input terkontrol.
			</p>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					id="textarea-basic"
					placeholder="Tulis sesuatu di sini..."
					:rows="4"
					data-cy="textarea-basic"
				/>
				<Textarea
					id="textarea-controlled"
					v-model="controlledValue"
					placeholder="Controlled textarea"
					:rows="4"
					data-cy="textarea-controlled"
				/>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">Sizing</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Atur tinggi awal textarea menggunakan prop <code>rows</code>.
			</p>
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
			<h3 class="font-semibold text-lg mb-1">Hint & Character Counter</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan slot <code>#hint</code> untuk instruksi tambahan dan prop
				<code>maxlength</code> untuk membatasi panjang input.
			</p>
			<div class="flex flex-col gap-3 max-w-md">
				<Textarea
					v-model="maxLengthValue"
					placeholder="Maks 100 karakter..."
					:rows="4"
					:maxlength="100"
					data-cy="textarea-maxlength"
				/>
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
			<h3 class="font-semibold text-lg mb-1">States</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan <code>disabled</code> untuk menonaktifkan input atau
				<code>readonly</code> untuk menampilkan nilai yang tidak dapat diedit.
			</p>
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
			<h3 class="font-semibold text-lg mb-1">Field Integration</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gabungkan dengan <code>Field</code> untuk label, deskripsi, dan status
				wajib pada form.
			</p>
			<div class="flex flex-col gap-4 max-w-md">
				<Field
					label="Deskripsi"
					description="Ceritakan produk Anda secara singkat."
					required
					for="textarea-field-basic"
				>
					<Textarea
						id="textarea-field-basic"
						v-model="fieldValue"
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
						id="textarea-field-counter"
						v-model="fieldCounterValue"
						placeholder="Tambahkan catatan..."
						:rows="3"
						:maxlength="200"
						data-cy="textarea-field-counter"
					/>
				</Field>

				<Field for="textarea-field-disabled">
					<template #label>
						<span class="block text-label-lg font-medium text-main">
							Diskusi (Read-only)
						</span>
					</template>
					<template #description>
						<span class="block text-label-md text-neutral-700">
							Field ini hanya bisa dibaca.
						</span>
					</template>
					<Textarea
						id="textarea-field-disabled"
						v-model="fieldDisabledValue"
						:rows="3"
						readonly
						data-cy="textarea-field-disabled"
					/>
				</Field>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">Validation</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan <code>required</code> dan <code>minlength</code> bersama
				<code>FormInput</code>. Klik Submit tanpa mengisi atau dengan teks
				kurang dari 10 karakter untuk melihat pesan validasi.
			</p>
			<FormInput @submit="onValidSubmit">
				<Textarea
					id="textarea-validation"
					v-model="validationValue"
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

const controlledValue = ref('')
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
