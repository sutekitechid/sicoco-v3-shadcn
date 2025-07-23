<template>
	<PinInputRoot
		:id="pinId"
		v-model="model"
		:placeholder="placeholder"
		:type="type"
		@complete="handleComplete"
	>
		<BaseInput
			v-for="(pin, index) in totalPins"
			:key="index"
			:model-value="model[index]"
			:validation-rules="rules"
			:use-validation="useValidation"
			:focus-function="() => focus(index)"
		>
			<template #default="{ validate }">
				<PinInputInput
					ref="inputRefs"
					v-model="model[index]"
					:index="index"
					:disabled="disabled"
					:class="cn(pinInputVariants({ disabled: props.disabled }))"
					@input="validate"
					@focus="handleFocus(index)"
					@blur="handleBlur"
				/>
			</template>
			<template #errors="{ validation }">
				<PinInputErrorMessage :validation="validation">
					<template v-if="focusedIndex === index" #required>
						<span class="whitespace-nowrap">
							<slot name="required" />
						</span>
					</template>
					<template v-if="focusedIndex === index" #errors>
						<span class="whitespace-nowrap">
							<slot name="errors" :validation="validation" />
						</span>
					</template>
				</PinInputErrorMessage>
			</template>
		</BaseInput>
	</PinInputRoot>
</template>

<script lang="ts">
import { computed, ref, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/tw-merge'
import { requiredIf } from '@vuelidate/validators'
import { PinInputInput } from 'radix-vue'
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

		const { required, customValidators } = props

		const rules = computed(() => {
			const rules: Record<string, unknown> = {
				modelValue: {
					required: requiredIf(() => required),
					...customValidators,
				},
			}
			return rules
		})

		const useValidation = computed(() => {
			const { value } = rules
			return !isEmpty(value.modelValue)
		})

		const inputRefs = ref<(HTMLInputElement | null)[]>([])
		const focusedIndex = ref<number | null>(null)

		function focus(index: number) {
			inputRefs.value[index]?.focus()
		}

		function handleFocus(index: number) {
			focusedIndex.value = index
		}

		function handleBlur() {
			focusedIndex.value = null
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
			focusedIndex,
			handleFocus,
			handleBlur,
		}
	},
}
</script>

<style scoped>
.input__has-error .pin__input {
	@apply border-danger-100/60 focus-visible:ring-danger-50/40 focus-visible:border-danger-100/60;
}
</style>
