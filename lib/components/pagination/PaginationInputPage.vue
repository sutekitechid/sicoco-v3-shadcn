<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { PaginationForwardInput } from '.'
import { cn } from '../../utils/tw-merge'
import { type HTMLAttributes } from 'vue'

/**
 * Props for the PaginationForward component
 * - `class`: Additional CSS classes
 * - `disabled`: Whether the component is disabled
 * - `modelValue`: Current value of the model
 * @default disabled: false
 * @default modelValue: 1
 *
 * @example
 * ```vue
 * <template>
 *  <PaginationForward v-model="page" @input="onInput" />
 * </template>
 * ```
 */
const props = defineProps<{
	class?: HTMLAttributes['class']
	disabled?: boolean
	modelValue?: number | string
	totalPages?: number
	dataCy?: string
	dataTestid?: string
}>()

/** Emits events for the PaginationForward component */
const emits = defineEmits(['input', 'update:modelValue'])

/** Computed property for modelValue that returns the current value of the model */
const computedModelValue = useVModel(props, 'modelValue', emits)
</script>

<template>
	<div :class="cn('flex gap-1', props.class)">
		<PaginationForwardInput
			v-model="computedModelValue"
			:disabled="props.disabled"
			:total-pages="props.totalPages"
			:data-cy="props.dataCy"
			:data-testid="props.dataTestid ?? props.dataCy"
			@input="emits('input', $event)"
		/>
	</div>
</template>
