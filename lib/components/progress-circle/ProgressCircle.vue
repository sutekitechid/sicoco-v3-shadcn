<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { ProgressRoot } from 'reka-ui'
import { cn } from '../../utils/tw-merge'

type ProgressCircleShape = 'circle' | 'semi-circle'
type ProgressCircleSize = 'sm' | 'md' | 'lg'

interface Props {
	modelValue?: number
	label?: string
	shape?: ProgressCircleShape
	size?: ProgressCircleSize
	class?: HTMLAttributes['class']
	trackColor?: string
	indicatorColor?: string
	trackClass?: HTMLAttributes['class']
	indicatorClass?: HTMLAttributes['class']
	textClass?: HTMLAttributes['class']
	labelClass?: HTMLAttributes['class']
	ariaLabel?: string
	disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0,
	shape: 'circle',
	size: 'md',
	trackColor: 'stroke-neutral-10',
	indicatorColor: 'stroke-primary-90',
	ariaLabel: 'Progress circle',
	disabled: false,
})

const normalizedValue = computed(() => {
	const currentValue = Number(props.modelValue ?? 0)

	if (Number.isNaN(currentValue)) {
		return 0
	}

	if (currentValue <= 0) {
		return 0
	}

	if (currentValue >= 100) {
		return 100
	}

	return Math.round(currentValue)
})

const progressText = computed(() => `${normalizedValue.value}%`)

const isSemiCircle = computed(() => props.shape === 'semi-circle')

const shouldMoveLabelOutside = computed(() => {
	if (!props.label) {
		return false
	}

	if (isSemiCircle.value) {
		return !doesSemiCircleLabelFit(props.label, props.size)
	}

	return props.size === 'sm'
})

const sizeClass = computed(() => getSizeClass(props.size, isSemiCircle.value))

const strokeWidth = computed(() => getStrokeWidth(props.size))

const valueContainerClass = computed(() => {
	if (isSemiCircle.value) {
		return 'absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1'
	}

	return 'absolute inset-0 flex flex-col items-center justify-center'
})

const valueTextClass = computed(() => {
	if (props.size === 'sm') {
		return 'text-sm'
	}

	if (props.size === 'lg') {
		return 'text-xl'
	}

	return 'text-base'
})

function getSizeClass(size: ProgressCircleSize, isSemi: boolean) {
	if (isSemi) {
		if (size === 'sm') {
			return 'h-12 w-20'
		}

		if (size === 'lg') {
			return 'h-20 w-36'
		}

		return 'h-16 w-28'
	}

	if (size === 'sm') {
		return 'h-20 w-20'
	}

	if (size === 'lg') {
		return 'h-36 w-36'
	}

	return 'h-28 w-28'
}

function getStrokeWidth(size: ProgressCircleSize) {
	if (size === 'sm') {
		return 8
	}

	if (size === 'lg') {
		return 12
	}

	return 10
}

function doesSemiCircleLabelFit(label: string, size: ProgressCircleSize) {
	const normalizedLabel = label.trim()

	if (!normalizedLabel) {
		return true
	}

	const maxLength = getSemiCircleLabelMaxLength(size)

	return normalizedLabel.length <= maxLength
}

function getSemiCircleLabelMaxLength(size: ProgressCircleSize) {
	if (size === 'sm') {
		return 4
	}

	if (size === 'lg') {
		return 12
	}

	return 8
}
</script>

<template>
	<div :class="cn('inline-flex flex-col items-center gap-1', props.class)">
		<ProgressRoot
			:model-value="normalizedValue"
			:max="100"
			:disabled="props.disabled"
			:aria-label="props.ariaLabel"
			aria-valuemin="0"
			aria-valuemax="100"
			:aria-valuenow="normalizedValue"
			:aria-valuetext="progressText"
			data-testid="progress-circle-root"
		>
			<div :class="cn('relative', sizeClass)">
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
						:stroke-width="strokeWidth"
						:data-value="normalizedValue"
						:class="cn(props.trackColor, props.trackClass)"
						data-testid="progress-circle-track"
					/>
					<circle
						cx="60"
						cy="60"
						r="52"
						pathLength="100"
						stroke-linecap="round"
						:stroke-width="strokeWidth"
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
						:stroke-width="strokeWidth"
						:class="cn(props.trackColor, props.trackClass)"
						data-testid="progress-semi-circle-track"
					/>
					<path
						d="M 8 60 A 52 52 0 0 1 112 60"
						pathLength="100"
						stroke-linecap="round"
						:stroke-width="strokeWidth"
						:stroke-dasharray="`${normalizedValue} 100`"
						:class="cn('transition-[stroke-dasharray] duration-300 ease-out', props.indicatorColor, props.indicatorClass)"
						data-testid="progress-semi-circle-indicator"
					/>
				</svg>

				<div :class="valueContainerClass" data-testid="progress-circle-value-container">
					<span
						v-if="props.label && !shouldMoveLabelOutside && isSemiCircle"
						:class="cn('mb-0.5 text-center text-xs text-neutral-60 font-medium', props.labelClass)"
						data-testid="progress-circle-label-inside"
					>
						{{ props.label }}
					</span>
					<span
						:class="cn('font-semibold text-neutral-100', valueTextClass, props.textClass)"
						data-testid="progress-circle-value"
					>
						{{ progressText }}
					</span>
					<span
						v-if="props.label && !shouldMoveLabelOutside && !isSemiCircle"
						:class="cn('mt-0.5 text-center text-xs text-neutral-60 font-medium', props.labelClass)"
						data-testid="progress-circle-label-inside"
					>
						{{ props.label }}
					</span>
				</div>
			</div>
		</ProgressRoot>

		<span
			v-if="props.label && shouldMoveLabelOutside"
			:class="cn('text-center text-xs text-neutral-60', props.labelClass)"
			data-testid="progress-circle-label-outside"
		>
			{{ props.label }}
		</span>
	</div>
</template>
