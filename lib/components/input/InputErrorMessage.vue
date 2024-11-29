<template>
  <BaseInputErrorMessage
    :invalid="validation.$invalid"
    class="text-sm"
  >
    <div v-if="validation.required?.$invalid">
      Wajib diisi
    </div>
    <div v-else-if="validation.minValue?.$invalid">
      Minimal {{ min }}
    </div>
    <div v-else-if="validation.maxValue?.$invalid">
      Maksimal {{ max }}
    </div>
    <div v-else-if="validation.exactLength?.$invalid">
      Harus {{ exactLength }} karakter
    </div>
    <div v-else-if="validation.email?.$invalid">
      Email tidak valid
    </div>
    <div v-else-if="validation.url?.$invalid">
      Masukkan URL yang valid. Contoh: https://example.com
    </div>
    <div v-else-if="validation.$invalid">
      <slot name="errors" />
    </div>
  </BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * Component that handles the input validation error messages
 */
import BaseInputErrorMessage from '../base-input-error-message';

defineProps<{
  validation: any
  min?: number
  max?: number
  exactLength?: number
}>()

const slots = defineSlots<{
  required?: string
  minValue?: string
  maxValue?: string
  exactLength?: string
  email?: string
}>()
</script>
