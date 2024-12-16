<template>
  <li :class="[props.class, 'cursor-pointer']">
    <nuxt-link
      :to="props.to"
      :class="[cn(navLink({ variant: inheritedVariant }), props.class)]"
    >
      <i :class="props.icon" v-if="props.icon" />
      <slot>{{ props.label }}</slot>
      <i
        id="si-chevron-down"
        class="si-chevron-down"
        v-if="props.hasDropdown"
      />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
import { defineProps, inject } from 'vue'
import { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type NavLink, navLink } from './index'

// Mendefinisikan props untuk NavItem
const props = defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
  class?: HTMLAttributes['class']
  variant?: NavLink['variant']
}>()

// Mengambil variant dari parent (NavMenu) jika tidak ada di props
const inheritedVariant = inject('variant', props.variant)
</script>
