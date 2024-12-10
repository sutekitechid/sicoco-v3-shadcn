<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { requiredIf, minLength, maxLength } from '@vuelidate/validators'
import { textAreaVariants } from '.'
import { TextAreaVariants } from '.'
import BaseInput from '../base-input'
import Label from '../label/Label.vue'
import InputErrorMessage from '../input/InputErrorMessage.vue'
import isEmpty from 'lodash/isEmpty'

const props = defineProps<{
  modelValue?: string | Number
  id?: string
  label?: string
  hintText?: string
  class?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  minlength?: number
  maxlength?: number
  customValidators?: Record<string, any>
  variant?: TextAreaVariants['variant']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'input', payload: InputEvent): void
}>()

const textAreaRef = ref<HTMLTextAreaElement | null>(null)
const modelValue = useVModel(props, 'modelValue', emits)

// Rules for validation
const rules = computed(() => {
  const rules: Record<string, any> = {
    modelValue: {
      required: requiredIf(() => props.required),
      ...props.customValidators
    }
  }
  if (props.minlength !== undefined) {
    rules.modelValue.minlength = minLength(props.minlength)
  }
  if (props.maxlength !== undefined) {
    rules.modelValue.maxlength = maxLength(props.maxlength)
  }

  return rules
})

// Check if validation is needed
const useValidation = computed(() => {
  if (props.disabled) {
    return false
  }
  return (
    props.required ||
    props.minlength !== undefined ||
    props.maxlength !== undefined ||
    !isEmpty(props.customValidators)
  )
})
</script>

<template>
  <BaseInput
    :model-value="modelValue"
    :validation-rules="rules"
    :use-validation="useValidation"
    :focus-function="() => textAreaRef.focus()"
  >
    <template #default="{ dirty, invalid, validate }">
      <Label v-if="label" :for="id" class="text-area__label mb-1 block">
        {{ label }}
      </Label>

      <textarea
        ref="textAreaRef"
        :id="id"
        :class="[
          textAreaVariants({
            variant: props.variant,
            disabled: props.disabled
          }),
          dirty && invalid ? 'textarea__has-error' : ''
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="validate"
        :rows="5"
        :cols="40"
      />

      <div
        v-if="hintText && !invalid"
        class="text-area__hint mt-1 text-sm text-grey-60 float-start"
      >
        {{ hintText }}
      </div>
    </template>

    <template #errors="{ validation }">
      <InputErrorMessage :validation="validation">
        <template #required>
          <slot name="required" />
        </template>
        <template #errors>
          <slot name="errors" :validation="validation" />
        </template>
      </InputErrorMessage>
    </template>
  </BaseInput>
</template>

<style scoped>
.textarea__has-error {
  @apply border-danger-100/60 focus:ring-danger-50/40 focus:border-danger-100/60;
}

.textarea__has-error + .text-sm {
  @apply text-danger-100;
}
</style>
