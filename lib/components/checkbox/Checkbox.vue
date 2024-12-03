<script setup lang="ts">
/**
 * Checkbox component.
 */

import type { CheckboxRootEmits } from 'radix-vue'
import uniqueId from 'lodash/uniqueId'
import { useVModel } from '@vueuse/core'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import {
	checkboxVariant,
	CheckboxLabel,
	determineModelValue,
	isChecked,
	CheckboxErrorMessage,
} from '.'

import {
	CheckboxIndicator,
	CheckboxRoot,
	useForwardPropsEmits,
} from 'radix-vue'
import { requiredIf } from '@vuelidate/validators'
import BaseInput from '../base-input'

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
	modelValue?: boolean | string | number | object | Array<any> | null
	value?: boolean | string | number | object | Array<any> | null
	indeterminate?: boolean
	required?: boolean
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

const rules = computed(() => {
	return {
		modelValue: {
			required: requiredIf(() => props.required),
		},
	}
})

const useValidation = computed(() => props.required)
</script>

<template>
	<BaseInput
		:validation-rules="rules"
		:use-validation="useValidation"
		:class="cn('flex items-center space-x-2', props.class)"
		:focus-function="() => $refs.checkboxInput.$el.focus()"
	>
		<template #default="{ validate, dirty, invalid }">
			<CheckboxRoot
				ref="checkboxInput"
				v-bind="forwarded"
				:id="computedId"
				:class="
					cn('checkbox', checkboxVariant({ variant, disabled }), {
						'border-danger-100': dirty && invalid,
					})
				"
				:checked="checked"
				:value="String(props.value)"
				@update:checked="onUpdateChecked"
				@blur="validate"
			>
				<CheckboxIndicator
					class="flex h-full w-full items-center justify-center"
				>
					<i :class="[indeterminate ? 'si-minus' : 'si-check']"></i>
				</CheckboxIndicator>
			</CheckboxRoot>
			<CheckboxLabel :for="computedId">
				<slot />
			</CheckboxLabel>
		</template>
		<template #errors="{ validation }">
			<CheckboxErrorMessage :validation="validation" class="-ml-2" />
		</template>
	</BaseInput>
</template>
