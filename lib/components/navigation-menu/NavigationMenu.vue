<template>
  <nav>
    <ul :class="[cn(navbarVariants({ layout: props.layout }), props.class)]">
      <slot />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type NavbarVariants, navbarVariants } from './index'

const props = defineProps<{
  class?: HTMLAttributes['class']
  layout?: NavbarVariants['layout']
}>()
</script>
