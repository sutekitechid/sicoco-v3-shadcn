<template>
	<BaseInput
		:model-value="value"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => chekboxGroup.focus()"
	>
		<template #default="{ dirty, invalid }">
			<div
				ref="chekboxGroup"
				tabindex="-1"
				:class="{ 'checkbox-group__invalid': dirty && invalid }"
			>
				<slot />
			</div>
		</template>
		<template #errors="{ validation }">
			<CheckboxErrorMessage
				:validation="validation"
				:custom-validators="customValidators"
			>
				<template #required>
					<slot name="required" />
				</template>
				<template #errors>
					<slot name="errors" :validation="validation" />
				</template>
			</CheckboxErrorMessage>
		</template>
	</BaseInput>
</template>

<script setup lang="ts">
/**
 * Component that handles the checkbox group input and validation
 *
 * @props value - The model value of the checkbox group
 * @props required - Whether the checkbox group is required
 * @props customValidators - Custom validation rules for the checkbox group
 *
 * @slot errors - Slot for custom error messages
 * @slot default - Slot for checkbox inputs
 */
import { computed, defineProps, ref } from 'vue'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import BaseInput from '../base-input'
import { CheckboxErrorMessage } from '.'

const props = defineProps<{
	value: unknown
	required?: boolean
	customValidators?: unknown
}>()

/**
 * Define the validation rules for the checkbox group.
 */
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

const chekboxGroup = ref<HTMLElement | null>(null)
</script>

<style scoped>
:deep(.checkbox-group__invalid .checkbox) {
	@apply border-danger-100 hover:ring-danger-100/30;
}
</style>
