<template>
	<div>
		<Dropdown
			v-model="computedModelValue"
			side="left"
			align="start"
			class="w-full text-left"
		>
			<template #trigger>
				<p class="p-2 hover:bg-neutral-10 w-full text-sm">Columns size</p>
			</template>
			<DropdownItem
				v-for="size in columnSizes"
				:key="size.value"
				:value="size.value"
				class="text-left text-sm"
			>
				{{ size.label }}
			</DropdownItem>
		</Dropdown>
	</div>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { useVModel } from '@vueuse/core'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { COLUMN_SIZE } from '.'

const props = defineProps<{
	modelValue: string | undefined
}>()

const emits = defineEmits<{
	'update:modelValue': (value: string) => void
}>()

const computedModelValue = useVModel(props, 'modelValue', emits)

const columnSizes = computed(() => {
	// return COLUMN_SIZE with label and value
	return Object.keys(COLUMN_SIZE).map(key => ({
		label: key,
		value: COLUMN_SIZE[key],
	}))
})
</script>
