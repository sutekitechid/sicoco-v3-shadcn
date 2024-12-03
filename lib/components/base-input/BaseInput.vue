<template>
	<div
		:data-validation-id="uid"
		:class="[{ 'input__has-error': dirty && invalid }, 'relative']"
	>
		<slot :invalid="invalid" :dirty="dirty" :validate="validateInput" />
		<div
			:class="[
				'input__help-message mt-1 text-danger-90 text-left absolute -bottom-5',
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
	getCurrentInstance,
} from 'vue'
import useVuelidate from '@vuelidate/core'
import uniqueId from 'lodash/uniqueId'
import {
	validate,
	reset,
	findFormInput,
	registerValidateFunc,
} from './validation'

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
const uid = ref(`input__${uniqueId()}`)

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
const instance = getCurrentInstance()

const formInput = computed(() => {
	if (props.useValidation) {
		return findFormInput(instance.parent)
	}
	return null
})

const registerInputValidateFunction = () => {
	registerValidateFunc(
		props.useValidation,
		formInput.value,
		uid.value,
		props.focusFunction,
		validateInput,
		resetInput
	)
}

onMounted(() => {
	registerInputValidateFunction()
})

onUnmounted(() => {
	if (formInput.value && formInput.value.exposed.removeValidateFunc) {
		formInput.value.exposed.removeValidateFunc(uid.value)
	}
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
</script>
