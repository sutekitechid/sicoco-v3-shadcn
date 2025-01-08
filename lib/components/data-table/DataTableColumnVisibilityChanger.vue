<template>
	<div>
		<Dropdown :model-value="undefined">
			<template #trigger>
				<Button outlined>Columns <i class="si-chevron-down"></i></Button>
			</template>
			<DropdownItem
				v-for="column in props.columns"
				:key="column.id"
				:value="column.id"
				class="text-left"
				@click="column.toggleVisibility(!column.getIsVisible())"
			>
				<div class="flex items-center text-sm">
					<Checkbox :model-value="column.getIsVisible()" :value="true" />
					<component :is="column.columnDef.header()" />
				</div>
			</DropdownItem>
		</Dropdown>
	</div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import Button from '../button/Button.vue'
import { Checkbox } from '../../components/checkbox'

const props = defineProps<{
	columns: ColumnDef<unknown, any>[]
}>()
</script>
