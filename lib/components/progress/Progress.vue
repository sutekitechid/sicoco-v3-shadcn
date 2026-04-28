<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import {
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import { cn } from '../../utils/tw-merge'

type ProgressLabelPosition =
  | 'right'
  | 'bottom-right'
  | 'tooltip-top'
  | 'tooltip-bottom-no-arrow'

interface Props {
  modelValue?: number
  class?: HTMLAttributes['class']
  trackClass?: HTMLAttributes['class']
  indicatorClass?: HTMLAttributes['class']
  labelPosition?: ProgressLabelPosition
  ariaLabel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  labelPosition: 'right',
  ariaLabel: 'Progress',
  disabled: false,
})

const totalSegments = 100

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

const isRightLabel = computed(() => props.labelPosition === 'right')
const isBottomRightLabel = computed(() => props.labelPosition === 'bottom-right')
const isTooltipTopLabel = computed(() => props.labelPosition === 'tooltip-top')
const isTooltipBottomNoArrowLabel = computed(
  () => props.labelPosition === 'tooltip-bottom-no-arrow'
)
console.log('isTooltipBottomNoArrowLabel', isTooltipBottomNoArrowLabel.value)
console.log('isTooltipTopLabel', isTooltipTopLabel.value)
const shouldShowTooltip = computed(
  () => isTooltipTopLabel.value || isTooltipBottomNoArrowLabel.value
)

function isFilledSegment(segment: number) {
  return segment <= normalizedValue.value
}

function isFirstFilledSegment(segment: number) {
  if (normalizedValue.value === 0) {
    return false
  }

  return segment === 1
}

function isMarkerSegment(segment: number) {
  if (normalizedValue.value === 0) {
    return segment === 1
  }

  return segment === normalizedValue.value
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div :class="cn('w-full', isRightLabel ? 'flex items-center gap-3' : 'space-y-2')">
      <ProgressRoot
        :model-value="normalizedValue"
        :max="100"
        :disabled="props.disabled"
        :aria-label="props.ariaLabel"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="normalizedValue"
        :aria-valuetext="progressText"
        data-testid="progress-root"
        :class="
          cn(
            'relative h-3 w-full overflow-hidden rounded-full bg-neutral-10',
            props.trackClass,
          )
        "
      >
        <ProgressIndicator class="flex h-full w-full" data-testid="progress-indicator">
          <div
            v-for="segment in totalSegments"
            :key="segment"
            :class="
              cn(
                'relative h-full flex-1 basis-0 transition-colors',
                isFilledSegment(segment)
                  ? cn('bg-primary-90', props.indicatorClass)
                  : 'bg-transparent',
                isFirstFilledSegment(segment) ? 'rounded-l-full' : '',
                isMarkerSegment(segment) && normalizedValue > 0 ? 'rounded-r-full' : '',
              )
            "
          >
            <div
              v-if="shouldShowTooltip && isMarkerSegment(segment)"
              data-testid="progress-tooltip-always"
              :class="
                cn(
                  'absolute right-0 z-10 -translate-x-1/2 rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-10 shadow-md',
                  isTooltipTopLabel ? 'bottom-full mb-2' : '',
                  isTooltipBottomNoArrowLabel ? 'top-full mt-2' : '',
                )
              "
            >
              {{ progressText }}
              <span
                v-if="isTooltipTopLabel"
                class="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-neutral-100"
              />
            </div>
          </div>
        </ProgressIndicator>
      </ProgressRoot>

      <span
        v-if="isRightLabel"
        data-testid="progress-right-label"
        class="shrink-0 text-sm font-medium text-neutral-100"
      >
        {{ progressText }}
      </span>
    </div>

    <div
      v-if="isBottomRightLabel"
      data-testid="progress-bottom-right-label"
      class="mt-2 text-right text-sm font-medium text-neutral-100"
    >
      {{ progressText }}
    </div>
  </div>
</template>
