<script setup lang="ts">
import {
	getCurrentInstance,
	ref,
	computed,
	defineProps,
	defineEmits,
} from 'vue'
import type { HTMLAttributes } from 'vue'
import { Checkbox } from '../checkbox/index'
import { cn } from '../../utils/tw-merge'
import { type DropdownItemVariants, dropdownItemVariants } from '.'

/**
 * Props for the DropdownItem component.
 *
 * @property {string | number | object} value - The value associated with this dropdown item.
 * @property {boolean} [disabled] - Whether the dropdown item is disabled.
 * @property {HTMLAttributes['class']} [class] - Additional CSS classes to apply to the dropdown item.
 * @property {DropdownItemVariants['type']} [type] - The style variant for the dropdown item.
 */
const props = defineProps<{
	value: string | number | object
	disabled?: boolean
	class?: HTMLAttributes['class']
	type?: DropdownItemVariants['type']
}>()

/**
 * Emits for the DropdownItem component.
 *
 * @event select - Emitted when the item is selected within the dropdown.
 */
const emits = defineEmits<{
	(e: 'select', payload: string | number | object): void
}>()

const instance = getCurrentInstance()

const dropdownItem = ref<HTMLElement | null>(null)

/**
 * Recursively find the parent dropdown component.
 *
 * @param {any} parent - The potential parent component.
 * @returns {any} - The dropdown parent component if found, otherwise null.
 */
const selectParent = (parent: any): any => {
	if (!parent) return null
	if (parent.exposed?.selectedOption) return parent
	return selectParent(parent.parent)
}

const dropdownParent = selectParent(instance.parent)

/**
 * Handle the selection of this dropdown item.
 * Emits a 'select' event to the parent dropdown.
 */
const onSelectDropdownItem = () => {
	if (!props.disabled && dropdownParent) {
		dropdownParent.exposed.onSelectOption(props.value)
		dropdownParent.exposed.setSelectedElement(dropdownItem.value)
		emits('select', props.value)
	}
}

/**
 * Computed property to determine if this dropdown item is selected.
 *
 * @type {boolean} - True if the item is selected, false otherwise.
 */
const isSelected = computed(() => {
	return dropdownParent?.exposed?.isOptionSelected(props.value)
})

/**
 * Computed property to determine if the parent dropdown allows multiple selections.
 *
 * @type {boolean} - True if multiple selection is allowed, false otherwise.
 */
const isMultipleSelect = computed(() => {
	return dropdownParent?.exposed?.isMultipleSelect?.value
})

/**
 * Computed property to determine if the dropdown item is disabled.
 *
 * @type {boolean} - True if the item is disabled, false otherwise.
 */
const isDisabled = computed(() => {
	return props.disabled
})

/**
 * Type definitions for the dropdown item type.
 */
const DropdownItemType = Object.freeze({
	Default: 'default',
	Disabled: 'disabled',
	Selected: 'selected',
	MultipleSelect: 'multiple-select',
})

/**
 * Computed property to determine the type of dropdown item.
 *
 * @type {DropdownItemType} - The type of dropdown item (default, disabled, selected, multiple-select).
 */
const dropdownItemType = computed(() => {
	if (isMultipleSelect.value && isSelected.value) {
		return DropdownItemType.MultipleSelect
	} else if (isSelected.value) {
		return DropdownItemType.Selected
	} else if (isDisabled.value) {
		return DropdownItemType.Disabled
	} else {
		return DropdownItemType.Default
	}
})

/**
 * Computed property for the JSON stringified value of the dropdown item.
 *
 * @type {string} - JSON string of the value.
 */
const dataDropdownItem = computed(() => {
	return JSON.stringify(props.value)
})

/**
 * Computed property for the data attribute identifying the dropdown group.
 *
 * @type {string} - The unique identifier for the dropdown group.
 */
const dataDropdownGroupItem = computed(() => {
	return dropdownParent?.exposed?.uniqueIdDropdown?.value + '__group'
})
</script>

<template>
	<div
		ref="dropdownItem"
		:data-dropdown-item="dataDropdownItem"
		:data-dropdown-group-item="dataDropdownGroupItem"
		:class="[cn(dropdownItemVariants({ type: dropdownItemType }), props.class)]"
		@click="onSelectDropdownItem"
	>
		<div class="flex items-center">
			<Checkbox
				v-if="isMultipleSelect"
				:disabled="props.disabled"
				:value="!dropdownParent?.exposed?.isOptionSelected(props.value)"
				class="ml-2"
			/>
		</div>
		<div class="px-2">
			<slot />
		</div>
	</div>
</template>
