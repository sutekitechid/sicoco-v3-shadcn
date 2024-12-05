<script setup lang="ts">
import { getCurrentInstance, ref, computed, defineProps, PropType } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { getDropdownItemClasses } from '.'

const props = defineProps({
	value: {
		type: [String, Number] as PropType<string | number>,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})

const emits = defineEmits(['click'])
const instance = getCurrentInstance()

const dropdownItem = ref(null)

const findParent = parent => {
	if (!parent) return null
	if (parent.exposed?.selectOption) return parent
	return findParent(parent.parent)
}

const dropdownParent = findParent(instance.parent)

const dropdownItemClasses = computed(() =>
	getDropdownItemClasses(props, dropdownParent)
)

const onClick = () => {
	if (!props.disabled && dropdownParent) {
		dropdownParent.exposed.onClickOption(props.value)
		dropdownParent.exposed.setSelectedElement(dropdownItem.value)
		emits('click')
	}
}
</script>

<template>
	<div
		:data-dropdown-item="String(props.value)"
		:data-dropdown-group-item="
			dropdownParent?.exposed?.uniqueIdDropdown?.value + '__item'
		"
		:class="dropdownItemClasses"
		class="block font-normal py-2 hover:bg-grey-10 rounded-md cursor-pointer mb-2 text-sm"
		@click="onClick"
		ref="dropdownItem"
	>
		<div class="flex items-center">
			<Checkbox
				:disabled="props.disabled"
				class="ml-2"
				v-if="dropdownParent?.exposed?.multipleSelect?.value"
				:value="!dropdownParent?.exposed?.isOptionSelected(props.value)"
			/>
			<div class="px-2">
				<slot />
			</div>
		</div>
	</div>
</template>
