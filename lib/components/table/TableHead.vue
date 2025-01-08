<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<th
		:class="
			cn(
				'h-12 px-4 text-left align-middle font-medium text-neutral-90 font-semibold [&:has([role=checkbox])]:pr-0 dark:text-neutral-40 cursor-pointer hover:bg-neutral-10 dark:hover:bg-neutral-10',
				props.class
			)
		"
	>
		<slot />
	</th>
</template>
