<script setup lang="ts">
import {
	ref,
	computed,
	onMounted,
	onBeforeUnmount,
	watch,
	h,
	useSlots,
	HTMLAttributes,
} from 'vue'
import { PopoverRoot, useForwardPropsEmits } from 'radix-vue'
import { useEventListener } from '@vueuse/core'
import { requiredIf } from '@vuelidate/validators'

import { DropdownTrigger, DropdownContent, DropdownErrorMessage } from './index'
import { Input } from '../input/index'
import { Checkbox } from '../checkbox/index'
import BaseInput from '../base-input/index'

import { jsonToValidSelector } from '../../utils/string'

import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'

import {
	type DropdownVariants,
	type Option,
	dropdownVariants,
	selectOption,
	getDropdownContentContainerWidth,
} from '.'

import { cn } from '../../utils/tw-merge'

/**
 * Props for the Dropdown component.
 *
 * @property {string} [class] - Additional CSS classes for the component.
 * @property {Option} modelValue - The current selected value of the dropdown. It can be a single value or an array of values for multiple selection.
 * @property {string} [placeholder] - The placeholder text displayed when no option is selected.
 * @property {boolean} [disabled] - Whether the dropdown is disabled.
 * @property {boolean} [required] - Whether the dropdown selection is required.
 * @property {boolean} [searchable] - Whether the dropdown supports search functionality.
 * @property {boolean} [loading] - Indicates if options are loading.
 * @property {boolean} [multiple] - Whether multiple selections are allowed.
 * @property {Record<string, any>} [customValidators] - Custom validation rules for the model value.
 */
interface Props {
	class?: HTMLAttributes['class']
	modelValue?: Option
	placeholder?: string
	disabled?: boolean
	required?: boolean
	searchable?: boolean
	loading?: boolean
	multiple?: boolean
	customValidators?: Record<string, any>
}

/**
 * An enumeration representing the different states of the dropdown.
 */
const DropdownType = Object.freeze({
	DISABLED: 'disabled',
	SELECTED: 'selected',
	DEFAULT: 'default',
})

/**
 * Props defined for the Dropdown component.
 * - `class`: Additional custom CSS classes.
 * - `modelValue`: The current selected value of the dropdown.
 * - `placeholder`: Placeholder text when no option is selected.
 * - `disabled`: If true, disables the dropdown.
 * - `required`: If true, makes the dropdown selection mandatory.
 * - `searchable`: If true, enables search functionality within the dropdown.
 * - `loading`: If true, indicates that options are being loaded.
 * - `multiple`: If true, allows multiple selections.
 * - `customValidators`: Object containing custom validation rules for the model value.
 */
const props = defineProps<Props>()

/**
 * Emits events from the Dropdown component.
 * - `update:modelValue`: Emits the updated model value.
 * - `typing`: Emits the value typed into the search input.
 * - `select`: Emits the selected option.
 */
const emit = defineEmits(['update:modelValue', 'typing', 'select'])

/**
 * Forwarded props and emits from the parent component.
 */
const forwarded = useForwardPropsEmits(props, emit)

/**
 * Vue slots.
 */
const slots = useSlots()

/**
 * Reactive state for search input value.
 */
const search = ref('')

/**
 * Reactive state for dropdown open/close status.
 */
const open = ref(false)

/**
 * Reference to the dropdown trigger button.
 */
const triggerButtonDropdown = ref(null)

/**
 * Reactive state for the size of the dropdown trigger button.
 */
const dropdownContentContainerSize = ref('')

/**
 * Reactive state for the currently selected element in the dropdown.
 */
const selectedElement = ref<string | null>(null)

/**
 * Reactive state for the "select all" checkbox.
 */
const selectAll = ref(false)

/**
 * Unique ID for the dropdown component.
 */
const uniqueIdDropdown = ref(`dropdown__${uniqueId()}`)

/**
 * Reactive state for the dropdown options.
 */
const options = ref([])

/**
 * References to the content of the dropdown for layout management.
 */
const contentRef = [ref(null), ref(null)]

/**
 * Reference to the dropdown list items container.
 */
const listItemDropdownRef = ref(null)

/**
 * Handles the selection of an option.
 * If the dropdown does not allow multiple selections, it closes the dropdown.
 *
 * @param {Option} option - The option to be selected.
 */
function onSelectOption(option: Option) {
	if (!isMultipleSelect.value) {
		onClickDropdown(false)
	}
	const value = selectOption(props.modelValue, option, isMultipleSelect.value)
	emit('update:modelValue', value)
	emit('select', value)
	resetSearch()
}

/**
 * Resets the search input value to an empty string.
 */
function resetSearch() {
	search.value = ''
}

/**
 * Updates the size of the dropdown trigger button based on its current width.
 */
function updateDropdownContentContainerWidth() {
	if (triggerButtonDropdown.value) {
		dropdownContentContainerSize.value = getDropdownContentContainerWidth(
			triggerButtonDropdown.value.getBoundingClientRect().width
		)
	}
}

/**
 * Checks if a given option is selected.
 *
 * @param {Option} option - The option to check.
 * @returns {boolean} - Returns `true` if the option is selected, otherwise `false`.
 */
function isOptionSelected(option: Option) {
	if (props.multiple && Array.isArray(props.modelValue)) {
		return props.modelValue.some(
			(item: Option) => JSON.stringify(item) === JSON.stringify(option)
		)
	}
	return JSON.stringify(props.modelValue) === JSON.stringify(option)
}

/**
 * Toggles the dropdown open/close state based on the provided payload.
 * Does nothing if the dropdown is disabled.
 *
 * @param {boolean} payload - The desired state of the dropdown.
 */
function onClickDropdown(payload: boolean) {
	if (!props.disabled) open.value = payload
}

/**
 * Opens the dropdown.
 */
function openDropdown() {
	onClickDropdown(true)
}

/**
 * Closes the dropdown.
 */
function closeDropdown() {
	onClickDropdown(false)
}

/**
 * Sets the currently selected element based on its inner HTML.
 *
 * @param {object} payload - Object containing the `innerHTML` of the element.
 */
function setSelectedElement(payload: { innerHTML: string }) {
	selectedElement.value = h('div', payload.innerHTML).children as string | null
}

/**
 * Initializes the currently selected element based on the model value.
 */
/**
 * Menginisialisasi elemen yang dipilih pada komponen dropdown.
 */
function initSelectedElement() {
	const value = jsonToValidSelector(props.modelValue)
	const element = document.querySelectorAll(
		`[data-dropdown-item="${value}"]` as string
	)
	if (element && element[0]) {
		selectedElement.value = element[0].innerHTML
	}
}

/**
 * Retrieves elements belonging to a specific dropdown group based on the unique ID.
 *
 * @param {string} uniqueId - The unique ID of the dropdown group.
 * @param {string} suffix - Optional suffix used to construct the data attribute (default: '__group').
 * @returns {HTMLElement[]} - An array of elements belonging to the dropdown group.
 */
function getElementsByDropdownGroupItem(
	uniqueId: string,
	suffix = '__group'
): HTMLElement[] {
	const dataDropdownGroupItem = `${uniqueId}${suffix}`
	const nodeList = document.querySelectorAll(
		`[data-dropdown-group-item="${dataDropdownGroupItem}"]`
	)
	if (nodeList) return Array.from(nodeList) as HTMLElement[]
	else return []
}

/**
 * Extracts dropdown items from the given elements.
 *
 * @param {HTMLElement[]} elements - Array of elements containing dropdown items.
 * @returns {string[]} - An array of dropdown item IDs.
 */
function extractDropdownItemsFromElements(elements: HTMLElement[]): string[] {
	return elements.map(
		(element: HTMLElement) => element.dataset.dropdownItem || ''
	)
}

/**
 * Processes dropdown group items by converting them to an array of objects.
 *
 * @param {string} uniqueId - The unique ID of the dropdown group.
 * @param {string} suffix - Optional suffix used to construct the data attribute (default: '__group').
 * @returns {string[]} - An array of processed dropdown items.
 */
function processDropdownGroupItems(
	uniqueId: string,
	suffix = '__group'
): string[] {
	const elements = getElementsByDropdownGroupItem(uniqueId, suffix)
	const dropdownItems = extractDropdownItemsFromElements(elements)
	return convertToObjectArray(dropdownItems)
}

/**
 * Converts an array of dropdown item IDs to an array of objects.
 *
 * @param {string[]} dropdownItems - Array of dropdown item IDs.
 * @returns {Object[]} - Array of parsed dropdown item objects.
 */
function convertToObjectArray(dropdownItems: string[]) {
	return dropdownItems.map(item => JSON.parse(item))
}

/**
 * Toggles the "select all" checkbox state and updates the model value accordingly.
 *
 * @param {boolean} payload - The desired state of the "select all" checkbox.
 */
function onCheckedAll(payload: boolean) {
	selectAll.value = !selectAll.value
	if (!payload) {
		emit('update:modelValue', [])
	} else {
		emit('update:modelValue', cloneDeep(options.value))
	}
}

/**
 * Initializes the "select all" checkbox based on the current model value and options.
 */
function initiateSelectAll() {
	if (isMultipleSelect && Array.isArray(props.modelValue)) {
		selectAll.value = props.modelValue.length === options.value.length
	}
}

/**
 * Computed property to determine the currently selected option(s).
 * Returns a string representing the number of selected items or the placeholder text if no items are selected.
 */
const selectedOption = computed(() => {
	if (
		isMultipleSelect.value &&
		Array.isArray(props.modelValue) &&
		props.modelValue.length > 0
	) {
		const countSelected = props.modelValue.length
		return countSelected + ' items selected'
	} else if (
		props.modelValue === undefined ||
		(Array.isArray(props.modelValue) && props.modelValue.length < 1)
	) {
		return props.placeholder || 'Select options..'
	}
	return props.modelValue || null
})

/**
 * Computed property indicating if the dropdown supports multiple selections.
 * Returns a boolean indicating the value of `props.multiple`.
 */
const isMultipleSelect = computed(() => {
	return props.multiple
})

/**
 * Computed property defining the validation rules for the model value.
 * Combines the `required` rule based on `props.required` and any custom validators provided in `props.customValidators`.
 */
const rules = computed(() => {
	const rules: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}
	return rules
})

/**
 * Computed property to determine if validation should be applied.
 * Returns `false` if the dropdown is disabled, otherwise returns whether the dropdown is required or has custom validators.
 */
const useValidation = computed(() => {
	if (props.disabled) {
		return false
	}
	return props.required || !isEmpty(props.customValidators)
})

/**
 * Computed property to determine if the "indeterminate" state should be applied to the "select all" checkbox.
 * Returns `true` if some but not all options are selected; otherwise, returns `false`.
 */
const isIndeterminate = computed(() => {
	if (isMultipleSelect.value && Array.isArray(props.modelValue)) {
		return (
			props.modelValue.length > 0 &&
			props.modelValue.length < options.value.length
		)
	}
	return false
})

/**
 * Computed property to determine the type of the button.
 * Returns the appropriate type based on the dropdown's state: disabled, selected, or default.
 */
const typeButton = computed(() => {
	if (props.disabled) {
		return DropdownType.DISABLED
	} else if (props.modelValue) {
		return DropdownType.SELECTED
	} else {
		return DropdownType.DEFAULT
	}
})

/**
 * Computed property to determine if the dropdown is searchable.
 * Returns a boolean indicating the value of `props.searchable`.
 */
const isSearchable = computed(() => {
	return props.searchable
})

// React on mount to set up a resize observer and adjust the button size accordingly
onMounted(() => {
	const resizeObserver = new ResizeObserver(updateDropdownContentContainerWidth)
	if (triggerButtonDropdown.value) {
		resizeObserver.observe(triggerButtonDropdown.value)
	}
	onBeforeUnmount(() => resizeObserver.disconnect())
	updateDropdownContentContainerWidth()
})

/**
 * Handle clicks outside the dropdown to close it.
 * It checks if the click occurred outside any dropdown content elements and closes the dropdown if it did.
 */
useEventListener('click', event => {
	const clickedOutside = contentRef.every(
		target => !target.value.contains(event.target)
	)
	if (clickedOutside) {
		onClickDropdown(false)
	}
})

/**
 * Watcher to emit a 'typing' event when the search term changes.
 */
watch(search, val => {
	emit('typing', val)
})

/**
 * Watcher for changes in `listItemDropdownRef`.
 * Updates the dropdown options and manages the select all state based on the provided dropdown group items.
 */
watch(listItemDropdownRef, val => {
	if (val) {
		options.value = processDropdownGroupItems(uniqueIdDropdown.value)
		initiateSelectAll()
		if (props.modelValue) {
			initSelectedElement()
		}
	}
})

defineExpose({
	selectOption,
	selectedOption,
	onSelectOption,
	isOptionSelected,
	setSelectedElement,
	isMultipleSelect,
	uniqueIdDropdown,
	openDropdown,
	closeDropdown,
})
</script>

<template>
	<div :class="props.class" class="text-black">
		<PopoverRoot v-bind="forwarded" :open="true">
			<DropdownTrigger>
				<BaseInput
					:model-value="modelValue"
					:validation-rules="rules"
					:use-validation="useValidation"
				>
					<template #default>
						<div :ref="contentRef[0]">
							<div v-if="slots.trigger" @click="onClickDropdown(!open)">
								<slot name="trigger" />
							</div>
							<div v-else>
								<div
									id="triggerButtonDropdown"
									ref="triggerButtonDropdown"
									:class="[cn(dropdownVariants({ type: typeButton }))]"
									:disabled="props.disabled"
									@click="onClickDropdown(!open)"
								>
									<div class="flex items-center gap-2">
										<div v-if="props.multiple">{{ selectedOption }}</div>
										<div v-else-if="selectedElement" v-html="selectedElement" />
										<p v-else-if="!props.modelValue">
											{{ selectedOption }}
										</p>
									</div>
									<div
										class="w-6 h-6 flex items-center justify-center"
										:class="open ? 'rotate-180' : ''"
									>
										<i class="si-chevron-down text-black" />
									</div>
								</div>
							</div>
						</div>
					</template>
					<template #errors="{ validation }">
						<DropdownErrorMessage :validation="validation">
							<template #required>
								<slot name="required" :validation="validation" />
							</template>
							<template #errors>
								<slot name="errors" :validation="validation" />
							</template>
						</DropdownErrorMessage>
					</template>
				</BaseInput>
			</DropdownTrigger>
			<DropdownContent
				id="triggerContentDropdown"
				:class="open ? 'block' : 'hidden'"
			>
				<div :style="dropdownContentContainerSize" :ref="contentRef[1]">
					<div class="px-4 pt-2 flex items-center gap-2 w-full text-black">
						<Checkbox
							v-if="isMultipleSelect"
							@update:checked="onCheckedAll"
							:indeterminate="isIndeterminate"
							:value="selectAll"
						/>
						<Input v-model="search" v-if="isSearchable">
							<template #suffix>
								<i class="si-search text-black" />
							</template>
						</Input>
					</div>
					<div
						ref="listItemDropdownRef"
						:id="uniqueIdDropdown"
						class="overflow-y-auto px-2 pt-2"
						:class="isSearchable ? 'max-h-52' : ''"
					>
						<slot />
					</div>
				</div>
			</DropdownContent>
		</PopoverRoot>
	</div>
</template>

<style scoped>
* {
	scrollbar-width: thin;
	scrollbar-color: #bbbdc5 white;
}
*::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}
*::-webkit-scrollbar-track {
	background: white;
	border-radius: 8px;
}
*::-webkit-scrollbar-thumb {
	background-color: #bbbdc5;
	border-radius: 8px;
	border: 2px solid white;
}
*:hover::-webkit-scrollbar-thumb {
	background-color: #aaa;
}
</style>
