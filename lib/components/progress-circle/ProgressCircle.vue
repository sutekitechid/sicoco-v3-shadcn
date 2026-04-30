<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import { type ProgressVariant, progressCircleVariantStrokeClass, progressCircleTrackVariantStrokeClass } from '../../utils/progress-variant'
import ProgressCircleSvg from './ProgressCircleSvg.vue'
import ProgressSemiCircleSvg from './ProgressSemiCircleSvg.vue'

const ProgressCircleShape = {
    circle: 'circle',
    semicircle: 'semi-circle'
} as const
type ProgressCircleShape = typeof ProgressCircleShape[keyof typeof ProgressCircleShape];

interface Props {
	modelValue?: number
	label?: string
	shape?: ProgressCircleShape
	variant?: ProgressVariant
	size?: string
	labelOutside?: boolean
	class?: HTMLAttributes['class']
	ariaLabel?: string
	disabled?: boolean
	strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0,
	shape: 'circle',
	variant: 'primary',
	size: '11.25rem',
	labelOutside: false,
	ariaLabel: 'Progress circle',
	disabled: false,
	strokeWidth: 8,
})

const PROGRESS_MIN = 0
const PROGRESS_MAX = 100

const normalizedValue = computed(() => {
	const currentValue = Number(props.modelValue ?? 0)

	if (Number.isNaN(currentValue)) {
		return PROGRESS_MIN
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

const progressCircleSizeStyle = computed(() => {
	if (isSemiCircle.value) {
		return { width: props.size, height: `calc(${props.size} / 2)` }
	}

	return { width: props.size, height: props.size }
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
			data-cy="progress-circle-root"
		>
			<div :class="cn('relative', props.class)" :style="progressCircleSizeStyle">
				<ProgressCircleSvg
					v-if="!isSemiCircle"
					:normalized-value="normalizedValue"
					:stroke-width="props.strokeWidth"
					:indicator-class="progressCircleVariantStrokeClass[props.variant]"
					:track-class="progressCircleTrackVariantStrokeClass"
				/>
				<ProgressSemiCircleSvg
					v-else
					:normalized-value="normalizedValue"
					:stroke-width="props.strokeWidth"
					:indicator-class="progressCircleVariantStrokeClass[props.variant]"
					:track-class="progressCircleTrackVariantStrokeClass"
				/>

				<div :class="valueContainerClass" data-cy="progress-circle-value-container">
					<slot>
						<span
							v-if="props.label && isSemiCircle"
							class="mb-0.5 text-center text-xs text-neutral-60 font-medium"
							data-cy="progress-circle-label-inside"
						>
							{{ props.label }}
						</span>
						<span
							class="font-semibold text-neutral-100"
							data-cy="progress-circle-value"
						>
							{{ progressText }}
						</span>
						<span
							v-if="props.label && !isSemiCircle && !props.labelOutside"
							class="mt-0.5 text-center text-xs text-neutral-60 font-medium"
							data-cy="progress-circle-label-inside"
						>
							{{ props.label }}
						</span>
					</slot>
				</div>
			</div>
		</ProgressRoot>

		<span
			v-if="props.label && !isSemiCircle && props.labelOutside"
			class="text-center text-xs text-neutral-60 font-medium"
			data-cy="progress-circle-label-outside"
		>
			{{ props.label }}
		</span>
	</div>
</template>
