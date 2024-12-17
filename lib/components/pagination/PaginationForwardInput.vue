<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { Input } from '../input'
import { computed, defineEmits, defineProps, type HTMLAttributes } from 'vue'

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
	emits('input', value)
}
</script>

<template>
	<Input
		v-model="computedModelValue"
		:class="props.class"
		:disabled="props.disabled"
		@input="onInput"
	/>
</template>
