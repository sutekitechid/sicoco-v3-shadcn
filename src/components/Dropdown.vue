<template>
	<Dropdown
		v-model="computedModelValue"
		class="w-full"
		data-cy="anotherModelDropdownDefaultSelected"
		data-testid="anotherModelDropdownDefaultSelected"
		placeholder="Select an option"
	>
		<DropdownItem :value="undefined">
			<span>value empty</span>
		</DropdownItem>
		<DropdownItem
			v-for="item in anotherDropdownItems"
			:key="item.value"
			:value="item.value"
		>
			{{ item.label }}
		</DropdownItem>
	</Dropdown>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import Dropdown from '@/components/dropdown/Dropdown.vue'
import DropdownItem from '@/components/dropdown/DropdownItem.vue'
import { ref } from 'vue'

const props = defineProps<{
	modelValue?: string | number | null
}>()

const emits = defineEmits<{
	(e: 'update:modelValue', value: string | number | null): void
}>()

const computedModelValue = useVModel(props, 'modelValue', emits)

const anotherDropdownItems = ref([
	{
		label: 'Opsi 1',
		value: 'option1',
	},
	{
		label: 'Opsi 2',
		value: 'option2',
	},
	{
		label: 'Opsi 3',
		value: 'option3',
	},
])
</script>
