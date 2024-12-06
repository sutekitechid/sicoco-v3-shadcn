<script setup lang="ts">
import {
	getCurrentInstance,
	ref,
	computed,
	defineProps,
	defineEmits,
} from 'vue'
import type { HTMLAttributes } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { cn } from '../../utils/tw-merge'
import { type DropdownItemVariants, dropdownItemVariants } from '.'

// Define props with explicit types
const props = defineProps<{
	value: string | number | object
	disabled?: boolean
	class?: HTMLAttributes['class']
	type?: DropdownItemVariants['type']
}>()

const emits = defineEmits<{
	(e: 'on-select', payload: string | number | object): void
}>()

const instance = getCurrentInstance()

const dropdownItem = ref<HTMLElement | null>(null)

const selectParent = (parent: any): any => {
	if (!parent) return null
	if (parent.exposed?.selectedOption) return parent
	return selectParent(parent.parent)
}

const dropdownParent = selectParent(instance.parent)

const onSelectDropdownItem = () => {
	if (!props.disabled && dropdownParent) {
		dropdownParent.exposed.onSelectOption(props.value)
		dropdownParent.exposed.setSelectedElement(dropdownItem.value)
		emits('on-select', props.value)
	}
}

const isSelected = computed(() => {
	return dropdownParent?.exposed?.isOptionSelected(props.value)
})
const isMultiple = computed(() => {
	return dropdownParent?.exposed?.multipleSelect?.value
})
const isDisabled = computed(() => {
	return props.disabled
})

const type = computed(() => {
	if (isMultiple.value && isSelected.value) {
		return 'multiple-select'
	} else if (isSelected.value) return 'selected'
	else if (isDisabled.value) return 'disabled'
	else return 'default'
})

const dataDropdownItem = computed(() => {
	return JSON.stringify(props.value)
})

const dataDropdownGroupItem = computed(() => {
	return dropdownParent?.exposed?.uniqueIdDropdown?.value + '__group'
})
</script>

<template>
	<div
		ref="dropdownItem"
		:data-dropdown-item="dataDropdownItem"
		:data-dropdown-group-item="dataDropdownGroupItem"
		:class="[cn(dropdownItemVariants({ type }), props.class)]"
		@click="onSelectDropdownItem"
	>
		<div class="flex items-center">
			<Checkbox
				v-if="dropdownParent?.exposed?.multipleSelect?.value"
				:disabled="props.disabled"
				:value="!dropdownParent?.exposed?.isOptionSelected(props.value)"
				class="ml-2"
			/>
			<div class="px-2">
				<slot />
			</div>
		</div>
	</div>
</template>
