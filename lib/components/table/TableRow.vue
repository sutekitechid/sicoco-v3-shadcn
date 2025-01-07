<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<tr
		:class="
			cn(
				'border-b transition-colors hover:bg-neutral-10/50 data-[state=selected]:bg-neutral-100 dark:hover:bg-neutral-80/50 dark:data-[state=selected]:bg-neutral-80',
				props.class
			)
		"
	>
		<slot />
	</tr>
</template>
