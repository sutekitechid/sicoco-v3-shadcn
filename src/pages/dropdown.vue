<template>
	<div>
		<Dropdown
			v-model="modelDropdown"
			placeholder="Sebuah placeholder"
			class="w-64"
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
</template>
<script lang="ts" setup>
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
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
</script>
