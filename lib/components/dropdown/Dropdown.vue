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
import { onClickOutside } from '@vueuse/core'
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
	options?: Option[]
	placeholder?: string
	optionLabel?: string
	disabled?: boolean
	required?: boolean
	customValidators?: Record<string, unknown>
	searchable?: boolean
	backendSearch?: boolean
	loading?: boolean
	multiple?: boolean
	isOptionDisabled?: (option: Option) => boolean
}

const props = defineProps<Props>()
const emit = defineEmits([
	'update:modelValue',
	'on-search',
	'select',
	'active-change',
	'focus',
])

const forwarded = useForwardPropsEmits(props, emit)
const slots = useSlots()

const search = ref('')
const open = ref(false)
const contentRef = ref(null)
const triggerButtonDropdown = ref(null)
const buttonSize = ref('')
const listItemDropdown = ref(null)
const selectedElement = ref<string | null>(null)
const selectAll = ref(false)
const uniqueIdDropdown = ref(`dropdown__${uniqueId()}`)
const options = ref([])

const selectedOption = computed(() => {
	if (multipleSelect.value && props.modelValue.length > 0) {
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
	console.log('value', value)
	if (props.multiple) {
		emit('update:modelValue', upsertArray(props.modelValue, value))
	} else {
		emit('update:modelValue', value)
	}
	emit('select', value)
}

function onClickOption(option: Option) {
	if (props.isOptionDisabled && props.isOptionDisabled(option)) return
	if (!multipleSelect.value) {
		handleClickDropdown(false, 'click')
	}
	search.value = ''
	selectOption(option)
}

function updateButtonSize() {
	if (triggerButtonDropdown.value) {
		buttonSize.value = `${
			triggerButtonDropdown.value.getBoundingClientRect().width
		}px`
	}
}

function isOptionSelected(option: Option) {
	if (props.multiple) {
		return props.modelValue.some(
			item => JSON.stringify(item) === JSON.stringify(option)
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

function handleClickDropdown(payload: boolean, from: string) {
	open.value = payload
}

onClickOutside(contentRef, () => handleClickDropdown(false, 'outside'))

function addSelectedElement(payload: { innerHTML: string }) {
	selectedElement.value = h('div', payload.innerHTML).children as string | null
}

function initSelectElement() {
	const element = document.getElementById(props.modelValue as string)
	if (element) {
		selectedElement.value = element.innerHTML
	}
}

function openDropdown() {
	handleClickDropdown(true, 'openDropdown')
}

const multipleSelect = computed(() => {
	return props.multiple
})

// Fungsi untuk mendapatkan elemen berdasarkan data-id
function getElementsByDataId(uniqueId, suffix = '__item') {
	const dataId = `${uniqueId}${suffix}`
	return document.querySelectorAll(`[data-id="${dataId}"]`)
}

// Fungsi untuk mendapatkan array ID dari elemen
function extractIdsFromElements(elements) {
	return Array.from(elements).map(element => element.id)
}

// Fungsi utama yang mengolah elemen dropdown
function processDropdownElements(uniqueId) {
	const elements = getElementsByDataId(uniqueId)
	return extractIdsFromElements(elements)
}

// Watcher utama
watch(listItemDropdown, val => {
	if (val) {
		options.value = processDropdownElements(uniqueIdDropdown.value)
		initSelectElement()
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

defineExpose({
	selectOption,
	onClickOption,
	isOptionSelected,
	addSelectedElement,
	selectedOption,
	openDropdown,
	multipleSelect,
	uniqueIdDropdown,
})
</script>

<template>
	<PopoverRoot v-bind="forwarded" :open="true">
		<DropdownTrigger class="w-full">
			<div
				v-if="slots.trigger"
				@click="handleClickDropdown(true, 'triggerslot')"
			>
				<slot name="trigger" />
			</div>
			<div v-else class="text-black">
				<button
					ref="triggerButtonDropdown"
					type="button"
					class="inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-30"
					:class="[
						{ 'text-grey-100 bg-white hover:bg-grey-10': !props.disabled },
						{ 'bg-grey-10 cursor-not-allowed': props.disabled },
						{ '!text-grey-60': !props.modelValue },
					]"
					aria-expanded="true"
					aria-haspopup="true"
					@click="handleClickDropdown(true, 'button trigger')"
				>
					<div class="flex items-center gap-2">
						<div v-if="props.multiple">{{ selectedOption }}</div>
						<div v-else-if="selectedElement" v-html="selectedElement" />
						<p v-else-if="props.modelValue === undefined">
							{{ selectedOption }}
						</p>
					</div>
					<div class="w-6 h-6 flex items-center justify-center">
						<i class="si-chevron-down text-black" />
					</div>
				</button>
			</div>
		</DropdownTrigger>
		<DropdownContent :class="open ? '' : 'hidden'">
			<div :style="`width: ${buttonSize}`" ref="contentRef">
				<div
					class="px-4 pt-2 flex items-center gap-2 w-full text-black"
					v-if="props.searchable"
				>
					<Checkbox
						@update:checked="onCheckedAll"
						:value="selectAll"
						v-if="multipleSelect"
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
