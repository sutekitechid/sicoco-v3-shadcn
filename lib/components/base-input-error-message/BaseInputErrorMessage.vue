<template>
	<div v-if="slots.default">
		<slot />
	</div>
	<div v-else>-</div>
</template>

<script setup lang="ts">
/**
 * Component that used as the base for input error message
 */
defineProps<{
	invalid: boolean
}>()

const slots = defineSlots()
</script>
