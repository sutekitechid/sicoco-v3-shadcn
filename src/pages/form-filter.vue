<template>
	<div class="p-4">
		<h1 class="text-2xl font-bold mb-6">FormFilter Demo</h1>

		<!-- FormFilter Component -->
		<FormFilter
			ref="formFilterRef"
			:initial-filter="initialFilter"
			v-model:dirty="isDirty"
			v-model:applied="isApplied"
			@apply="handleApply"
			@reset="handleReset"
		>
			<template #default="{ filters, dirty, apply, reset }">
				<div class="p-4 border border-neutral-200 rounded-lg">
					<h2 class="text-lg font-semibold mb-4">Filter Panel</h2>

					<!-- Status indicator -->
					<div class="flex items-center gap-4 mb-4">
						<span class="text-sm text-neutral-600">
							Dirty: <span :class="dirty ? 'text-danger-500 font-semibold' : 'text-success-500'">{{ dirty }}</span>
						</span>
						<span class="text-sm text-neutral-600">
							Applied: <span :class="isApplied ? 'text-success-500 font-semibold' : 'text-neutral-400'">{{ isApplied }}</span>
						</span>
					</div>

					<!-- Filter fields -->
					<div class="grid grid-cols-2 gap-4 mb-4">
						<Input
							v-model="filters.search"
							placeholder="Search..."
						/>
						<Input
							v-model="filters.category"
							placeholder="Category..."
						/>
						<Input
							v-model="filters.status"
							placeholder="Status..."
						/>
						<Input
							v-model="filters.dateRange"
							placeholder="Date range..."
						/>
					</div>

					<!-- Current filters display -->
					<div class="p-3 bg-neutral-50 rounded mb-4">
						<p class="text-xs text-neutral-500 mb-1">Current filters:</p>
						<pre class="text-sm">{{ filters }}</pre>
					</div>

					<!-- Action buttons -->
					<div class="flex gap-2">
						<Button @click="apply">Apply</Button>
						<Button v-if="dirty" outlined @click="reset">Reset</Button>
					</div>
				</div>
			</template>
		</FormFilter>

		<!-- Applied filters display -->
		<div class="mt-8 p-4 border border-neutral-200 rounded-lg">
			<h2 class="text-lg font-semibold mb-2">Applied Filters (from parent)</h2>
			<pre class="text-sm">{{ appliedFilters }}</pre>
		</div>

		<!-- Simulated API data -->
		<div class="mt-8 p-4 border border-neutral-200 rounded-lg">
			<h2 class="text-lg font-semibold mb-2">Simulated API Data</h2>
			<p class="text-sm text-neutral-600 mb-2">After 1.5s, filters will be updated from "API":</p>
			<pre class="text-sm">{{ apiData }}</pre>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FormFilter from '@/components/form-filter/FormFilter.vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'

const initialFilter = {
	search: '',
	category: '',
	status: '',
	dateRange: '',
}

const formFilterRef = ref()
const isDirty = ref(false)
const isApplied = ref(false)
const appliedFilters = ref<Record<string, unknown>>({})
const apiData = ref({})

function handleApply(filters: Record<string, unknown>) {
	appliedFilters.value = { ...filters }
}

function handleReset() {
	appliedFilters.value = {}
}

// Simulate API fetch — updates filters after delay
// Tanpa setInitial(), API data dianggap "perubahan" → dirty=true
onMounted(() => {
	setTimeout(() => {
		const apiResponse = {
			search: 'search term',
			category: 'development',
			status: 'active',
			dateRange: '2024-01-01 - 2024-12-31',
		}
		apiData.value = apiResponse
		// Update filters langsung tanpa setInitial → dirty=true
		// formFilterRef.value.filters = apiResponse
		formFilterRef.value.setInitial(apiResponse) // Gunakan setInitial() untuk menghindari dirty=true
	}, 1500)
})
</script>
