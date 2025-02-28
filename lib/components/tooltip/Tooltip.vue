<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

/**
 * Tooltip component that wraps the TooltipRoot component from radix-ui
 *
 * @slot trigger - The element that will trigger the tooltip
 * @slot - The content of the tooltip
 *
 * @example
 * <Tooltip>
 * 	<template #trigger>
 * 		<button>Hover me</button>
 * 	</template>
 * <TooltipContent>
 * 	Tooltip content
 * </TooltipContent>
 * </Tooltip>
 */
import {
	TooltipRoot,
	type TooltipRootEmits,
	type TooltipRootProps,
	useForwardPropsEmits,
	TooltipProvider,
	TooltipTrigger,
} from 'radix-vue'

// array of possible trigger with 'click', 'hover', 'focus' only
type triggers = 'click' | 'hover' | 'focus'

const props = withDefaults(
	defineProps<TooltipRootProps & { trigger?: triggers }>(),
	{
		disabled: false,
		trigger: 'click',
	}
)
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const open = ref(false)
function onClick() {
	if (props.trigger !== 'click') {
		return
	}
	open.value = !open.value
}

const isTooltipDisabled = computed(() => {
	if (props.disabled) {
		return true
	}

	// if the trigger is click, return true
	return props.trigger === 'click'
})

const isTooltipOpened = computed(() => {
	if (props.open) {
		return props.open
	}
	if (props.trigger === 'hover') {
		return undefined
	}
	return open.value
})

const tooltipRef = ref()
/**
 * Handle clicks outside the dropdown to close it.
 * It checks if the click occurred outside any dropdown content elements and closes the dropdown if it did.
 */
if (props.trigger === 'click') {
	onClickOutside(tooltipRef, () => {
		open.value = false
	})
}
</script>

<template>
	<TooltipProvider>
		<TooltipRoot
			v-bind="forwarded"
			:open="isTooltipOpened"
			:disabled="isTooltipDisabled"
		>
			<span ref="tooltipRef" class="w-fit">
				<TooltipTrigger as="div" class="w-fit" as-child @click="onClick">
					<slot name="trigger" />
				</TooltipTrigger>
			</span>
			<slot />
		</TooltipRoot>
	</TooltipProvider>
</template>
