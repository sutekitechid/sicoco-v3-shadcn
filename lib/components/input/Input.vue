
<template>
  <BaseInput
    :model-value="modelValue"
    :validation-rules="rules"
    :use-validation="useValidation"
    :focus-function="() => inputText.focus()"
  >
    <template #default="{ dirty, invalid, validate }">
      <input
        ref="inputText"
        :value="computedValue"
        :class="[cn(inputVariants({ size, disabled }), props.class), { 'pr-10': dirty && invalid }]"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="validate"
        @keypress="onKeypress"
        @input="onInput"
      >
      <i
        v-if="dirty && invalid"
        class="absolute top-1/2 right-3 text-danger-100 si-alert-circle -translate-y-1/2"
      ></i>
    </template>
    <template #errors="{ validation }">
      <div v-if="validation.required.$invalid">
        <slot name="required" />
        <div
          v-if="!slots.required"
          class="text-xs"
        >
          Wajib diisi
        </div>
      </div>
      <p
        v-else
        class="text-xs"
      >validation passed</p>
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { useVModel } from '@vueuse/core'
import BaseInput from '../base-input/index';
import { computed, ref, useSlots, watch } from 'vue'
import isEmpty from 'lodash/isEmpty'
import { requiredIf, minValue, maxValue, minLength, maxLength, email, url } from '@vuelidate/validators'
import { type InputVariants, type InputType, inputVariants, keypress, InputTypeEnum, listenInput } from '.'
import { formatCurrency } from '../../utils/currency'

const props = defineProps<{
  modelValue?: string | number
  class?: HTMLAttributes['class']
  size?: InputVariants['size']
  disabled?: boolean
  name?: string
  placeholder?: string
  required?: boolean
  type?: InputType
  customValidators?: Record<string, (value: string | number) => boolean>
  min?: number
  max?: number
  exactLength?: number
  minlength?: number
  maxlength?: number
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'keypress', payload: KeyboardEvent): void
  (e: 'input', payload: InputEvent): void
}>()

const slots = defineSlots<{
  required?: string
}>()

const inputText = ref<HTMLInputElement | null>(null)

const modelValue = useVModel(props, 'modelValue', emits)

const computedValue = computed(() => {
  if (props.type === InputTypeEnum.currency) {
    return formatCurrency(props.modelValue)
  }
  return props.modelValue
})

const rules = computed(() => {
  const rules: Record<string, any> = {
    modelValue: {
      required: requiredIf(() => props.required),
      ...props.customValidators,
    },
  }
  if (props.type === InputTypeEnum.number || props.type === InputTypeEnum.currency) {
    if (props.min !== undefined) {
      rules.modelValue.minValue = minValue(props.min)
    }
    if (props.max !== undefined) {
      rules.modelValue.maxValue = maxValue(props.max)
    }
  }
  if (props.exactLength !== undefined) {
    rules.modelValue.exactLength = (value) => meetsExactLength(value, props.exactLength)
  }
  if (props.minlength !== undefined) {
    rules.modelValue.minlength = minLength(props.minlength)
  }
  if (props.maxlength !== undefined) {
    rules.modelValue.maxlength = maxLength(props.maxlength)
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
    (props.min !== undefined && (props.type === 'number' || props.type === 'currency')) ||
    (props.max !== undefined && (props.type === 'number' || props.type === 'currency')) ||
    props.minlength !== undefined ||
    props.maxlength !== undefined ||
    props.exactLength !== undefined ||
    props.type === 'email' ||
    props.type === 'url' ||
    !isEmpty(props.customValidators)
  )
})

const onKeypress = (e: KeyboardEvent) => {
  keypress(e, props.type, emits, props.modelValue, false)
}

const onInput = (e: InputEvent) => {
  listenInput(e, props.type, emits)
}
</script>

<style>
.input__has-error input {
  @apply border-danger-100/60 focus-visible:ring-danger-50/40 focus-visible:border-danger-100/60;
}
</style>
