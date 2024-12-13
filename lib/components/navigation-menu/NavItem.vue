<template>
  <li
    :class="[cn(navItem({ variant: props.variant }), props.class)]"
    @click="toggleChevron"
  >
    <nuxt-link
      :to="props.to"
      :class="[cn(navLink({ variant: props.variant }), props.class)]"
    >
      <i :class="props.icon" v-if="props.icon" />
      <slot>{{ props.label }}</slot>
      <i id="si-chevron-down" :class="chevronClass" v-if="props.hasDropdown" />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, onBeforeUnmount } from 'vue'
import { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { type NavItem, navItem } from './index'
import { type NavLink, navLink } from './index'

const props = defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
  class?: HTMLAttributes['class']
  variant?: NavLink['variant']
}>()

const isChevronUp = ref(false)

const toggleChevron = () => {
  if (props.hasDropdown) {
    isChevronUp.value = !isChevronUp.value
  }
}

const resetChevron = (event: Event) => {
  if (
    !event
      .composedPath()
      .some(el => (el as HTMLElement).classList?.contains('group'))
  ) {
    isChevronUp.value = false
  }
}

const chevronClass = computed(() =>
  isChevronUp.value ? 'si-chevron-up' : 'si-chevron-down'
)

// Lifecycle
onMounted(() => {
  document.addEventListener('click', resetChevron)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', resetChevron)
})
</script>
