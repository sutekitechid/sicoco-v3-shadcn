<template>
	<div>
		<Label
			:for="pinId"
			:class="
				cn(
					'text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
				)
			"
		>
			<template v-if="slots.label">
				<slot name="label" />
			</template>
			<template v-else>
				{{ label }}
			</template>
		</Label>
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
				:focus-function="focus"
			>
				<PinInputInput
					ref="inputRefs"
					v-model="model[index]"
					:index="index"
					:disabled="disabled"
					class="pin__input"
				/>
			</BaseInput>
		</PinInputRoot>
	</div>
</template>

<script lang="ts">
import { computed, useSlots, ref, PropType } from 'vue'
import { useVModel } from '@vueuse/core'
import PinInputRoot from './PinInputRoot.vue'
import PinInputInput from './PinInputInput.vue'
import uniqueId from 'lodash/uniqueId'
import { Label } from 'radix-vue'
import { cn } from '../../utils/tw-merge'
import { requiredIf } from '@vuelidate/validators'
import BaseInput from '../base-input/BaseInput.vue'
import isEmpty from 'lodash/isEmpty'

export default {
	components: {
		PinInputRoot,
		PinInputInput,
		Label,
		BaseInput,
	},
	props: {
		label: {
			type: String,
			default: '',
		},
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
	},
	setup(props, { emit }) {
		const model = useVModel(props, 'modelValue', emit)
		const slots = useSlots()
		const pinId = computed(() => uniqueId('pin-input-'))

		const { required } = props

		const rules = computed(() => {
			const rules: Record<string, unknown> = {
				modelValue: {
					required: requiredIf(() => required),
				},
			}

			return rules
		})

		const useValidation = computed(() => {
			const { value } = rules
			return !isEmpty(value.modelValue)
		})

		const inputRefs = ref<(HTMLInputElement | null)[]>([])

		function focus(index: number) {
			inputRefs.value[index]?.focus()
		}

		return {
			props,
			cn,
			model,
			pinId,
			slots,
			focus,
			rules,
			useValidation,
		}
	},
}
</script>

<style scoped>
.input__has-error .pin__input {
	@apply border-danger-100/60 focus-visible:ring-danger-50/40 focus-visible:border-danger-100/60;
}
</style>
