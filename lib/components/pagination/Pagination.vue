<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep'
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

/**
 * Props for the Pagination component
 * - `total`: Total number of items
 * - `perPage`: Number of items per page
 * - `page`: Current page number
 * - `defaultPage`: Default page number
 * @default total: 0
 * @default perPage: 10
 * @default page: 1
 * @default defaultPage: 1
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
interface Props {
	total?: number | string
	perPage?: number | string
	page?: number | string
	defaultPage?: number | string
}

/** Default values for the props */
const props = withDefaults(defineProps<Props>(), {
	total: 0,
	perPage: 10,
	page: 1,
	defaultPage: 1,
})

/** Emits events for updating perPage and page */
const emit = defineEmits(['update:perPage', 'update:page'])

/**
 * Computed property for perPage that returns the perPage
 * and emits the `update:perPage` event
 */
const computedPerPage = computed({
	get: () => props.perPage,
	set: (value: number) => {
		emit('update:perPage', value)
	},
})

/** Computed property for page that returns the page and emits the `update:page` event */
const computedPage = computed({
	get: () => props.page,
	set: (value: number) => {
		emit('update:page', value)
	},
})

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
 */
function onInputPaginationForward(value: any): void {
	computedPage.value = cloneDeep(Number(value))
}

/** Watcher for computedPerPage to reset page to 1 */
watch(computedPerPage, (): void => {
	computedPage.value = 1
})
</script>

<template>
	<PaginationRoot
		v-slot="{ pageCount }"
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
						@click="computedPage = item.value"
					>
						{{ item.value }}
					</Button>
				</PaginationListItem>
			</template>
			<PaginationPrev
				@click="computedPage = Number(computedPage) - 1"
				:disabled="computedPage === 1"
				class="pagination-prev"
			/>
			<PaginationNext
				@click="computedPage = Number(computedPage) + 1"
				:disabled="computedPage === pageCount"
				class="pagination-next"
			/>
			<PaginationForward
				class="ml-2 pl-3 border-l-1 border-gray-30"
				v-model="pageIndex"
				:disabled="pageCount === 1"
				@input="onInputPaginationForward"
			/>
		</PaginationList>
	</PaginationRoot>
</template>
