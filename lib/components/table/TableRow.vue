<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<tr
		:class="[
			cn(
				'border-b transition-colors data-[state=selected]:bg-neutral-100 dark:hover:bg-neutral-80/50 dark:data-[state=selected]:bg-neutral-80',
				props.class
			),
		]"
	>
		<slot />
	</tr>
</template>

<style scoped>
@keyframes slideInFromLeft {
	0% {
		transform: translateX(-100%);
		opacity: 0;
	}
	100% {
		transform: translateX(0);
		opacity: 1;
	}
}
.slide-in-from-left {
	animation: slideInFromLeft 0.3s ease-out;
}
</style>
