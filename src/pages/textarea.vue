<template>
	<div class="flex flex-col gap-4 p-4">
		<section>
			<Field
				label="Basic Usage"
				description="Gunakan textarea tanpa binding untuk input sederhana atau dengan v-model untuk input terkontrol."
			>
				<div class="flex flex-col gap-10 max-w-md">
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
			</Field>
		</section>

		<section>
			<Field
				label="Sizing"
				description="Atur tinggi awal textarea menggunakan prop rows."
			>
				<div class="flex flex-col gap-10 max-w-md">
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
			</Field>
		</section>

		<section class="mb-10">
			<Field
				label="Hint & Character Counter"
				description="Gunakan slot #hint untuk instruksi tambahan dan prop maxlength untuk membatasi panjang input."
			>
				<div class="flex flex-col gap-10 max-w-md">
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
			</Field>
		</section>

		<section>
			<Field
				label="States"
				description="Gunakan disabled untuk menonaktifkan input atau readonly untuk menampilkan nilai yang tidak dapat diedit."
			>
				<div class="flex flex-col gap-10 max-w-md">
					<Textarea
						v-model="disabledValue"
						placeholder="Disabled textarea"
						:rows="4"
						disabled
						data-cy="textarea-disabled"
					/>
				</div>
			</Field>
		</section>

		<section>
			<Field
				label="Field Integration"
				description="Gabungkan dengan Field untuk label, deskripsi, dan status wajib pada form."
			>
				<div class="flex flex-col gap-10 max-w-md">
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
						>
							<template #required> Wajib di isi bang </template>
						</Textarea>
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
			</Field>
		</section>

		<section>
			<Field
				label="Validation"
				description="Gunakan required dan minlength bersama FormInput. Klik Submit tanpa mengisi atau dengan teks kurang dari 10 karakter untuk melihat pesan validasi."
			>
				<div class="flex flex-col gap-10 max-w-md">
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
							<template #required> Field ini wajib diisi </template>
							<template #minlength> Minimal 10 karakter </template>
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
						class="text-sm text-success-700"
						data-cy="textarea-submit-result"
						data-testid="textarea-submit-result"
					>
						{{ lastSubmitResult }}
					</p>
				</div>
			</Field>
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
