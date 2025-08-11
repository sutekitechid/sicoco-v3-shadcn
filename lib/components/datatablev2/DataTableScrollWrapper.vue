<template>
  <div
    class="relative scroll-wrapper" 
  >
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      :class="[
        stickyHeader && maxHeight ? 'overflow-y-auto' : 'overflow-y-visible',
        enableHorizontalScroll ? 'overflow-x-auto' : 'overflow-x-hidden',
        'scroll-content w-full',
      ]"
      :style="stickyHeader && maxHeight ? { maxHeight } : {}"
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
  maxHeight: {
    type: String,
    default: null,
  },
  stickyHeader: {
    type: Boolean,
    default: false,
  },
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
