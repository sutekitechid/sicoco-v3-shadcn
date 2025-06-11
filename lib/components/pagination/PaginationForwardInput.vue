<script setup lang="ts">
import { Input } from '../input'
import { defineEmits, defineProps, ref, type HTMLAttributes, watch } from 'vue'
import { debounceInput } from '../../utils/input'
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
	dataCy?: string
}>()

/** Emits events for the PaginationForwardInput component */
const emits = defineEmits(['input', 'update:modelValue'])

// Local state for input value
const localValue = ref(props.modelValue ?? 1)

// Debounced emit to parent
const debouncedEmitInput = debounceInput((val: number) => {
	emits('input', val)
	emits('update:modelValue', val)
})

// Watch localValue and emit debounced event to parent
watch(localValue, val => {
	if (val) {
		debouncedEmitInput(val)
	}
})

/**
 * Handles the input event for the input field
 * Emits the `input` event with the current value of the input
 * @param value - The input event
 */
const onInput = (value: InputEvent): void => {
	if (!value) return
	localValue.value = Number(value)
}

const onKeypress = (event: KeyboardEvent) => {
	if (
		Number(localValue.value) + Number(event.key) > props.totalPages ||
		Number(event.key) <= 0
	) {
		event.preventDefault()
	}
}
</script>

<template>
	<Input
		v-model="localValue"
		type="numeric"
		class="w-20 bg-transparent pagination__input"
		:class="props.class"
		:disabled="props.disabled"
		:min="1"
		:data-cy="props.dataCy"
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
