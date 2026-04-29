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
		viewBox="0 0 120 120"
		fill="none"
		class="h-full w-full"
		data-testid="progress-circle-svg"
	>
		<circle
			cx="60"
			cy="60"
			r="52"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:class="cn(props.trackClass)"
			data-testid="progress-circle-track"
		/>
		<circle
			cx="60"
			cy="60"
			r="52"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:stroke-dasharray="`${props.normalizedValue} 100`"
			:class="cn('origin-center -rotate-90 transition-[stroke-dasharray] duration-300 ease-out', props.indicatorClass)"
			data-testid="progress-circle-indicator"
		/>
	</svg>
</template>
