<template>
  <aside :class="sidenavClass">
    <ul class="flex flex-col items-start">
      <template v-for="(item, index) in items" :key="index">
        <li :class="activeIndex === index ? activeClass : 'cursor-pointer'">
          <component
            :to="item.to"
            :class="labelClass"
            @click="handleClick(index)"
          >
            <span v-if="activeIndex === index" :class="activeIndicator"></span>
            {{ item.label }}
          </component>
        </li>
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
import { sidemenuVariants, SidemenuVariants } from './index'
import { cn } from '../../utils/tw-merge'

const props = withDefaults(
  defineProps<{
    /**
     * The items to display in the side menu.
     * @default []
     */
    items?: { label: string; to: string }[]

    /**
     * The index of the item that should be active by default.
     * @default 0
     */
    defaultActiveIndex?: number

    /**
     * The variant of the side menu, which determines the styling.
     * @default 'default'
     */
    variant?: SidemenuVariants['variant']

    /**
     * Additional CSS classes for the root element of the side menu.
     * @default ''
     */
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
  cn(
    props.class,
    'bg-white',
    'p-3',
    'w-full',
    'rounded-md',
    'h-[450px]',
    'max-w-[200px]'
  )
)

const activeIndicator = computed(() =>
  cn(
    sidemenuVariants({ variant: props.variant }),
    props.class,
    'w-1',
    'mr-2',
    '-mt-2',
    '-ml-6',
    'h-[90%]',
    'absolute'
  )
)

const labelClass = computed(() =>
  cn(
    props.class,
    'py-[0.7rem]',
    'px-3',
    'text-left',
    'font-semibold',
    'w-full',
    'block'
  )
)

const activeClass = computed(() =>
  cn(
    props.class,
    'flex',
    'items-center',
    'relative',
    activeIndex.value !== undefined && 'text-purple-800'
  )
)
</script>

<style scoped>
.active {
  @apply text-purple-800;
  @apply flex items-center;
  @apply relative;
}
</style>
