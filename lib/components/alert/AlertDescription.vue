<script setup lang="ts">
import { inject, type HTMLAttributes, type Ref } from 'vue'
import { cn } from '../../utils/tw-merge'
import type { AlertVariants } from '.'

const props = defineProps<{
	class?: HTMLAttributes['class']
}>()

const variant = inject<Ref<AlertVariants['variant']>>('alertVariant')
</script>

<template>
	<div :class="cn('text-label-md', variant === 'neutral' ? 'text-secondary' : 'text-main', props.class)">
		<slot />
	</div>
</template>
