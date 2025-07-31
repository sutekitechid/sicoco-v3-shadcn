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
	provide,
	nextTick,
} from 'vue'
import { PopoverRoot, PopoverPortal, useForwardPropsEmits } from 'radix-vue'
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
	type Option,
	dropdownVariants,
	selectSingleOption,
	selectMultipleOptions,
	getDropdownContentContainerWidth,
} from '.'

import { cn } from '../../utils/tw-merge'

import Spinner from './DropdownSpinner.vue'

import DropdownChevron from './DropdownChevron.vue'

import { sanitizeHtml } from '../../utils/sanitize-html'
import isEqual from 'lodash/isEqual'

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
 * @property {boolean} [ignoreActiveItemValue] - Ignore active UI dropdown item
 * @property {'top' | 'right' | 'bottom' | 'left'} [side] - The preferred side where the dropdown should open.
 * @property {'start' | 'center' | 'end'} [align] - Alignment of the dropdown relative to the trigger element.
 * @property {boolean} [pending] - Indicates if there is a pending operation (e.g., API call) related to the dropdown.
 * @property {boolean} [scrollable] - Enables scrollable behavior if there are many options.
 *
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
	customValidators?: Record<string, unknown>
	ignoreActiveItemValue?: boolean
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
	pending?: boolean
	scrollable?: boolean
	dataCySearchInput?: string
	appendToBody?: boolean
	fitContent?: boolean
	dataCy?: string
	inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	scrollable: true,
	appendToBody: false,
	fitContent: false,
	inline: false,
})

/**
 * An enumeration representing the different states of the dropdown.
 */
const DropdownType = Object.freeze({
	DISABLED: 'disabled',
	SELECTED: 'selected',
	DEFAULT: 'default',
})

/**
 * Emits events from the Dropdown component.
 * - `update:modelValue`: Emits the updated model value.
 * - `typing`: Emits the value typed into the search input.
 * - `select`: Emits the selected option.
 */
const emit = defineEmits(['update:modelValue', 'typing', 'select', 'focus'])

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
async function onSelectOption(option: Option) {
	let value
	if (!isMultipleSelect.value) {
		onClickDropdown(false)
		value = selectSingleOption(option)
	} else {
		value = selectMultipleOptions(props.modelValue, option)
	}
	emit('update:modelValue', value)
	emit('select', value)
	resetSearch()
	await nextTick()
	validate()
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
	if (props.ignoreActiveItemValue) {
		return null
	}
	if (props.multiple && Array.isArray(props.modelValue)) {
		return props.modelValue.some((item: Option) =>
			isEqualModelValue(option, item)
		)
	}
	return isEqualModelValue(props.modelValue, option)
}

const hasOptions = computed(() => {
	return options.value && options.value.length > 0
})

/**
 * Checks if the current modelValue matches any of the options.
 * @returns {boolean}
 */
const isSelected = computed(() => {
	if (!hasOptions.value) {
		return false
	}
	const isEqual = options.value.some(option =>
		isEqualModelValue(props.modelValue, option)
	)
	return isEqual
})

/**
 * Disabling teleporting of the dropdown portal if `appendToBody` is false or if `inline` is true.
 */
const isPopoverPortalDisabled = computed(() => {
	return !props.appendToBody || props.inline
})

/**
 *
 * @param modelValue
 * @param option
 *
 */

function isEqualModelValue(modelValue: unknown, option: unknown): boolean {
	return isEqual(modelValue, option)
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
 * If the element is a dropdown item, it sets a flag to indicate that the element was selected by clicking an item.
 *
 * @param {object} payload - Object containing the `innerHTML` of the element.
 */
function setSelectedElement(payload: { innerHTML: string }) {
	selectedElement.value = h('div', payload.innerHTML).children as string | null
}

/**
 * Finds and sets the currently selected element based on the model value.
 * If the element was not set by clicking an item, it finds the element based on the model value.
 */
function findAndSetSelectedElement() {
	setTimeout(() => {
		const value = jsonToValidSelector(props.modelValue)
		const dropdownItems = listItemDropdownRef.value
		const element = document.querySelectorAll(
			`#${dropdownItems?.id} [data-dropdown-item="${value}"]` as string
		)
		if (element && element[0]) {
			setSelectedElement({ innerHTML: element[0].innerHTML })
		} else {
			setSelectedElement({ innerHTML: props.placeholder })
		}
	}, 0)
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
	} else if (!isSelected.value) {
		return props.placeholder || 'Select options..'
	}
	return props.modelValue
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	} else if (isSelected.value) {
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

const renderDummyOptions = computed(() => {
	return !open.value && props.modelValue !== null
})

/**
 * Adds an option to the dropdown item after the dropdown item is added.
 * @param option
 * @returns
 */
const addOption = (option: Option) => {
	options.value.push(option)
}

/**
 * Removes an option from the dropdown item after dropdown item is removed.
 * @param option
 */
const removeOption = (option: Option) => {
	const index = options.value.findIndex(
		(item: Option) => JSON.stringify(item) === JSON.stringify(option)
	)
	if (index > -1) {
		options.value.splice(index, 1)
	}
}

// React on mount to set up a resize observer and adjust the button size accordingly
onMounted(() => {
	if (!props.fitContent) {
		const resizeObserver = new ResizeObserver(
			updateDropdownContentContainerWidth
		)
		if (triggerButtonDropdown.value) {
			resizeObserver.observe(triggerButtonDropdown.value)
		}
		onBeforeUnmount(() => resizeObserver.disconnect())
		updateDropdownContentContainerWidth()
	}
})

/**
 * Handle clicks outside the dropdown to close it.
 * It checks if the click occurred outside any dropdown content elements and closes the dropdown if it did.
 */
useEventListener('click', event => {
	const clickedOutside = contentRef.every(target => {
		if (!target.value) return true

		return !target.value.contains(event.target)
	})
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
 * Watcher for changes in `listItemDropdownRef` and options.
 * The options is updated when the dropdown group items are updated.
 * Updates the dropdown options and manages the select all state based on the provided dropdown group items.
 */
watch(
	[options, listItemDropdownRef],
	() => {
		initiateSelectAll()
		findAndSetSelectedElement()
	},
	{ immediate: true, deep: true }
)

/**
 * Watcher for changes in `props.modelValue`.
 * Updates the selected element based on the model value.
 */
watch(
	() => props.modelValue,
	() => {
		findAndSetSelectedElement()
	},
	{ immediate: true }
)

const baseInputRef = ref<InstanceType<typeof BaseInput> | null>(null)

function validate() {
	if (useValidation.value) {
		return baseInputRef.value?.validate()
	}
}

function resetValidation() {
	if (useValidation.value) {
		baseInputRef.value?.reset()
	}
}

function focusAndShake() {
	if (useValidation.value) {
		baseInputRef.value?.focusAndShake()
	}
}

/**
 * This function is used to focus the input.
 */
function focus() {
	if (triggerButtonDropdown.value) {
		triggerButtonDropdown.value.focus()
	}
	emit('focus')
}

provide('selectedOption', selectedOption)
provide('addOption', addOption)
provide('removeOption', removeOption)
provide('onSelectOption', onSelectOption)
provide('isOptionSelected', isOptionSelected)
provide('setSelectedElement', setSelectedElement)
provide('isMultipleSelect', isMultipleSelect)
provide('uniqueIdDropdown', uniqueIdDropdown)

defineExpose({
	openDropdown,
	closeDropdown,
	validate,
	resetValidation,
	focusAndShake,
	focus,
})
</script>

<template>
	<BaseInput
		ref="baseInputRef"
		:model-value="modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="focus"
	>
		<template #default>
			<div :class="[{ inline: props.inline }, 'text-neutral-100']">
				<PopoverRoot v-bind="forwarded" :open="true">
					<DropdownTrigger
						:class="props.class"
						:data-cy="slots.trigger ? dataCy : undefined"
					>
						<div :ref="contentRef[0]">
							<div
								v-if="slots.trigger"
								ref="triggerButtonDropdown"
								tabindex="0"
								@click="onClickDropdown(!open)"
							>
								<slot
									name="trigger"
									:open="open"
									:label="selectedElement || selectedOption"
								/>
							</div>
							<div v-else>
								<div
									ref="triggerButtonDropdown"
									:class="cn(dropdownVariants({ type: typeButton }))"
									class="dropdown__dropdown-trigger"
									:data-cy="dataCy"
									:disabled="props.disabled"
									tabindex="0"
									@click="onClickDropdown(!open)"
								>
									<div class="flex items-center gap-2 truncate">
										<div v-if="props.multiple">{{ selectedOption }}</div>
										<div
											v-else-if="selectedElement"
											v-html="sanitizeHtml(selectedElement)"
										/>
										<p v-else>{{ selectedOption }}</p>
									</div>
									<DropdownChevron v-if="!props.pending" :open="open" />
									<div v-else>
										<Spinner class="w-3 h-3 -mt-2 mr-2" />
									</div>
								</div>
							</div>
						</div>
					</DropdownTrigger>
					<PopoverPortal :disabled="isPopoverPortalDisabled">
						<div>
							<!-- Handle if value has been selected and dropdown is closed and there are one or more options selected -->
							<!-- DropdownContent component has a render performance issue if there are too many dropdowns rendered -->
							<div
								v-if="renderDummyOptions"
								:id="uniqueIdDropdown"
								ref="listItemDropdownRef"
								class="hidden"
							>
								<slot />
							</div>
							<DropdownContent
								v-else-if="open"
								:side="props.side"
								:align="props.align"
								:inline="props.inline"
							>
								<div :ref="contentRef[1]" :style="dropdownContentContainerSize">
									<div
										class="px-2 flex items-center gap-2 w-full text-neutral-100"
									>
										<Checkbox
											v-if="isMultipleSelect"
											:indeterminate="isIndeterminate"
											:value="selectAll"
											class="py-2"
											@update:checked="onCheckedAll"
										/>
										<div v-if="isSearchable" class="py-2" :class="props.class">
											<Input
												v-model="search"
												:data-cy="props.dataCySearchInput"
											>
												<template #suffix>
													<i class="si-search text-neutral-100" />
												</template>
											</Input>
										</div>
									</div>
									<div
										:id="uniqueIdDropdown"
										ref="listItemDropdownRef"
										class="overflow-y-auto"
										:class="props.scrollable && 'max-h-52'"
									>
										<slot />
									</div>
								</div>
							</DropdownContent>
						</div>
					</PopoverPortal>
				</PopoverRoot>
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
		<template #hint>
			<slot name="hint" />
		</template>
	</BaseInput>
</template>

<style scoped>
.input__has-error .dropdown__dropdown-trigger {
	@apply border-danger-100/60 focus-visible:ring-danger-50/40 focus-visible:border-danger-100/60;
}
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
.inline [data-radix-popper-content-wrapper] {
	position: relative !important;
	transform: none !important;
}
</style>
