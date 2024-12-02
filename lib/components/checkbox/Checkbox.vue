<script setup lang="ts">
/**
 * Checkbox component.
 */

import type { CheckboxRootEmits } from 'radix-vue'
import uniqueId from 'lodash/uniqueId'
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import {
	checkboxVariant,
	CheckboxLabel,
	determineModelValue,
	isChecked,
} from '.'

import {
	CheckboxIndicator,
	CheckboxRoot,
	useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

/**
 * Define props for the Checkbox component with default values.
 * - `class`: Additional custom CSS classes.
 * - `variant`: Defines the style variant of the checkbox.
 * - `id`: The unique identifier for the checkbox.
 * - `disabled`: Whether the checkbox is disabled.
 * - `modelValue`: The value of the checkbox.
 * - `value`: The value of the checkbox.
 * - `indeterminate`: Whether the checkbox is in an indeterminate state.
 */
const props = defineProps<{
	class?: HTMLAttributes['class']
	variant?: 'primary' | 'danger' | 'warning' | 'success'
	id?: string
	disabled?: boolean
	modelValue?: boolean | string | number | object | Array<any>
	value?: boolean | string | number | object | Array<any>
	indeterminate?: boolean
}>()
const emits = defineEmits<CheckboxRootEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const computedId = computed(() => props.id || uniqueId('checkbox-'))

const computedModelValue = useVModel(props, 'modelValue', emits)

const onUpdateChecked = (checked: boolean) => {
	computedModelValue.value = determineModelValue(
		checked,
		props.value,
		props.modelValue
	)
}

const checked = computed(() => {
	return isChecked(props.value, props.modelValue)
})
</script>

<template>
	<div :class="cn('flex items-center space-x-2', props.class)">
		<CheckboxRoot
			v-bind="forwarded"
			:id="computedId"
			:class="cn(checkboxVariant({ variant, disabled }))"
			:checked="checked"
			:value="String(props.value)"
			@update:checked="onUpdateChecked"
		>
			<CheckboxIndicator class="flex h-full w-full items-center justify-center">
				<i :class="[indeterminate ? 'si-minus' : 'si-check']"></i>
			</CheckboxIndicator>
		</CheckboxRoot>
		<CheckboxLabel :for="computedId">
			<slot />
		</CheckboxLabel>
	</div>
</template>
