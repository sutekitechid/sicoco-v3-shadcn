<template>
  <div
    class="relative scroll-wrapper" 
  >
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      :class="[
        stickyHeader && maxHeight ? 'overflow-y-auto' : 'overflow-y-visible',
        'scroll-content w-full overflow-x-hidden',
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

const props = defineProps({
  maxHeight: {
    type: String,
    default: null,
  },
  stickyHeader: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['scroll'])

const scrollContainer = ref(null)

const handleScroll = (e) => {
  if (!scrollContainer.value || !props.enableHorizontalScroll) return

  // Emit scroll event
  emits('scroll', e)
}

defineExpose({
  scrollContainer,
})
</script>
