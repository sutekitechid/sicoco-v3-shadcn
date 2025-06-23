<script setup lang="ts">
/**
 * Checkbox component is a component that allows users to select one or more options from a set of options.
 *
 * @example
 * <Checkbox v-model="checked" value="1">Option 1</Checkbox>
 *
 * @props {string} class - Additional custom CSS classes.
 * @props {string} variant - Defines the style variant of the checkbox.
 * @props {string} id - The unique identifier for the checkbox.
 * @props {boolean} disabled - Whether the checkbox is disabled.
 * @props {boolean|string|number|object|Array<any>|null} modelValue - The value of the checkbox.
 * @props {boolean|string|number|object|Array<any>|null} value - The value of the checkbox.
 * @props {boolean} indeterminate - Whether the checkbox is in an indeterminate state.
 * @props {boolean} required - Whether the checkbox is required.
 *
 * @emits {boolean} update:checked - Emitted when the checkbox is checked.
 * @emits {Event} blur - Emitted when the checkbox loses focus.
 *
 */

import uniqueId from 'lodash/uniqueId'
import { useVModel } from '@vueuse/core'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import {
	checkboxVariant,
	CheckboxVariant,
	CheckboxLabel,
	determineModelValue,
	isChecked,
} from '.'

import {
	CheckboxIndicator,
	CheckboxRoot,
	useForwardPropsEmits,
} from 'radix-vue'

/**
 * Define props for the Checkbox component with default values.
 */
const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		variant?: CheckboxVariant['variant']
		size?: CheckboxVariant['size']
		rounded?: boolean
		checkedIcon?: string
		id?: string
		disabled?: boolean
		modelValue?: boolean | string | number | object | Array<any> | null
		value?: boolean | string | number | object | Array<any> | null
		indeterminate?: boolean
		alwaysShowIndicator?: boolean
		dataCy?: string
	}>(),
	{
		checkedIcon: 'si-check',
	}
)

const emits = defineEmits(['update:checked', 'update:modelValue', 'blur'])

/**
 * Extract delegated props from the props object.
 */
const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

/**
 * Forward props and emits to the Checkbox component.
 */
const forwarded = useForwardPropsEmits(delegatedProps, emits)

/**
 * Generate a unique identifier for the checkbox if not provided.
 */
const computedId = computed(() => props.id || uniqueId('checkbox-'))

/**
 * Determine the model value of the checkbox.
 */
const computedModelValue = useVModel(props, 'modelValue', emits)

/**
 * Update the checked state of the checkbox.
 */
const onUpdateChecked = (checked: boolean) => {
	computedModelValue.value = determineModelValue(
		checked,
		props.value,
		props.modelValue
	)
}

/**
 * Determine if the checkbox is checked.
 */
const checked = computed(() => {
	return isChecked(props.value, props.modelValue)
})
</script>

<template>
	<div :class="cn('flex items-center space-x-2')">
		<!-- CheckboxRoot is a component that wraps the checkbox input and label. -->
		<CheckboxRoot
			ref="checkboxInput"
			:data-cy="dataCy"
			v-bind="forwarded"
			:id="computedId"
			:class="
				cn(
					'checkbox',
					checkboxVariant({
						variant,
						disabled,
						size,
						rounded,
						alwaysShowIndicator,
					}),
					props.class
				)
			"
			:checked="checked"
			:value="String(props.value)"
			@update:checked="onUpdateChecked"
		>
			<slot name="trigger" />
			<!-- checkbox indicator is a component that displays the checkbox icon. -->
			<div
				v-if="checked || alwaysShowIndicator"
				:class="
					cn(
						'flex h-full w-full items-center justify-center text-xs text-stroke-1'
					)
				"
			>
				<slot name="indicator">
					<i
						:class="
							cn(indeterminate ? 'si-minus' : checkedIcon, ' animate-reveal')
						"
					/>
				</slot>
			</div>
		</CheckboxRoot>
		<!-- CheckboxLabel is a component that displays the checkbox label. -->
		<CheckboxLabel :for="computedId">
			<slot />
		</CheckboxLabel>
	</div>
</template>

<style scoped>
.checkbox .si-check,
.checkbox .si-minus {
	clip-path: inset(0 100% 0 0);
	animation: reveal 500ms forwards;
}

@keyframes reveal {
	to {
		clip-path: inset(0 0 0 0);
	}
}
</style>
