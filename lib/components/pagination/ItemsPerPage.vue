<script setup lang="ts">
/**
 * 'ItemsPerPage' is a component that allows users to select the number of items
 * to display per page.
 *
 * Props for the ItemsPerPage component
 * @props {string} class - Additional CSS classes
 * @props {number|string} modelValue: 10 - Additional CSS classes
 * @props {number[]|string[]} options: [10, 20, 50, 100] - Options for items per page
 * @props {number|string} total: 0 - Total number of items
 * @props {string} labelText: 'Tampilkan' - Label text for the component, usefull for i18n
 * @props {function} perPageFormatter: (perPage) => `${perPage} per halaman` - Formatter function
 * for per page option label, usefull for i18n
 *
 * @example
 * ```vue
 * <template>
 *  <ItemsPerPage
 *   class="text-danger-50"
 *   v-model="perPage"
 *   :total="total"
 *   :per-page-formatter="(perPage) => `${perPage} per kaca`"
 *   :label-text="Tampilkeun"
 *   :options="[5, 10, 20, 50]"
 *  />
 * </template>
 * ```
 */
import { computed, defineEmits, type HTMLAttributes } from 'vue'
import { DEFAULT_PER_PAGE } from './constants'
import { Dropdown, DropdownItem } from '../dropdown'
import { cn } from '../../utils/tw-merge'

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		modelValue?: number | string
		options?: number[] | string[]
		total?: number | string
		labelText?: string
		perPageFormatter?: (perPage: number | string) => string
	}>(),
	{
		modelValue: DEFAULT_PER_PAGE,
		options: [10, 20, 50, 100],
		total: 0,
		perPageFormatter: (perPage: number | string) => `${perPage} per halaman`,
		labelText: 'Tampilkan',
	}
)

/** Emits events for the ItemsPerPage component */
const emit = defineEmits(['update:model-value'])

/**
 * Computed properpty for model value that returns the current value of items per page and
 * emits the `update:model-value` event when the value is changed
 */
const computedModelValue = computed({
	get: () => props.modelValue,
	set: (value: number) => {
		emit('update:model-value', value)
	},
})
</script>

<template>
	<div :class="cn('flex gap-3 text-sm items-start', props.class)">
		<p class="text-neutral-60 pt-3">{{ labelText }}</p>
		<Dropdown v-model="computedModelValue">
			<DropdownItem
				v-for="perPage in options"
				:key="perPage"
				:value="perPage"
				:disabled="Number(perPage) > Number(total)"
			>
				{{ perPageFormatter(perPage) }}
			</DropdownItem>
		</Dropdown>
		<p class="text-neutral-100 font-semibold pt-3">Total data : {{ total }}</p>
	</div>
</template>
