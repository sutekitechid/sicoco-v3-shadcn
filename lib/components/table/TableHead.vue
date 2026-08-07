<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { tableHeadVariant, TableHeadVariant } from '.'

const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class']
	size?: TableHeadVariant['size']
	textWrap?: TableHeadVariant['textWrap']
}>(), {
	textWrap: true
})
</script>

<template>
	<th 
    	v-bind="$attrs"
		:class="cn(tableHeadVariant({ size: props.size, textWrap }), props.class)"
	>
		<slot />
	</th>
</template>
