<template>
  <InputMorpUnit
    class="absolute inset-y-0 right-0 flex items-center pr-3"
    @width-change="emits('width-change', $event)"
  >
    <slot />
  </InputMorpUnit>
</template>

<script setup lang="ts">
/**
 * Component that handles the input suffix
 */
import { InputMorpUnit } from '.'

const emits = defineEmits(['width-change'])
</script>
