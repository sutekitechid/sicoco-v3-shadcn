<script setup lang="ts">
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

const props = defineProps<TooltipRootProps>()
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<TooltipProvider>
		<TooltipRoot v-bind="forwarded">
			<TooltipTrigger as="div" class="w-fit">
				<slot name="trigger" />
			</TooltipTrigger>
			<slot />
		</TooltipRoot>
	</TooltipProvider>
</template>
