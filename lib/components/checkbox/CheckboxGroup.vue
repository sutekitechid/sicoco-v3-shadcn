<template>
	<BaseInput
		:model-value="value"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => $refs.chekboxGroup.focus()"
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
				<template #errors>
					<slot name="errors" :validation="validation" />
				</template>
			</CheckboxErrorMessage>
		</template>
	</BaseInput>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import BaseInput from '../base-input'
import { CheckboxErrorMessage } from '.'

const props = defineProps<{
	value: any
	required?: boolean
	customValidators?: any
}>()

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
</script>

<style scoped>
:deep(.checkbox-group__invalid .checkbox) {
	@apply border-danger-100;
}
</style>
