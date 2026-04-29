<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { cn } from '../../utils/tw-merge'
import ProgressCircleSvg from './ProgressCircleSvg.vue'
import ProgressSemiCircleSvg from './ProgressSemiCircleSvg.vue'

const ProgressCircleShape = {
    circle: 'circle',
    semicircle: 'semicircle'
}
type ProgressCircleShape = typeof ProgressCircleShape[keyof typeof ProgressCircleShape];

type ProgressCircleVariant = 'primary' | 'success' | 'warning' | 'danger'
type ProgressCircleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const variantIndicatorClass: Record<ProgressCircleVariant, string> = {
	primary: 'stroke-primary-90',
	success: 'stroke-success-90',
	warning: 'stroke-warning-90',
	danger: 'stroke-danger-90',
}

const sizeClass: Record<ProgressCircleSize, string> = {
	xs: 'h-16 w-16',
	sm: 'h-[9rem] w-[9rem]',
	md: 'h-[11.25rem] w-[11.25rem]',
	lg: 'h-[13.5rem] w-[13.5rem]',
	xl: 'h-[15.75rem] w-[15.75rem]',
}

const semiCircleSizeClass: Record<ProgressCircleSize, string> = {
	xs: 'h-8 w-16',
	sm: 'h-[4.5rem] w-[9rem]',
	md: 'h-[5.625rem] w-[11.25rem]',
	lg: 'h-[6.75rem] w-[13.5rem]',
	xl: 'h-[7.875rem] w-[15.75rem]',
}

interface Props {
	modelValue?: number
	label?: string
	shape?: ProgressCircleShape
	variant?: ProgressCircleVariant
	size?: ProgressCircleSize
	class?: HTMLAttributes['class']
	trackClass?: HTMLAttributes['class']
	indicatorClass?: HTMLAttributes['class']
	ariaLabel?: string
	disabled?: boolean
	strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0,
	shape: 'circle',
	variant: 'primary',
	size: 'md',
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

const progressCircleSizeClass = computed(() => {
	if (isSemiCircle.value) {
		return semiCircleSizeClass[props.size]
	}

	return sizeClass[props.size]
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
			<div :class="cn('relative', progressCircleSizeClass, props.class)">
				<ProgressCircleSvg
					v-if="!isSemiCircle"
					:normalized-value="normalizedValue"
					:stroke-width="props.strokeWidth"
					:track-class="cn('stroke-neutral-10', props.trackClass)"
					:indicator-class="cn(variantIndicatorClass[props.variant], props.indicatorClass)"
				/>
				<ProgressSemiCircleSvg
					v-else
					:normalized-value="normalizedValue"
					:stroke-width="props.strokeWidth"
					:track-class="cn('stroke-neutral-10', props.trackClass)"
					:indicator-class="cn(variantIndicatorClass[props.variant], props.indicatorClass)"
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
							v-if="props.label && !isSemiCircle"
							class="mt-0.5 text-center text-xs text-neutral-60 font-medium"
							data-cy="progress-circle-label-inside"
						>
							{{ props.label }}
						</span>
					</slot>
				</div>
			</div>
		</ProgressRoot>


	</div>
</template>
