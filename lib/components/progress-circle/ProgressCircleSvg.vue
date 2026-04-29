<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '../../utils/tw-merge'

interface Props {
	normalizedValue: number
	strokeWidth: number
	trackClass?: HTMLAttributes['class']
	indicatorClass?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const VIEWBOX_SIZE = 120
const CIRCLE_CENTER = VIEWBOX_SIZE / 2
const circleRadius = computed(() => (VIEWBOX_SIZE - props.strokeWidth) / 2)
</script>

<template>
	<svg
		viewBox="0 0 120 120"
		fill="none"
		class="h-full w-full"
		data-cy="progress-circle-svg"
	>
		<circle
			:cx="CIRCLE_CENTER"
			:cy="CIRCLE_CENTER"
			:r="circleRadius"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:class="cn(props.trackClass)"
			data-cy="progress-circle-track"
		/>
		<circle
			:cx="CIRCLE_CENTER"
			:cy="CIRCLE_CENTER"
			:r="circleRadius"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:stroke-dasharray="`${props.normalizedValue} 100`"
			:class="cn('origin-center -rotate-90 transition-[stroke-dasharray] duration-300 ease-out', props.indicatorClass)"
			data-cy="progress-circle-indicator"
		/>
	</svg>
</template>
