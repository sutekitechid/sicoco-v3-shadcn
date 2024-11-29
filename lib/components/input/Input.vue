
<template>
  <BaseInput
    :model-value="modelValue"
    :validation-rules="rules"
    :use-validation="useValidation"
    :focus-function="() => inputText.focus()"
  >
    <template #default="{ dirty, invalid, validate }">
      <InputPrefix
        v-if="slots.prefix"
        @width-change="onPrefixWidthChange"
      >
        <slot name="prefix" />
      </InputPrefix>
      <input
        ref="inputText"
        :value="computedValue"
        :style="{ paddingLeft: computedPrefixWidth, paddingRight: getInputPaddingRight(suffixWidth, dirty, invalid) }"
        :class="[
          cn(inputVariants({ size, disabled }), props.class),
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="validate"
        @keypress="onKeypress"
        @input="onInput"
      >
      <i
        v-if="dirty && invalid"
        :style="{ right: computedSuffixWidth }"
        class="absolute top-1/2 right-3 text-danger-100 si-alert-circle -translate-y-1/2"
      ></i>
      <InputSuffix
        v-if="slots.suffix"
        @width-change="onSuffixWidthChange"
      >
        <slot name="suffix" />
      </InputSuffix>
    </template>
    <template #errors="{ validation }">
      <InputErrorMessage
        :validation="validation"
        :min="min"
        :max="max"
        :exact-length="exactLength"
      >
        <template #errors>
          <slot name="errors" :validation="validation" />
        </template>
      </InputErrorMessage>
    </template>
  </BaseInput>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { useVModel } from '@vueuse/core'
import BaseInput from '../base-input/index';
import { computed, ref } from 'vue'
import isEmpty from 'lodash/isEmpty'
import { requiredIf, minValue, maxValue, minLength, maxLength, email, url } from '@vuelidate/validators'
import { type InputVariants, type InputType, inputVariants, keypress, InputTypeEnum, listenInput, meetsExactLength, convertMorpWidthToCss, getInputPaddingRight } from '.'
import { formatCurrency } from '../../utils/currency'
import { InputErrorMessage, InputPrefix, InputSuffix } from '.';

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
  prefix?: string
  suffix?: string
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

const prefixWidth = ref(0)
const onPrefixWidthChange = (width: number) => {
  prefixWidth.value = width
}

const suffixWidth = ref(0)
const onSuffixWidthChange = (width: number) => {
  suffixWidth.value = width
}

const computedPrefixWidth = computed(() => {
  return convertMorpWidthToCss(prefixWidth.value)
})

const computedSuffixWidth = computed(() => {
  return convertMorpWidthToCss(suffixWidth.value)
})
</script>

<style>
.input__has-error input {
  @apply border-danger-100/60 focus-visible:ring-danger-50/40 focus-visible:border-danger-100/60;
}
</style>
