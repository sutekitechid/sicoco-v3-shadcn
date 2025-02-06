<script setup lang="ts">
/**
 * TextArea Component with built-in validation.
 *
 * @module Textarea
 *
 * @example
 * <Textarea
 *   v-model="inputValue"
 *   id="example-textarea"
 *   placeholder="Masukkan teks di sini"
 *   :required="true"
 *   :minlength="5"
 *   :rows="4"
 *   :cols="50"
 * >
 *   <template #required>Field ini wajib diisi</template>
 *   <template #minlength>Minimal 5 karakter</template>
 * </Textarea>
 */
import type { HTMLAttributes } from 'vue'
import { ref, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { requiredIf, minLength } from '@vuelidate/validators'
import { textAreaVariants } from '.'
import { cn } from '../../utils/tw-merge'
import BaseInput from '../base-input'
import isEmpty from 'lodash/isEmpty'
import TextareaErrorMessage from './TextareaErrorMessage.vue'

/**
 * Props yang diterima oleh komponen TextArea
 *
 * @property {string | number} [modelValue] - Nilai teks saat ini dalam textarea.
 * @property {string} [id] - ID unik untuk elemen textarea.
 * @property {string} [class] - Kelas CSS khusus untuk elemen root.
 * @property {string} [placeholder] - Teks placeholder yang ditampilkan saat teks kosong.
 * @property {boolean} [disabled] - Status untuk menonaktifkan textarea.
 * @property {boolean} [required] - Menentukan apakah teks wajib diisi.
 * @property {number} [minlength] - Panjang minimum teks yang diizinkan.
 * @property {Record<string, any>} [customValidators] - Validasi kustom untuk textarea.
 * @property {number} [maxlength] - Panjang maksimum teks yang diizinkan.
 */

const props = defineProps<{
	modelValue?: string
	class?: HTMLAttributes['class']
	id?: string
	placeholder?: string
	disabled?: boolean
	required?: boolean
	minlength?: number
	rows?: number
	cols?: number
	customValidators?: Record<string, any>
	maxlength?: number
}>()

/**
 * Emit event yang didukung oleh komponen TextArea.
 *
 * @emits
 * @event update:modelValue - Emit saat modelValue diperbarui.
 * @param {string | number} payload - Nilai baru untuk modelValue.
 * @event focus - Emit saat textarea menerima fokus.
 * @event blur - Emit saat textarea kehilangan fokus.
 * @event input - Emit saat ada perubahan input.
 * @param {InputEvent} payload - Objek event input.
 *
 */

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
	(e: 'focus'): void
	(e: 'blur'): void
	(e: 'input', payload: InputEvent): void
}>()

/**
 * Referensi DOM untuk elemen textarea.
 *
 * @type {Ref<HTMLTextAreaElement | null>}
 *
 */
const textAreaRef = ref<HTMLTextAreaElement | null>(null)

/**
 * Binding dua arah untuk modelValue menggunakan useVModel.
 *
 * @type {Ref<string | number>}
 *
 */
const modelValue = useVModel(props, 'modelValue', emits)

/**
 * Aturan validasi untuk textarea.
 *
 * @returns {ComputedRef<Record<string, any>>} - Aturan validasi yang digunakan oleh VueVlidate.
 */
const rules = computed(() => {
	const rules: Record<string, any> = {
		modelValue: {
			...props.customValidators,
		},
	}
	if (props.required) {
		rules.modelValue.required = requiredIf(() => props.required)
	}

	if (props.minlength !== undefined) {
		rules.modelValue.minlength = minLength(props.minlength)
	}

	return rules
})

/**
 * Menentukan apakah validasi harus diaktifkan.
 *
 * @returns {ComputedRef<boolean>} - True jika validasi diaktifkan, false jika dinonaktifkan.
 *
 */
const useValidation = computed(() => {
	return !isEmpty(rules.value.modelValue)
})
</script>

<template>
	<BaseInput
		:model-value="modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => textAreaRef.focus()"
	>
		<template #default="{ validate }">
			<div class="relative" :class="props.class">
				<textarea
					ref="textAreaRef"
					:value="modelValue"
					:id="id"
					:class="[cn(textAreaVariants({ disabled }))]"
					:placeholder="placeholder"
					:disabled="disabled"
					@blur="validate"
					@input="
						$emit(
							'update:modelValue',
							($event.target as HTMLTextAreaElement).value
						)
					"
					:rows="rows"
					:cols="cols"
					:maxlength="props.maxlength"
				/>
				<div v-if="props.maxlength" class="w-full text-right text-sm">
					{{ modelValue.length }}/{{ props.maxlength }}
				</div>
			</div>
		</template>

		<template #errors="{ validation }">
			<TextareaErrorMessage :validation="validation">
				<template #required>
					<slot name="required" />
				</template>
				<template #minlength>
					<slot name="minlength" />
				</template>
			</TextareaErrorMessage>
		</template>
	</BaseInput>
</template>

<style scoped>
.input__has-error textarea {
	@apply border-danger-100/60 focus-visible:ring-4 focus-visible:ring-danger-50/40 focus-visible:border-1;
}
</style>
