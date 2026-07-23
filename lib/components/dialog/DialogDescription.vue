<script setup lang="ts">
import {
	DialogDescription as RekaDialogDescription,
	type DialogDescriptionProps,
} from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

const props = defineProps<
	DialogDescriptionProps & {
		class?: HTMLAttributes['class']
	}
>()
</script>

<template>
	<RekaDialogDescription
		v-bind="props"
		:class="cn('max-h-[60vh] overflow-y-auto text-main dialog-description mb-4', props.class)"
	>
		<slot />
	</RekaDialogDescription>
</template>

<style>
.dialog-description::-webkit-scrollbar-track {
  @apply bg-neutral-50 !border-neutral-400;
}
</style>
