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
	</div>
</template>
<script lang="ts" setup>
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import { computed, ref, watch } from 'vue'

const modelDropdown = ref(undefined)
const modelDropdown2 = ref()
const modelDropdown3 = ref()

const listCoffee = ref([])
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
