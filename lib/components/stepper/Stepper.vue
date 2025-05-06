<template>
	<StepperRoot
		v-model="computedModelValue"
		:default-value="defaultValue"
		:linear="linear"
		:orientation="orientation"
		:class="cn(stepperVariants({ orientation }), props.class)"
	>
		<template
			v-slot="{
				modelValue,
				totalSteps,
				isNextDisabled,
				isPrevDisabled,
				isFirstStep,
				isLastStep,
				goToStep,
				nextStep,
				prevStep,
			}"
		>
			<slot
				:model-value="modelValue"
				:total-steps="totalSteps"
				:is-next-disabled="isNextDisabled"
				:is-prev-disabled="isPrevDisabled"
				:is-first-step="isFirstStep"
				:is-last-step="isLastStep"
				:go-to-step="goToStep"
				:next-step="nextStep"
				:prev-step="prevStep"
			/>
		</template>
	</StepperRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { StepperRoot } from 'radix-vue'

import { cn } from '../../utils/tw-merge'

import { type StepperVariants, stepperVariants } from './index'

interface Props {
	class?: string
	modelValue?: number
	defaultValue?: number
	linear?: boolean
	orientation?: StepperVariants['orientation']
	fullWidth?: boolean
}

const DEFAULT_STEP_NUMBER = 1

const props = withDefaults(defineProps<Props>(), {
	modelValue: null,
	defaultValue: DEFAULT_STEP_NUMBER,
	linear: true,
	orientation: 'horizontal',
	fullWidth: true,
})

const emits = defineEmits(['update:modelValue'])

/**
 *  store the new value
 */
const newModelValue = ref<number>(
	props.modelValue || props.defaultValue || DEFAULT_STEP_NUMBER
)

const computedModelValue = computed({
	get: () => {
		return props.modelValue || newModelValue.value
	},
	set: value => {
		newModelValue.value = value
		emits('update:modelValue', value)
	},
})
</script>
