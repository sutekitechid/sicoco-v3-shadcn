<template>
	<StepperSeparator :class="cn(baseClass, props.class)">
		<slot />
	</StepperSeparator>
</template>

<script setup lang="ts">
import { StepperSeparator } from 'radix-vue'

import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: string
}>()

const baseClass =
	'relative w-full h-0.5 rounded-full group-data-[disabled]:bg-gray-300 group-data-[state=completed]:bg-primary-100 bg-[#d7d9df]'
</script>
