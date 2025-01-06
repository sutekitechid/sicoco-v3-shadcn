<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { useSlots, type HTMLAttributes } from 'vue'
import { TableCell, TableRow } from '.'
import { EmptyDataMessage } from '../empty-data-message'

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		colspan?: number
	}>(),
	{
		colspan: 1,
	}
)
</script>

<template>
	<TableRow>
		<TableCell
			:class="
				cn(
					'p-4 whitespace-nowrap align-middle text-sm text-slate-950 dark:text-slate-50',
					props.class
				)
			"
			:colspan="props.colspan"
		>
			<div class="flex items-center justify-center py-10">
				<EmptyDataMessage class="w-full">
					<template v-if="$slots.default && $slots.default().length > 0">
						<slot />
					</template>
				</EmptyDataMessage>
			</div>
		</TableCell>
	</TableRow>
</template>
