<template>
  <div class="relative">
    <!-- Left Scroll Indicator - Fixed position outside scroll container -->
    <div 
      v-if="enableHorizontalScroll && showLeftIndicator"
      class="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-neutral-20 via-neutral-10/40 to-transparent dark:from-white/60 dark:via-gray-200/40 z-10 pointer-events-none"
    ></div>
    
    <!-- Right Scroll Indicator - Fixed position outside scroll container -->
    <div 
      v-if="enableHorizontalScroll && showRightIndicator"
      class="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-neutral-20 via-neutral-10/40 to-transparent dark:from-white/60 dark:via-gray-200/40 z-10 pointer-events-none"
    ></div>
    
    <!-- Scroll Container -->
    <div 
      ref="scrollContainer"
      :class="[
        enableHorizontalScroll ? 'overflow-x-auto' : 'overflow-x-visible',
        stickyHeader && maxHeight ? 'overflow-y-auto' : 'overflow-y-visible',
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
    default: true
  },
  maxHeight: {
    type: String,
    default: null
  },
  stickyHeader: {
    type: Boolean,
    default: false
  }
})

const scrollContainer = ref(null)
const showLeftIndicator = ref(false)
const showRightIndicator = ref(false)

const handleScroll = () => {
  if (!scrollContainer.value || !props.enableHorizontalScroll) return
  
  const container = scrollContainer.value
  const scrollLeft = container.scrollLeft
  const scrollWidth = container.scrollWidth
  const clientWidth = container.clientWidth
  
  // Show left indicator if scrolled right
  showLeftIndicator.value = scrollLeft > 0
  
  // Show right indicator if can scroll more to the right
  showRightIndicator.value = scrollLeft < scrollWidth - clientWidth - 1
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
  scrollContainer
})
</script>
