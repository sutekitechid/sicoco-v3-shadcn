<template>
	<aside :class="sidenavClass">
		<SidemenuItem
			v-for="(item, index) in props.items"
			:key="index"
			:items="item"
			:is-active="isActive(item.value)"
			:has-border-bottom="props.items.length !== index + 1"
			@select="onSelect"
		/>

		<slot />
	</aside>
</template>

<script setup lang="ts">
/**
 * The Sidemenu Component
 * selectable navigation items, support active state and routing between page
 * 
 * @figma https://www.figma.com/design/KC07QctZq9skLaxmQ43c3p/Portal-Dosen-Revamp?node-id=475-21298&t=maGFJwf8pnF5vgBJ-4
 * 
 * @example
 * const selectedItem = ref('')
 * const menuItems = [
		{ value: 'home', label: 'Home', route: '/' },
		{ value: 'about', label: 'About', route: '/about' },
	]
 * <Sidemenu v-model="selectedItem" class="shadow-md" :items="menuItems" />
 * 
 * @import
 * import Sidemenu from '@/components/sidemenu/Sidemenu.vue'
 */
import { defineProps, defineEmits, computed, type HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import type { SidemenuInterface } from '@/types/sidemenu'
import { cn } from '../../utils/tw-merge'
import SidemenuItem from './SidemenuItem.vue'

/**
 * @props
 * @property {Array<{value: string; label: string; to: string}>} [items=[]] - List of navigation items.
 * @property {HTMLAttributes['class']} [class=""] - Custom CSS class.
 */

const props = withDefaults(
	defineProps<{
		modelValue: string
		items?: SidemenuInterface[]
		class?: HTMLAttributes['class']
	}>(),
	{
		modelValue: '',
		class: '',
	}
)
/**
 * @emits
 * @event update:modelValue
 */
const emit = defineEmits(['update:modelValue', 'select'])

const computedModelValue = useVModel(props, 'modelValue', emit)
/**
 * @param index
 * @methods
 * @method onSelect - Update the active item index and trigger events `update:modelValue`.
 */
function onSelect(value: SidemenuInterface) {
	computedModelValue.value = value.value
	emit('select', value)
}

const isActive = (value: string) => {
	return computedModelValue.value === value
}
/**
 * @computed
 * @property {string} sidenavClass - Custom CSS class.
 */
const sidenavClass = computed(() =>
	cn(
		'flex flex-col items-start bg-white p-3 w-full rounded-md h-[450px] max-w-[200px] dark:bg-transparent',
		props.class
	)
)
</script>
