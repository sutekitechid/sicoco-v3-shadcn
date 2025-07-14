<template>
	<div
		ref="baseInputRef"
		:data-validation-id="uid"
		:class="baseInputClass"
		:style="{ paddingBottom: `${paddingBottom}px` }"
	>
		<slot :invalid="invalid()" :dirty="dirty()" :validate="validateInput" />

		<div
			ref="errorRef"
			:class="[
				'input__help-message text-danger-90 text-left absolute w-full',
				{ invisible: !validated },
			]"
		>
			<slot name="errors" :validation="v$.modelValue" />
		</div>
		<div
			ref="hintRef"
			class="text-left absolute w-full"
			:style="{ marginTop: `${validated ? errorHeight : 0}px` }"
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
let v$ = useVuelidate(props.validationRules, { modelValue })

function dirty() {
	return v$.value.modelValue.$dirty
}
function invalid() {
	return v$.value.modelValue.$invalid
}

// register validate func to custom form
const uid = `input__${uniqueId()}`

const validateInput = () => {
	return validate(v$)
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
		focusFunction: focusAndShake,
	})
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
		baseInputRef.value.classList.add('input__has-error')
	})

	setTimeout(() => {
		baseInputRef.value?.classList.remove('shake')
	}, 500)
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

		v$ = useVuelidate(props.validationRules, { modelValue })
	}
)
const errorRef = ref<HTMLElement | null>(null)
const errorHeight = ref(0)
const oneErrorLineHeight = 21
function updateErrorHeight() {
	nextTick(() => {
		const offsetHeight = errorRef.value?.offsetHeight
		errorHeight.value =
			offsetHeight < oneErrorLineHeight ? 0 : offsetHeight || 0
	})
}

const validated = computed(() => {
	return dirty() && invalid()
})

const slotRef = ref(null)
const slotHeight = ref(0)
let slotObserver = null

onMounted(() => {
	if (slotRef.value) {
		slotObserver = new ResizeObserver(entries => {
			for (let entry of entries) {
				slotHeight.value = entry.contentRect.height
			}
		})
		slotObserver.observe(slotRef.value)
	}
})

onUnmounted(() => {
	if (slotObserver) slotObserver.disconnect()
})

const paddingBottom = computed(() => {
	return errorHeight.value + slotHeight.value
})

watch(
	[dirty(), invalid()],
	() => {
		updateErrorHeight()
	},
	{ immediate: true }
)

const baseInputClass = computed(() => {
	const result = baseInputCva({ invalid: dirty() && invalid() })

	return result
})
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
