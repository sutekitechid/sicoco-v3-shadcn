<script setup lang="ts">
/**
 * Component that wraps the radio group to handle the model value
 * and update the model value when a radio item is selected
 *
 * @props class - The class to apply to
 * @props modelValue - The model value of the radio group
 *
 * @emits update:modelValue - Event emitted when the model value is updated
 *
 */
import { cn } from '../../utils/tw-merge'
import { RadioGroupRoot, useForwardPropsEmits } from 'reka-ui'
import { computed, ref, type HTMLAttributes } from 'vue'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import { RadioGroupErrorMessage } from '.'
import BaseInput from '../base-input'

import {
	jsonToValidSelector,
	validSelectorToJson,
	type JsonObjectType,
} from '../../utils/string'

const props = defineProps<{
	class?: HTMLAttributes['class']
	modelValue?: JsonObjectType
	required?: boolean
	customValidators?: unknown
}>()
const emits = defineEmits(['update:modelValue'])

const delegatedProps = computed(() => {
	const { modelValue, ...delegated } = props

	const result = {
		...delegated,
		modelValue: '',
	}

	result.modelValue = jsonToValidSelector(modelValue)

	return result
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

/**
 * Update the model value when a radio item is selected
 *
 * @param value - The value of the selected radio item
 */
const onUpdateModelValue = (value: string) => {
	const parsedValue = validSelectorToJson(value)
	emits('update:modelValue', parsedValue)
}

const rules = computed(() => {
	const rules = {
		modelValue: {
			required: requiredIf(() => props.required),
		},
	}
	if (props.customValidators) {
		Object.assign(rules.modelValue, props.customValidators)
	}
	return rules
})

const useValidation = computed(() => !isEmpty(rules.value))

const radioGroup = ref<HTMLElement | null>(null)
</script>

<template>
	<BaseInput
		:model-value="props.modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => radioGroup.focus()"
	>
		<template #default="{ dirty, invalid }">
			<div
				ref="radioGroup"
				tabindex="-1"
				:class="{ 'radio-group__invalid': dirty && invalid }"
			>
				<RadioGroupRoot
					:class="cn('grid gap-2', props.class)"
					v-bind="forwarded"
					@update:model-value="onUpdateModelValue"
				>
					<slot />
				</RadioGroupRoot>
			</div>
		</template>
		<template #errors="{ validation }">
			<RadioGroupErrorMessage
				:validation="validation"
				:custom-validators="customValidators"
			>
				<template #required>
					<slot name="required" />
				</template>
				<template #errors>
					<slot name="errors" :validation="validation" />
				</template>
			</RadioGroupErrorMessage>
		</template>
	</BaseInput>
</template>
