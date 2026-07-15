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
 * @props {string} labelText: 'Per halaman' - Label text for the component, usefull for i18n
 * @props {function} perPageFormatter: (perPage) => `${perPage} Baris` - Formatter function
 * for per page option label, usefull for i18n
 *
 * @example
 * ```vue
 * <template>
 *  <ItemsPerPage
 *   class="text-danger-200"
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
		currentPage?: number | string
		options?: number[]
		total?: number | string
		visibleItems?: unknown[]
		labelText?: string
		perPageFormatter?: (perPage: number | string) => string
		dataCy?: string
		dataTestid?: string
	}>(),
	{
		currentPage: 1,
		modelValue: DEFAULT_PER_PAGE,
		options: () => [10, 20, 50, 100],
		total: 0,
		perPageFormatter: (perPage: number | string) => `${perPage} Baris`,
		labelText: 'Per halaman',
		visibleItems: undefined,
	},
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

const dropdownItemDataTestid = computed(() =>
	getDataCyWithPrefix('dropdown-item', props.dataTestid || props.dataCy)
)

const showingStart = computed(() => {
	const totalItems = Number(props.total)
	if (totalItems === 0) return 0

	return (Number(props.currentPage) - 1) * Number(props.modelValue) + 1
})

const showingEnd = computed(() => {
	const totalItems = Number(props.total)

	return Math.min(
		Number(props.currentPage) * Number(props.modelValue),
		totalItems,
	)
})
</script>

<template>
	<div :class="cn('flex flex-col md:flex-row gap-4 items-start', props.class)">
		<div class="flex gap-2">
			<p class="text-main text-label-md">{{ labelText }}</p>
			<Dropdown v-model="computedModelValue" @select="onSelect">
				<template #trigger="{ open }">
					<div
						class="item-per-page__dropdown-trigger inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-200 focus:ring-2 focus:ring-primary-50 bg-transparent dark:bg-neutral-100 hover:bg-neutral-100"
						:data-cy="props.dataCy"
						:data-testid="props.dataTestid ?? props.dataCy"
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
					:data-testid="dropdownItemDataTestid"
				>
					{{ perPageFormatter(perPage) }}
				</DropdownItem>
			</Dropdown>
		</div>
		<p class="text-neutral-700 text-label-md font-normal dark:text-neutral-500">
			Menampilkan
			<span class="font-semibold">{{ showingStart }} - {{ showingEnd }}</span>
			dari {{ total }} data
		</p>
	</div>
</template>
