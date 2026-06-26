<template>
	<StepperSeparator :class="cn(baseClass, props.class)">
		<slot />
	</StepperSeparator>
</template>

<script setup lang="ts">
import { StepperSeparator } from 'reka-ui'

import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: string
}>()

const baseClass =
	'relative w-full h-0.5 rounded-full group-data-[disabled]:bg-neutral-100 group-data-[state=completed]:bg-primary-500 bg-neutral-300'
</script>
