<template>
	<div
		:id="props.value"
		:class="dropdownClasses"
		class="block font-normal px-4 py-2 hover:bg-grey-10 rounded-md cursor-pointer mb-2 text-sm"
		@click="onClick"
		ref="dropdownItem"
	>
		<slot />
	</div>
</template>

<script setup>
import { getCurrentInstance, ref, computed } from 'vue'

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
	return {
		'text-grey-90': !dropdownParent?.exposed?.isOptionSelected(props.value),
		'bg-primary-100 text-white hover:bg-primary-100':
			dropdownParent?.exposed?.isOptionSelected(props.value),
		'bg-grey-10 border-grey-40 cursor-not-allowed': props.disabled,
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
