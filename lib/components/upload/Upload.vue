<template>
	<BaseInput
		:model-value="computedValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => inputFile.focus()"
		class="relative"
	>
		<template #default="{ validate, dirty, invalid }">
			<div
				:class="
					cn(
						{ '!border-danger-100': dirty && invalid },
						uploadVariants({ disabled })
					)
				"
			>
				<div class="flex gap-4 font-semibold items-center">
					<UploadIcon :disabled="disabled" />
					<p class="text-sm">
						{{ label }}
					</p>
				</div>
				<input
					ref="inputFile"
					:disabled="disabled"
					type="file"
					@change="onChange($event, validate)"
					:class="cn(uploadInputVariants({ disabled }))"
				/>
			</div>
		</template>

		<template #errors="{ validation }">
			<UploadErrorMessage :validation="validation">
				<template #required>
					<slot name="required" />
				</template>
				<template #maxSize>
					<slot name="maxSize" />
				</template>
				<template #errors>
					<slot name="errors" :validation="validation" />
				</template>
			</UploadErrorMessage>
		</template>
	</BaseInput>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import BaseInput from '../base-input'
import { ref, computed } from 'vue'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import {
	uploadVariants,
	type UploadVariants,
	UploadErrorMessage,
	UploadIcon,
	uploadInputVariants,
	checkMaxSize,
} from '.'

const props = defineProps<{
	modelValue?: File
	required?: boolean
	customValidators?: Record<string, any>
	disabled?: boolean
	label: string
	maxSize?: number
}>()

const emits = defineEmits(['update:modelValue'])
const computedValue = useVModel(props, 'modelValue', emits)

const inputFile = ref(null)

const onChange = (event, validate) => {
	console.log('onChange', event, validate)
	validate()
	const file = event.target.files[0]
	computedValue.value = file
}

const rules = computed(() => {
	const result: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			...props.customValidators,
		},
	}

	if (props.maxSize) {
		console.log(
			'checkMaxSize',
			checkMaxSize(computedValue.value, props.maxSize)
		)
		result.modelValue.maxSize = () =>
			checkMaxSize(computedValue.value, props.maxSize)
	}

	console.log('rules', result)

	return result
})

const useValidation = computed(() => !isEmpty(rules.value))
</script>
