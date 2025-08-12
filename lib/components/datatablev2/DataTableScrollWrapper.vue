<template>
  <div
    class="relative scroll-wrapper" 
  >
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      :class="[
        enableHorizontalScroll ? 'overflow-x-auto' : 'overflow-x-hidden',
        'w-full overflow-y-hidden',
      ]"
      @scroll="handleScroll"
    >
      <!-- Content -->
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  enableHorizontalScroll: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['scroll'])

const scrollContainer = ref(null)

const handleScroll = (e) => {
  // Emit scroll event
  emits('scroll', e)
}

defineExpose({
  scrollContainer,
})
</script>
