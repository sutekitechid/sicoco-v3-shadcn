<script setup lang="ts">
import { PopoverTrigger, type PopoverTriggerProps } from 'radix-vue'

// Define the props for this component, inheriting from PopoverTriggerProps
const props = defineProps<PopoverTriggerProps>()
</script>

<template>
	<!-- The PopoverTrigger component wraps the slot content and triggers the visibility of the popover -->
	<PopoverTrigger v-bind="props">
		<slot />
	</PopoverTrigger>
</template>
