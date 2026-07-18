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
 * @props {string} perPageLabelText: 'Per halaman' - Label text for items per page component,
 * usefull for i18n
 * @props {function} perPageItemFormatter: (perPage) => `${perPage} Baris` - Formatter
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
import { useVModel } from '@vueuse/core'
import {
	watch,
	computed,
	ref,
	defineProps,
	defineEmits,
	withDefaults,
} from 'vue'
import {
	PaginationRoot,
	PaginationList,
	PaginationListItem,
} from 'reka-ui'
import PaginationNext from './PaginationNext.vue'
import PaginationPrev from './PaginationPrev.vue'
import PaginationInputPage from './PaginationInputPage.vue'
import ItemsPerPage from './ItemsPerPage.vue'
import PaginationFirstPageButton from './PaginationFirstPageButton.vue'
import PaginationLastPageButton from './PaginationLastPageButton.vue'
import { Button } from '../button'
import { FormInput } from '../form-input'
import { PaginationIndexType } from './constants'
import { getDataCyWithPrefix } from '../../utils/string'

const MAXIMUM_PAGE_BEFORE_ELLIPSIS = 5

interface Props {
	total?: number | string
	perPage?: number | string
	page?: number | string
	defaultPage?: number | string
	options?: number[]
	visibleItems: unknown[]
	perPageLabelText?: string
	perPageItemFormatter?: (perPage: number | string) => string
	showPerPageOptions?: boolean
	showPaginationInput?: boolean
	dataCy?: string
	dataTestid?: string
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
	visibleItems: () => [],
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
const localPage = ref('')

/**
 * Checks if the given page is the active page
 * @param page - Page number to check
 * @returns true if the page is active, false otherwise
 */
function isActivePage(page: number): boolean {
	return page === props.page
}

/**
 * Handles input for pagination forward
 * @param value - New page value
 * @returns void
 */
function onInputPaginationForward(): void {
	const localPageAsNumber = Number(localPage.value)
	localPage.value = ''
	if (localPageAsNumber === 0) {
		return
	}
	computedPage.value = localPageAsNumber
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

const shouldShowEdges = computed(() => pageCount.value > MAXIMUM_PAGE_BEFORE_ELLIPSIS)
const paginationSiblingCount = computed(() => (shouldShowEdges.value ? 0 : 2))

const shouldShowPerPage = computed(() => {
	return props.showPerPageOptions
})
const shouldShowPaginationInput = computed(() => {
	return props.showPaginationInput && shouldShowEdges.value
})

const itemsPerPageDataCy = computed(() =>
	getDataCyWithPrefix('items-per-page', props.dataCy)
)
const itemsPerPageDataTestid = computed(() =>
	getDataCyWithPrefix('items-per-page', props.dataTestid || props.dataCy)
)
const paginationListItemDataCy = computed(() =>
	getDataCyWithPrefix('pagination-list-item', props.dataCy)
)
const paginationListItemDataTestid = computed(() =>
	getDataCyWithPrefix(
		'pagination-list-item',
		props.dataTestid || props.dataCy
	)
)
const paginatioPrevDataCy = computed(() =>
	getDataCyWithPrefix('pagination-prev', props.dataCy)
)
const paginatioPrevDataTestid = computed(() =>
	getDataCyWithPrefix('pagination-prev', props.dataTestid || props.dataCy)
)
const paginationNextDataCy = computed(() =>
	getDataCyWithPrefix('pagination-next', props.dataCy)
)
const paginationNextDataTestid = computed(() =>
	getDataCyWithPrefix('pagination-next', props.dataTestid || props.dataCy)
)
const paginationInputPageDataCy = computed(() =>
	getDataCyWithPrefix('pagination-input-page', props.dataCy)
)
const paginationInputPageDataTestid = computed(() =>
	getDataCyWithPrefix(
		'pagination-input-page',
		props.dataTestid || props.dataCy
	)
)
const paginationFirstPageDataCy = computed(() =>
	getDataCyWithPrefix('pagination-first-page', props.dataCy)
)
const paginationFirstPageDataTestid = computed(() =>
	getDataCyWithPrefix(
		'pagination-first-page',
		props.dataTestid || props.dataCy
	)
)
const paginationLastPageDataCy = computed(() =>
	getDataCyWithPrefix('pagination-last-page', props.dataCy)
)
const paginationLastPageDataTestid = computed(() =>
	getDataCyWithPrefix(
		'pagination-last-page',
		props.dataTestid || props.dataCy
	)
)
</script>

<template>
	<PaginationRoot
		:page="Number(computedPage)"
		:total="Number(total)"
		:sibling-count="paginationSiblingCount"
		:show-edges="shouldShowEdges"
		:default-page="Number(defaultPage)"
		:items-per-page="Number(computedPerPage)"
		class="flex flex-col md:flex-row w-full justify-between items-center gap-4"
	>
		<ItemsPerPage
			v-if="shouldShowPerPage"
			v-model="computedPerPage"
			:total="total"
			:options="options"
			:visible-items="visibleItems"
			:current-page="computedPage"
			:label-text="perPageLabelText"
			:per-page-formatter="perPageItemFormatter"
			:data-cy="itemsPerPageDataCy"
			:data-testid="itemsPerPageDataTestid"
			@change="onChangeItemsPerPage"
		/>
		<PaginationList v-slot="{ items }" class="flex items-center gap-8">
			<div class="flex items-center gap-2">
				<!-- Prev & Go to First Page Button -->
				<div class="flex items-center gap-1">
					<PaginationFirstPageButton
						v-if="shouldShowPaginationInput"
						:disabled="paginationFirstPageIsDisabled"
						:data-cy="paginationFirstPageDataCy"
						:data-testid="paginationFirstPageDataTestid"
						@click="onClickPaginationListItem(1)"
					/>
					<PaginationPrev
						class="pagination-prev hidden md:flex"
						:disabled="paginationPrevIsDisabled"
						:data-cy="paginatioPrevDataCy"
						:data-testid="paginatioPrevDataTestid"
						@click="onClickPaginationPrev"
					/>
				</div>
				<!-- Number List Page Button -->
				<div class="flex items-center gap-2">
					<template v-for="(item, index) in items">
						<PaginationListItem
							v-if="item.type === PaginationIndexType.PAGE"
							:key="index"
							:value="item.value"
							:data-cy="paginationListItemDataCy"
							:data-testid="paginationListItemDataTestid"
							as-child
						>
							<Button
								:variant="
									!isActivePage(item.value) ? 'tertiary-primary' : 'primary'
								"
								size="sm"
								@click="onClickPaginationListItem(item.value)"
							>
								{{ item.value }}
							</Button>
						</PaginationListItem>
						<span
							v-else-if="item.type === PaginationIndexType.ELLIPSIS"
							:key="`ellipsis-${index}`"
							class="inline-flex h-10 w-10 items-center justify-center text-main"
						>
							...
						</span>
					</template>
				</div>
				<!-- Next & Go to Last Page Button -->
				<div class="flex items-center gap-1">
					<PaginationNext
						:disabled="paginationNextIsDisabled"
						class="pagination-next hidden md:flex"
						:data-cy="paginationNextDataCy"
						:data-testid="paginationNextDataTestid"
						@click="onClickPaginationNext"
					/>
					<PaginationLastPageButton
						v-if="shouldShowPaginationInput"
						:disabled="paginationLastPageIsDisabled"
						:data-cy="paginationLastPageDataCy"
						:data-testid="paginationLastPageDataTestid"
						@click="onClickPaginationListItem(pageCount)"
					/>
				</div>
			</div>

			<FormInput
				v-if="shouldShowPaginationInput"
				class="flex items-center gap-2 [&>:not(:last-child)]:mb-0 mb-0"
				@submit="onInputPaginationForward"
			>
				<p class="text-main text-label-md font-normal">Halaman</p>
				<PaginationInputPage
					v-model="localPage"
					class="hidden md:block"
					:disabled="paginationForwarIsDisabled"
					:total-pages="pageCount"
					:data-cy="paginationInputPageDataCy"
					:data-testid="paginationInputPageDataTestid"
					:placeholder="String(computedPage)"
				/>
				<Button variant="tertiary-primary" type="submit">
					<template #icon-left>
						<i class="si-heroicon-outline-arrow-right" />
					</template>
				</Button>
			</FormInput>
		</PaginationList>
	</PaginationRoot>
</template>
