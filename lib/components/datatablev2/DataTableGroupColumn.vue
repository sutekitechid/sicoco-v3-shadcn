<script setup>
import { inject, provide, useSlots } from 'vue'

const props = defineProps({
  name: String,
  order: {
    type: Number,
    default: null
  },
})

const slots = useSlots()
const register = inject('registerGroup')
const parent = inject('groupName', null)

provide('groupName', props.name)

register({
  name: props.name,
  header: slots.header,
  parent,
  order: props.order || -1, // Default order is -1 if not specified
  hasExplicitOrder: props.order !== null
})
</script>

<template>
  <slot />
</template>