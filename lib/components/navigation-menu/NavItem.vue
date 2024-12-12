<template>
  <nuxt-link :to="to" class="group">
    <div
      class="flex items-center gap-2 py-3 px-3 cursor-pointer group-hover:bg-primary-80 text-white group-hover:text-white"
    >
      <i :class="icon" v-if="icon" />
      <slot>{{ label }}</slot>
      <i class="si-chevron-down" v-if="hasDropdown" />
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
}>()
</script>

<style scoped>
/* Gaya tambahan untuk NavItem */
</style>
