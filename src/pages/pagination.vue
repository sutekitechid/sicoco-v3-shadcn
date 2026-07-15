<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-3">Default</h3>
			<div class="rounded-lg border border-neutral-200 p-4">
				<Pagination
					v-model:page="page"
					v-model:per-page="perPage"
					:total="total"
					:options="perPageOptions"
					:visible-items="visibleItems"
					data-cy="pagination-default"
					data-testid="pagination-default"
					@change-page="onChangePage"
					@change-per-page="onChangePerPage"
				/>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Current Page Data</h3>
			<div class="overflow-hidden rounded-lg border border-neutral-200">
				<div
					v-for="item in visibleItems"
					:key="item.id"
					class="flex items-center justify-between border-b border-neutral-100 px-4 py-3 last:border-b-0"
				>
					<div>
						<p class="font-medium text-main">{{ item.title }}</p>
						<p class="text-sm text-neutral-500">{{ item.description }}</p>
					</div>
					<span class="text-sm font-semibold text-primary-default">
						#{{ item.id }}
					</span>
				</div>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Without Per Page Options</h3>
			<div class="rounded-lg border border-neutral-200 p-4">
				<Pagination
					v-model:page="compactPage"
					:per-page="10"
					:total="total"
					:show-per-page-options="false"
					data-cy="pagination-without-per-page"
					data-testid="pagination-without-per-page"
				/>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-3">Without Page Input</h3>
			<div class="rounded-lg border border-neutral-200 p-4">
				<Pagination
					v-model:page="simplePage"
					v-model:per-page="simplePerPage"
					:total="total"
					:options="[5, 10, 20]"
					:show-pagination-input="false"
					per-page-label-text="Show"
					:per-page-item-formatter="formatPerPage"
					data-cy="pagination-without-input"
					data-testid="pagination-without-input"
				/>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pagination } from '@/components/pagination'

const total = 48
const perPageOptions = [5, 10, 20, 50]

const page = ref(1)
const perPage = ref(5)
const compactPage = ref(1)
const simplePage = ref(1)
const simplePerPage = ref(10)

const items = Array.from({ length: total }, (_, index) => ({
	id: index + 1,
	title: `Component record ${index + 1}`,
	description: `Sample paginated row ${index + 1}`,
}))

const visibleItems = computed(() => {
	const start = (page.value - 1) * perPage.value
	return items.slice(start, start + perPage.value)
})

function formatPerPage(value: number | string) {
	return `${value} items`
}

function onChangePage(value: number) {
	console.log('Pagination page changed:', value)
}

function onChangePerPage(value: number) {
	console.log('Pagination per page changed:', value)
}
</script>
