<script setup lang="ts">
/**
 * `switch` is a Vue component for a switch based on Reka-ui.
 * This component allows interaction between two customizable values,
 * and supports states like **checked**, **unchecked**, and **disabled**.
 *
 * @example
 * <switch v-model="isChecked" :disabled="false" />
 *
 * @component
 *
 * @props {string} [class] - Additional CSS classes for the root element of the switch.
 * @props {boolean | string} [modelValue=false] - The current value of the switch for two-way binding.
 * @props {boolean | string} [trueValue=true] - The value considered as "checked".
 * @props {boolean | string} [falseValue=false] - The value considered as "unchecked".
 * @props {boolean} [disabled=false] - Determines if the switch is disabled.
 *
 * @emits {function} update:modelValue(value: boolean | string) - Emitted when the model value changes.
 * @emits {function} change(value: boolean | string) - Emitted when the switch value changes.
 * @emits {function} input() - Emitted whenever there is an input change.
 */
import { computed, ref, type HTMLAttributes } from 'vue'
import uniqueId from 'lodash/uniqueId'
import isEmpty from 'lodash/isEmpty'
import { cn } from '../../utils/tw-merge'
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { type SwitchVariants, switchVariants, thumbVariant } from './index'
import SwitchLabel from './SwitchLabel.vue'
import BaseInput from '../base-input/BaseInput.vue'
import SwitchErrorMessage from './SwitchErrorMessage.vue'

const props = withDefaults(
	defineProps<{
		id?: string
		/**
		 * Additional CSS classes for the root element of the switch.
		 * @default ''
		 */
		class?: HTMLAttributes['class']

		/**
		 * The current value of the switch, used for two-way binding (v-model).
		 * @default false
		 */
		modelValue?: boolean | string

		/**
		 * The value considered as "checked" on the switch.
		 * @default true
		 */
		trueValue?: boolean | string

		/**
		 * The value considered as "unchecked" on the switch.
		 * @default false
		 */
		falseValue?: boolean | string

		/**
		 * Determines whether the switch is disabled.
		 * @default false
		 */
		disabled?: boolean

		/**
		 * The variant of the switch, which determines the color.
		 * @default 'primary'
		 */
		variant?: SwitchVariants['variant']
		required?: boolean
		customValidators?: unknown
	}>(),
	{
		class: '',
		modelValue: false,
		trueValue: true,
		falseValue: false,
		disabled: false,
		variant: 'primary',
	}
)

/**
 * Emits to handle events for the component.
 */
const emits =
	defineEmits<(e: 'update:modelValue', value: boolean | string) => void>()

/**
 * CSS class for the SwitchRoot element based on the provided props.
 */
const switchClass = computed(() =>
	cn(switchVariants({ variant: props.variant }), props.class)
)

/**
 * CSS class for the switchThumb element.
 */
const thumbClass = computed(() => 
	cn(thumbVariant({ disabled: props.disabled }))
)

/**
 * Function to handle the change in the switch state (checked/unchecked).
 * Emits the appropriate event when the switch value changes.
 */
function onChecked() {
	if (!props.disabled) {
		const value =
			props.modelValue === props.trueValue ? props.falseValue : props.trueValue
		emits('update:modelValue', value)
	}
}

const isChecked = computed(() => {
	return props.modelValue === props.trueValue
})

const computedId = computed(() => {
	return props.id ?? uniqueId('switch-')
})

const rules = computed(() => {
	const required = props.required
	const trueValue = props.trueValue
	const rules = {
		modelValue: {
			// Custom `required` validator: the built-in `required`/`requiredIf`
			// treat `false` as a present value, so they can never fail for a
			// boolean switch. We enforce that the value must equal `trueValue`.
			required: (value: boolean | string) =>
				!required || value === trueValue,
		},
	}
	if (props.customValidators) {
		Object.assign(rules.modelValue, props.customValidators)
	}
	return rules
})

const useValidation = computed(() => !isEmpty(rules.value))

const switchRoot = ref<HTMLElement | null>(null)
</script>

<template>
	<BaseInput
		:model-value="props.modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="() => switchRoot?.focus()"
	>
		
		<template #default="{ dirty, invalid }">
			<div
				ref="switchRoot"
				tabindex="-1"
				:class="[
					'flex items-center space-x-3 text-label-md',
					{ 'switch__invalid': dirty && invalid }]
				">
				<!-- SwitchRoot to render the main switch element -->
				<SwitchRoot
					:id="computedId"
					:disabled="props.disabled"
					:model-value="isChecked"
					:class="switchClass"
					@click="onChecked()"
				>
					<!-- SwitchThumb to render the thumb element of the switch -->
					<SwitchThumb :class="thumbClass" />
				</SwitchRoot>
				<SwitchLabel :for="computedId" :disabled="props.disabled">
					<slot />
				</SwitchLabel>
			</div>
		</template>
		<template #errors="{ validation }">
			<SwitchErrorMessage
				:validation="validation"
				:custom-validators="customValidators"
			>
				<template #required>
					<slot name="required" />
				</template>
				<template #errors>
					<slot name="errors" :validation="validation" />
				</template>
			</SwitchErrorMessage>
		</template>
	</BaseInput>
</template>

<style scoped>
.switch__invalid button {
	@apply border-danger-default shadow-danger;
}
</style>