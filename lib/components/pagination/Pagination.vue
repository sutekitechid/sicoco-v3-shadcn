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
	PaginationForward,
	ItemsPerPage,
} from '.'
import { Button } from '../button'

interface Props {
	total?: number | string
	perPage?: number | string
	page?: number | string
	defaultPage?: number | string
	options?: number[] | string[]
	perPageLabelText?: string
	perPageItemFormatter?: (perPage: number | string) => string
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
})

/** Emits events for updating perPage and page */
const emit = defineEmits(['update:perPage', 'update:page'])

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
const paginationPrevIsDisabled = computed(() => Number(computedPage) === 1)

/**
 * Check if the pagination next button is disabled
 * @returns true if the pagination next button is disabled, false otherwise
 */
const paginationNextIsDisabled = computed(
	() => Number(computedPage) === pageCount.value
)

/**
 * Check if the pagination forward is disabled
 * @returns true if the pagination forward is disabled, false otherwise
 */
const paginationForwarIsDisabled = computed(() => {
	return pageCount.value === 1
})

/**
 * Total number of pages
 * @returns number
 */
const pageCount = computed(() => {
	const total = Number(props.total)
	const perPage = Number(computedPerPage)
	return Math.ceil(total / perPage)
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
			class="hidden md:flex mt-6"
			:total="total"
			v-model="computedPerPage"
			:options="options"
			:label-text="perPageLabelText"
			:per-page-formatter="perPageItemFormatter"
		/>
		<PaginationList v-slot="{ items }" class="flex items-center gap-1">
			<div class="flex items-center gap-1">
				<template v-for="(item, index) in items">
					<PaginationListItem
						v-if="item.type === 'page'"
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
			<PaginationForward
				class="pt-6 ml-2 pl-3 border-l-1 border-neutral-30"
				v-model="pageIndex"
				:disabled="paginationForwarIsDisabled"
				@input="onInputPaginationForward"
			/>
		</PaginationList>
	</PaginationRoot>
</template>
