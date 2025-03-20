<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { Input } from '../input'
import { defineEmits, defineProps, type HTMLAttributes } from 'vue'
import { debounceInput } from '@/utils/input'
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
const handleInput = (value: InputEvent): void => {
	if (!value) {
		return
	}
	emits('input', Number(value))
}

/** Debounced input event handler */
const onInput = debounceInput(handleInput)

const onKeypress = (event: KeyboardEvent) => {
	// Prevent user from typing if input is higher than total pages
	if (Number(props.modelValue) * 10 + Number(event.key) > props.totalPages) {
		event.preventDefault()
	}
}
</script>

<template>
	<Input
		v-model="computedModelValue"
		type="numeric"
		class="w-20 bg-transparent pagination__input"
		:class="props.class"
		:disabled="props.disabled"
		:min="1"
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
