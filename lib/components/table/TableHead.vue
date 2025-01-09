<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { tableHeadVariant, TableHeadVariant } from '.'

const props = defineProps<{
	class?: HTMLAttributes['class']
	size?: TableHeadVariant['size']
}>()
</script>

<template>
	<th :class="cn(tableHeadVariant({ size: props.size }), props.class)">
		<slot />
	</th>
</template>
