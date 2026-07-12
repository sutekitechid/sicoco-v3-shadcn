<template>
  <nav>
    <ul :class="navLayout">
      <slot />
    </ul>
  </nav>
</template>

<script setup lang="ts">
/**
 * Komponen Navbar
 * @example '
 * <NavigationMenu class="my-3 shadow-lg">'
 * <NavItem icon="si-home" label="Home" />
 * <NavItem icon="si-user" label="Account" />
 * <NavItem icon="si-wrench" label="Settings" />
 * </NavigationMenu>
 *
 */
import { defineProps, type HTMLAttributes, computed } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
  /**
   * Class tambahan untuk styling navbar
   * @example 'class="rounded-b shadow"'
   */
  class?: HTMLAttributes['class']
}>()

/**
 *
 * @computed
 * @property {string} navLayout - Kelas CSS yang dikomputasi untuk layouting child komponen.
 *
 */
const navLayout = computed(() => {
  return cn('flex w-full bg-primary-default ps-14', props.class)
})
</script>
