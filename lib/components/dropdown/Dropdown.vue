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

import { toggleArrayValue } from '../../utils/array'

import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'

import { type DropdownVariants, dropdownVariants } from '.'

import { cn } from '../../utils/tw-merge'

type Option =
	| string
	| number
	| boolean
	| Record<string, unknown>
	| Array<unknown>
	| null
	| undefined

interface Props {
	class?: HTMLAttributes['class']
	modelValue: Option
	placeholder?: string
	disabled?: boolean
	required?: boolean
	searchable?: boolean
	loading?: boolean
	multiple?: boolean
	customValidators?: Record<string, any>
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'typing', 'select'])

const forwarded = useForwardPropsEmits(props, emit)
const slots = useSlots()

const search = ref('')
const open = ref(false)
const triggerButtonDropdown = ref(null)
const buttonSize = ref('')
const selectedElement = ref<string | null>(null)
const selectAll = ref(false)
const uniqueIdDropdown = ref(`dropdown__${uniqueId()}`)
const options = ref([])
const contentRef = [ref(null), ref(null)]
const listItemDropdownRef = ref(null)

const selectedOption = computed(() => {
	if (
		multipleSelect.value &&
		Array.isArray(props.modelValue) &&
		props.modelValue.length > 0
	) {
		const countSelected = props.modelValue.length
		return countSelected + '  items selected'
	} else if (
		props.modelValue === undefined ||
		(Array.isArray(props.modelValue) && props.modelValue.length < 1)
	) {
		return props.placeholder || 'Select options..'
	}
	return props.modelValue || null
})

function selectOption(value: Option) {
	if (props.multiple) {
		emit(
			'update:modelValue',
			toggleArrayValue(props.modelValue as [], value as Option)
		)
	} else {
		emit('update:modelValue', value)
	}
	emit('select', value)
}

function onSelectOption(option: Option) {
	if (!multipleSelect.value) {
		onClickDropdown(false)
	}
	resetSearch()
	selectOption(option)
}

function resetSearch() {
	search.value = ''
}

function updateButtonSize() {
	if (triggerButtonDropdown.value) {
		buttonSize.value = `width: ${
			triggerButtonDropdown.value.getBoundingClientRect().width
		}px`
	}
}

function isOptionSelected(option: Option) {
	if (props.multiple && Array.isArray(props.modelValue)) {
		return props.modelValue.some(
			(item: Option) => JSON.stringify(item) === JSON.stringify(option)
		)
	}
	return JSON.stringify(props.modelValue) === JSON.stringify(option)
}

function onClickDropdown(payload: boolean) {
	open.value = payload
}

function openDropdown() {
	onClickDropdown(true)
}

function closeDropdown() {
	onClickDropdown(false)
}

function setSelectedElement(payload: { innerHTML: string }) {
	selectedElement.value = h('div', payload.innerHTML).children as string | null
}

function initSelectedElement() {
	const value = JSON.stringify(props.modelValue)
	const element = document.querySelectorAll(
		`[data-dropdown-item="${value}"]` as string
	)
	if (element && element[0]) {
		selectedElement.value = element[0].innerHTML
	}
}

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

function extractDropdownItemsFromElements(elements: HTMLElement[]): string[] {
	return elements.map(
		(element: HTMLElement) => element.dataset.dropdownItem || ''
	)
}

function processDropdownGroupItems(
	uniqueId: string,
	suffix = '__group'
): string[] {
	const elements = getElementsByDropdownGroupItem(uniqueId, suffix)
	const dropdownItems = extractDropdownItemsFromElements(elements)
	return convertToObjectArray(dropdownItems)
}

function convertToObjectArray(dropdownItems: string[]) {
	return dropdownItems.map(item => JSON.parse(item))
}

function onCheckedAll(payload: boolean) {
	selectAll.value = !selectAll.value
	if (!payload) {
		emit('update:modelValue', [])
	} else {
		emit('update:modelValue', options.value)
	}
}

function initiateSelectAll() {
	if (multipleSelect && Array.isArray(props.modelValue)) {
		selectAll.value = props.modelValue.length === options.value.length
	}
}

const multipleSelect = computed(() => {
	return props.multiple
})

const rules = computed(() => {
	const rules: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}
	return rules
})

const useValidation = computed(() => {
	if (props.disabled) {
		return false
	}
	return props.required || !isEmpty(props.customValidators)
})

const isIndeterminate = computed(() => {
	if (multipleSelect.value && Array.isArray(props.modelValue)) {
		return (
			props.modelValue.length > 0 &&
			props.modelValue.length < options.value.length
		)
	}
	return false
})

const type = computed(() => {
	if (props.disabled) {
		return 'disabled'
	} else if (props.modelValue) {
		return 'selected'
	} else {
		return 'default'
	}
})

onMounted(() => {
	const resizeObserver = new ResizeObserver(updateButtonSize)
	if (triggerButtonDropdown.value) {
		resizeObserver.observe(triggerButtonDropdown.value)
	}
	onBeforeUnmount(() => resizeObserver.disconnect())
	updateButtonSize()
})

useEventListener('click', event => {
	const clickedOutside = contentRef.every(
		target => !target.value.contains(event.target)
	)
	if (clickedOutside) {
		onClickDropdown(false)
	}
})

watch(search, val => {
	emit('typing', val)
})

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
	multipleSelect,
	uniqueIdDropdown,
	openDropdown,
	closeDropdown,
})
</script>

<template>
	<div :class="props.class">
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
									:class="[cn(dropdownVariants({ type }))]"
									:disabled="props.disabled"
									@click="onClickDropdown(!open)"
								>
									<div class="flex items-center gap-2">
										<div v-if="props.multiple">{{ selectedOption }}</div>
										<div v-else-if="selectedElement" v-html="selectedElement" />
										<p v-else-if="props.modelValue === undefined">
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
							<template #errors>
								<slot name="errors" :validation="validation" />
							</template>
						</DropdownErrorMessage>
					</template>
				</BaseInput>
			</DropdownTrigger>
			<div id="triggerContentDropdown">
				<DropdownContent :class="open ? '' : 'hidden'">
					<div :style="buttonSize" :ref="contentRef[1]">
						<div
							v-if="props.searchable"
							class="px-4 pt-2 flex items-center gap-2 w-full text-black"
						>
							<Checkbox
								v-if="multipleSelect"
								@update:checked="onCheckedAll"
								:indeterminate="isIndeterminate"
								:value="selectAll"
							/>
							<Input v-model="search">
								<template #suffix>
									<i class="si-search text-black" />
								</template>
							</Input>
						</div>
						<div
							ref="listItemDropdownRef"
							:id="uniqueIdDropdown"
							class="overflow-y-auto px-2 pt-2"
							:class="props.searchable ? 'max-h-52' : ''"
						>
							<slot />
						</div>
					</div>
				</DropdownContent>
			</div>
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
