<template>
  <div class="flex items-center gap-1 ml-2">
    <!-- Sort Button -->
    <button
      v-if="showSortControls"
      class="p-1 rounded hover:bg-gray-100 transition-colors"
      :class="sortButtonClass"
      @click.stop="$emit('toggle-sort')"
    >
      <i 
        v-if="sortState === 'asc'"
        class="si-sort-ascending text-xs"
      />
      <i 
        v-else-if="sortState === 'desc'"
        class="si-sort-descending text-xs"
      />
      <i 
        v-else
        class="si-sort text-xs text-gray-400"
      />
      
      <!-- Multiple sort index indicator -->
      <span 
        v-if="sortIndex && sortIndex > 1" 
        class="text-xs font-medium ml-1 text-primary-60"
      >
        {{ sortIndex }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  sortState: {
    type: String, // 'asc', 'desc', or null
    default: null
  },
  sortIndex: {
    type: Number,
    default: null
  },
  showSortControls: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle-sort'])

const sortButtonClass = computed(() => ({
  'text-primary-60': props.sortState,
  'text-neutral-40': !props.sortState
}))
</script>
