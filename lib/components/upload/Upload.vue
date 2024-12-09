<template>
	<BaseInput
		:model-value="computedValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => inputFile.focus()"
		class="relative"
	>
		<template #default="{ validate, dirty, invalid }">
			<input
				ref="inputFile"
				:disabled="disabled"
				type="file"
				@change="onChange($event, validate)"
				:class="cn(uploadInputVariants({ disabled }))"
			/>
			<div
				v-if="!slots.default"
				:class="
					cn(
						{ '!border-danger-100': dirty && invalid },
						uploadVariants({ disabled })
					)
				"
			>
				<div>
					<div v-if="!modelValue" class="flex gap-4 font-semibold items-center">
						<UploadIcon :disabled="disabled" />
						<p class="text-sm">
							{{ label }}
						</p>
					</div>
					<div v-else class="flex justify-between w-full">
						<UploadFileDetail :file="modelValue" />
						<UploadDeleteButton @click="onClickDeleteFile" />
					</div>
				</div>
			</div>
			<slot :invalid="invalid" :dirty="dirty" />
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
/**
 * Component that handles the file upload input and validation
 *
 * @props modelValue - The model value of the file upload input
 * @props required - Whether the file upload input is required
 * @props customValidators - Custom validation rules for the file upload input
 * @props disabled - Whether the file upload input is disabled
 * @props label - The label of the file upload input
 * @props maxSize - The maximum size of the file upload input
 *
 * @slot errors - Slot for custom error messages
 * @slot default - Slot for custom file upload input
 *
 * @emits update:modelValue - Emits when the model value of the file upload input is updated
 *
 * @example
 * <Upload
 *  v-model="file"
 * required
 * label="Upload File"
 * :max-size="1024"
 * >
 * <template #required>
 * This field is required
 * </template>
 * <template #maxSize>
 * The file size must be less than 1MB
 * </template>
 * </Upload>
 */
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import BaseInput from '../base-input'
import { ref, computed } from 'vue'
import { requiredIf } from '@vuelidate/validators'
import isEmpty from 'lodash/isEmpty'
import {
	uploadVariants,
	UploadErrorMessage,
	UploadIcon,
	uploadInputVariants,
	checkMaxSize,
	UploadFileDetail,
	UploadDeleteButton,
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

const slots = defineSlots<{
	default?: string
}>()

const inputFile = ref(null)

const onChange = (event, validate) => {
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
		result.modelValue.maxSize = () =>
			checkMaxSize(computedValue.value, props.maxSize)
	}

	return result
})

const useValidation = computed(() => !isEmpty(rules.value))

const onClickDeleteFile = () => {
	computedValue.value = null
}
</script>
