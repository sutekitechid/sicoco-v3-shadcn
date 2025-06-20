<template>
	<div
		ref="baseInputRef"
		:data-validation-id="uid"
		:class="baseInputClass"
		:style="{ paddingBottom: `${errorHeight}px` }"
	>
		<slot :invalid="invalid" :dirty="dirty" :validate="validateInput" />

		<div
			ref="errorRef"
			:class="[
				'input__help-message text-danger-90 text-left absolute w-full',
				{ invisible: !dirty || !invalid },
			]"
		>
			<slot name="errors" :validation="v$.modelValue" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	ref,
	computed,
	defineExpose,
	onMounted,
	onUnmounted,
	watch,
	nextTick,
	inject,
} from 'vue'
import useVuelidate from '@vuelidate/core'
import uniqueId from 'lodash/uniqueId'
import { validate, reset } from './validation'

const props = defineProps({
	modelValue: {
		type: [String, Number, Boolean, Object, Array, File],
		default: undefined,
	},
	validationRules: {
		type: Object,
		default: () => ({}),
	},
	useValidation: Boolean,
	focusFunction: {
		type: Function,
		default: undefined,
	},
})

const modelValue = computed(() => props.modelValue)
const v$ = useVuelidate(props.validationRules, { modelValue })

const dirty = computed(() => v$.value.modelValue.$dirty)
const invalid = computed(() => v$.value.modelValue.$invalid)

// register validate func to custom form
const uid = `input__${uniqueId()}`

const validateInput = () => {
	const result = validate(v$)
	if (v$.value.modelValue.$invalid) {
		triggerShake()
	}
	return result
}

const resetInput = () => {
	reset(v$)
}

defineExpose({
	validate: validateInput,
	reset: resetInput,
})

const registerValidateFunc = inject('registerValidateFunc', undefined)
const removeValidateFunc = inject('removeValidateFunc', undefined)
const baseInputRef = ref<HTMLElement | null>(null)

const existingValidationId = computed(() => {
	// find existing data-validation-id in the this component only
	// we should not use the uuid again, because it maybe rendered in ssr already
	const dataValidationId =
		baseInputRef.value?.getAttribute('data-validation-id') || uid
	return `[data-validation-id="${dataValidationId}"]`
})

const registerInputValidateFunction = () => {
	if (!props.useValidation) {
		return
	}
	if (!registerValidateFunc) {
		return
	}

	registerValidateFunc({
		validate: validateInput,
		reset: resetInput,
		validationId: existingValidationId.value,
		focusFunction: props.focusFunction,
	})
}

onMounted(() => {
	nextTick(() => {
		registerInputValidateFunction()
	})
})

onUnmounted(() => {
	if (!removeValidateFunc) {
		return
	}
	removeValidateFunc(existingValidationId.value)
})

// watch useValidation
watch(
	() => props.useValidation,
	() => {
		registerInputValidateFunction()
	}
)

// watch validationRules
watch(
	() => props.validationRules,
	() => {
		registerInputValidateFunction()
	}
)

const errorRef = ref<HTMLElement | null>(null)
const errorHeight = ref(0)
const oneErrorLineHeight = 21
const updateErrorHeight = () => {
	nextTick(() => {
		const offsetHeight = errorRef.value?.offsetHeight
		errorHeight.value =
			offsetHeight <= oneErrorLineHeight ? 0 : offsetHeight || 0
	})
}
watch([() => dirty.value, () => invalid.value], updateErrorHeight)

/**
 * Reactive class for error state
 * - shake animation is triggered when input becomes dirty and invalid
 * - uses a ref to control the shake animation class
 */
const showErrorClass = ref(false)
const baseInputClass = computed(() =>
	[
		'block relative transition-all duration-300',
		showErrorClass.value ? 'input__has-error shake' : '',
	].join(' ')
)

/**
 * function to trigger the shake animation
 * - sets showErrorClass to false, then true after next tick
 * - resets showErrorClass to false after 500ms
 */
function triggerShake() {
	showErrorClass.value = false
	nextTick(() => {
		showErrorClass.value = true
		setTimeout(() => {
			showErrorClass.value = false
		}, 500)
	})
}

/**
 * watch for dirty and invalid state changes
 * - triggers shake animation when both become true
 * - only triggers when transitioning from not dirty/invalid to dirty/invalid
 */
watch(
	() => [dirty.value, invalid.value],
	([newDirty, newInvalid], [oldDirty, oldInvalid]) => {
		if (newDirty && newInvalid && (!oldDirty || !oldInvalid)) {
			triggerShake()
		}
	}
)
</script>

<style scoped>
.shake {
	animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes shake {
	10%,
	90% {
		transform: translateX(-2px);
	}
	20%,
	80% {
		transform: translateX(4px);
	}
	30%,
	50%,
	70% {
		transform: translateX(-8px);
	}
	40%,
	60% {
		transform: translateX(8px);
	}
}
</style>
