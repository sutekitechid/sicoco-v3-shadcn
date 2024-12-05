<script setup lang="ts">
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
