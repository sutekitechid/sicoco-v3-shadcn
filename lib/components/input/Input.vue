<template>
	<BaseInput
		:model-value="modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => inputText.focus()"
	>
		<template #default="{ dirty, invalid, validate }">
			<div class="h-fit relative">
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
					:class="[cn(inputVariants({ size, disabled }), props.class)]"
					:placeholder="placeholder"
					:disabled="disabled"
					:type="computedType"
					:readonly="readonly"
					:data-cy="props.dataCy"
					@blur="validate(), onBlur()"
					@keypress="onKeypress"
					@keydown="onKeydown"
					@input="onInput"
					@paste="onPaste"
					@select="onSelect"
					@mouseup="onMouseup"
					@keyup="onKeyup"
					@contextmenu="onSelect"
				/>
				<i
					v-if="dirty && invalid"
					:style="{ right: computedSuffixWidth }"
					class="absolute top-1/2 right-3 text-danger-100 si-alert-circle -translate-y-1/2"
				></i>
				<InputPassword
					v-if="props.type === InputTypeEnum.password"
					:show="showPassword"
					@update:show="showPassword = $event"
				/>
				<InputSuffix
					v-if="slots.suffix"
					class="z-[999]"
					@width-change="onSuffixWidthChange"
				>
					<div class="ml-2">
						<slot name="suffix" />
					</div>
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
 *
 * @example
 * <Input v-model="password" placeholder="Enter your name" type="password" required>
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { useVModel } from '@vueuse/core'
import BaseInput from '../base-input/index'
import { computed, ref } from 'vue'
import isEmpty from 'lodash/isEmpty'
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
	keypress,
	InputTypeEnum,
	listenInput,
	meetsExactLength,
	convertMorpWidthToCss,
	getInputPaddingRight,
	InputPassword,
} from '.'
import { formatCurrency } from '../../utils/currency'
import { InputErrorMessage, InputPrefix, InputSuffix } from '.'

const props = defineProps<{
	modelValue?: string | number
	class?: HTMLAttributes['class']
	size?: InputVariants['size']
	disabled?: boolean
	name?: string
	placeholder?: string
	required?: boolean
	type?: InputType
	customValidators?: Record<string, any>
	min?: number
	max?: number
	exactLength?: number
	minLength?: number
	maxLength?: number
	readonly?: boolean
	decimal?: boolean
	maxFractionDigits?: string | number
	dataCy?: string
}>()

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
	required?: string
	minValue?: string
	maxValue?: string
	exactLength?: string
	email?: string
	url?: string
	maxFractionDigits?: string
	errors?: string
}>()

const inputText = ref<HTMLInputElement | null>(null)

const modelValue = useVModel(props, 'modelValue', emits)

const computedValue = computed(() => {
	if (props.type === InputTypeEnum.currency) {
		return formatCurrency(props.modelValue)
	}
	return props.modelValue
})

const showPassword = ref(false)

/**
 * The real type of the input.
 */
const computedType = computed(() => {
	if (props.type === InputTypeEnum.number) {
		return InputTypeEnum.number
	}
	if (props.type === InputTypeEnum.currency) {
		return InputTypeEnum.text
	}
	if (props.type === InputTypeEnum.password) {
		return showPassword.value ? InputTypeEnum.text : InputTypeEnum.password
	}
	return InputTypeEnum.text
})

const rules = computed(() => {
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

const selectionStartIndex = ref(0)
const selectionEndIndex = ref(0)

/**
 * An event handler for the select event.
 * This event is used to get the selected text in the input.
 *
 * @param {Event} e
 * @returns {void}
 */
function onSelect(e: Event) {
	const target = e.target as HTMLInputElement
	selectionStartIndex.value = target.selectionStart ?? 0
	selectionEndIndex.value = target.selectionEnd ?? 0
	if (selectionStartIndex.value === selectionEndIndex.value) {
		selectionStartIndex.value = 0
	}
}

function onMouseup(e: MouseEvent) {
	onUnselect()
	emits('mouseup', e)
}

function onKeyup(e: KeyboardEvent) {
	// unselect text triggered by pressing arrow keys
	if (
		e.key === 'ArrowLeft' ||
		e.key === 'ArrowRight' ||
		e.key === 'End' ||
		e.key === 'Home' ||
		e.key === 'PageUp' ||
		e.key === 'PageDown' ||
		e.key === 'ArrowUp' ||
		e.key === 'ArrowDown'
	) {
		onUnselect()
	}
	emits('keyup', e)
}

function onBlur() {
	selectionEndIndex.value = 0
	selectionStartIndex.value = 0
	onUnselect()
	emits('blur')
}

/**
 * An event handler for the paste event.
 *
 * @param {ClipboardEvent} e
 * @returns {void}
 */
function onPaste(e: ClipboardEvent) {
	const pastedValue = e.clipboardData?.getData('text')
	const newCurrentValue = getReplacedSelectedText(pastedValue)
	if (hasMaxlength.value !== undefined) {
		if (isExceedsMaxLength(newCurrentValue)) {
			e.preventDefault()
			return
		}
	}

	if (props.type !== InputTypeEnum.number) {
		return
	}

	const newValue = Number(newCurrentValue)
	if (isNaN(newValue)) {
		e.preventDefault()
		return
	}

	if (props.min !== undefined && newValue < props.min) {
		e.preventDefault()
		return
	}

	if (props.max !== undefined && newValue > props.max) {
		e.preventDefault()
		return
	}

	onUnselect()

	// ;(e.target as HTMLInputElement).value = String(newValue)
}

/**
 * Computed property to determine if the input has a max length.
 */
const hasMaxlength = computed(() => props.maxLength !== undefined)

/**
 * An event handler for the keypress event.
 * Avoids alphabetical characters for number input.
 *
 * @param {KeyboardEvent} e
 * @returns {void}
 */
function onKeypress(e: KeyboardEvent) {
	if (hasMaxlength.value !== undefined) {
		const currentValue = getReplacedSelectedText(e.key)
		if (isExceedsMaxLength(currentValue)) {
			e.preventDefault()
			return
		}
	}

	const char = e.key
	if (!validateNumericInput(char, props.type, props.decimal)) {
		return
	}

	if (!validateFractionalDigit(e)) {
		return
	}

	const isDecimal = props.decimal
	keypress(e, props.type, emits, props.modelValue, isDecimal)
	onUnselect()
}

/**
 * An event handler for the focus event.
 * This event is used to set the selection start and end index to 0.
 *
 * @returns {void}
 */
function onUnselect() {
	selectionStartIndex.value = 0
	selectionEndIndex.value = 0
}

function getReplacedSelectedText(pastedValue: string) {
	const start = selectionStartIndex.value
	const end = selectionEndIndex.value
	if (start === end) {
		return `${modelValue.value}${pastedValue}`
	}
	const currentValue = modelValue.value as string
	return currentValue.slice(0, start) + pastedValue + currentValue.slice(end)
}

/**
 * Validates the max length of the input.
 *
 * @param {string} value
 * @returns {boolean}
 */
function isExceedsMaxLength(value: string): boolean {
	return value.length > props.maxLength
}

/**
 * Validates the numeric input.
 *
 * @param {string} value
 * @param {InputType} type
 * @param {boolean} decimal
 * @param {number} [min]
 * @param {number} [max]
 * @returns {boolean}
 */
function validateNumericInput(
	value: string,
	type: InputType,
	decimal: boolean,
	min?: number,
	max?: number
): boolean {
	if (type !== InputTypeEnum.numeric) {
		return true
	}

	if (!/^\d+$/.test(value) && !decimal) {
		return false
	}
	if (min !== undefined && Number(value) < min) {
		return false
	}
	if (max !== undefined && Number(value) > max) {
		return false
	}

	return true
}

function onKeydown(e: KeyboardEvent) {
	emits('keydown', e)
}

/**
 * An event handler for the keypress event.
 * Validates the fractional digit of the input.
 *
 * @param {KeyboardEvent} e
 * @returns {void}
 */
function validateFractionalDigit(event: KeyboardEvent) {
	if (!props.decimal) {
		return true
	}
	if (!props.maxFractionDigits) {
		return true
	}

	const key = event.key
	const currentValue = props.modelValue
	const newValue = currentValue + key

	// Allow only numbers and one dot (.)
	if (!/^\d+([.,]\d*)?$/.test(newValue)) {
		event.preventDefault()
		return false
	}

	// Check fraction digit constraints
	const parts = newValue.split(/[.,]/)

	if (parts.length !== 2) {
		return true
	}

	const fraction = parts[1]

	// Prevent entering more than maxFractionDigits decimal places
	if (fraction.length > Number(props.maxFractionDigits)) {
		event.preventDefault()
		return false
	}

	return true
}

function onInput(e: InputEvent) {
	listenInput(e, props.type, emits)
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
</script>

<style>
.input__has-error input {
	@apply border-danger-100/60 focus-visible:ring-danger-50/40 focus-visible:border-danger-100/60;
}
</style>
