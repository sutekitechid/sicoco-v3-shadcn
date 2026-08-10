<template>
	<div class="mx-auto flex max-w-5xl flex-col gap-8 p-4 tablet:p-8">
		<header class="max-w-2xl">
			<h1 class="text-2xl font-semibold text-main">Dropdown</h1>
			<p class="mt-2 text-sm text-neutral-500">
				Contoh pemilihan nilai tunggal, beberapa nilai, pencarian, dan trigger
				kustom.
			</p>
		</header>

		<div class="grid gap-6 tablet:grid-cols-2">
			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Default</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Pilih satu jenis kopi dari daftar.
				</p>
				<Dropdown v-model="defaultValue" class="mt-4" placeholder="Pilih kopi">
					<DropdownItem
						v-for="coffee in coffees"
						:key="coffee.value"
						:value="coffee.value"
					>
						{{ coffee.label }}
					</DropdownItem>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{ defaultValue || '-' }}</span>
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Multiple</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Pilih lebih dari satu jenis kopi. Badge ditampilkan di dalam dropdown
					untuk setiap item yang dipilih.
				</p>
				<Dropdown
					v-model="multipleValues"
					multiple
					searchable
					selected-label="kopi dipilih"
					class="w-64"
					placeholder="Pilih kopi"
				>
					<DropdownItem
						v-for="coffee in coffees"
						:key="coffee.value"
						:value="coffee.value"
					>
						{{ coffee.label }}
					</DropdownItem>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						multipleValues.join(', ') || '-'
					}}</span>
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Searchable</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Gunakan kolom pencarian bawaan untuk menyaring opsi.
				</p>
				<Dropdown
					v-model="searchableValue"
					searchable
					class="mt-4"
					placeholder="Cari kopi"
					@typing="filterSearch"
				>
					<DropdownItem
						v-for="coffee in filteredCoffees"
						:key="coffee.value"
						:value="coffee.value"
					>
						{{ coffee.label }}
					</DropdownItem>
					<p
						v-if="filteredCoffees.length === 0"
						class="p-3 text-sm text-neutral-500"
					>
						Kopi tidak ditemukan.
					</p>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						searchableValue || '-'
					}}</span>
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Custom Trigger</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Input dapat digunakan sebagai trigger dan kolom pencarian.
				</p>
				<Dropdown v-model="customTriggerValue" class="mt-4" fit-content>
					<template #trigger>
						<Input
							v-model="customSearch"
							placeholder="Ketik untuk mencari kopi"
						>
							<template #prefix>
								<i class="si-search text-lg text-neutral-500" />
							</template>
						</Input>
					</template>
					<DropdownItem
						v-for="coffee in customFilteredCoffees"
						:key="coffee.value"
						:value="coffee.value"
					>
						{{ coffee.label }}
					</DropdownItem>
					<p
						v-if="customFilteredCoffees.length === 0"
						class="p-3 text-sm text-neutral-500"
					>
						Kopi tidak ditemukan.
					</p>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						customTriggerValue || '-'
					}}</span>
				</p>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import Input from '@/components/input/Input.vue'

const coffees = [
	{ label: 'Espresso', value: 'Espresso' },
	{ label: 'Latte', value: 'Latte' },
	{ label: 'Cappuccino', value: 'Cappuccino' },
	{ label: 'Americano', value: 'Americano' },
	{ label: 'Mocha', value: 'Mocha' },
	{ label: 'Flat White', value: 'Flat White' },
]

const defaultValue = ref('')
const multipleValues = ref<string[]>([])
const searchableValue = ref('')
const searchableQuery = ref('')
const customTriggerValue = ref('')
const customSearch = ref('')

const filteredCoffees = computed(() => filterCoffees(searchableQuery.value))
const customFilteredCoffees = computed(() => filterCoffees(customSearch.value))

function filterSearch(value: string) {
	searchableQuery.value = value
}

function filterCoffees(query: string) {
	const normalizedQuery = query.trim().toLowerCase()
	if (!normalizedQuery) return coffees
	return coffees.filter(coffee =>
		coffee.label.toLowerCase().includes(normalizedQuery),
	)
}
</script>
