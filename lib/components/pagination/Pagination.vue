<script setup lang="ts">
/**
 * 'Pagination' is a component that allows users to navigate through pages of content.
 *
 * Props for the Pagination component
 * @props {number|string} total: 0 - Total number of items
 * @props {number|string} perPage: 10 - Number of items per page
 * @props {number[]|string[]} options: [10, 20, 50, 100] - Options for items per page
 * @props {number|string} page: 1 - Current page number
 * @props {number|string} defaultPage: 1 - Default page number
 * @props {string} perPageLabelText: 'Tampilkan' - Label text for items per page component,
 * usefull for i18n
 * @props {function} perPageItemFormatter: (perPage) => `${perPage} per halaman` - Formatter
 * function for per page option label, usefull for i18n
 *
 * @example
 * ```vue
 * <template>
 *  <Pagination
 * 	 :total="total"
 *   :perPage="perPage"
 *   :page="page"
 * 	 :options="[5, 10, 20, 50]"
 *   :defaultPage="defaultPage"
 *   :per-page-label-text="Tampilken"
 *   :per-page-item-formatter="(perPage) => `${perPage} per kaca`"
 *  />
 * </template>
 * ```
 */
import cloneDeep from 'lodash/cloneDeep'
import { useVModel } from '@vueuse/core'
import {
	ref,
	watch,
	computed,
	defineProps,
	defineEmits,
	withDefaults,
} from 'vue'
import {
	PaginationRoot,
	PaginationList,
	PaginationListItem,
	PaginationNext,
	PaginationPrev,
	PaginationInputPage,
	ItemsPerPage,
	PaginationFirstPageButton,
	PaginationLastPageButton,
} from '.'
import { Button } from '../button'
import { PaginationIndexType } from './constants'

interface Props {
	total?: number | string
	perPage?: number | string
	page?: number | string
	defaultPage?: number | string
	options?: number[]
	perPageLabelText?: string
	perPageItemFormatter?: (perPage: number | string) => string
	showPerPageOptions?: boolean
	showPaginationInput?: boolean
}

/** Default values for the props */
const props = withDefaults(defineProps<Props>(), {
	total: 0,
	perPage: 20,
	page: 1,
	defaultPage: 1,
	options: undefined,
	perPageLabelText: undefined,
	perPageItemFormatter: undefined,
	showPerPageOptions: true,
	showPaginationInput: true,
})

/** Emits events for updating perPage and page */
const emit = defineEmits([
	'update:perPage',
	'update:page',
	'change-page',
	'change-per-page',
])

/**
 * Computed property for perPage that returns the perPage
 * and emits the `update:perPage` event
 */
const computedPerPage = useVModel(props, 'perPage', emit)

/** Computed property for page that returns the page and emits the `update:page` event */
const computedPage = useVModel(props, 'page', emit)

/**
 * Checks if the given page is the active page
 * @param page - Page number to check
 * @returns true if the page is active, false otherwise
 */
function isActivePage(page: number): boolean {
	return page === props.page
}

/** Index of the current page */
const pageIndex = ref<number>()

/**
 * Handles input for pagination forward
 * @param value - New page value
 * @returns void
 */
function onInputPaginationForward(value: any): void {
	computedPage.value = cloneDeep(Number(value))
}

/** Watcher for computedPerPage to reset page to 1 */
watch(computedPerPage, (): void => {
	computedPage.value = 1
})

/**
 * Handles click event for pagination list item
 * Sets the page number to the clicked page number
 * @param value - Page number to set
 * @returns void
 */
function onClickPaginationListItem(value: number): void {
	computedPage.value = value
	emit('change-page', value)
}

/**
 * Handles click event for pagination prev
 * Decrements the page by 1
 * @returns void
 */
function onClickPaginationPrev(): void {
	computedPage.value = Number(computedPage.value) - 1
}

/**
 * Handles click event for pagination next
 * Increments the page by 1
 * @returns void
 */
function onClickPaginationNext(): void {
	computedPage.value = Number(computedPage.value) + 1
}

/**
 * Checks if the pagination prev button is disabled
 * @returns true if the pagination prev button is disabled, false otherwise
 */
const paginationPrevIsDisabled = computed(
	() => Number(computedPage.value) === 1
)

/**
 * Check if the pagination next button is disabled
 * @returns true if the pagination next button is disabled, false otherwise
 */
const paginationNextIsDisabled = computed(() => {
	return Number(computedPage.value) === pageCount.value
})

/**
 * Check if the pagination forward is disabled
 * @returns true if the pagination forward is disabled, false otherwise
 */
const paginationForwarIsDisabled = computed(() => {
	return pageCount.value === 1
})

/**
 * Check if the pagination last page is disabled
 * @returns true if the pagination last page is disabled, false otherwise
 */
const paginationLastPageIsDisabled = computed(() => {
	return props.page === pageCount.value
})

/**
 * Check if the pagination first page is disabled
 * @returns true if the pagination first page is disabled, false otherwise
 */
const paginationFirstPageIsDisabled = computed(() => {
	return props.page === 1
})

/**
 * Total number of pages
 * @returns number
 */
const pageCount = computed(() => {
	const total = Number(props.total)
	const perPage = Number(computedPerPage.value)
	return Math.ceil(total / perPage)
})

/**
 * Handler function for the `change` event that emits
 * the `change-per-page` event with the selected value
 */
function onChangeItemsPerPage(value: number): void {
	emit('change-per-page', value)
}

const shouldShowPerPage = computed(() => {
	return props.showPerPageOptions
})
const shouldShowPaginationInput = computed(() => {
	return props.showPaginationInput
})
</script>

<template>
	<PaginationRoot
		:page="Number(computedPage)"
		:total="Number(total)"
		:sibling-count="1"
		:default-page="Number(defaultPage)"
		:items-per-page="Number(computedPerPage)"
		class="flex w-full justify-between gap-4"
	>
		<ItemsPerPage
			v-if="shouldShowPerPage"
			class="hidden md:flex"
			:total="total"
			v-model="computedPerPage"
			:options="options"
			:label-text="perPageLabelText"
			:per-page-formatter="perPageItemFormatter"
			@change="onChangeItemsPerPage"
		/>
		<PaginationList v-slot="{ items }" class="flex items-center gap-1">
			<div class="flex items-center gap-1">
				<template v-for="(item, index) in items">
					<PaginationListItem
						v-if="item.type === PaginationIndexType.PAGE"
						:key="index"
						:value="item.value"
						as-child
					>
						<Button
							variant="primary"
							:outlined="!isActivePage(item.value)"
							@click="onClickPaginationListItem(item.value)"
						>
							{{ item.value }}
						</Button>
					</PaginationListItem>
				</template>
				<PaginationPrev
					class="pagination-prev"
					@click="onClickPaginationPrev"
					:disabled="paginationPrevIsDisabled"
				/>
				<PaginationNext
					@click="onClickPaginationNext"
					:disabled="paginationNextIsDisabled"
					class="pagination-next"
				/>
			</div>
			<PaginationInputPage
				v-if="shouldShowPaginationInput"
				class="ml-2 pl-3 border-l-1 border-neutral-30"
				v-model="computedPage"
				:disabled="paginationForwarIsDisabled"
				:total-pages="pageCount"
				@input="onInputPaginationForward"
			/>
			<PaginationFirstPageButton
				v-if="shouldShowPaginationInput"
				@click="onClickPaginationListItem(1)"
				:disabled="paginationFirstPageIsDisabled"
			/>
			<PaginationLastPageButton
				v-if="shouldShowPaginationInput"
				@click="onClickPaginationListItem(pageCount)"
				:disabled="paginationLastPageIsDisabled"
			/>
		</PaginationList>
	</PaginationRoot>
</template>
