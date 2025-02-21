<template>
	<Dropdown :model-value="null" class="h-6">
		<template #trigger>
			<BreadcrumbEllipsis class="h-2" />
		</template>
		<DropdownItem
			v-for="(option, index) in options"
			:key="index"
			:value="index"
			class="min-w-[10rem] p-0"
		>
			<component :is="option" class="w-full text-left" />
		</DropdownItem>
	</Dropdown>
</template>

<script lang="ts" setup>
/**
 * BreadcrumbDropdown component is used to display a dropdown with the breadcrumb items.
 * @slot default - Content to be displayed inside the dropdown
 *
 * @props options - Array of options to be displayed in the dropdown
 */
import { Dropdown, DropdownItem } from '../dropdown'
import { BreadcrumbEllipsis } from '.'

const props = defineProps<{
	options: any[]
}>()
</script>

<style scoped>
:deep(li a) {
	@apply !py-2 w-full font-normal;
}
</style>
