<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import {
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import { Tooltip, TooltipContent } from '../tooltip/index'
import { cn } from '../../utils/tw-merge'
import { type ProgressVariant, progressBarVariantBackgroundClass, progressBarTrackBackgroundClass } from '../../utils/progress-variant'
import { normalizeProgressValue, PROGRESS_MIN, PROGRESS_MAX } from '../../utils/progress'

interface Props {
  modelValue?: number
  class?: HTMLAttributes['class']
  variant?: ProgressVariant
  size?: string
  showTooltip?: boolean
  ariaLabel?: string
  disabled?: boolean
  dataCy?: string
  dataTestid?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  variant: 'primary',
  size: '0.5rem',
  showTooltip: false,
  ariaLabel: 'Progress',
  disabled: false,
  dataCy: 'progress',
})

const normalizedValue = computed(() => normalizeProgressValue(props.modelValue))

const progressText = computed(() => `${normalizedValue.value}%`)
const indicatorStyle = computed(() => ({ width: `${normalizedValue.value}%` }))
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div :class="cn('w-full', 'space-y-2')">
      <ProgressRoot
        :model-value="normalizedValue"
        :max="PROGRESS_MAX"
        :disabled="props.disabled"
        :aria-label="props.ariaLabel"
        :aria-valuemin="PROGRESS_MIN"
        :aria-valuemax="PROGRESS_MAX"
        :aria-valuenow="normalizedValue"
        :aria-valuetext="progressText"
        :class="cn('relative w-full overflow-hidden rounded-full', progressBarTrackBackgroundClass)"
        :style="{ height: props.size }"
        :data-cy="props.dataCy"
        :data-testid="props.dataTestid ?? props.dataCy"
      >
        <ProgressIndicator
          :data-cy="`${props.dataCy}-indicator`"
          :data-testid="`${props.dataTestid ?? props.dataCy}-indicator`"
          :style="indicatorStyle"
          :class="
            cn(
              'relative h-full rounded-full transition-[width] duration-[400ms] ease-in-out motion-reduce:duration-100',
              progressBarVariantBackgroundClass[props.variant]
            )
          "
        >
          <Tooltip
            v-if="props.showTooltip"
            :open="true"
          >
            <template #trigger>
              <span
                :data-cy="`${props.dataCy}-tooltip-trigger`"
                :data-testid="`${props.dataTestid ?? props.dataCy}-tooltip-trigger`"
                class="absolute right-0 top-1/2 h-px w-px -translate-y-1/2"
              />
            </template>
            <TooltipContent
              :data-cy="`${props.dataCy}-tooltip`"
              :data-testid="`${props.dataTestid ?? props.dataCy}-tooltip`"
              variant="white"
            >
              <slot name="tooltip-content">  
              {{ progressText }}  
              </slot>
            </TooltipContent>
          </Tooltip>
        </ProgressIndicator>
      </ProgressRoot>
    </div>
  </div>
</template>
