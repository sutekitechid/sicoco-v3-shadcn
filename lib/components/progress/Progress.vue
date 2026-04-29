<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import {
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import { Tooltip, TooltipContent } from '../tooltip/index'
import { cn } from '../../utils/tw-merge'
import { type ProgressVariant, progressVariantBgClass } from '../../utils/progress-variant'

type ProgressLabelPosition =
  null
  | 'right'
  | 'bottom-right'
  | 'tooltip-top'

interface Props {
  modelValue?: number
  class?: HTMLAttributes['class']
  variant?: ProgressVariant
  trackClass?: HTMLAttributes['class']
  indicatorClass?: HTMLAttributes['class']
  labelPosition?: ProgressLabelPosition
  ariaLabel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  variant: 'primary',
  labelPosition: null,
  ariaLabel: 'Progress',
  disabled: false,
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
const indicatorStyle = computed(() => ({ width: `${normalizedValue.value}%` }))

const isRightLabel = computed(() => props.labelPosition === 'right')
const isBottomRightLabel = computed(() => props.labelPosition === 'bottom-right')
const isTooltipTopLabel = computed(() => props.labelPosition === 'tooltip-top')
const isTooltipBottomNoArrowLabel = computed(
  () => props.labelPosition === 'tooltip-bottom-no-arrow'
)
const shouldShowTooltip = computed(
  () => isTooltipTopLabel.value || isTooltipBottomNoArrowLabel.value
)
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div :class="cn('w-full', isRightLabel ? 'flex items-center gap-3' : 'space-y-2')">
      <ProgressRoot
        :model-value="normalizedValue"
        :max="PROGRESS_MAX"
        :disabled="props.disabled"
        :aria-label="props.ariaLabel"
        :aria-valuemin="PROGRESS_MIN"
        :aria-valuemax="PROGRESS_MAX"
        :aria-valuenow="normalizedValue"
        :aria-valuetext="progressText"
        data-cy="progress-root"
        class="relative h-2 w-full overflow-hidden rounded-full bg-neutral-10"
      >
        <ProgressIndicator
          data-cy="progress-indicator"
          :style="indicatorStyle"
          :class="
            cn(
              'relative h-full rounded-full transition-[width] duration-[400ms] ease-in-out motion-reduce:duration-100',
              progressVariantBgClass[props.variant]
            )
          "
        >
          <Tooltip
            v-if="shouldShowTooltip"
            :open="true"
          >
            <template #trigger>
              <span
                data-cy="progress-tooltip-trigger"
                class="absolute right-0 top-1/2 h-px w-px -translate-y-1/2"
              />
            </template>
            <TooltipContent
              data-cy="progress-tooltip-always"
              variant="white"
            >
              <slot name="tooltip-content">  
              {{ progressText }}  
              </slot>
            </TooltipContent>
          </Tooltip>
        </ProgressIndicator>
      </ProgressRoot>

      <span
        v-if="isRightLabel"
        data-cy="progress-right-label"
        class="shrink-0 text-sm font-medium text-neutral-100"
      >
        {{ progressText }}
      </span>
    </div>

    <div
      v-if="isBottomRightLabel"
      data-cy="progress-bottom-right-label"
      class="mt-2 text-right text-sm font-medium text-neutral-100"
    >
      {{ progressText }}
    </div>
  </div>
</template>
