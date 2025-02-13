<script setup lang="ts">
import { useSlots, type HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'
import { tableCellVariant, type TableCellVariant } from '.'
import Skeleton from '../skeleton/Skeleton.vue'

const props = defineProps<{
	class?: HTMLAttributes['class']
	value?: string | number
	size?: TableCellVariant['size']
	loading?: boolean
}>()

const slots = useSlots()
</script>

<template>
	<td :class="cn(tableCellVariant({ size: props.size }), props.class)">
		<template v-if="props.loading">
			<Skeleton class="h-4 w-full" />
		</template>
		<template v-else>
			<template v-if="!slots.default">
				{{ props.value }}
			</template>
			<template v-else>
				<slot />
			</template>
		</template>
	</td>
</template>
