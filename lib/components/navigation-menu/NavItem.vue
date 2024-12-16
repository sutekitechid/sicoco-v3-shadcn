<template>
  <li :class="[props.class, 'cursor-pointer']">
    <nuxt-link
      :to="props.to"
      :class="[
        cn(navLink({ variant: inheritedVariant }), props.class),
        {
          'bg-primary-80': props.isActive
        }
      ]"
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

/**
 * Komponen Navbar Item
 * @example '<NavItem icon="si-home-alt" label="Beranda" :isActive="true" />'
 */

const props = defineProps<{
  /**
   * Ikon yang ditampilkan di sebelah label (jika ada)
   * @example 'icon="si-home"'
   */
  icon?: string
  /**
   * Label yang ditampilkan dalam item navigasi
   * @example 'label="Home"'
   */
  label?: string
  /**
   * Alamat tujuan navigasi (link)
   * @example 'to="/your-direction"'
   */
  to?: string
  /**
   * Menandakan apakah item memiliki dropdown
   * @example '<NavItem icon="si-work-agenda" label="Agenda" hasDropdown/>'
   */
  hasDropdown?: boolean
  class?: HTMLAttributes['class']
  /**
   * Variasi akan menyesuaikan dengan parent(NavigationMenu)
   */
  variant?: NavLink['variant']
  /**
   * Menandakan apakah item sedang aktif
   * @example '<NavItem icon="si-home-alt" label="Beranda" :isActive="true" />'
   */
  isActive?: boolean
}>()

// Mengambil variant dari parent (NavMenu)
const inheritedVariant = inject('variant', props.variant)
</script>
