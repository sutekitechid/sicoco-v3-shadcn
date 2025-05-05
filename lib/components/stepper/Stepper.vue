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
				:modelValue="modelValue"
				:totalSteps="totalSteps"
				:isNextDisabled="isNextDisabled"
				:isPrevDisabled="isPrevDisabled"
				:isFirstStep="isFirstStep"
				:isLastStep="isLastStep"
				:goToStep="goToStep"
				:nextStep="nextStep"
				:prevStep="prevStep"
			/>
		</template>
	</StepperRoot>
</template>

<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep'
import { ref, computed, watch } from 'vue'
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

const props = withDefaults(defineProps<Props>(), {
	modelValue: 1,
	defaultValue: 1,
	linear: true,
	orientation: 'horizontal',
	fullWidth: true,
})

const emits = defineEmits({
	'update:modelValue': (value: number) => {
		return typeof value === 'number'
	},
})

/**
 *  store the new value
 */
const newModelValue = ref<number>(cloneDeep(props.modelValue))

const computedModelValue = computed({
	get: () => {
		return newModelValue.value ?? props.modelValue
	},
	set: value => {
		newModelValue.value = value
		emits('update:modelValue', value)
	},
})

watch(
	() => props.modelValue,
	newValue => {
		if (newValue !== newModelValue.value) {
			newModelValue.value = newValue
		}
	},
	{
		immediate: true,
	}
)
</script>
