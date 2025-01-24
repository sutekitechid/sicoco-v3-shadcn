<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { Input } from '../input'
import { defineEmits, defineProps, type HTMLAttributes } from 'vue'

/**
 * Props for the PaginationForwardInput component
 * - `class`: Additional CSS classes
 * - `disabled`: Whether the input is disabled
 * - `modelValue`: Current value of the model
 * @default disabled: false
 * @default modelValue: 1
 *
 * @example
 * ```vue
 * <template>
 *  <PaginationForwardInput v-model="page" @input="onInput" />
 * </template>
 * ```
 */
const props = defineProps<{
	class?: HTMLAttributes['class']
	disabled?: boolean
	modelValue?: number | string
	totalPages?: number
}>()

/** Emits events for the PaginationForwardInput component */
const emits = defineEmits(['input', 'update:modelValue'])

/** Computed property for modelValue that returns the current value of the model */
const computedModelValue = useVModel(props, 'modelValue', emits)

/**
 * Handles the input event for the input field
 * Emits the `input` event with the current value of the input
 * @param value - The input event
 */
function onInput(value: InputEvent): void {
	if (!value) {
		return
	}
	emits('input', value)
}

const onKeypress = (event: KeyboardEvent) => {
	// prevent user to type if input higher than total pages
	if (Number(props.modelValue) * 10 + Number(event.key) > props.totalPages) {
		event.preventDefault()
	}
}
</script>

<template>
	<Input
		v-model="computedModelValue"
		:class="props.class"
		class="w-20 bg-transparent pagination__input"
		:disabled="props.disabled"
		type="number"
		@input="onInput"
		@keypress="onKeypress"
	/>
</template>

<style lang="css">
/* Chrome, Safari, Edge, Opera */
input.pagination__input::-webkit-outer-spin-button,
input.pagination__input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type='number'].pagination__input {
	-moz-appearance: textfield;
}
</style>
