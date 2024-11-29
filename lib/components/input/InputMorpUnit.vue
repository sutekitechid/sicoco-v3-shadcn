<template>
  <div ref="morphUnitRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * Component that wraps the input prefix or suffix to get the width of the element
 */
import { computed, watch, ref } from 'vue'

const morphUnitRef = ref(null)
const emits = defineEmits()

const morphUnitWidth = computed(() => {
  const prefix = morphUnitRef.value
  if (!prefix) return 0
  return prefix.offsetWidth
})

watch(morphUnitWidth, (value) => {
  emits('width-change', value)
})
</script>
