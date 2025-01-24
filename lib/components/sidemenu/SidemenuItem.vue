<template>
	<section
		:class="{
			'border-b border-dotted dark:border-neutral-40': hasBorderBottom,
		}"
		class="flex items-center w-full"
		@click="onSelectItem"
	>
		<span :class="isActive && activeIndicator"></span>
		<component
			:is="props.as"
			:to="props.items.route"
			:href="props.items.route"
			:class="reactedClass"
		>
			{{ props.items.label }}
		</component>
		<slot name="dropdown" v-if="hasDropdown" />
	</section>
</template>

<script setup lang="ts">
/**
 *
 * The SidemenuItem Component
 * The child component of Sidemenu component with reactive UI, dropdown,
 * and customize tag with router-link as default.
 *
 */

import { computed, defineProps, defineEmits, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import type { SidemenuInterface } from '@/types/sidemenu'

/**
 * @props
 * @property {SidemenuInterface} items - The navigation item to be displayed in the sidebar.
 * @property {boolean} [isActive=false] - Determines whether the item is in an active state.
 * @property {boolean} [hasDropdown=false] - Determines whether the item has a dropdown.
 * @property {string} [as='router-link'] - The element type to render; can be a tag (e.g., 'a', 'div') or a component (e.g., 'RouterLink').
 * @property {boolean} hasBorderBottom - Determines whether the item has a bottom border.
 */
const props = withDefaults(
	defineProps<{
		items: SidemenuInterface
		isActive?: boolean
		hasDropdown?: boolean
		as?: string
		hasBorderBottom: boolean
	}>(),
	{
		isActive: false,
		hasDropdown: false,
		as: 'router-link',
	}
)
/**
 * @emits
 * @event click
 */
const emit = defineEmits(['select'])

function onSelectItem() {
	emit('select', props.items)
}

/**
 * @computed
 * @property {string} reactedClass - The combined CSS class for the main navigation element, considering the active state and additional classes.
 * @property {string} activeIndicator - The CSS class for the active state indicator visible on the active item.
 */
const reactedClass = computed(() =>
	cn(
		'cursor-pointer w-full text-left font-semibold block px-3 py-[0.7rem] dark:text-white',
		props.isActive && 'text-primary-100 dark:text-primary-100 relative'
	)
)
const activeIndicator = computed(() =>
	cn('w-1 mr-2 -mt-1 -ml-3 h-10 absolute bg-primary-100')
)
</script>
