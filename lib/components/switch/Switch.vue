<script setup lang="ts">
/**
 * `switch` is a Vue component for a switch based on Radix Vue.
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
import { ref, computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { SwitchRoot, type SwitchRootProps, SwitchThumb } from 'radix-vue'
import { type SwitchVariants, switchVariants } from './index'

const props = withDefaults(
	defineProps<{
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
const emits = defineEmits<{
	/**
	 * Emitted when the model value changes.
	 * @param value The new value of the model.
	 */
	(e: 'update:modelValue', value: boolean | string): void
}>()

/**
 * CSS class for the SwitchRoot element based on the provided props.
 */
const switchClass = computed(() =>
	cn(switchVariants({ variant: props.variant }), props.class)
)

/**
 * CSS class for the switchThumb element.
 */
const thumbClass =
	'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5'

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
</script>

<template>
	<div class="flex items-center gap-2">
		<!-- SwitchRoot to render the main switch element -->
		<SwitchRoot
			@click="onChecked()"
			:disabled="props.disabled"
			:checked="isChecked"
			:class="switchClass"
		>
			<!-- SwitchThumb to render the thumb element of the switch -->
			<SwitchThumb :class="thumbClass" />
		</SwitchRoot>
		<slot />
	</div>
</template>
