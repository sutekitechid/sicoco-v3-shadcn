<template>
	<StepperDescription
		:completed="completed"
		:disabled="disabled"
		:step="step"
		:class="cn(baseClass, props.class)"
	>
		<slot />
	</StepperDescription>
</template>

<script setup lang="ts">
import { StepperDescription } from 'reka-ui'

import { cn } from '../../utils/tw-merge'

const props = defineProps({
	class: {
		type: String,
		default: '',
	},
	completed: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	step: {
		type: Number,
		default: 1,
	},
})

const baseClass = 'font-semibold text-sm text-neutral-100'
</script>
