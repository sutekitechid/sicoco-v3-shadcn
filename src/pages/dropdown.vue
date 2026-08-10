<template>
	<div class="flex gap-4">
		<div>
			<Dropdown class="w-64">
				<template #trigger>
					<Button class="w-full"> Nested Dropdown </Button>
				</template>
				<div class="p-4 flex flex-col gap-4">
					<span class="text-sm"> Dropdown with dropdown inside : </span>
					<Dropdown v-model="dropdownValue" class="w-60" data-testid="test-data-testid">
						<DropdownItem value="1">Option 1</DropdownItem>
						<DropdownItem value="2">Option 2</DropdownItem>
						<DropdownItem value="3">Option 3</DropdownItem>
					</Dropdown>
					<span class="text-sm">
						When select dropdown inside, <br />the parent dropdown should be not
						close
					</span>
				</div>
			</Dropdown>
		</div>
		<div>
			<Dropdown
				v-model="modelDropdown"
				placeholder="Sebuah placeholder"
				class="w-64"
				searchable
				:onTyping="onSearch"
			>
				<DropdownItem
					v-for="(item, index) in filteredListCoffee"
					:key="index"
					:value="item.label"
				>
					<span class="flex items-center gap-2">
						{{ item.label }}
					</span>
				</DropdownItem>
			</Dropdown>
			<Dropdown
				v-model="modelDropdown2"
				class="w-64"
				placeholder="Sebuah placeholder"
			>
				<DropdownItem
					v-for="(item, index) in listCoffeeWithUndefinedValue"
					:key="index"
					:value="item"
				>
					<span class="flex items-center gap-2">
						{{ item.label }}
					</span>
				</DropdownItem>
			</Dropdown>
			<Dropdown
				v-model="modelDropdown3"
				class="w-64"
				placeholder="Sebuah placeholder"
			>
				<DropdownItem
					v-for="(item, index) in listCoffee"
					:key="index"
					:value="item"
				>
					<span class="flex items-center gap-2">
						{{ item.label }}
					</span>
				</DropdownItem>
			</Dropdown>
			<Dropdown
				v-model="modelDropdown4"
				class="w-64"
				placeholder="Sebuah placeholder"
			>
				<DropdownItem
					v-for="(item, index) in typeOfCommunityServiceOptions"
					:key="index"
					:value="item"
				>
					{{ item.nama }}
				</DropdownItem>
			</Dropdown>
		</div>

		<div>
			<Dropdown ref="dropdownInput" v-model="selectedOption" align="start">
				<template #trigger>
					<Input
						v-model="search"
						placeholder="Type to open"
						class="placeholder:text-sm"
					>
						<template #prefix>
							<i class="si-search text-primary-default text-xl" />
						</template>
					</Input>
				</template>
				<div class="w-full">
					<template v-if="filteredList.length === 0">
						<div class="p-4 text-sm text-neutral-500">
							Tidak ada hasil yang ditemukan
						</div>
					</template>
					<template v-else>
						<DropdownItem
							v-for="(option, index) in filteredList"
							:key="index"
							:value="listCoffee[index]"
							class="p-4 rounded-sm"
						>
							{{ option.label }}
						</DropdownItem>
					</template>
				</div>
			</Dropdown>
		</div>
	</div>
</template>
<script lang="ts" setup>
import Button from '@/components/button/Button.vue'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import Input from '@/components/input/Input.vue'
import { computed, ref, watch } from 'vue'

const modelDropdown = ref(undefined)
const modelDropdown2 = ref()
const modelDropdown3 = ref()
const modelDropdown4 = ref()

const listCoffee = ref([])

const typeOfCommunityServiceOptions = [
	{
		id: 'A',
		nama: 'Menduduki jabatan pimpinan pada lembaga pemerintah/pejabat negara yang harus dibebaskan dari jabatan organiknya',
	},
	{
		id: 'B',
		nama: 'Melaksanakan pengembangan hasil pendidikan dan penelitian yang dapat dimanfaatkan oleh masyarakat',
	},
	{
		id: 'C',
		nama: 'Memberi latihan/penyuluhan/penataran/ceramah pada masyarakat',
	},
	{
		id: 'D',
		nama: 'Memberi pelayanan kepada masyarakat atau kegiatan lain yang menunjang pelaksanaan tugas umum pemerintahan dan pembangunan',
	},
	{
		id: 'E',
		nama: 'Membuat/menulis karya pengabdian pada masyarakat yang tidak dipublikasikan',
	},
]

const fetchCoffee = async () => {
	const response = await fetch('https://api.sampleapis.com/coffee/hot')
	const data = await response.json()
	const coffeeList = data.map((item: any) => ({
		label: item.title,
		value: item.id,
	}))
	listCoffee.value = [...coffeeList]
}

const listCoffeeWithUndefinedValue = computed(() => {
	return [
		{
			label: 'Semua',
			value: undefined,
		},
		...listCoffee.value,
	]
})

fetchCoffee()

watch(modelDropdown, () => {
	modelDropdown2.value = undefined
})

const dropdownValue = ref<string>('')
const dropdownInput = ref<InstanceType<typeof Dropdown> | null>(null)
const selectedOption = ref<string | null>(null)
const search = ref('')

const coffeeList = ref([
	{ label: 'Espresso', value: 1 },
	{ label: 'Latte', value: 2 },
	{ label: 'Cappuccino', value: 3 },
	{ label: 'Americano', value: 4 },
	{ label: 'Mocha', value: 5 },
	{ label: 'Macchiato', value: 6 },
	{ label: 'Flat White', value: 7 },
	{ label: 'Affogato', value: 8 },
	{ label: 'Irish Coffee', value: 9 },
	{ label: 'Cortado', value: 10 },
])

const filteredListCoffee = ref(coffeeList.value)

const onSearch = (value: string) => {
	console.log('Searching for:', value)
	search.value = value
	filteredListCoffee.value = coffeeList.value.filter(item =>
		item.label.toLowerCase().includes(value.toLowerCase())
	)
}

const filteredList = computed(() => {
	if (!search.value) return coffeeList.value
	const searchNormalized = search.value.toLowerCase().replace(/\s+/g, '')
	return coffeeList.value.filter(item =>
		item.label.toLowerCase().replace(/\s+/g, '').includes(searchNormalized)
	)
})
</script>
