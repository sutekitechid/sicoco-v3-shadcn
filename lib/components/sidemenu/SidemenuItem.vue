<template>
  <li :class="itemClass" @click="handleClick">
    <component :is="linkTag" :to="to" :class="labelClass">
      <span v-if="isActive" :class="activeIndicator"></span>
      <slot>{{ label }}</slot>
    </component>
    <slot name="dropdown" v-if="hasDropdown" />
  </li>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = withDefaults(
  defineProps<{
    label: string
    to?: string
    isActive?: boolean
    hasDropdown?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    to: '',
    isActive: false,
    hasDropdown: false,
    class: ''
  }
)

const emit = defineEmits(['click'])

const linkTag = computed(() => (props.to ? 'RouterLink' : 'div'))

function handleClick() {
  emit('click')
}

const itemClass = computed(() =>
  cn(
    'flex items-center cursor-pointer',
    props.isActive && 'text-primary-100 relative',
    props.class
  )
)

const labelClass = computed(() =>
  cn('w-full text-left font-semibold block px-3 py-[0.7rem]', props.class)
)

const activeIndicator = computed(() =>
  cn('w-1 mr-2 -mt-2 -ml-6 h-[90%] absolute bg-primary-100', props.class)
)
</script>
