<template>
	<div
		:data-validation-id="uid"
		:class="[
			{ 'input__has-error': dirty && invalid },
			'block relative transition-all duration-300',
		]"
		:style="{ paddingBottom: `${errorHeight}px` }"
	>
		<slot :invalid="invalid" :dirty="dirty" :validate="validateInput" />

		<div
			ref="errorRef"
			:class="[
				'input__help-message text-danger-90 text-left absolute',
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

const registerValidateFunc = inject('registerValidateFunc', undefined)
const removeValidateFunc = inject('removeValidateFunc', undefined)

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
		id: uid.value,
		focusFunction: props.focusFunction,
	})
}

onMounted(() => {
	registerInputValidateFunction()
})

onUnmounted(() => {
	if (!removeValidateFunc) {
		return
	}
	removeValidateFunc(uid.value)
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
</script>
