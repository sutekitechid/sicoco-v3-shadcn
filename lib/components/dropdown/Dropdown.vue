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
	optionClass?: string
	multiple?: boolean
	appendToBody?: boolean
	mobileModal?: boolean
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

const selectedOption = computed(() => {
	if (
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
	if (props.isOptionDisabled && props.isOptionDisabled(option)) return
	handleClickDropdown(false, 'click')
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

watch(listItemDropdown, val => {
	if (val) {
		initSelectElement()
	}
})

defineExpose({
	selectOption,
	onClickOption,
	isOptionSelected,
	addSelectedElement,
	selectedOption,
	openDropdown,
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
			<div v-else>
				<button
					ref="triggerButtonDropdown"
					type="button"
					class="inline-flex items-center w-full h-[2.75rem] border-[1px] justify-between gap-x-1.5 rounded-md px-3 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-30"
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
						<span v-if="selectedElement">
							<div v-html="selectedElement" />
						</span>
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
				<div class="px-4 pt-2" v-if="props.searchable">
					<Input v-model="search">
						<template #suffix>
							<i class="si-search text-black" />
						</template>
					</Input>
				</div>
				<div
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
