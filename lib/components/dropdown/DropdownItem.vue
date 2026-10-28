<script setup lang="ts">
import {
	computed,
	inject,
	onMounted,
	onUnmounted,
	provide,
	ref,
	watch,
	type ComputedRef,
	type HTMLAttributes,
} from 'vue'
import { Checkbox } from '../checkbox/index'
import { cn } from '../../utils/tw-merge'
import {
	type DropdownItemVariants,
	type Option,
	dropdownItemChevronVariants,
	dropdownItemType,
	dropdownItemVariants,
} from '.'

interface NestedDropdownItem {
	getLeafOptions: () => Option[]
	getSelectableOptions: () => Option[]
}

interface DropdownItemParent {
	registerChild: (item: NestedDropdownItem) => void
	unregisterChild: (item: NestedDropdownItem) => void
	isChecked: ComputedRef<boolean>
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
const optionRegistrationId = Symbol('dropdown-item')

const onSelectOption = inject('onSelectOption', (option: Option) => option)
const onSelectOptions = inject('onSelectOptions', (options: Option[]) => options)
const onSelectNestedParent = inject(
	'onSelectNestedParent',
	(parent: Option, descendants: Option[]) => [parent, descendants],
)
const setSelectedElement = inject(
	'setSelectedElement',
	(element: HTMLElement | null) => element,
)
const isOptionSelected = inject(
	'isOptionSelected',
	(option: Option) => {
		void option
		return false
	},
)
const isMultiple = inject('isMultipleSelect', ref(false))
const nestedParentSelection = inject('nestedParentSelection', ref(false))
const uniqueIdDropdown = inject('uniqueIdDropdown', ref(''))
const addOption = inject<
	(
		id: symbol,
		option: Option,
		label?: string,
		isNestedTopLevel?: boolean,
	) => void
>(
	'addOption',
	() => {},
)
const removeOption = inject<(id: symbol) => void>('removeOption', () => {})
const addNestedItem = inject<() => void>('addNestedItem', () => {})
const removeNestedItem = inject<() => void>('removeNestedItem', () => {})
const hasNestedItems = inject<ComputedRef<boolean>>(
	'hasNestedItems',
	computed(() => false),
)
const parentItem = inject<DropdownItemParent | null>('dropdownItemParent', null)
const parentLabelStart = inject<ComputedRef<number>>(
	'dropdownItemLabelStart',
	computed(() => 16),
)
const dropdownSearch = inject('dropdownSearch', ref(''))

const CHEVRON_OFFSET = 32
const CHECKBOX_OFFSET = 28

const hasChildren = computed(() => {
	return children.value.length > 0
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
const isNestedTopLevel = computed(() => {
	return nestedParentSelection.value && isMultipleSelect.value && !parentItem
})
const usesNestedParentSelection = computed(() => {
	return (
		nestedParentSelection.value &&
		isMultipleSelect.value &&
		hasChildren.value &&
		props.value !== undefined
	)
})
const isSelectedByParent = computed(() => {
	return Boolean(nestedParentSelection.value && parentItem?.isChecked.value)
})
const isDisabled = computed(() => props.disabled || isSelectedByParent.value)
const leafOptions = computed(() => getLeafOptions())
const descendantOptions = computed(() => getDescendantOptions())
const isSelected = computed(() => {
	if (!hasChildren.value) return isOptionSelected(props.value)
	if (usesNestedParentSelection.value) return isOptionSelected(props.value)
	if (leafOptions.value.length === 0) return false
	return leafOptions.value.every(option => isOptionSelected(option))
})
const hasSelectedChild = computed(() => {
	if (isMultipleSelect.value || !hasChildren.value) return false
	return leafOptions.value.some(option => isOptionSelected(option))
})
const hasSelectedDescendant = computed(() => {
	if (!hasChildren.value) return false
	return descendantOptions.value.some(option => isOptionSelected(option))
})
const isVisuallySelected = computed(() => {
	return isSelected.value || hasSelectedChild.value || isSelectedByParent.value
})
const isIndeterminate = computed(() => {
	if (usesNestedParentSelection.value) return false
	if (!hasChildren.value || !isMultipleSelect.value) return false
	const selectedCount = leafOptions.value.filter(option => isOptionSelected(option)).length
	return selectedCount > 0 && selectedCount < leafOptions.value.length
})
const dataDropdownItem = computed(() => JSON.stringify(props.value) ?? '')
const dataDropdownGroupItem = computed(() => `${uniqueIdDropdown.value}__group`)

const nestedItem: NestedDropdownItem = { getLeafOptions, getSelectableOptions }

provide<DropdownItemParent>('dropdownItemParent', {
	registerChild,
	unregisterChild,
	isChecked: isVisuallySelected,
})
provide('dropdownItemLabelStart', labelStart)

if (parentItem) {
	parentItem.registerChild(nestedItem)
}

function onSelectDropdownItem() {
	if (isDisabled.value) return
	if (usesNestedParentSelection.value) {
		onSelectNestedParent(props.value, descendantOptions.value)
		return
	}
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

function getDescendantOptions(): Option[] {
	return children.value.flatMap(child => child.getSelectableOptions())
}

function getSelectableOptions(): Option[] {
	const ownOption = props.value === undefined ? [] : [props.value]
	if (!hasChildren.value) return ownOption
	const childOptions = getDescendantOptions()
	if (!usesNestedParentSelection.value) return childOptions
	return [...ownOption, ...childOptions]
}

function getOptionText(): string {
	return props.label ?? dropdownItem.value?.textContent?.trim() ?? String(props.value)
}

function syncOptionRegistration() {
	const shouldRegisterOption =
		props.value !== undefined &&
		(!hasChildren.value || usesNestedParentSelection.value)
	if (!shouldRegisterOption) {
		if (!isOptionRegistered) return
		removeOption(optionRegistrationId)
		isOptionRegistered = false
		return
	}
	if (isOptionRegistered) return
	addOption(
		optionRegistrationId,
		props.value,
		getOptionText(),
		isNestedTopLevel.value,
	)
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

watch([hasChildren, usesNestedParentSelection, isNestedTopLevel], () => {
	syncOptionRegistration()
	syncNestedRegistration()
})

watch(
	dropdownSearch,
	query => {
		if (!hasChildren.value || !query?.trim()) return
		expanded.value = true
	},
	{ immediate: true },
)

watch(
	hasSelectedDescendant,
	hasSelected => {
		if (!hasSelected) return
		expanded.value = true
	},
	{ immediate: true },
)

watch(
	() => props.value,
	(_newValue, oldValue) => {
		if (!isOptionRegistered) return
		void oldValue
		removeOption(optionRegistrationId)
		isOptionRegistered = false
		syncOptionRegistration()
	},
)

onUnmounted(() => {
	if (isOptionRegistered) removeOption(optionRegistrationId)
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
				:class="dropdownItemChevronVariants({ expanded })"
				aria-hidden="true"
				@click.stop.prevent="toggleChildren"
			/>
			<div
				v-else-if="hasNestedItems && (!isMultipleSelect || !parentItem)"
				class="w-6"
			></div>
			<Checkbox
				v-if="isMultipleSelect"
				:checked="isVisuallySelected"
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
