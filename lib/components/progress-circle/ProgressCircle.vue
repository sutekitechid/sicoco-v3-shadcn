<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { cn } from '../../utils/tw-merge'

const ProgressCircleShape = {
    circle: 'circle',
    semicircle: 'semicircle'
}
type ProgressCircleShape = typeof ProgressCircleShape[keyof typeof ProgressCircleShape];

interface Props {
	modelValue?: number
	label?: string
	shape?: ProgressCircleShape
	class?: HTMLAttributes['class']
	trackColor?: string
	indicatorColor?: string
	trackClass?: HTMLAttributes['class']
	indicatorClass?: HTMLAttributes['class']
	ariaLabel?: string
	disabled?: boolean
	strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0,
	shape: 'circle',
	trackColor: 'stroke-neutral-10',
	indicatorColor: 'stroke-primary-90',
	ariaLabel: 'Progress circle',
	disabled: false,
	strokeWidth: 8,
})

const PROGRESS_MIN = 0
const PROGRESS_MAX = 100

const normalizedValue = computed(() => {
	const currentValue = Number(props.modelValue ?? 0)

	if (Number.isNaN(currentValue)) {
		return 0
	}

	if (currentValue <= PROGRESS_MIN) {
		return PROGRESS_MIN
	}

	if (currentValue >= PROGRESS_MAX) {
		return PROGRESS_MAX
	}

	return Math.round(currentValue)
})

const progressText = computed(() => `${normalizedValue.value}%`)

const isSemiCircle = computed(() => props.shape === 'semi-circle')

const valueContainerClass = computed(() => {
	if (isSemiCircle.value) {
		return 'absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1'
	}

	return 'absolute inset-0 flex flex-col items-center justify-center'
})

</script>

<template>
	<div class="inline-flex flex-col items-center gap-1">
		<ProgressRoot
			:model-value="normalizedValue"
			:max="PROGRESS_MAX"
			:disabled="props.disabled"
			:aria-label="props.ariaLabel"
			:aria-valuemin="PROGRESS_MIN"
			:aria-valuemax="PROGRESS_MAX"
			:aria-valuenow="normalizedValue"
			:aria-valuetext="progressText"
			data-testid="progress-circle-root"
		>
			<div :class="cn('relative', props.class)">
				<svg
					v-if="!isSemiCircle"
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
						:class="cn(props.trackColor, props.trackClass)"
						data-testid="progress-circle-track"
					/>
					<circle
						cx="60"
						cy="60"
						r="52"
						pathLength="100"
						stroke-linecap="round"
						:stroke-width="props.strokeWidth"
						:stroke-dasharray="`${normalizedValue} 100`"
						:class="cn('origin-center -rotate-90 transition-[stroke-dasharray] duration-300 ease-out', props.indicatorColor, props.indicatorClass)"
						data-testid="progress-circle-indicator"
					/>
				</svg>

				<svg
					v-else
					viewBox="0 0 120 70"
					fill="none"
					class="h-full w-full"
					data-testid="progress-semi-circle-svg"
				>
					<path
						d="M 8 60 A 52 52 0 0 1 112 60"
						pathLength="100"
						stroke-linecap="round"
						:stroke-width="props.strokeWidth"
						:class="cn(props.trackColor, props.trackClass)"
						data-testid="progress-semi-circle-track"
					/>
					<path
						d="M 8 60 A 52 52 0 0 1 112 60"
						pathLength="100"
						stroke-linecap="round"
						:stroke-width="props.strokeWidth"
						:stroke-dasharray="`${normalizedValue} 100`"
						:class="cn('transition-[stroke-dasharray] duration-300 ease-out', props.indicatorColor, props.indicatorClass)"
						data-testid="progress-semi-circle-indicator"
					/>
				</svg>

				<div :class="valueContainerClass" data-testid="progress-circle-value-container">
					<span
						v-if="props.label && isSemiCircle"
						class="mb-0.5 text-center text-xs text-neutral-60 font-medium"
						data-testid="progress-circle-label-inside"
					>
						{{ props.label }}
					</span>
					<span
						class="font-semibold text-neutral-100"
						data-testid="progress-circle-value"
					>
						{{ progressText }}
					</span>
					<span
						v-if="props.label && !isSemiCircle"
						class="mt-0.5 text-center text-xs text-neutral-60 font-medium"
						data-testid="progress-circle-label-inside"
					>
						{{ props.label }}
					</span>
				</div>
			</div>
		</ProgressRoot>


	</div>
</template>
