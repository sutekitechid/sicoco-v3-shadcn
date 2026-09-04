<template>
	<form
		class="[&>:not(:last-child)]:mb-8 mb-2"
		:autocomplete="autocomplete"
		novalidate
		@submit.prevent="validateForm({ submit: true })"
	>
		<slot />
	</form>
</template>

<script setup lang="ts">
import { provide, computed, reactive, ref, onMounted, nextTick, type PropType } from 'vue'
import {
	registerValidateFunc,
	registerValidateFuncBatched,
	removeValidateFunc,
	validate,
	createValidationRegistry,
	type ValidateFunctionObject,
	type DirtyChecker,
} from '.'
import { BatchingMode, type BatchingModeType } from './constants'
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

const dirty = defineModel<boolean>('dirty', { default: false })

// Create validation registry (new optimized structure)
// IMPORTANT: Wrap with reactive() so Vue tracks array mutations!
const validationRegistry = reactive(createValidationRegistry())

// Dirty state tracking
const dirtyCheckerList = ref<DirtyChecker[]>([])

function registerDirtyChecker(checker: DirtyChecker) {
	if (!checker || !checker.id) return
	const index = dirtyCheckerList.value.findIndex((item) => item.id === checker.id)
	if (index !== -1) {
		dirtyCheckerList.value.splice(index, 1, checker)
	} else {
		dirtyCheckerList.value.push(checker)
	}
	updateDirtyState()
}

function removeDirtyChecker(checkerOrId: string | DirtyChecker) {
	const id = typeof checkerOrId === 'string' ? checkerOrId : checkerOrId?.id
	if (!id) return
	const index = dirtyCheckerList.value.findIndex((item) => item.id === id)
	if (index !== -1) {
		dirtyCheckerList.value.splice(index, 1)
		updateDirtyState()
	}
}

function notifyDirtyChange() {
	updateDirtyState()
}

function updateDirtyState() {
	const wasDirty = dirty.value
	dirty.value = dirtyCheckerList.value.some((item) => item.isDirty())
	if (wasDirty !== dirty.value) {
		// v-model update happens automatically via defineModel
	}
}

function captureAllInitialValues() {
	nextTick(() => {
		dirtyCheckerList.value.forEach((item) => {
			if (typeof item.captureInitialValue === 'function') {
				item.captureInitialValue()
			}
		})
		updateDirtyState()
	})
}

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
	if (submit) {
		updateDirtyState()
	}
}

onMounted(() => {
	captureAllInitialValues()
})

defineExpose({
	validateForm,
	resetForm: reset,
	validationRegistry,
	captureAllInitialValues,
})

provide('registerValidateFunc', registerInputValidateFunction)
provide('removeValidateFunc', removeInputValidateFunction)
provide('validateForm', validateForm)
provide('reset', reset)
provide('validationRegistry', validationRegistry)
provide('registerDirtyChecker', registerDirtyChecker)
provide('removeDirtyChecker', removeDirtyChecker)
provide('notifyDirtyChange', notifyDirtyChange)
</script>
