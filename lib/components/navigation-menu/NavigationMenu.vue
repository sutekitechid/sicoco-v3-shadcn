<template>
  <nav>
    <ul
      :class="[
        cn(
          navbarVariants({ layout: props.layout, variant: props.variant }),
          props.class
        )
      ]"
    >
      <slot />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, provide, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type NavbarVariants, navbarVariants } from './index'

/**
 * Komponen Navbar
 * @example '
 * <NavigationMenu class="my-3 shadow-lg" layout="centered">'
 * <NavItem icon="si-home" label="Home" />
 * <NavItem icon="si-user" label="Account" />
 * <NavItem icon="si-wrench" label="Settings" />
 * </NavigationMenu>
 */

const props = defineProps<{
  /**
   * Class tambahan untuk styling navbar
   * @example 'class="rounded-b shadow"'
   */
  class?: HTMLAttributes['class']
  /**
   * Menentukan varian navbar yang digunakan (enum: 'dark', 'light')
   * @example 'variant="dark"'
   */
  variant?: NavbarVariants['variant']
  /**
   * Menentukan layout navbar item (enum: 'spaced', 'centered')
   * @example 'layout="centered"'
   */
  layout?: NavbarVariants['layout']
}>()

// Menyediakan variant untuk diteruskan ke child component(navitem)
provide('variant', props.variant)
</script>
