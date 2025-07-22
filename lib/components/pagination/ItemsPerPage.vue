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
import { getDataCyWithPrefix } from '../../utils/string'
import DropdownChevron from '../dropdown/DropdownChevron.vue'

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		modelValue?: number | string
		options?: number[]
		total?: number | string
		labelText?: string
		perPageFormatter?: (perPage: number | string) => string
		dataCy?: string
	}>(),
	{
		modelValue: DEFAULT_PER_PAGE,
		options: () => [10, 20, 50, 100],
		total: 0,
		perPageFormatter: (perPage: number | string) => `${perPage} per halaman`,
		labelText: 'Tampilkan',
	}
)

/** Emits events for the ItemsPerPage component */
const emit = defineEmits(['update:model-value', 'change'])

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

/**
 * Handler function for the `select` event that emits
 * the `change` event with the selected value
 */
function onSelect(value: number): void {
	emit('change', value)
}

const dropdownItemDataCy = computed(() =>
	getDataCyWithPrefix('dropdown-item', props.dataCy)
)
</script>

<template>
	<div :class="cn('flex gap-3 text-sm items-start', props.class)">
		<p class="text-neutral-60 pt-3">{{ labelText }}</p>
		<Dropdown v-model="computedModelValue" @select="onSelect">
			<template #trigger="{ open }">
				<div
					class="item-per-page__dropdown-trigger inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-3 bg-transparent dark:bg-neutral-10 hover:bg-neutral-10"
					:data-cy="props.dataCy"
				>
					<div class="flex items-center gap-2">
						{{ perPageFormatter(modelValue) }}
					</div>
					<DropdownChevron :open="open" />
				</div>
			</template>
			<DropdownItem
				v-for="perPage in options"
				:key="perPage"
				:value="perPage"
				:data-cy="dropdownItemDataCy"
			>
				{{ perPageFormatter(perPage) }}
			</DropdownItem>
		</Dropdown>
		<p class="text-neutral-100 font-semibold pt-3">Total data : {{ total }}</p>
	</div>
</template>
