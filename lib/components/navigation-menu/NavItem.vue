<template>
  <li class="cursor-pointer group" @click="toggleChevron">
    <nuxt-link
      :to="to"
      class="flex items-center gap-2 py-3 group-hover:bg-primary-80 text-white group-hover:text-white"
    >
      <i :class="icon" v-if="icon" />
      <slot>{{ label }}</slot>
      <i id="si-chevron-down" :class="chevronClass" v-if="hasDropdown" />
    </nuxt-link>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  icon?: string
  label?: string
  to?: string
  hasDropdown?: boolean
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

onMounted(() => {
  document.addEventListener('click', resetChevron)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', resetChevron)
})
</script>

<style scoped>
/* Gaya tambahan untuk NavItem */
</style>
