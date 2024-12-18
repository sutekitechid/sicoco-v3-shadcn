<template>
  <nav>
    <ul :class="navLayout">
      <slot />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { defineProps, type HTMLAttributes, computed } from 'vue'
import { cn } from '../../utils/tw-merge'

/**
 * Komponen Navbar
 * @example '
 * <NavigationMenu class="my-3 shadow-lg">'
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
}>()

const navLayout = computed(() => {
  return cn('flex w-full justify-evenly bg-primary-100', props.class)
})
</script>
