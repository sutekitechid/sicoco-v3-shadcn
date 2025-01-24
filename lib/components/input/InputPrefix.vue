<template>
	<InputMorpUnit
		class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
		@width-change="emits('width-change', $event)"
	>
		<slot />
	</InputMorpUnit>
</template>

<script setup lang="ts">
/**
 * Component that handles the input prefix
 */
import { InputMorpUnit } from '.'

const emits = defineEmits(['width-change'])
</script>
