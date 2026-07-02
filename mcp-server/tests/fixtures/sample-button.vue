<script setup lang="ts">
/**
 * Sample button SFC for parser tests.
 */
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props {
  /** The visual variant. */
  variant?: 'primary' | 'danger'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
})

const emits = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button :class="cn('btn', props.class)" @click="emits('click')">
    <slot />
  </button>
</template>
