<template>
	<div>
		<div v-if="invalid">
			<slot />
		</div>
		<div v-else>-</div>
	</div>
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
