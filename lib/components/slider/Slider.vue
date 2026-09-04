<script setup lang="ts">
/**
 * Slider component based on Reka UI SliderRoot.
 * Provides a draggable thumb over a track to select a value from a range.
 *
 * @prop {number | number[]} modelValue - The controlled value.
 * @prop {number} min - Minimum value (default: 0).
 * @prop {number} max - Maximum value (default: 100).
 * @prop {number} step - Step increment (default: 1).
 * @prop {boolean} disabled - Disabled state (default: false).
 *
 * @example
 * <Slider v-model="value" :min="0" :max="10" :step="0.1" />
 */
import { computed, type HTMLAttributes } from 'vue'
import { SliderRoot, SliderTrack, SliderRange, SliderThumb } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import {
	sliderVariants,
	sliderTrackVariants,
	sliderRangeVariants,
	sliderThumbVariants,
} from './index'

interface Props {
	modelValue?: number | number[]
	defaultValue?: number | number[]
	min?: number
	max?: number
	step?: number
	disabled?: boolean
	class?: HTMLAttributes['class']
	orientation?: 'horizontal' | 'vertical'
	inverted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	min: 0,
	max: 100,
	step: 1,
	disabled: false,
	orientation: 'horizontal',
	inverted: false,
})

const emits = defineEmits<{
	'update:modelValue': [value: number | number[]]
}>()

const arrayValue = computed(() => {
	if (Array.isArray(props.modelValue)) return props.modelValue
	if (props.modelValue != null) return [props.modelValue]
	return undefined
})

const arrayDefaultValue = computed(() => {
	if (Array.isArray(props.defaultValue)) return props.defaultValue
	if (props.defaultValue != null) return [props.defaultValue]
	return undefined
})

function onUpdate(value: number[] | null) {
	if (value == null) return
	emits('update:modelValue', value.length === 1 ? value[0] : value)
}
</script>

<template>
	<SliderRoot
		:model-value="arrayValue"
		:default-value="arrayDefaultValue"
		:min="min"
		:max="max"
		:step="step"
		:disabled="disabled"
		:orientation="orientation"
		:inverted="inverted"
		:class="cn(sliderVariants(), props.class)"
		@update:model-value="onUpdate"
	>
		<SliderTrack :class="sliderTrackVariants()">
			<SliderRange :class="sliderRangeVariants()" />
		</SliderTrack>
		<SliderThumb :class="sliderThumbVariants()" />
	</SliderRoot>
</template>
