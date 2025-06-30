<script setup lang="ts">
/**
 * It integrates with `PopoverContent` from `radix-vue` to manage dropdown functionalities.
 *
 * @example
 * <DropdownItem value="option1" type="default" @select="handleSelect">
 *   Option 1
 * </DropdownItem>
 */
import {
	ref,
	computed,
	defineProps,
	defineEmits,
	inject,
	onUnmounted,
} from 'vue'
import type { HTMLAttributes } from 'vue'
import { Checkbox } from '../checkbox/index'
import { cn } from '../../utils/tw-merge'
import {
	type DropdownItemVariants,
	dropdownItemVariants,
	dropdownItemType,
} from '.'

/**
 * Props for the DropdownItem component.
 *
 * @property {string | number | object} value - The value associated with this dropdown item.
 * @property {boolean} [disabled] - Whether the dropdown item is disabled.
 * @property {HTMLAttributes['class']} [class] - Additional CSS classes to apply to the dropdown item.
 * @property {DropdownItemVariants['type']} [type] - The style variant for the dropdown item.
 */
const props = defineProps<{
	value?: string | number | object | boolean
	disabled?: boolean
	class?: HTMLAttributes['class']
	type?: DropdownItemVariants['type']
}>()

/**
 * Emits for the DropdownItem component.
 *
 * @event select - Emitted when the item is selected within the dropdown.
 */
const emits =
	defineEmits<
		(e: 'select', payload: string | number | object | boolean) => void
	>()

const dropdownItem = ref<HTMLElement | null>(null)

// const dropdownParent = selectParent(instance.parent)

/**
 * Handle the selection of this dropdown item.
 * Emits a 'select' event to the parent dropdown.
 */

const onSelectOption = inject('onSelectOption', (val: unknown) => { return val})
const setSelectedElement = inject('setSelectedElement', (val: unknown) => { return val })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isOptionSelected = inject('isOptionSelected', (val: unknown) => false)
const isMultiple = inject('isMultipleSelect', ref(false))
const uniqueIdDropdown = inject('uniqueIdDropdown', ref(''))
const addOption = inject('addOption', (val: unknown) => { return val })
const removeOption = inject('removeOption', (val: unknown) => { return val })

addOption(props.value)

// remove option when unmounted
onUnmounted(() => {
	removeOption(props.value)
})

const onSelectDropdownItem = () => {
	if (!props.disabled) {
		onSelectOption(props.value)
		setSelectedElement(dropdownItem.value)
		emits('select', props.value)
	}
}

/**
 * Computed property to determine if this dropdown item is selected.
 *
 * @type {boolean} - True if the item is selected, false otherwise.
 */
const isSelected = computed(() => {
	return isOptionSelected(props.value)
})

/**
 * Computed property to determine if the parent dropdown allows multiple selections.
 *
 * @type {boolean} - True if multiple selection is allowed, false otherwise.
 */
const isMultipleSelect = computed(() => {
	return isMultiple?.value
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
	return `${uniqueIdDropdown?.value}__group`
})

/**
 * Computed property to determine the checked state of the dropdown item.
 *
 * @type {boolean} - Returns true if the item is not selected, false otherwise.
 */
const isChecked = computed(() => {
	return !isOptionSelected(props.value)
})
</script>

<template>
	<div
		ref="dropdownItem"
		:data-dropdown-item="dataDropdownItem"
		:data-dropdown-group-item="dataDropdownGroupItem"
		:class="[
			cn(
				dropdownItemVariants({
					type: dropdownItemType(isMultipleSelect, isSelected, isDisabled),
				}),
				props.class
			),
		]"
		@click="onSelectDropdownItem"
	>
		<div class="flex items-center">
			<Checkbox
				v-if="isMultipleSelect"
				:disabled="isDisabled"
				:value="isChecked"
				class="ml-2"
			/>
			<div class="px-2 w-full">
				<slot />
			</div>
		</div>
	</div>
</template>
