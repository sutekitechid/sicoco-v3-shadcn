<script setup lang="ts">
/**
 * Komponen validasi panjang minimal teks.
 * @module MinLengthValidator
 */

import { minLength as minLengthValidator } from '@vuelidate/validators'
import { computed, watch, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  value?: string | Number
  minlength?: number
}>()

const emit = defineEmits<{
  (e: 'update:invalid', isInvalid: boolean): void
}>()

const minLengthError = computed(() => {
  if (props.minlength !== undefined && props.value !== undefined) {
    const validator = minLengthValidator(props.minlength)
    return !validator.$validator(props.value, {}, {})
  }
  return false
})

watch(minLengthError, isInvalid => {
  emit('update:invalid', isInvalid)
})
</script>

<template>
  <div
    v-if="minLengthError"
    class="text-red-500 textarea-minlength__error mt-1 text-sm"
  >
    Minimal {{ minlength }} karakter.
  </div>
</template>

<style scoped></style>
