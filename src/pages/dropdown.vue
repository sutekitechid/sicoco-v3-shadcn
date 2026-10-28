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
				<h2 class="text-base font-semibold text-main">Required</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Kirim form tanpa memilih kopi untuk melihat pesan validasi.
				</p>
				<FormInput class="mt-4" @submit="onRequiredSubmit">
					<Dropdown
						v-model="requiredValue"
						required
						placeholder="Pilih kopi"
						data-cy="dropdown-required"
					>
						<DropdownItem
							v-for="coffee in coffees"
							:key="coffee.value"
							:value="coffee.value"
							:disabled="coffee.disabled"
						>
							{{ coffee.label }}
						</DropdownItem>
						<template #required>Silakan pilih jenis kopi.</template>
					</Dropdown>
					<Button type="submit" class="mt-3" data-cy="dropdown-required-submit">
						Submit
					</Button>
				</FormInput>
				<p v-if="requiredSubmitResult" class="mt-3 text-xs text-success-700">
					{{ requiredSubmitResult }}
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">
					Recursive Nested Parent Selection
				</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Contoh unit rekursif seperti SPMI. Memilih fakultas menggantikan
					pilihan program studinya.
				</p>
				<Dropdown
					v-model="selectedUnits"
					multiple
					searchable
					nested-parent-selection
					key-label="name"
					class="mt-4"
					placeholder="Pilih unit"
				>
					<RecursiveUnitDropdownItem
						v-for="unit in units"
						:key="unit.id"
						:unit="unit"
					/>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						selectedUnits.map(unit => unit.name).join(', ') || '-'
					}}</span>
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Nested Parent Selection</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Pilih anak secara mandiri. Memilih kategori hanya mengirim nilai
					kategori dan menonaktifkan semua anaknya.
				</p>
				<Dropdown
					v-model="nestedParentValues"
					multiple
					nested-parent-selection
					class="mt-4"
					placeholder="Pilih kopi atau kategori"
				>
					<DropdownItem value="espresso-based" label="Espresso based">
						<DropdownItem value="Espresso">Espresso</DropdownItem>
						<DropdownItem value="Americano">Americano</DropdownItem>
					</DropdownItem>
					<DropdownItem value="milk-based" label="Milk based">
						<DropdownItem value="Latte">Latte</DropdownItem>
						<DropdownItem value="Cappuccino">Cappuccino</DropdownItem>
					</DropdownItem>
					<DropdownItem value="Mocha">Mocha</DropdownItem>
					<DropdownItem value="Matcha">Matcha</DropdownItem>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						nestedParentValues.join(', ') || '-'
					}}</span>
				</p>
			</section>

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
						:value="coffee"
						:disabled="coffee.disabled"
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
				<h2 class="text-base font-semibold text-main">Nested Single</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Buka kategori melalui chevron, lalu pilih satu kopi di dalamnya.
				</p>
				<Dropdown
					v-model="nestedSingleValue"
					class="mt-4"
					placeholder="Pilih kopi"
				>
					<DropdownItem label="Espresso based">
						<DropdownItem label="Classic coffee">
							<DropdownItem value="Espresso">Espresso</DropdownItem>
							<DropdownItem value="Americano">Americano</DropdownItem>
						</DropdownItem>
					</DropdownItem>
					<DropdownItem label="Milk based">
						<DropdownItem value="Latte">Latte</DropdownItem>
						<DropdownItem value="Cappuccino">Cappuccino</DropdownItem>
					</DropdownItem>
					<DropdownItem value="Mocha">Mocha</DropdownItem>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						nestedSingleValue || '-'
					}}</span>
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">
					Nested Multiple Searchable
				</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Cari kategori atau kopi, lalu pilih kategori untuk memilih seluruh
					item di dalamnya.
				</p>
				<Dropdown
					v-model="nestedValues"
					multiple
					searchable
					class="mt-4"
					placeholder="Pilih kopi"
					@typing="filterNestedSearch"
				>
					<template
						v-for="option in filteredNestedCoffeeOptions"
						:key="option.label"
					>
						<DropdownItem v-if="option.children" :label="option.label">
							<template v-for="child in option.children" :key="child.label">
								<DropdownItem v-if="child.children" :label="child.label">
									<DropdownItem
										v-for="leaf in child.children"
										:key="leaf.value"
										:value="leaf.value"
									>
										{{ leaf.label }}
									</DropdownItem>
								</DropdownItem>
								<DropdownItem v-else :value="child.value">
									{{ child.label }}
								</DropdownItem>
							</template>
						</DropdownItem>
						<DropdownItem v-else :value="option.value">
							{{ option.label }}
						</DropdownItem>
					</template>
					<p
						v-if="!hasNestedSearchResults"
						class="p-3 text-sm text-neutral-500"
					>
						Kopi atau kategori tidak ditemukan.
					</p>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						nestedValues.join(', ') || '-'
					}}</span>
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
					class="w-64"
					placeholder="Pilih kopi"
				>
					<template
						#multiple-label="{
							labels,
							selectedCount,
							allOptionsSelected,
							placeholder,
						}"
					>
						<span class="truncate">
							{{
								selectedCount === 0
									? placeholder
									: allOptionsSelected
										? 'Semua'
										: selectedCount > 2
											? 'Item dipilih'
											: labels.join(', ')
							}}
						</span>
					</template>
					<template #footer="{ selectedCount, optionCount, allSelected }">
						<div class="flex items-center justify-end gap-2 w-full p-1">
							<Button
								size="sm"
								variant="tertiary-neutral"
								:disabled="selectedCount === 0"
								@click.stop="handleResetMultiple"
							>
								Reset
							</Button>
							<Button
								size="sm"
								variant="tertiary-primary"
								:disabled="allSelected || optionCount === 0"
								@click.stop="handleSelectAllMultiple"
							>
								Pilih Semua
							</Button>
						</div>
					</template>
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
					<template #empty-search="{ query }">
						<p class="px-4 py-2 text-sm text-placeholder">
							Role tidak ditemukan
						</p>
					</template>
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

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Backend Search</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Opsi dirender dari hasil pencarian parent, seperti respons dari backend.
				</p>
				<Dropdown
					v-model="backendSearchValues"
					multiple
					searchable
					class="mt-4"
					placeholder="Cari kopi"
					@typing="filterBackendSearch"
				>
					<DropdownItem
						v-for="coffee in coffeeFiltered"
						:key="coffee.value"
						:value="coffee.value"
					>
						{{ coffee.label }}
					</DropdownItem>
					<template #empty-search="{ query }">
						<p class="px-4 py-2 text-sm text-placeholder">
							Kopi "{{ query }}" tidak ditemukan.
						</p>
					</template>
				</Dropdown>
				<p class="mt-3 text-xs text-neutral-500">
					Terpilih:
					<span class="font-medium text-main">{{
						backendSearchValues.join(', ') || '-'
					}}</span>
				</p>
			</section>

			<section
				class="rounded-lg border border-main bg-white p-5 shadow-sm dark:bg-neutral-100"
			>
				<h2 class="text-base font-semibold text-main">Disabled</h2>
				<p class="mt-1 text-sm text-neutral-500">
					Dropdown yang dinonaktifkan tetap menampilkan nilai terpilih, tetapi
					tidak dapat dibuka atau diubah.
				</p>
				<Dropdown v-model="disabledValue" disabled class="mt-4">
					<DropdownItem
						v-for="coffee in coffees"
						:key="coffee.value"
						:value="coffee.value"
					>
						{{ coffee.label }}
					</DropdownItem>
				</Dropdown>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import Input from '@/components/input/Input.vue'
import Button from '@/components/button/Button.vue'
import { FormInput } from '@/components/form-input'

const coffees = [
	{ label: 'Espresso disabled', value: 'Espresso', disabled: true },
	{ label: 'Latte', value: 'Latte' },
	{ label: 'Cappuccino', value: 'Cappuccino' },
	{ label: 'Americano', value: 'Americano' },
	{ label: 'Mocha', value: 'Mocha' },
	{ label: 'Flat White', value: 'Flat White' },
]

interface NestedCoffeeOption {
	label: string
	value?: string
	children?: NestedCoffeeOption[]
}

interface Unit {
	id: string
	name: string
	parent_id: string
	level: number
	items: Unit[]
}

const units: Unit[] = [
	{
		id: 'faculty-a',
		name: 'Fakultas A',
		parent_id: '',
		level: 1,
		items: [
			{
				id: 'faculty-a-program-1',
				name: 'Program Studi A1',
				parent_id: 'faculty-a',
				level: 2,
				items: [],
			},
		],
	},
	{
		id: 'faculty-b',
		name: 'Fakultas B',
		parent_id: '',
		level: 1,
		items: [
			{
				id: 'faculty-b-program-1',
				name: 'Program Studi B1',
				parent_id: 'faculty-b',
				level: 2,
				items: [],
			},
		],
	},
	{
		id: 'faculty-c',
		name: 'Fakultas C',
		parent_id: '',
		level: 1,
		items: [],
	},
	{
		id: 'faculty-d',
		name: 'Fakultas D',
		parent_id: '',
		level: 1,
		items: [],
	},
]

const RecursiveUnitDropdownItem = defineComponent({
	name: 'RecursiveUnitDropdownItem',
	props: {
		unit: { type: Object as () => Unit, required: true },
	},
	setup(props) {
		return () => {
			if (props.unit.items.length) {
				return h(
					DropdownItem,
					{ value: props.unit, label: props.unit.name },
					{
						default: () =>
							props.unit.items.map(unit =>
								h(RecursiveUnitDropdownItem, { key: unit.id, unit }),
							),
					},
				)
			}
			return h(DropdownItem, { value: props.unit }, () => props.unit.name)
		}
	},
})

const nestedCoffeeOptions: NestedCoffeeOption[] = [
	{
		label: 'Espresso based',
		children: [
			{
				label: 'Classic coffee',
				children: [
					{ label: 'Espresso', value: 'Espresso' },
					{ label: 'Americano', value: 'Americano' },
				],
			},
		],
	},
	{
		label: 'Milk based',
		children: [
			{ label: 'Latte', value: 'Latte' },
			{ label: 'Cappuccino', value: 'Cappuccino' },
		],
	},
	{ label: 'Mocha', value: 'Mocha' },
]

const defaultValue = ref('')
const requiredValue = ref('')
const requiredSubmitResult = ref('')
const nestedSingleValue = ref('')
const multipleValues = ref<string[]>([])
const nestedValues = ref<string[]>([])
const nestedParentValues = ref<string[]>([])
const selectedUnits = ref<Unit[]>([{
				id: 'faculty-b-program-1',
				name: 'Program Studi B1',
				parent_id: 'faculty-b',
				level: 2,
				items: [],
			},])
const nestedSearchQuery = ref('')
const searchableValue = ref('')
const searchableQuery = ref('')
const backendSearchValues = ref<string[]>([])
const coffeeFiltered = ref(coffees)
const customTriggerValue = ref('')
const customSearch = ref('')
const disabledValue = ref('Cappuccino')

const filteredCoffees = computed(() => filterCoffees(searchableQuery.value))
const customFilteredCoffees = computed(() => filterCoffees(customSearch.value))
const filteredNestedCoffeeOptions = computed(() =>
	filterNestedCoffeeOptions(nestedCoffeeOptions, nestedSearchQuery.value),
)
const hasNestedSearchResults = computed(
	() => filteredNestedCoffeeOptions.value.length > 0,
)

function filterSearch(value: string) {
	searchableQuery.value = value
}

function filterBackendSearch(value: string) {
	coffeeFiltered.value = filterCoffees(value)
}

function handleResetMultiple() {
	multipleValues.value = []
}

function handleSelectAllMultiple() {
	multipleValues.value = coffees.map(coffee => coffee.value)
}

function onRequiredSubmit(valid: boolean) {
	if (!valid) {
		requiredSubmitResult.value = ''
		return
	}
	requiredSubmitResult.value = `Form valid! Kopi terpilih: ${requiredValue.value}`
}

function filterCoffees(query: string) {
	const normalizedQuery = query.trim().toLowerCase()
	if (!normalizedQuery) return coffees
	return coffees.filter(coffee =>
		coffee.label.toLowerCase().includes(normalizedQuery),
	)
}

function filterNestedCoffeeOptions(
	options: NestedCoffeeOption[],
	query: string,
): NestedCoffeeOption[] {
	const normalizedQuery = query.trim().toLowerCase()
	if (!normalizedQuery) return options

	return options.flatMap(option => {
		const matchesOption = option.label.toLowerCase().includes(normalizedQuery)
		if (!option.children) return matchesOption ? [option] : []
		if (matchesOption) return [option]

		const children = filterNestedCoffeeOptions(option.children, query)
		if (children.length === 0) return []
		return [{ ...option, children }]
	})
}
</script>
