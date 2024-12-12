<template>
  <BaseInputErrorMessage :invalid="validation.$invalid" class="text-sm">
    <div v-if="validation.required.$invalid">
      <slot name="required" />
    </div>

    <div v-else-if="validation.minlength.$invalid">
      <slot name="minlength" />
    </div>
    <div v-else-if="validation.$invalid">
      <slot name="errors" />
    </div>
  </BaseInputErrorMessage>
</template>

<script setup lang="ts">
/**
 * Komponen untuk menampilkan pesan kesalahan validasi pada Textarea
 */
import BaseInputErrorMessage from '../base-input-error-message'

defineProps<{
  validation: any
}>()

const slots = defineSlots<{
  required?: string
  minlength?: string
  errors?: string
}>()
</script>
