<template>
  <li :class="[props.class, 'cursor-pointer']" @click="handleClick">
    <component :to="props.to" :class="navLinkClass">
      <i :class="props.icon" v-if="props.icon" />
      <slot>{{ props.label }}</slot>
      <i :class="chevronIconClass" v-if="props.hasDropdown" />
    </component>
  </li>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, onUnmounted, computed } from 'vue'
import { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
  class?: HTMLAttributes['class']
  isActive?: boolean
}>()

const navLinkClass = computed(() => {
  return cn(
    props.class,
    'flex',
    'items-center',
    'gap-2',
    'py-[0.75rem]',
    'px-3',
    'text-white',
    'hover:bg-primary-80',
    isActive.value ? 'bg-primary-80' : ''
  )
})

const isActive = ref(props.isActive ?? false)

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
