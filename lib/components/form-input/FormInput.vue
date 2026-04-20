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
import { provide, computed, reactive, type PropType } from 'vue'
import {
	registerValidateFunc,
	registerValidateFuncBatched,
	removeValidateFunc,
	validate,
	createValidationRegistry,
	BatchingMode,
	type ValidateFunctionObject,
	type BatchingModeType,
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
	 * Batching mode for validation registration
	 * - 'auto': Auto-detect based on input count (> 50 inputs)
	 * - 'on': Always use batching
	 * - 'off': Never use batching
	 * @default 'auto'
	 */
	batchingMode: {
		type: String as PropType<BatchingModeType>,
		default: BatchingMode.AUTO,
		validator: (value: string) => Object.values(BatchingMode).includes(value as BatchingModeType),
	},
})

// Create validation registry (new optimized structure)  
// IMPORTANT: Wrap with reactive() so Vue tracks array mutations!
const validationRegistry = reactive(createValidationRegistry())

// Auto-detect if batching should be enabled
const shouldBatch = computed(() => {
	if (props.batchingMode === BatchingMode.ON) return true
	if (props.batchingMode === BatchingMode.OFF) return false
	// auto mode - detect based on input count
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
	if (shouldBatch.value) {
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
