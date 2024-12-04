<script setup lang="ts">
import { getCurrentInstance, ref, computed } from 'vue'
import { Checkbox } from '@/components/checkbox'

const props = defineProps({
	value: {
		type: [String, Number, Object, Array, Boolean],
		default: null,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})

const emits = defineEmits(['click'])
const instance = getCurrentInstance()

const dropdownItem = ref(null)

const findParent = parent => {
	if (!parent) return null
	if (parent.exposed?.selectOption) return parent
	return findParent(parent.parent)
}

const dropdownParent = findParent(instance.parent)

const dropdownClasses = computed(() => {
	const isSelected = dropdownParent?.exposed?.isOptionSelected(props.value)
	const isMultiple = dropdownParent?.exposed?.multipleSelect?.value
	const isDisabled = props.disabled

	return {
		'text-grey-90': !isSelected && !isDisabled,
		'bg-primary-100 text-white hover:bg-primary-100': isSelected && !isMultiple,
		'bg-white text-grey-90': isMultiple,
		'bg-grey-10 border-grey-40 cursor-not-allowed': isDisabled,
	}
})

const onClick = () => {
	if (!props.disabled && dropdownParent) {
		dropdownParent.exposed.onClickOption(props.value)
		dropdownParent.exposed.addSelectedElement(dropdownItem.value)
		emits('click')
	}
}
</script>

<template>
	<div
		:id="props.value"
		:data-id="dropdownParent?.exposed?.uniqueIdDropdown?.value + '__item'"
		:class="dropdownClasses"
		class="block font-normal py-2 hover:bg-grey-10 rounded-md cursor-pointer mb-2 text-sm"
		@click="onClick"
		ref="dropdownItem"
	>
		<div class="flex items-center">
			<Checkbox
				class="ml-2"
				v-if="dropdownParent?.exposed?.multipleSelect?.value"
				:value="!dropdownParent?.exposed?.isOptionSelected(props.value)"
			/>
			<div class="px-2">
				<slot />
			</div>
		</div>
	</div>
</template>
