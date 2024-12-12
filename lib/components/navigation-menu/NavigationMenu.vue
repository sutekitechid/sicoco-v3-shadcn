<template>
  <header>
    <NavContainer>
      <slot />
    </NavContainer>
  </header>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { NavContainer } from './index'

const props = defineProps<{
  class?: string
}>()
</script>
