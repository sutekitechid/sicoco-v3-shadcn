<template>
	<div>
		<Dropdown
			:model-value="undefined"
			align="start"
			side="right"
			class="w-full text-left"
		>
			<template #trigger>
				<p class="p-2 hover:bg-neutral-10 w-full text-sm">Pin column</p>
			</template>
			<DropdownItem
				v-for="(option, index) in pinningOptions"
				:key="index"
				:value="option.value"
				:disabled="option.value === column?.getIsPinned()"
				class="text-left"
				@click="emits('select', option.value)"
			>
				<div class="flex items-center text-sm">
					{{ option.label }}
				</div>
			</DropdownItem>
		</Dropdown>
	</div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, watch } from 'vue'
import { type Column } from '@tanstack/vue-table'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { PINNING_TYPE } from '.'

const props = defineProps<{
	column: Column<unknown, any>
}>()

const emits = defineEmits()

const pinningOptions = [
	{
		label: 'Pin to Left',
		value: PINNING_TYPE.LEFT,
	},
	{
		label: 'Pin to Right',
		value: PINNING_TYPE.RIGHT,
	},
]
</script>
