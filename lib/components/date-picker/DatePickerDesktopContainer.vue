<script setup lang="ts">
import { ref, useSlots } from 'vue'
import PickerDesktopContainer from '../picker-container/PickerDesktopContainer.vue'

const container = ref<InstanceType<typeof PickerDesktopContainer> | null>(null)
const slots = useSlots()

function closeDropdown() {
	container.value?.closeDropdown()
}

defineExpose({ closeDropdown })
</script>

<template>
	<PickerDesktopContainer ref="container" v-bind="$attrs">
		<template #trigger><slot name="trigger" /></template>
		<slot />
		<template v-if="slots.footer" #footer><slot name="footer" /></template>
	</PickerDesktopContainer>
</template>
