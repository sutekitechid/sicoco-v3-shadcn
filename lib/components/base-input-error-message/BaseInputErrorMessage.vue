<template>
  <div v-if="invalid">
    <slot />
  </div>
  <p
    v-else
    class="text-xs"
  >-</p>
</template>

<script setup lang="ts">
/**
 * Component that used as the base for input error message
 */
defineProps<{
  invalid: boolean
}>()
</script>
