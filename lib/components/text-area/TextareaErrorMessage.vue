<template>
	<BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
		<div v-if="validation.required.$invalid">
			<slot name="required" />
		</div>

		<div v-else-if="validation.minlength.$invalid">
			<slot name="minlength" />
		</div>
		<div v-else-if="validation.$invalid">
			<slot name="errors" :validation="validation" />
		</div>
	</BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * Komponen untuk menampilkan pesan kesalahan validasi pada Textarea
 *
 */
import BaseInputErrorMessage from '../base-input-error-message'
import type { Validation } from '../../types/validation'

defineProps<{
	validation: Validation
}>()

/**
 *
 * @slots
 * @slot required - danger style jika field wajib diisi.
 * @slot minlength - danger style jika teks tidak mencapai panjang minimum.
 * @slot errors - Kesalahan lainnya yang dapat ditampilkan untuk validasi tambahan.
 *
 */
defineSlots<{
	required?: string
	minlength?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()
</script>
