<script setup lang="ts">
/**
 * Tooltip content component that wraps the tooltip content
 *
 * @slot - The content of the tooltip
 *
 * @example
 * <TooltipContent>
 * 	Tooltip content
 * </TooltipContent>
 */
import { cn } from '../../utils/tw-merge'
import {
	TooltipContent,
	type TooltipContentEmits,
	type TooltipContentProps,
	TooltipPortal,
	useForwardPropsEmits,
	TooltipArrow,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import {
	tooltipVariant,
	type TooltipVariant,
	tooltipArrowVariant,
	type TooltipContentPosition,
} from '.'

defineOptions({
	inheritAttrs: false,
})

const props = withDefaults(
	defineProps<
		TooltipContentProps & {
			class?: HTMLAttributes['class']
			variant?: TooltipVariant['variant']
			position?: TooltipContentPosition
		}
	>(),
	{
		sideOffset: 4,
	}
)

const emits = defineEmits<TooltipContentEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<TooltipPortal>
		<TooltipContent
			v-bind="{ ...forwarded, ...$attrs }"
			:class="cn(props.class, tooltipVariant({ variant }))"
			:side="props.position"
		>
			<TooltipArrow :class="cn(tooltipArrowVariant({ variant }))" />
			<slot />
		</TooltipContent>
	</TooltipPortal>
</template>
