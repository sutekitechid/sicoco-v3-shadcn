<template>
	<div>
		<Dropdown :model-value="undefined" align="start">
			<template #trigger>
				<div class="p-2 cursor-pointer hover:bg-neutral-20 rounded">
					<i class="si-push-pin"></i>
				</div>
			</template>
			<DropdownItem
				v-for="(option, index) in pinningOptions"
				:key="index"
				:value="option.value"
				:disabled="option.value === column.getIsPinned()"
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
import { defineProps, defineEmits } from 'vue'
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
	{
		label: 'Unpin',
		value: false,
	},
]
</script>
