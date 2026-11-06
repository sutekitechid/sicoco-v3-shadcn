<script setup lang="ts">
import { useSlots } from 'vue'
import PickerMobileContainer from '../picker-container/PickerMobileContainer.vue'

const slots = useSlots()
</script>

<template>
	<PickerMobileContainer v-bind="$attrs">
		<template #trigger><slot name="trigger" /></template>
		<template v-if="slots.header" #header><slot name="header" /></template>
		<template v-if="slots['range-display']" #range-display><slot name="range-display" /></template>
		<slot />
		<template v-if="slots.footer" #footer><slot name="footer" /></template>
	</PickerMobileContainer>
</template>
