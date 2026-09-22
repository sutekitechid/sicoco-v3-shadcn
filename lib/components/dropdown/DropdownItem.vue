<script setup lang="ts">
import {
	computed,
	Fragment,
	inject,
	onMounted,
	onUnmounted,
	provide,
	ref,
	useSlots,
	watch,
	type ComputedRef,
	type HTMLAttributes,
	type VNode,
} from 'vue'
import { Checkbox } from '../checkbox/index'
import { cn } from '../../utils/tw-merge'
import {
	type DropdownItemVariants,
	type Option,
	dropdownItemType,
	dropdownItemVariants,
} from '.'

interface NestedDropdownItem {
	getLeafOptions: () => Option[]
}

interface DropdownItemParent {
	registerChild: (item: NestedDropdownItem) => void
	unregisterChild: (item: NestedDropdownItem) => void
}

const props = defineProps<{
	value?: Option
	label?: string
	disabled?: boolean
	class?: HTMLAttributes['class']
	type?: DropdownItemVariants['type']
}>()

defineOptions({
	name: 'DropdownItem',
})

const emits = defineEmits<{
	select: [payload: Option]
}>()

const dropdownItem = ref<HTMLElement | null>(null)
const expanded = ref(false)
const children = ref<NestedDropdownItem[]>([])
const hasRegisteredNestedItem = ref(false)
let isOptionRegistered = false
const slots = useSlots()

const onSelectOption = inject('onSelectOption', (option: Option) => option)
const onSelectOptions = inject('onSelectOptions', (options: Option[]) => options)
const setSelectedElement = inject(
	'setSelectedElement',
	(element: HTMLElement | null) => element,
)
const isOptionSelected = inject(
	'isOptionSelected',
	option => {
		void option
		return false
	},
)
const isMultiple = inject('isMultipleSelect', ref(false))
const uniqueIdDropdown = inject('uniqueIdDropdown', ref(''))
const addOption = inject<(option: Option) => void>('addOption', () => {})
const removeOption = inject<(option: Option) => void>('removeOption', () => {})
const addNestedItem = inject<() => void>('addNestedItem', () => {})
const removeNestedItem = inject<() => void>('removeNestedItem', () => {})
const parentItem = inject<DropdownItemParent | null>('dropdownItemParent', null)
const parentLabelStart = inject<ComputedRef<number>>(
	'dropdownItemLabelStart',
	computed(() => 16),
)

const CHEVRON_OFFSET = 32
const CHECKBOX_OFFSET = 28

const hasChildren = computed(() => {
	return children.value.length > 0 || hasDropdownItem(slots.default?.() ?? [])
})
const headerPadding = computed(() => {
	if (!parentItem) return 16
	if (!isMultiple.value) return parentLabelStart.value
	return parentLabelStart.value - (hasChildren.value ? CHEVRON_OFFSET : 0)
})
const labelStart = computed(() => {
	return (
		headerPadding.value +
		(hasChildren.value ? CHEVRON_OFFSET : 0) +
		(isMultiple.value ? CHECKBOX_OFFSET : 0)
	)
})
const headerStyle = computed(() => {
	if (!parentItem) return undefined
	return { paddingLeft: `${headerPadding.value}px` }
})
const isMultipleSelect = computed(() => isMultiple.value)
const isDisabled = computed(() => props.disabled)
const leafOptions = computed(() => getLeafOptions())
const isSelected = computed(() => {
	if (!hasChildren.value) return isOptionSelected(props.value)
	if (leafOptions.value.length === 0) return false
	return leafOptions.value.every(option => isOptionSelected(option))
})
const hasSelectedChild = computed(() => {
	if (isMultipleSelect.value || !hasChildren.value) return false
	return leafOptions.value.some(option => isOptionSelected(option))
})
const isVisuallySelected = computed(() => {
	return isSelected.value || hasSelectedChild.value
})
const isIndeterminate = computed(() => {
	if (!hasChildren.value || !isMultipleSelect.value) return false
	const selectedCount = leafOptions.value.filter(option => isOptionSelected(option)).length
	return selectedCount > 0 && selectedCount < leafOptions.value.length
})
const dataDropdownItem = computed(() => JSON.stringify(props.value) ?? '')
const dataDropdownGroupItem = computed(() => `${uniqueIdDropdown.value}__group`)

const nestedItem: NestedDropdownItem = { getLeafOptions }

provide<DropdownItemParent>('dropdownItemParent', {
	registerChild,
	unregisterChild,
})
provide('dropdownItemLabelStart', labelStart)

if (parentItem) {
	parentItem.registerChild(nestedItem)
}

function onSelectDropdownItem() {
	if (props.disabled) return
	if (hasChildren.value && isMultipleSelect.value) {
		onSelectOptions(leafOptions.value)
		return
	}
	if (hasChildren.value) return
	onSelectOption(props.value)
	setSelectedElement(dropdownItem.value)
	emits('select', props.value)
}

function toggleChildren() {
	if (props.disabled || !hasChildren.value) return
	expanded.value = !expanded.value
}

function registerChild(item: NestedDropdownItem) {
	children.value.push(item)
}

function unregisterChild(item: NestedDropdownItem) {
	const index = children.value.indexOf(item)
	if (index === -1) return
	children.value.splice(index, 1)
}

function getLeafOptions(): Option[] {
	if (!hasChildren.value) {
		return props.value === undefined ? [] : [props.value]
	}
	return children.value.flatMap(child => child.getLeafOptions())
}

function hasDropdownItem(nodes: VNode[]): boolean {
	return nodes.some(node => {
		if (node.type === Fragment && Array.isArray(node.children)) {
			return hasDropdownItem(node.children as VNode[])
		}
		return (
			typeof node.type === 'object' &&
			(node.type as { name?: string }).name === 'DropdownItem'
		)
	})
}

function syncOptionRegistration() {
	if (hasChildren.value || props.value === undefined) {
		if (!isOptionRegistered) return
		removeOption(props.value)
		isOptionRegistered = false
		return
	}
	if (isOptionRegistered) return
	addOption(props.value)
	isOptionRegistered = true
}

function syncNestedRegistration() {
	if (hasChildren.value && !hasRegisteredNestedItem.value) {
		addNestedItem()
		hasRegisteredNestedItem.value = true
		return
	}
	if (!hasChildren.value && hasRegisteredNestedItem.value) {
		removeNestedItem()
		hasRegisteredNestedItem.value = false
	}
}

onMounted(() => {
	syncOptionRegistration()
	syncNestedRegistration()
})

watch(hasChildren, () => {
	syncOptionRegistration()
	syncNestedRegistration()
})

watch(
	() => props.value,
	(_newValue, oldValue) => {
		if (!isOptionRegistered) return
		removeOption(oldValue)
		isOptionRegistered = false
		syncOptionRegistration()
	},
)

onUnmounted(() => {
	if (isOptionRegistered) removeOption(props.value)
	if (hasRegisteredNestedItem.value) removeNestedItem()
	parentItem?.unregisterChild(nestedItem)
})
</script>

<template>
	<div
		ref="dropdownItem"
		:data-dropdown-item="dataDropdownItem"
		:data-dropdown-group-item="dataDropdownGroupItem"
		tabindex="0"
		@click.stop="onSelectDropdownItem"
	>
		<div
			:class="cn(dropdownItemVariants({ type: dropdownItemType(isMultipleSelect, isVisuallySelected, isDisabled) }), props.class)"
			:style="headerStyle"
			class="flex items-center gap-2"
		>
			<i
				v-if="hasChildren"
				:class="[
					'si-heroicon-solid-chevron-right flex h-6 w-6 shrink-0 items-center justify-center transition-transform',
					expanded && 'rotate-90',
				]"
				aria-hidden="true"
				@click.stop.prevent="toggleChildren"
			/>
			<Checkbox
				v-if="isMultipleSelect"
				:checked="isSelected"
				:indeterminate="isIndeterminate"
				:disabled="isDisabled"
				class="shrink-0"
			/>
			<div class="min-w-0 flex-1">
				<slot v-if="!hasChildren" />
				<slot v-else name="label">
					<span>{{ label ?? value }}</span>
				</slot>
			</div>
		</div>
		<div v-if="hasChildren" v-show="expanded">
			<slot />
		</div>
	</div>
</template>
