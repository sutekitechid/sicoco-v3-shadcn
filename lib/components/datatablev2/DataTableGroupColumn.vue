<script setup>
import { inject, provide, useSlots } from 'vue'

const props = defineProps({
  name: String,
  order: {
    type: Number,
    default: null
  },
  pin: {
    type: String, // PIN_DIRECTION.Left, PIN_DIRECTION.Right, or empty string
    default: '',
  }
})

const slots = useSlots()
const register = inject('registerGroup')
const group = inject('groupName', null)

provide('groupName', props.name)

register({
  name: props.name,
  header: slots.header,
  group,
  order: props.order || -1, // Default order is -1 if not specified
  hasExplicitOrder: props.order !== null,
  pin: props.pin // Add pin prop to registration
})
</script>

<template>
  <slot />
</template>