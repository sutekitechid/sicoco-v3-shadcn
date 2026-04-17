<template>
	<form
		class="[&>:not(:last-child)]:mb-4 mb-2"
		:autocomplete="autocomplete"
		novalidate
		@submit.prevent="validateForm({ submit: true })"
	>
		<slot />
	</form>
</template>

<script setup lang="ts">
import { provide, computed, reactive } from 'vue'
import {
	registerValidateFunc,
	registerValidateFuncBatched,
	removeValidateFunc,
	validate,
	createValidationRegistry,
	type ValidateFunctionObject,
} from '.'
import { shouldEnableBatching } from './validationBatcher'

const props = defineProps({
	label: {
		type: String,
		default: undefined,
	},
	autocomplete: {
		type: String,
		default: 'off',
	},
	/**
	 * Enable batched registration for better performance with many inputs
	 * Auto-enabled when input count > 50
	 */
	enableBatching: {
		type: Boolean,
		default: undefined,
	},
})

// Create validation registry (new optimized structure)  
// IMPORTANT: Wrap with reactive() so Vue tracks array mutations!
const validationRegistry = reactive(createValidationRegistry())

// Auto-detect if batching should be enabled
const shouldBatch = computed(() => {
	return shouldEnableBatching(validationRegistry)
})

// validate all input component
// if there is an invalid input, scroll to that input
// if all input is valid, emit submit event
const emit = defineEmits(['submit'])

/**
 * Reset all input component
 */
function reset() {
	validationRegistry.list.forEach(item => {
		item.reset()
	})
}

const registerInputValidateFunction = (func: ValidateFunctionObject) => {
	// Use batching if explicitly enabled or auto-detected
	const useBatching =
		typeof props.enableBatching === 'boolean'
			? props.enableBatching
			: shouldBatch.value

	if (useBatching) {
		registerValidateFuncBatched(func, validationRegistry)
	} else {
		registerValidateFunc(func, validationRegistry)
	}
}

const removeInputValidateFunction = (id: string) => {
	removeValidateFunc(id, validationRegistry)
}

function validateForm({ submit }: { submit?: boolean } = { submit: false }) {
	validate({ registry: validationRegistry, emit, submit })
}

defineExpose({
	validateForm,
	resetForm: reset,
	validationRegistry, // Expose for advanced usage
})

provide('registerValidateFunc', registerInputValidateFunction)
provide('removeValidateFunc', removeInputValidateFunction)
provide('validateForm', validateForm)
provide('reset', reset)
provide('validationRegistry', validationRegistry)
</script>
