<template>
  <li :class="[props.class, 'cursor-pointer']" @click="handleClick">
    <nuxt-link
      :to="props.to"
      :class="[
        cn(navLink({ variant: inheritedVariant }), props.class),
        {
          'bg-primary-80':
            isActive &&
            inheritedVariant !== 'dark' &&
            inheritedVariant !== 'light',
          'bg-slate-700': isActive && inheritedVariant === 'dark',
          'bg-neutral-30': isActive && inheritedVariant === 'light'
        }
      ]"
    >
      <i :class="props.icon" v-if="props.icon" />
      <slot>{{ props.label }}</slot>
      <i
        :id="chevronIconId"
        :class="chevronIconClass"
        v-if="props.hasDropdown"
      />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
import { defineProps, inject, ref, onMounted, onUnmounted, computed } from 'vue'
import { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type NavLink, navLink } from './index'

/**
 * Komponen Navbar Item
 * @example '<NavItem icon="si-home-alt" label="Beranda" :isActive="true" />'
 */

const props = defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
  class?: HTMLAttributes['class']
  variant?: NavLink['variant']
  isActive?: boolean
}>()

// Mengambil variant dari parent (NavMenu), menggunakan props.variant sebagai fallback
const inheritedVariant = inject('variant', props.variant ?? 'default')
const isActive = ref(props.isActive ?? false)

const chevronIconId = computed(() =>
  isActive.value ? 'si-chevron-up' : 'si-chevron-down'
)
const chevronIconClass = computed(() =>
  isActive.value ? 'si-chevron-up' : 'si-chevron-down'
)

function handleClick() {
  if (props.hasDropdown) {
    isActive.value = !isActive.value
  }
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('li')) {
    isActive.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})
</script>
