<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { tableHeaderVariant, TableHeaderVariant } from '.'

const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class'],
	sticky?: TableHeaderVariant['sticky']
}>(), {
	sticky: true
})
</script>

<template>
	<thead :class="cn(tableHeaderVariant({ sticky }), props.class)">
		<slot />
	</thead>
</template>
