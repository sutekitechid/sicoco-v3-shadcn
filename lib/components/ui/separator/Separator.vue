<script setup lang="ts">
import { cn } from '@/utils/tw-merge'

const props = defineProps<{
  orientation?: 'horizontal' | 'vertical'
  class?: string | Record<string, boolean>
}>()
</script>

<template>
  <div
    role="separator"
    :orientation="orientation"
    :class="cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', props.class)"
  />
</template>
