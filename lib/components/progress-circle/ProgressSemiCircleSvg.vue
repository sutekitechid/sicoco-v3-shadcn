<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props {
	normalizedValue: number
	strokeWidth: number
	trackClass?: HTMLAttributes['class']
	indicatorClass?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
	<svg
		viewBox="0 0 120 70"
		fill="none"
		class="h-full w-full"
		data-cy="progress-semi-circle-svg"
	>
		<path
			d="M 8 60 A 52 52 0 0 1 112 60"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:class="cn(props.trackClass)"
			data-cy="progress-semi-circle-track"
		/>
		<path
			d="M 8 60 A 52 52 0 0 1 112 60"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:stroke-dasharray="`${props.normalizedValue} 100`"
			:class="cn('transition-[stroke-dasharray] duration-300 ease-out', props.indicatorClass)"
			data-cy="progress-semi-circle-indicator"
		/>
	</svg>
</template>
