<script setup lang="ts">
import { useSlots, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { tableCellVariant, type TableCellVariant } from '.'

const props = defineProps<{
	class?: HTMLAttributes['class']
	value?: string | number
	size?: TableCellVariant['size']
}>()

const slots = useSlots()
</script>

<template>
	<td :class="cn(tableCellVariant({ size: props.size }), props.class)">
		<template v-if="!slots.default">
			{{ props.value }}
		</template>
		<template v-else>
			<slot />
		</template>
	</td>
</template>
