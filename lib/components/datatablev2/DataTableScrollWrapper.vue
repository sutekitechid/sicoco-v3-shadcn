<template>
  <div
    class="relative scroll-wrapper" 
  >
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      :class="[
        enableHorizontalScroll ? 'overflow-x-auto' : 'overflow-x-visible',
        stickyHeader && maxHeight ? 'overflow-y-auto' : 'overflow-y-visible',
        'scroll-content w-full'
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
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  enableHorizontalScroll: {
    type: Boolean,
    default: true,
  },
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
const showLeftIndicator = ref(false)
const showRightIndicator = ref(false)

const handleScroll = (e) => {
  if (!scrollContainer.value || !props.enableHorizontalScroll) return

  const container = scrollContainer.value
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth

  // Show left indicator if scrolled right
  showLeftIndicator.value = scrollLeft > 0

  // Show right indicator if can scroll more to the right
  showRightIndicator.value = scrollLeft < scrollWidth - clientWidth - 1

  // Emit scroll event
  emits('scroll', e)
}

const checkScrollable = () => {
  if (!scrollContainer.value || !props.enableHorizontalScroll) return

  const container = scrollContainer.value
  const isScrollable = container.scrollWidth > container.clientWidth

  if (isScrollable) {
    showRightIndicator.value = true
  } else {
    showLeftIndicator.value = false
    showRightIndicator.value = false
  }
}

onMounted(() => {
  if (props.enableHorizontalScroll) {
    // Check initially
    setTimeout(checkScrollable, 100)

    // Check on resize
    window.addEventListener('resize', checkScrollable)

    // Use ResizeObserver if available
    if (window.ResizeObserver && scrollContainer.value) {
      const resizeObserver = new ResizeObserver(checkScrollable)
      resizeObserver.observe(scrollContainer.value)

      onUnmounted(() => {
        resizeObserver.disconnect()
      })
    }
  }
})

onUnmounted(() => {
  if (props.enableHorizontalScroll) {
    window.removeEventListener('resize', checkScrollable)
  }
})

defineExpose({
  scrollContainer,
})
</script>
