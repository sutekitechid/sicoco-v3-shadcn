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
import { RadioGroupIndicator, RadioGroupItem, useForwardProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import uniqueId from 'lodash/uniqueId'
import {
	type RadioGroupItemVariant,
	radioGroupItemVariant,
	RadioGroupItemLabel,
	radioGroupItemIndicatorVariant,
	radioGroupItemInnerIndicator,
} from '.'

import { jsonToValidSelector, type JsonObjectType } from '../../utils/string'

const props = defineProps<{
	id?: string
	class?: HTMLAttributes['class']
	variant?: RadioGroupItemVariant['variant']
	value?: JsonObjectType
	disabled?: boolean
}>()

const delegatedProps = computed(() => {
	const { value, ...delegated } = props

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
			:id="computedId"
			:class="
				cn(
					radioGroupItemVariant({
						disabled: props.disabled,
						variant: props.variant,
					})
				)
			"
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
					:class="radioGroupItemInnerIndicator({ disabled: props.disabled })"
				/>
			</RadioGroupIndicator>
		</RadioGroupItem>
		<RadioGroupItemLabel :for="computedId" :disabled="disabled">
			<slot />
		</RadioGroupItemLabel>
	</div>
</template>

<style scoped>
.radio-group__invalid button {
	@apply border-danger-100 hover:ring-danger-100/30;
}

[data-state='checked'] .radio-group-item-indicator {
	animation: grow-in 0.2s ease-out;
}

@keyframes grow-in {
	from {
		transform: scale(0);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
