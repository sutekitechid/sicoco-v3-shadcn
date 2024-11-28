<script setup lang="ts">
import type { PopoverRootEmits, PopoverRootProps } from 'radix-vue'
import { PopoverRoot, useForwardPropsEmits } from 'radix-vue'

// Define the props for this component. These are passed down to the PopoverRoot component.
const props = defineProps<PopoverRootProps>()

// Define the events emitted by this component. These events are passed to the PopoverRoot component.
const emits = defineEmits<PopoverRootEmits>()

// Forward the props and emits to the PopoverRoot component
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<!-- The PopoverRoot component is rendered with the forwarded props and emits. -->
	<!-- The content inside the Popover component is rendered as a slot. -->
	<PopoverRoot v-bind="forwarded">
		<slot />
	</PopoverRoot>
</template>
