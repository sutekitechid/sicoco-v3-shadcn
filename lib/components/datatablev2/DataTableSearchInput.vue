<template>
  <div class="p-2 flex gap-4 bg-white shadow-md rounded-md items-center h-full">
    <Input
      ref="searchInputRef"
      :model-value="computedModelValue"
      placeholder="Search..."
      class="datatable-search-input"
      @input="onInput"
    />
    <div class="flex items-center gap-2 h-full">
      <Button
        data-cy="datatable-search-close-btn" 
        size="sm"
        outlined
        class="border-none"
        @click="$emit('close')"
      >
        <i class="si-x" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVModel } from '@vueuse/core';
import debounce from 'lodash/debounce';
import Input from '../input/Input.vue'
import Button from '../button/Button.vue'

const props = defineProps({
  modelValue: String,
  totalRecords: {
    type: Number,
    default: 0,
  },
  highlightedText: {
    type: Number,
    default: 0,
  },
})

const emits = defineEmits(['update:modelValue', 'close', 'next', 'previous'])
const computedModelValue = useVModel(props, 'modelValue', emits)

const onInput = debounce((value) => {
  emits('update:modelValue', value)
}, 300)

const searchInputRef = ref(null)
const focusSearchInput = () => {
  searchInputRef.value?.focus()
}

defineExpose({
  focus: focusSearchInput,
})
</script>

<style scoped>
:deep(input) {
  @apply !border-none;
}
</style>
