<script setup lang="ts">
import { ref } from 'vue'
import { sanitizeDigits } from '../../utils/editable-date-picker'

/**
 * DatepickerEditableInput is a single numeric segment input used by the
 * editable datepicker trigger (day, month, year, or their range counterparts).
 *
 * It handles sanitisation, auto-advance when the segment is full, and manual
 * keyboard navigation (arrow keys / backspace). Paste events are forwarded to
 * the parent trigger as raw text because a pasted date can span multiple
 * segments.
 */

const props = withDefaults(
	defineProps<{
		modelValue: string
		placeholder: string
		maxLength: number
		widthClass: string
		disabled?: boolean
		dataCy?: string
		dataTestid?: string
		name?: string
	}>(),
	{
		disabled: false,
		dataCy: '',
		dataTestid: '',
		name: '',
	}
)

const emits = defineEmits<{
	(event: 'update:modelValue', value: string): void
	(event: 'blur', payload: FocusEvent): void
	(event: 'prev'): void
	(event: 'next'): void
	(event: 'paste', rawText: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function attr() {
	return {
		'data-cy': props.dataCy,
		'data-testid': props.dataTestid,
		name: props.name,
	}
}

function handleInput(e: Event) {
	const target = e.target as HTMLInputElement
	const digits = sanitizeDigits(target.value, props.maxLength)
	target.value = digits
	emits('update:modelValue', digits)

	// Auto-advance to the next segment when this one is full.
	if (digits.length === props.maxLength) {
		emits('next')
	}
}

function handleKeydown(e: KeyboardEvent) {
	const target = e.target as HTMLInputElement
	const atStart = target.selectionStart === 0 && target.selectionEnd === 0
	const atEnd = target.selectionStart === target.value.length

	if (e.key === 'Backspace' && atStart) {
		e.preventDefault()
		emits('prev')
		return
	}

	if (e.key === 'ArrowLeft' && atStart) {
		e.preventDefault()
		emits('prev')
		return
	}

	if (e.key === 'ArrowRight' && atEnd) {
		e.preventDefault()
		emits('next')
	}
}

function handlePaste(e: ClipboardEvent) {
	const rawText = e.clipboardData?.getData('text') ?? ''
	if (!rawText) return
	e.preventDefault()
	emits('paste', rawText)
}

function handleBlur(e: FocusEvent) {
	emits('blur', e)
}

function focus() {
	inputRef.value?.focus()
	inputRef.value?.select()
}

function hasFocus() {
	return document.activeElement === inputRef.value
}

defineExpose({
	focus,
	hasFocus,
})
</script>

<template>
	<input
		ref="inputRef"
		:value="modelValue"
		type="text"
		inputmode="numeric"
		autocomplete="off"
		:maxlength="maxLength"
		:placeholder="placeholder"
		:disabled="disabled"
		v-bind="attr()"
		:class="
			[
				widthClass,
				'min-w-0 text-center bg-transparent outline-hidden border-0 focus:ring-0 focus:outline-hidden p-0 disabled:cursor-not-allowed',
			]
		"
		@input="handleInput"
		@keydown="handleKeydown"
		@paste="handlePaste"
		@blur="handleBlur"
	/>
</template>
