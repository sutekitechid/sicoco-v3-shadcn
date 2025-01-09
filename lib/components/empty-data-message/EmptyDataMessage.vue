<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { useSlots, computed, type HTMLAttributes } from 'vue'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const slots = useSlots()

const isDefaultSlotEmpty = computed(() => {
	// default slot ussually contains comment node
	// if the default slot contains only comment node, it means the default slot is empty
	return slots.default && slots.default({}).length === 0
})
</script>

<template>
	<div :class="cn(props.class)">
		<slot />
	</div>
</template>
