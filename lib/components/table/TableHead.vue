<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { normalizeWidth } from '../../utils/normalize-width'
import { tableHeadVariant, TableHeadVariant } from '.'

const props = withDefaults(defineProps<{
	class?: HTMLAttributes['class']
	width?: string | number
	size?: TableHeadVariant['size']
	textWrap?: TableHeadVariant['textWrap']
}>(), {
	textWrap: true
})

</script>

<template>
	<th 
    	v-bind="$attrs"
		:style="{ width: normalizeWidth(props.width) }"
		:class="cn(tableHeadVariant({ size: props.size, textWrap }), props.class)"
	>
		<slot />
	</th>
</template>
