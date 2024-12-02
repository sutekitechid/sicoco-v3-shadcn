<script setup lang="ts">
/**
 * `Toggle` is a Vue component for a toggle based on Radix Vue.
 * This component allows interaction between two customizable values,
 * and supports states like **checked**, **unchecked**, and **disabled**.
 *
 * @example
 * <Toggle v-model="isChecked" :disabled="false" />
 *
 * @component
 *
 * @props {string} [class] - Additional CSS classes for the root element of the toggle.
 * @props {boolean | string} [modelValue=false] - The current value of the toggle for two-way binding.
 * @props {boolean | string} [trueValue=true] - The value considered as "checked".
 * @props {boolean | string} [falseValue=false] - The value considered as "unchecked".
 * @props {boolean} [disabled=false] - Determines if the toggle is disabled.
 *
 * @emits {function} update:modelValue(value: boolean | string) - Emitted when the model value changes.
 * @emits {function} change(value: boolean | string) - Emitted when the toggle value changes.
 * @emits {function} input() - Emitted whenever there is an input change.
 */
import { ref, computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { SwitchRoot, type SwitchRootProps, SwitchThumb } from 'radix-vue'
import { type ToggleVariants, toggleVariants } from './index'

/**
 * Interface to define the properties that the Toggle component accepts.
 */
interface Props extends SwitchRootProps {
	/**
	 * Additional CSS classes for the root element of the toggle.
	 * @default ''
	 */
	class?: HTMLAttributes['class']

	/**
	 * The current value of the toggle, used for two-way binding (v-model).
	 * @default false
	 */
	modelValue?: boolean | string

	/**
	 * The value considered as "checked" on the toggle.
	 * @default true
	 */
	trueValue?: boolean | string

	/**
	 * The value considered as "unchecked" on the toggle.
	 * @default false
	 */
	falseValue?: boolean | string

	/**
	 * Determines whether the toggle is disabled.
	 * @default false
	 */
	disabled?: boolean
}

/**
 * Define the component's props with default values.
 */
const props = withDefaults(defineProps<Props>(), {
	class: '',
	modelValue: false,
	trueValue: true,
	falseValue: false,
	disabled: false,
})

/**
 * Emits to handle events for the component.
 */
const emits = defineEmits<{
	/**
	 * Emitted when the model value changes.
	 * @param value The new value of the model.
	 */
	(e: 'update:modelValue', value: boolean | string): void

	/**
	 * Emitted when the Toggle value changes.
	 * @param value The new value of the Toggle.
	 */
	(e: 'change', value: boolean | string): void

	/**
	 * Emitted whenever there is an input change.
	 */
	(e: 'input'): void
}>()

/**
 * CSS class for the SwitchRoot element based on the provided props.
 */
const toggleClass = computed(() => cn(toggleVariants(), props.class))

/**
 * CSS class for the ToggleThumb element.
 */
const thumbClass =
	'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5'

/**
 * Function to handle the change in the toggle state (checked/unchecked).
 * Emits the appropriate event when the toggle value changes.
 */
function onChecked() {
	if (!props.disabled) {
		const value =
			props.modelValue === props.trueValue ? props.falseValue : props.trueValue
		emits('update:modelValue', value)
		emits('input')
		emits('change', value)
	}
}
</script>

<template>
	<div class="flex items-center gap-2">
		<!-- SwitchRoot to render the main toggle element -->
		<SwitchRoot
			@click="onChecked()"
			:disabled="props.disabled"
			:checked="props.modelValue === props.trueValue"
			:class="toggleClass"
		>
			<!-- SwitchThumb to render the thumb element of the toggle -->
			<SwitchThumb :class="thumbClass" />
		</SwitchRoot>
		<slot />
	</div>
</template>
