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
				'border-b transition-colors data-[state=selected]:bg-neutral-950 text-main dark:text-neutral-500 dark:bg-neutral-100 hover:bg-[#F8F8F9] dark:hover:bg-neutral-300 dark:data-[state=selected]:bg-neutral-700',
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
