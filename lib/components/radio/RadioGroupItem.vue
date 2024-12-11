<script setup lang="ts">
/**
 * RadioGroupItem component that holds the radio button and the label with the value
 *
 * @slot - Default slot for the label
 *
 * @props class - The class to apply to
 * @props value - The value of the radio item
 * @props variant - The variant of the radio item
 * @props disabled - Whether the radio item is disabled
 * @props id - The id of the radio item
 *
 * @emits update:modelValue - Event emitted when the model value is updated
 *
 */
import { cn } from '../../utils/tw-merge'
import { RadioGroupIndicator, RadioGroupItem, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import uniqueId from 'lodash/uniqueId'
import {
	type RadioGroupItemVariant,
	radioGroupItemVariant,
	RadioGroupItemLabel,
	radioGroupItemIndicatorVariant,
} from '.'

import { jsonToValidSelector } from '../../utils/string'

const props = defineProps<{
	id?: string
	class?: HTMLAttributes['class']
	variant?: RadioGroupItemVariant['variant']
	value?: any
	disabled?: boolean
}>()

const delegatedProps = computed(() => {
	const { class: _, value, ...delegated } = props

	const result = {
		...delegated,
		value: '',
	}

	result.value = jsonToValidSelector(value)
	return result
})

const forwardedProps = useForwardProps(delegatedProps)

const computedId = computed(() => props.id || uniqueId('radio-'))
</script>

<template>
	<div :class="cn('flex items-center space-x-2', props.class)">
		<RadioGroupItem
			v-bind="forwardedProps"
			:class="
				cn(
					radioGroupItemVariant({
						disabled: props.disabled,
						variant: props.variant,
					})
				)
			"
			:id="computedId"
		>
			<RadioGroupIndicator
				:class="
					radioGroupItemIndicatorVariant({
						disabled: props.disabled,
						variant: props.variant,
					})
				"
			>
				<div
					:class="[
						'h-2 w-2 rounded-full',
						{ 'bg-neutral-5': !disabled, 'bg-neutral-50': disabled },
					]"
				/>
			</RadioGroupIndicator>
		</RadioGroupItem>
		<RadioGroupItemLabel
			:for="computedId"
			:class="{ 'cursor-not-allowed': disabled }"
		>
			<slot />
		</RadioGroupItemLabel>
	</div>
</template>

<style scoped>
.radio-group__invalid button {
	@apply border-danger-100 hover:ring-danger-100/30;
}
</style>
