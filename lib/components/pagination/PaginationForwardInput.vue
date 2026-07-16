<script setup lang="ts">
import { Input } from '../input'
import {
	defineEmits,
	defineProps,
	type HTMLAttributes,
	computed,
} from 'vue'
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
	dataTestid?: string
}>()

/** Emits events for the PaginationForwardInput component */
const emits = defineEmits(['input', 'update:modelValue'])

// Debounced emit to parent
const debouncedEmitInput = debounceInput((val: number) => {
	emits('input', val)
	emits('update:modelValue', val)
})

// Keep the field visually empty so the current page is shown as placeholder.
const computedInputValue = computed({
	get: () => undefined,
	set: () => {},
})

// Use computed property for v-model binding
const computedModelValue = computed({
	get: () => props.modelValue ?? 1,
	set: (value: number) => {
		debouncedEmitInput(value ?? 1)
	},
})

/**
 * Handles the input event for the input field
 * Emits the `input` event with the current value of the input
 * @param value - The input event
 */
const onInput = (value: string): void => {
	if (!value) return
	computedModelValue.value = Number(value)
}

const onKeypress = (event: KeyboardEvent) => {
	if (!/^\d$/.test(event.key)) {
		event.preventDefault()
		return
	}

	const input = event.target as HTMLInputElement
	const { selectionStart, selectionEnd, value } = input

	const newValue =
		value.slice(0, selectionStart!) + event.key + value.slice(selectionEnd!)

	const numericValue = Number(newValue)

	if (numericValue > props.totalPages || numericValue <= 0) {
		event.preventDefault()
	}
}
</script>

<template>
	<Input
		v-model="computedInputValue"
		type="numeric"
		class="bg-transparent pagination__input !p-1 w-[37px] h-[34px]"
		:class="props.class"
		:disabled="props.disabled"
		:min="1"
		:placeholder="String(computedModelValue)"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
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
