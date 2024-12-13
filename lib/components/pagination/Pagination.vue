<script setup lang="ts">
/**
 * 'Pagination' is a component that allows users to navigate through pages of content.
 *
 * Props for the Pagination component
 * @props {number|string} total: 0 - Total number of items
 * @props {number|string} perPage: 10 - Number of items per page
 * @props {number|string} page: 1 - Current page number
 * @props {number|string} defaultPage: 1 - Default page number
 *
 * @example
 * ```vue
 * <template>
 *  <Pagination
 * 	 :total="total"
 *   :perPage="perPage"
 *   :page="page"
 *   :defaultPage="defaultPage"
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
	Pagination,
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
}

/** Default values for the props */
const props = withDefaults(defineProps<Props>(), {
	total: 0,
	perPage: 20,
	page: 1,
	defaultPage: 1,
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
	computedPage.value = Number(computedPage) - 1
}

/**
 * Handles click event for pagination next
 * Increments the page by 1
 * @returns void
 */
function onClickPaginationNext(): void {
	computedPage.value = Number(computedPage) + 1
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
	<Pagination
		:page="Number(computedPage)"
		:total="Number(total)"
		:sibling-count="1"
		:default-page="Number(defaultPage)"
		:items-per-page="Number(computedPerPage)"
		class="flex w-full justify-between gap-4"
	>
		<ItemsPerPage
			class="hidden md:flex"
			:total="total"
			v-model="computedPerPage"
		/>
		<PaginationList v-slot="{ items }" class="flex items-center gap-1">
			<template v-for="(item, index) in items">
				<PaginationListItem
					v-if="item.type === 'page'"
					:key="index"
					:value="item.value"
					as-child
				>
					<Button
						class="w-10 h-10 p-0"
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
			<PaginationForward
				class="ml-2 pl-3 border-l-1 border-gray-30"
				v-model="pageIndex"
				:disabled="paginationForwarIsDisabled"
				@input="onInputPaginationForward"
			/>
		</PaginationList>
	</Pagination>
</template>
