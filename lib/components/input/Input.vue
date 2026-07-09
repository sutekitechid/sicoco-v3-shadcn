<template>
	<BaseInput
		ref="baseInputRef"
		:model-value="modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="focus"
	>
		<template #default="{ dirty, invalid, validate }">
			<div :class="cn('h-fit relative mb-1')">
				<InputPrefix v-if="slots.prefix" @width-change="onPrefixWidthChange">
					<slot name="prefix" />
				</InputPrefix>
				<input
					ref="inputText"
					:value="computedValue"
					:style="{
						paddingLeft: computedPrefixWidth,
						paddingRight: getInputPaddingRight(suffixWidth, dirty, invalid),
					}"
					:class="[
						cn(
							inputVariants({ size, disabled, readonly }),
							props.class,
							{ 'pr-8': dirty && invalid }
						),
					]"
					:placeholder="placeholder"
					:disabled="disabled"
					:type="computedType"
					:readonly="readonly"
					:data-cy="props.dataCy"
					:data-testid="props.dataTestid ?? props.dataCy"
					:name="computedName"
					@blur="validate(), onBlur()"
					@keypress="onKeypress"
					@keydown="onKeydown"
					@input="onInput"
					@paste="onPaste"
					@select="onSelect"
					@mouseup="onMouseup"
					@keyup="onKeyup"
					@contextmenu="onSelect"
					@wheel="onWheel"
				/>
				<i
					v-if="dirty && invalid"
					:style="{ right: computedSuffixWidth }"
					class="absolute top-1/2 right-3 text-danger-500 si-alert-circle -translate-y-1/2"
				></i>
				<InputPassword
					v-if="props.type === InputTypeEnum.password"
					:show="showPassword"
					@update:show="showPassword = $event"
				/>
				<InputSuffix
					v-if="slots.suffix"
					@width-change="onSuffixWidthChange"
				>
					<slot name="suffix" />
				</InputSuffix>
			</div>
		</template>
		<template #errors="{ validation }">
			<InputErrorMessage
				:validation="validation"
				:min="min"
				:max="max"
				:exact-length="exactLength"
			>
				<template #required>
					<slot name="required" />
				</template>
				<template #minLength>
					<slot name="minLength" />
				</template>
				<template #maxLength>
					<slot name="maxLength" />
				</template>
				<template #minValue>
					<slot name="minValue" />
				</template>
				<template #maxValue>
					<slot name="maxValue" />
				</template>
				<template #exactLength>
					<slot name="exactLength" />
				</template>
				<template #email>
					<slot name="email" />
				</template>
				<template #url>
					<slot name="url" />
				</template>
				<template #maxFractionDigits>
					<slot name="maxFractionDigits" />
				</template>

				<template #errors>
					<slot name="errors" :validation="validation" />
				</template>
			</InputErrorMessage>
		</template>
		<template v-if="slots.hint" #hint>
			<div>
				<slot name="hint" />
			</div>
		</template>
		<template #counter>
			<span v-if="showCount && maxLength" class="whitespace-nowrap">
				{{ String(modelValue ?? '').length }} / {{ maxLength }}
			</span>
		</template>
	</BaseInput>
</template>

<script setup lang="ts">
/**
 * Input component is used to get user input.
 * It can be used to get text, number, email, password, etc.
 * It can also be used to get currency input.
 * It can also be used to get URL input.
 *
 * @slot prefix - Slot for prefix content.
 * @slot suffix - Slot for suffix content.
 * @slot errors - Slot for error messages.
 * @slot hint - Slot for hint text.
 *
 * @emits update:modelValue - Emitted when the value of the input changes.
 * @emits focus - Emitted when the input is focused.
 * @emits blur - Emitted when the input is blurred.
 * @emits keypress - Emitted when a key is pressed.
 * @emits input - Emitted when the input value changes.
 *
 * @param {string | number} modelValue - The value of the input.
 * @param {string} class - The class of the input.
 * @param {InputVariants['size']} size - The size of the input.
 * @param {boolean} disabled - The disabled state of the input.
 * @param {string} name - The name of the input.
 * @param {string} placeholder - The placeholder of the input.
 * @param {boolean} required - The required state of the input.
 * @param {InputType} type - The type of the input.
 * @param {Record<string, any>} customValidators - The custom validators of the input.
 * @param {number} min - The minimum value of the input.
 * @param {number} max - The maximum value of the input.
 * @param {number} exactLength - The exact length of the input.
 * @param {number} minlength - The minimum length of the input.
 * @param {number} maxlength - The maximum length of the input.
 * @param {boolean} readonly - The readonly state of the input.
 * @param {boolean} decimal - The decimal state of the input.
 * @param {string | number} maxFractionDigits - The maximum fraction digits of the input.
 * @param {boolean} showCount - Show character counter (e.g. "12 / 100"). Requires maxLength to be set.
 *
 * @example
 * <Input v-model="password" placeholder="Enter your name" type="password" required>
 */
import { computed, ref, defineExpose, type HTMLAttributes } from 'vue'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import BaseInput from '../base-input/index'
import {
	requiredIf,
	minValue,
	maxValue,
	minLength,
	email,
	url,
} from '@vuelidate/validators'
import {
	type InputVariants,
	type InputType,
	inputVariants,
	InputTypeEnum,
	listenInput,
	meetsExactLength,
	convertMorpWidthToCss,
	getInputPaddingRight,
	InputPassword,
	hasExceedsMaxLength,
} from '.'
import { formatCurrency } from '../../utils/currency'
import { InputErrorMessage, InputPrefix, InputSuffix } from '.'

const props = withDefaults(
	defineProps<{
		modelValue?: string | number
		class?: HTMLAttributes['class']
		size?: InputVariants['size']
		disabled?: boolean
		name?: string
		placeholder?: string
		required?: boolean
		type?: InputType
		customValidators?: Record<string, unknown>
		min?: number
		max?: number
		exactLength?: number
		minLength?: number
		maxLength?: number
		readonly?: boolean
		maxFractionDigits?: string | number
		showCount?: boolean
		dataCy?: string
		dataTestid?: string
	}>(),
	{
		type: 'text',
		maxFractionDigits: 0,
		showCount: false,
	}
)

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
	(e: 'focus'): void
	(e: 'blur'): void
	(e: 'keypress', payload: KeyboardEvent): void
	(e: 'keydown', payload: KeyboardEvent): void
	(e: 'input', payload: InputEvent): void
	(e: 'paste', payload: ClipboardEvent): void
	(e: 'select', payload: Event): void
	(e: 'mouseup', payload: MouseEvent): void
	(e: 'keyup', payload: KeyboardEvent): void
}>()

const slots = defineSlots<{
	prefix?: string
	suffix?: string
	minLength?: string
	maxLength?: string
	required?: string
	minValue?: string
	maxValue?: string
	exactLength?: string
	email?: string
	url?: string
	maxFractionDigits?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
	hint?: string
}>()

const inputText = ref<HTMLInputElement | null>(null)

const modelValue = useVModel(props, 'modelValue', emits)

const computedValue = computed(() => {
	if (props.type === InputTypeEnum.currency) {
		return formatCurrency(props.modelValue)
	}
	return props.modelValue
})

const computedName = computed(() => {
	if (props.name) {
		return props.name
	}
	return `input__${uniqueId()}`
})

const showPassword = ref(false)

/**
 * The real type of the input.
 */
const computedType = computed(() => {
	if (props.type === InputTypeEnum.password) {
		return showPassword.value ? InputTypeEnum.text : InputTypeEnum.password
	}
	if (props.type === InputTypeEnum.number) {
		return InputTypeEnum.number
	}
	return InputTypeEnum.text
})

const rules = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rules: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}
	if (
		props.type === InputTypeEnum.number ||
		props.type === InputTypeEnum.currency
	) {
		if (props.min !== undefined) {
			rules.modelValue.minValue = minValue(props.min)
		}
		if (props.max !== undefined) {
			rules.modelValue.maxValue = maxValue(props.max)
		}
	}
	if (props.exactLength !== undefined) {
		rules.modelValue.exactLength = value =>
			meetsExactLength(value, props.exactLength)
	}
	if (props.minLength !== undefined) {
		rules.modelValue.minLength = minLength(props.minLength)
	}
	if (props.type === InputTypeEnum.email) {
		rules.modelValue.email = email
	}
	if (props.type === InputTypeEnum.url) {
		rules.modelValue.url = url
	}
	return rules
})

// validation
const useValidation = computed(() => {
	if (props.disabled) {
		return false
	}
	return (
		props.required ||
		(props.min !== undefined &&
			(props.type === InputTypeEnum.number ||
				props.type === InputTypeEnum.currency)) ||
		(props.max !== undefined &&
			(props.type === InputTypeEnum.number ||
				props.type === InputTypeEnum.currency)) ||
		props.minLength !== undefined ||
		props.exactLength !== undefined ||
		props.type === InputTypeEnum.email ||
		props.type === InputTypeEnum.url ||
		!isEmpty(props.customValidators)
	)
})

/**
 * An event handler for the select event.
 * This event is used to get the selected text in the input.
 *
 * @param {Event} e
 * @returns {void}
 */
function onSelect(e: Event) {
	emits('select', e)
}

function onMouseup(e: MouseEvent) {
	emits('mouseup', e)
}

function onKeyup(e: KeyboardEvent) {
	emits('keyup', e)
}

function onBlur() {
	emits('blur')
}

/**
 * An event handler for the paste event.
 *
 * @param {ClipboardEvent} e
 * @returns {void}
 */
function onPaste(e: ClipboardEvent) {
	emits('paste', e)
}

/**
 * An event handler for the keypress event.
 * Avoids alphabetical characters for number input.
 *
 * @param {KeyboardEvent} e
 * @returns {void}
 */
function onKeypress(e: KeyboardEvent) {
	emits('keypress', e)

	// handle type text
	const char = e.key
	const newCurrentValue = replaceSelectedText(char)
	const { type } = props
	const { text, number } = InputTypeEnum

	if (type === text) {
		if (hasExceedsMaxLength(newCurrentValue, props.maxLength)) {
			e.preventDefault()
		}
		return
	}
	if (type === number) {
		if (isNaN(Number(char)) && char !== '-' && char !== '.' && char !== ',') {
			e.preventDefault()
			return
		}
	}
}

/**
 * Returns the input value as if the given text was inserted at the current selection.
 * Used for simulating input changes (e.g., paste, typing).
 *
 * @param {string} insertedText - The text to insert at the selection.
 * @returns {string}
 */
function replaceSelectedText(insertedText: string) {
	let start = 0
	let end = 0

	const input = inputText.value
	if (input) {
		start = input.selectionStart
		end = input.selectionEnd
	}

	const currentValue = String(modelValue.value || '')
	return currentValue.slice(0, start) + insertedText + currentValue.slice(end)
}

function onKeydown(e: KeyboardEvent) {
	emits('keydown', e)
}

function onInput(e: InputEvent) {
	listenInput({
		event: e,
		props: props,
		emit: emits,
		type: props.type,
	})
}

const prefixWidth = ref(0)
/**
 * An event handler for the prefix width change event.
 * This event is used to change the padding left of the input.
 *
 * @param width
 */
const onPrefixWidthChange = (width: number) => {
	prefixWidth.value = width
}

const suffixWidth = ref(0)
/**
 * An event handler for the suffix width change event.
 * This event is used to change the padding right of the input.
 *
 * @param width
 */
function onSuffixWidthChange(width: number) {
	suffixWidth.value = width
}

/**
 * This computed property is used to convert the prefix width to CSS.
 * This is used to set the padding left of the input.
 */
const computedPrefixWidth = computed(() => {
	return convertMorpWidthToCss(prefixWidth.value)
})

/**
 * This computed property is used to convert the suffix width to CSS.
 * This is used to set the padding right of the input.
 */
const computedSuffixWidth = computed(() => {
	if (props.type === InputTypeEnum.password) {
		return convertMorpWidthToCss(suffixWidth.value + 30)
	}
	return convertMorpWidthToCss(suffixWidth.value)
})

const baseInputRef = ref<InstanceType<typeof BaseInput> | null>()

function validate() {
	if (useValidation.value) {
		return baseInputRef.value?.validate()
	}
}

function resetValidation() {
	if (useValidation.value) {
		baseInputRef.value?.reset()
	}
}

function focusAndShake() {
	if (baseInputRef.value) {
		baseInputRef.value.focusAndShake()
	}
}

defineExpose({
	focus,
	resetValidation,
	validate,
	focusAndShake,
})

/**
 * This function is used to focus the input.
 */
function focus() {
	if (inputText.value) {
		inputText.value.focus()
	}
	emits('focus')
}

/**
 * An event handler for the wheel event.
 * For number input, blur the input to prevent accidental value changes while scrolling.
 *
 * @param {WheelEvent} e
 * @returns {void}
 */
function onWheel() {
	if (computedType.value !== InputTypeEnum.number) {
		return
	}
	inputText.value?.blur()
}
</script>

<style scoped>
.input__has-error input {
	@apply border-danger-500 shadow-danger;
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type='number'] {
	-moz-appearance: textfield;
}
</style>
