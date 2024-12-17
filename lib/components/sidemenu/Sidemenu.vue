<template>
  <aside :class="sidenavClass">
    <ul class="flex flex-col items-start">
      <template v-for="(item, index) in items" :key="index">
        <SidemenuItem
          :label="item.label"
          :to="item.to"
          :isActive="activeIndex === index"
          :class="cn(props.class)"
          @click="handleClick(index)"
        />
        <div
          v-if="index < items.length - 1"
          class="w-[85%] ml-3 border-b border-dotted"
        ></div>
      </template>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  type HTMLAttributes
} from 'vue'
import { cn } from '../../utils/tw-merge'
import SidemenuItem from './SidemenuItem.vue'

const props = withDefaults(
  defineProps<{
    items?: { label: string; to: string }[]
    defaultActiveIndex?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    items: [],
    defaultActiveIndex: 0,
    variant: 'default',
    class: ''
  }
)

const emit = defineEmits(['update:activeIndex'])
const activeIndex = ref(props.defaultActiveIndex)

function handleClick(index: number) {
  activeIndex.value = index
  emit('update:activeIndex', index)
}

const sidenavClass = computed(() =>
  cn(props.class, 'bg-white p-3 w-full rounded-md h-[450px] max-w-[200px]')
)
</script>

<style scoped>
.active {
  @apply text-purple-800;
  @apply flex items-center;
  @apply relative;
}
</style>
