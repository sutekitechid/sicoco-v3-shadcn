<template>
	<div :style="stepperItemStyle">
		<StepperItem
			:step="step"
			:disabled="disabled"
			:completed="completed"
			:class="cn(baseClass, props.class)"
			><template v-slot="{ state }">
				<div class="flex gap-2">
					<slot name="trigger" :state="state" />
					<slot name="label" :state="state" />
				</div>
				<StepperSeparator v-if="step !== stepsCount" class="top-5" />
			</template>
		</StepperItem>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { StepperItem } from 'radix-vue'
import { StepperSeparator } from '.'

import { cn } from '../../utils/tw-merge'

const props = defineProps({
	class: {
		type: String,
		default: '',
	},
	step: {
		type: Number,
		required: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	completed: {
		type: Boolean,
		default: false,
	},
	stepsCount: {
		type: Number,
		required: true,
	},
})

const stepperItemStyle = computed(() => {
	const width = 100 / (props.stepsCount > 0 ? props.stepsCount : 1)
	return {
		width: `${width}%`,
	}
})

const baseClass =
	'flex gap-4 px-2 cursor-pointer group data-[disabled]:cursor-not-allowed'
</script>
