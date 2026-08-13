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

const VIEWBOX_WIDTH = 120
const VIEWBOX_HEIGHT = 70
const halfStroke = computed(() => props.strokeWidth / 2)
const arcRadius = computed(() => (VIEWBOX_WIDTH - props.strokeWidth) / 2)
const arcBaseline = computed(() => VIEWBOX_HEIGHT - halfStroke.value)
const arcPath = computed(() => {
	return `M ${halfStroke.value} ${arcBaseline.value} A ${arcRadius.value} ${arcRadius.value} 0 0 1 ${VIEWBOX_WIDTH - halfStroke.value} ${arcBaseline.value}`
})
</script>

<template>
	<svg
		viewBox="0 0 120 70"
		fill="none"
		class="h-full w-full"
		data-cy="progress-semi-circle-svg"
		data-testid="progress-semi-circle-svg"
	>
		<path
			:d="arcPath"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:class="cn(props.trackClass)"
			data-cy="progress-semi-circle-track"
			data-testid="progress-semi-circle-track"
		/>
		<path
			:d="arcPath"
			pathLength="100"
			stroke-linecap="round"
			:stroke-width="props.strokeWidth"
			:stroke-dasharray="`${props.normalizedValue} 100`"
			:class="cn('transition-[stroke-dasharray] duration-300 ease-out', props.indicatorClass)"
			data-cy="progress-semi-circle-indicator"
			data-testid="progress-semi-circle-indicator"
		/>
	</svg>
</template>
