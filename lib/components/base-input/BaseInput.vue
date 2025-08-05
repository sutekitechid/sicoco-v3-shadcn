<template>
	<div
		ref="baseInputRef"
		:data-validation-id="uid"
		:class="baseInputClass"
		v-bind="validate ? { style: { marginBottom: `${errorHeight}px` } } : {}"
	>
		<slot :invalid="invalid" :dirty="dirty" :validate="validateInput" />

		<div
			v-if="isInvalidAndDirty"
			ref="errorRef"
			class="input__help-message text-danger-90 text-left absolute w-full"
		>
			<slot name="errors" :validation="v$.modelValue" />
		</div>
		<div
			v-else
			ref="hintRef"
			class="text-left text-neutral-60 text-sm absolute w-full"
			:style="{
				marginTop: `${isInvalidAndDirty ? errorHeight : 0}px`,
			}"
		>
			<slot name="hint" />
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
import { baseInputCva } from './index'

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
const validationRules = computed(() => props.validationRules)

// Initialize vuelidate instance once
let v$ = useVuelidate(validationRules, { modelValue })

// Create reactive computed properties for validation states
const dirty = computed(() => {
	return v$.value.modelValue.$dirty
})

const invalid = computed(() => {
	return v$.value.modelValue.$invalid
})

const isInvalidAndDirty = computed(() => invalid.value && dirty.value)

// register validate func to custom form
const uid = `input__${uniqueId()}`

const validateInput = () => {
	return validate(v$)
}

const resetInput = () => {
	reset(v$)
}

/**
 * Focus the input and shake it to indicate an error.
 * This function is called when the input is invalid and needs attention.
 * It will add a 'shake' class to the input element to trigger a CSS animation.
 */
function focusAndShake() {
	if (baseInputRef.value) {
		props.focusFunction?.()
	}

	nextTick(() => {
		baseInputRef.value.classList.add('shake')
	})

	setTimeout(() => {
		baseInputRef.value?.classList.remove('shake')
	}, 500)
}

defineExpose({
	validate: validateInput,
	reset: resetInput,
	focusAndShake,
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
		focusFunction: focusAndShake,
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
	},
	{ deep: true }
)
const errorRef = ref<HTMLElement | null>(null)
const errorHeight = ref(0)
const oneErrorLineHeight = 21
function updateErrorHeight() {
	nextTick(() => {
		const offsetHeight = errorRef.value?.offsetHeight
		errorHeight.value =
			offsetHeight <= oneErrorLineHeight ? 0 : offsetHeight || 0
	})
}

const hintRef = ref(null)
const hintHeight = ref(0)
let hintElementObserver = null

onMounted(() => {
	if (hintRef.value) {
		hintElementObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				hintHeight.value = entry.contentRect.height
			}
		})
		hintElementObserver.observe(hintRef.value)
	}
})

onUnmounted(() => {
	if (hintElementObserver) hintElementObserver.disconnect()
})

watch(
	[dirty, invalid],
	() => {
		updateErrorHeight()
	},
	{ immediate: true }
)

const baseInputClass = computed(() => {
	const result = baseInputCva({ invalid: isInvalidAndDirty.value })
	return result
})
</script>

<style scoped>
.input__has-error.shake {
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
