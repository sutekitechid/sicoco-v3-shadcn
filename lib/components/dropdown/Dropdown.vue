<script setup lang="ts">
import {
	useSlots,
	computed,
	ref,
	onMounted,
	onBeforeUnmount,
	h,
	watch,
} from 'vue'
import { PopoverRoot, useForwardPropsEmits } from 'radix-vue'
import DropdownTrigger from './DropdownTrigger.vue'
import DropdownContent from './DropdownContent.vue'
import Input from '../input/Input.vue'
import { useEventListener } from '@vueuse/core'
import { upsertArray } from '@/utils/array'
import { Checkbox } from '@/components/checkbox'
import uniqueId from 'lodash/uniqueId'

type Option =
	| string
	| number
	| boolean
	| Record<string, unknown>
	| Array<unknown>

interface Props {
	modelValue?: Option
	placeholder?: string
	optionLabel?: string
	disabled?: boolean
	required?: boolean
	customValidators?: Record<string, unknown>
	searchable?: boolean
	backendSearch?: boolean
	loading?: boolean
	multiple?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits([
	'update:modelValue',
	'typing',
	'select',
	'active-change',
	'focus',
])

const forwarded = useForwardPropsEmits(props, emit)
const slots = useSlots()

const search = ref('')
const open = ref(false)
const triggerButtonDropdown = ref(null)
const buttonSize = ref('')
const listItemDropdown = ref(null)
const selectedElement = ref<string | null>(null)
const selectAll = ref(false)
const uniqueIdDropdown = ref(`dropdown__${uniqueId()}`)
const options = ref([])

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
		emit('update:modelValue', upsertArray(props.modelValue, value))
	} else {
		emit('update:modelValue', value)
	}
	emit('select', value)
}

function onClickOption(option: Option) {
	if (!multipleSelect.value) {
		onClickDropdown(false)
	}
	search.value = ''
	selectOption(option)
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

onMounted(() => {
	const resizeObserver = new ResizeObserver(updateButtonSize)
	if (triggerButtonDropdown.value) {
		resizeObserver.observe(triggerButtonDropdown.value)
	}
	onBeforeUnmount(() => resizeObserver.disconnect())
	updateButtonSize()
})

function onClickDropdown(payload: boolean) {
	open.value = payload
}

const contentRef = [ref(null), ref(null)]

useEventListener('click', event => {
	const clickedOutside = contentRef.every(
		target => !target.value.contains(event.target)
	)

	if (clickedOutside) {
		onClickDropdown(false)
	}
})

function setSelectedElement(payload: { innerHTML: string }) {
	selectedElement.value = h('div', payload.innerHTML).children as string | null
}

function initSelectedElement() {
	const element = document.querySelectorAll(
		`[data-dropdown-item="${props.modelValue}"]` as string
	)
	console.log('element', element[0])
	if (element[0]) {
		selectedElement.value = element[0].innerHTML
	}
}

function openDropdown() {
	onClickDropdown(true)
}

const multipleSelect = computed(() => {
	return props.multiple
})

function getElementsByDropdownGroupItem(
	uniqueId: string,
	suffix = '__item'
): HTMLElement[] {
	const dataId = `${uniqueId}${suffix}`
	const nodeList = document.querySelectorAll(
		`[data-dropdown-group-item="${dataId}"]`
	)
	return Array.from(nodeList) as HTMLElement[]
}

function extractDropdownItemsFromElements(elements: HTMLElement[]): string[] {
	return elements.map(
		(element: HTMLElement) => element.dataset.dropdownItem || ''
	)
}

function processDropdownGroupItems(
	uniqueId: string,
	suffix = '__item'
): string[] {
	const elements = getElementsByDropdownGroupItem(uniqueId, suffix)
	const dropdownItems = extractDropdownItemsFromElements(elements)
	console.log('Extracted Dropdown Items:', dropdownItems)
	return dropdownItems
}

watch(search, val => {
	emit('typing', val)
})

watch(listItemDropdown, val => {
	if (val) {
		options.value = processDropdownGroupItems(uniqueIdDropdown.value)
		initiateSelectAll()
		initSelectedElement()
	}
})

function onCheckedAll(payload: boolean) {
	selectAll.value = !selectAll.value
	if (!payload) {
		emit('update:modelValue', [])
	} else {
		emit('update:modelValue', options.value)
	}
}

const isIndeterminate = computed(() => {
	if (multipleSelect.value && Array.isArray(props.modelValue)) {
		return (
			props.modelValue.length > 0 &&
			props.modelValue.length < options.value.length
		)
	}
	return false
})

function initiateSelectAll() {
	if (multipleSelect && Array.isArray(props.modelValue)) {
		selectAll.value = props.modelValue.length === options.value.length
	}
}

defineExpose({
	selectOption,
	onClickOption,
	isOptionSelected,
	setSelectedElement,
	selectedOption,
	openDropdown,
	multipleSelect,
	uniqueIdDropdown,
})
</script>

<template>
	<PopoverRoot v-bind="forwarded" :open="true">
		<DropdownTrigger class="w-full">
			<div :ref="contentRef[0]">
				<div v-if="slots.trigger" @click="onClickDropdown(!open)">
					<slot name="trigger" />
				</div>
				<div v-else class="text-black">
					<button
						ref="triggerButtonDropdown"
						class="inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-30"
						:class="[
							{ 'text-grey-100 bg-white hover:bg-grey-10': !props.disabled },
							{ 'bg-grey-10 cursor-not-allowed': props.disabled },
							{ '!text-grey-60': !props.modelValue },
						]"
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
					</button>
				</div>
			</div>
		</DropdownTrigger>
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
					:id="uniqueIdDropdown"
					class="overflow-y-auto px-2 pt-2"
					ref="listItemDropdown"
					:class="props.searchable ? 'max-h-52' : ''"
				>
					<slot />
				</div>
			</div>
		</DropdownContent>
	</PopoverRoot>
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
