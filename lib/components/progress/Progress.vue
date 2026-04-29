<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import {
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import { Tooltip, TooltipContent } from '../tooltip/index'
import { cn } from '../../utils/tw-merge'

type ProgressLabelPosition =
  | 'right'
  | 'bottom-right'
  | 'tooltip-top'
  | 'tooltip-bottom-no-arrow'

interface Props {
  modelValue?: number
  class?: HTMLAttributes['class']
  trackColor?: string
  indicatorColor?: string
  trackClass?: HTMLAttributes['class']
  indicatorClass?: HTMLAttributes['class']
  labelPosition?: ProgressLabelPosition
  ariaLabel?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  trackColor: 'bg-neutral-10',
  indicatorColor: 'bg-primary-90',
  labelPosition: 'right',
  ariaLabel: 'Progress',
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
            'relative h-2 w-full overflow-hidden rounded-full',
            props.trackColor,
            props.trackClass,
          )
        "
      >
        <ProgressIndicator
          data-testid="progress-indicator"
          :style="indicatorStyle"
          :class="
            cn(
              'relative h-full rounded-full transition-[width] duration-[400ms] ease-in-out motion-reduce:duration-100',
              props.indicatorColor,
              props.indicatorClass,
            )
          "
        >
          <Tooltip
            v-if="shouldShowTooltip"
            :open="true"
          >
            <template #trigger>
              <span
                data-testid="progress-tooltip-trigger"
                class="absolute right-0 top-1/2 h-px w-px -translate-y-1/2"
              />
            </template>
            <TooltipContent
              data-testid="progress-tooltip-always"
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
