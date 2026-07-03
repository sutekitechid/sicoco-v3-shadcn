<script lang="ts">
export const ProgressCircleShape = {
	circle: 'circle',
	semicircle: 'semi-circle',
} as const
export type ProgressCircleShape = typeof ProgressCircleShape[keyof typeof ProgressCircleShape]

const DEFAULT_DIAMETER = '11.25rem'
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { type ProgressVariant, progressCircleVariantStrokeClass, progressCircleTrackVariantStrokeClass } from '../../utils/progress-variant'
import { normalizeProgressValue, PROGRESS_MIN, PROGRESS_MAX } from '../../utils/progress'
import ProgressCircleSvg from './ProgressCircleSvg.vue'
import ProgressSemiCircleSvg from './ProgressSemiCircleSvg.vue'

interface Props {
	modelValue?: number
	shape?: ProgressCircleShape
	variant?: ProgressVariant
	diameter?: string
	class?: HTMLAttributes['class']
	ariaLabel?: string
	disabled?: boolean
	strokeWidth?: number
	dataCy?: string
	dataTestid?: string
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0,
	shape: ProgressCircleShape.circle,
	variant: 'primary',
	diameter: DEFAULT_DIAMETER,
	ariaLabel: 'Progress circle',
	disabled: false,
	strokeWidth: 8,
	dataCy: 'progress-circle',
})

const normalizedValue = computed(() => normalizeProgressValue(props.modelValue))

const STROKE_WIDTH_MIN = 1
const STROKE_WIDTH_MAX = 119
const DEFAULT_STROKE_WIDTH = 8

const normalizedStrokeWidth = computed(() => {
	const currentStrokeWidth = Number(props.strokeWidth)

	if (Number.isNaN(currentStrokeWidth)) {
		return DEFAULT_STROKE_WIDTH
	}

	if (currentStrokeWidth <= STROKE_WIDTH_MIN) {
		return STROKE_WIDTH_MIN
	}

	if (currentStrokeWidth >= STROKE_WIDTH_MAX) {
		return STROKE_WIDTH_MAX
	}

	return currentStrokeWidth
})

const progressText = computed(() => `${normalizedValue.value}%`)

const isSemiCircle = computed(() => props.shape === ProgressCircleShape.semicircle)

// Normalizes bare numbers (e.g. "180") to px; all other CSS units pass through.
const NUMERIC_VALUE_REGEX = /^\d+(\.\d+)?$/

const normalizedDiameter = computed(() => {
	if (NUMERIC_VALUE_REGEX.test(props.diameter)) {
		return `${props.diameter}px`
	}

	return props.diameter
})

const progressCircleSizeStyle = computed(() => {
	if (isSemiCircle.value) {
		return {
			width: normalizedDiameter.value,
			aspectRatio: '2 / 1',
		}
	}

	return { width: normalizedDiameter.value, height: normalizedDiameter.value }
})

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
			:data-cy="props.dataCy"
			:data-testid="props.dataTestid ?? props.dataCy"
		>
			<div :class="cn('relative', props.class)" :style="progressCircleSizeStyle">
				<ProgressCircleSvg
					v-if="!isSemiCircle"
					:normalized-value="normalizedValue"
					:stroke-width="normalizedStrokeWidth"
					:indicator-class="progressCircleVariantStrokeClass[props.variant]"
					:track-class="progressCircleTrackVariantStrokeClass"
				/>
				<ProgressSemiCircleSvg
					v-else
					:normalized-value="normalizedValue"
					:stroke-width="normalizedStrokeWidth"
					:indicator-class="progressCircleVariantStrokeClass[props.variant]"
					:track-class="progressCircleTrackVariantStrokeClass"
				/>

				<div :class="valueContainerClass" :data-cy="`${props.dataCy}-value-container`" :data-testid="`${props.dataTestid ?? props.dataCy}-value-container`">
					<slot :progress="progressText">
						<span
							class="font-semibold text-neutral-950 dark:text-neutral-500"
							:data-cy="`${props.dataCy}-value`"
							:data-testid="`${props.dataTestid ?? props.dataCy}-value`"
						>
							{{ progressText }}
						</span>
					</slot>
				</div>
			</div>
		</ProgressRoot>
	</div>
</template>
