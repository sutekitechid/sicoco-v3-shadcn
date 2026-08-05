<template>
	<BaseInput
		:model-value="model"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="focus"
	>
		<template #default="{ validate }">
			<PinInputRoot
				:id="pinId"
				v-model="model"
				:placeholder="placeholder"
				:type="type"
				class="gap-3"
				otp
				@complete="handleComplete"
			>
				<PinInputInput
					v-for="(pin, index) in totalPins"
					:key="index"
					ref="inputRefs"
					v-model="model[index]"
					:index="index"
					:disabled="disabled"
					:class="cn(pinInputVariants({ disabled: props.disabled }))"
					@input="validate"
				/>
			</PinInputRoot>
		</template>
		<template #errors="{ validation }">
			<PinInputErrorMessage :validation="validation">
				<template #required>
					<span class="whitespace-nowrap">
						<slot name="required" />
					</span>
				</template>
				<template #errors>
					<span class="whitespace-nowrap">
						<slot name="errors" :validation="validation" />
					</span>
				</template>
			</PinInputErrorMessage>
		</template>
	</BaseInput>
</template>

<script lang="ts">
import { computed, ref, type ComponentPublicInstance, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import { PinInputInput } from 'reka-ui'
import { pinInputVariants } from '.'
import PinInputRoot from './PinInputRoot.vue'
import uniqueId from 'lodash/uniqueId'
import BaseInput from '../base-input/BaseInput.vue'
import isEmpty from 'lodash/isEmpty'
import PinInputErrorMessage from './PinInputErrorMessage.vue'

export default {
	components: {
		PinInputRoot,
		PinInputInput,
		BaseInput,
		PinInputErrorMessage,
	},
	props: {
		modelValue: {
			type: Array as () => string[],
			default: () => [],
		},
		placeholder: {
			type: String,
		},
		handleComplete: {
			type: Function as PropType<(e: string[]) => void>,
			default: () => {},
		},
		totalPins: {
			type: Number,
			default: 5,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String as () => 'number' | 'text',
			default: 'text',
		},
		customValidators: {
			type: Object as PropType<Record<string, unknown>>,
			default: () => ({}),
		},
	},
	setup(props, { emit }) {
		const model = useVModel(props, 'modelValue', emit)
		const pinId = computed(() => uniqueId('pin-input-'))

		const rules = computed(() => {
			const validationRules: Record<string, unknown> = {
				...props.customValidators,
			}

			if (props.required) {
				validationRules.required = (value: unknown) => {
					if (!Array.isArray(value) || value.length !== props.totalPins) {
						return false
					}

					return Array.from(
						{ length: props.totalPins },
						(_, index) => value[index]
					).every(pin => pin !== '' && pin !== undefined && pin !== null)
				}
			}

			return { modelValue: validationRules }
		})

		const useValidation = computed(() => !isEmpty(rules.value.modelValue))
		const inputRefs = ref<(ComponentPublicInstance | null)[]>([])

		function focus() {
			const firstEmptyIndex = Array.from(
				{ length: props.totalPins },
				(_, index) => model.value[index]
			).findIndex(pin => pin === '' || pin === undefined || pin === null)
			const input = inputRefs.value[firstEmptyIndex === -1 ? 0 : firstEmptyIndex]?.$el

			if (input instanceof HTMLInputElement) {
				input.focus()
			}
		}

		return {
			props,
			cn,
			model,
			pinId,
			focus,
			rules,
			useValidation,
			pinInputVariants,
			inputRefs,
		}
	},
}
</script>

<style scoped>
.input__has-error .pin__input {
	@apply border-danger-500 shadow-danger;
}
</style>
