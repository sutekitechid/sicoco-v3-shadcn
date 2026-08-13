<template>
	<div class="flex flex-col gap-6 p-4">
		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Variants (Soft/Default)</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="default">Default</Badge>
				<Badge variant="primary">Primary</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="danger">Danger</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="grey">Grey</Badge>
				<Badge variant="gray">Gray</Badge>
				<Badge variant="neutral">Neutral</Badge>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Variants (Solid)</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge variant="solid">Solid (= primary solid)</Badge>
				<Badge variant="primary solid">Primary Solid</Badge>
				<Badge variant="success solid">Success Solid</Badge>
				<Badge variant="warning solid">Warning Solid</Badge>
				<Badge variant="danger solid">Danger Solid</Badge>
				<Badge variant="secondary solid">Secondary Solid</Badge>
				<Badge variant="grey solid">Grey Solid</Badge>
				<Badge variant="gray solid">Gray Solid</Badge>
				<Badge variant="neutral solid">Neutral Solid (bg-neutral-950)</Badge>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Solid + Closeable + Sizes</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge
					variant="solid"
					size="small"
					closeable
					>Solid Small</Badge
				>
				<Badge
					variant="success solid"
					size="medium"
					closeable
					>Success Medium</Badge
				>
				<Badge
					variant="danger solid"
					size="large"
					closeable
					>Danger Large Rounded</Badge
				>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Squared</h3>
			<div class="flex flex-wrap items-center gap-2">
				<Badge
					variant="primary"
					:rounded="false"
					>Squared Primary</Badge
				>
				<Badge
					variant="success solid"
					:rounded="false"
					closeable
					>Squared Success Solid</Badge
				>
				<Badge
					variant="danger"
					:rounded="false"
					>Danger Squared</Badge
				>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Filter</h3>
			<div class="flex flex-wrap items-center gap-2">
				<BadgeFilter
					value="cat-sm"
					:count="3"
				>
					All
				</BadgeFilter>
				<BadgeFilter
					value="cat-md"
					:count="12"
				>
					Active
				</BadgeFilter>
				<BadgeFilter
					value="cat-lg"
					:count="99"
				>
					Label
				</BadgeFilter>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Filter — Without Counter</h3>
			<div class="flex flex-wrap items-center gap-2">
				<BadgeFilter value="all">All</BadgeFilter>
				<BadgeFilter value="active">Active</BadgeFilter>
				<BadgeFilter value="archived">Archived</BadgeFilter>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">
				Badge Filter — Inactive (Disabled)
			</h3>
			<div class="flex flex-wrap items-center gap-2">
				<BadgeFilter
					value="locked"
					:count="0"
					inactive
					>Locked</BadgeFilter
				>
				<BadgeFilter
					value="pending"
					:count="2"
					inactive
					>Pending</BadgeFilter
				>
			</div>
		</div>

		<div>
			<h3 class="font-semibold text-lg mb-3">Badge Filter — Single Select</h3>
			<div
				class="flex flex-wrap items-center gap-2"
				data-cy="badge-filter-group"
			>
				<BadgeFilter
					v-for="filter in singleSelectFilters"
					:key="filter.value"
					v-model="selectedFilter"
					:value="filter.value"
					:count="filter.count"
					:inactive="filter.inactive"
				>
					{{ filter.label }}
				</BadgeFilter>
			</div>
			<p
				class="text-label-md text-secondary-700 mt-3"
				data-cy="selected-value"
			>
				Selected:
				<span class="font-semibold">{{ selectedFilter ?? 'none' }}</span>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Badge from '@/components/badge/Badge.vue'
import BadgeFilter from '@/components/badge/BadgeFilter.vue'

interface FilterOption {
	value: string
	label: string
	count: number
	inactive?: boolean
}

const singleSelectFilters: FilterOption[] = [
	{ value: 'all', label: 'All', count: 124 },
	{ value: 'active', label: 'Active', count: 56 },
	{ value: 'pending', label: 'Pending', count: 23 },
	{ value: 'archived', label: 'Archived', count: 45 },
	{ value: 'locked', label: 'Locked', count: 0, inactive: true },
]

const selectedFilter = ref<string | null>('all')
</script>
