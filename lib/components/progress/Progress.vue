<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, useSlots } from 'vue'
import {
  ProgressIndicator,
  ProgressRoot,
} from 'reka-ui'
import { Tooltip, TooltipContent } from '../tooltip/index'
import { cn } from '../../utils/tw-merge'
import {
  type ProgressVariant,
  progressBarTrackBackgroundClass,
  progressBarVariantBackgroundClass,
  progressCompletionIconClass,
} from './progress-variant'
import { normalizeProgressValue, PROGRESS_MIN, PROGRESS_MAX } from '../../utils/progress'

interface Props {
  modelValue?: number
  class?: HTMLAttributes['class']
  label?: string
  labelClass?: HTMLAttributes['class']
  valueClass?: HTMLAttributes['class']
  hint?: string
  hintClass?: HTMLAttributes['class']
  inline?: boolean
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
  inline: false,
})

const slots = useSlots()
const normalizedValue = computed(() => normalizeProgressValue(props.modelValue))

const progressText = computed(() => `${normalizedValue.value}%`)
const indicatorStyle = computed(() => ({ width: `${normalizedValue.value}%` }))
const hasLabel = computed(() => Boolean(props.label || slots.label))
const isInline = computed(() => props.inline || !hasLabel.value)
const isComplete = computed(() => normalizedValue.value === PROGRESS_MAX)
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div v-if="hasLabel && !isInline" class="flex items-center justify-between gap-2">
      <span
        :data-cy="`${props.dataCy}-label`"
        :data-testid="`${props.dataTestid ?? props.dataCy}-label`"
        :class="cn('text-label-lg font-semibold text-main', props.labelClass)"
      >
        <slot name="label">{{ props.label }}</slot>
      </span>
      <span
        :data-cy="`${props.dataCy}-value`"
        :data-testid="`${props.dataTestid ?? props.dataCy}-value`"
        :class="cn('shrink-0 text-label-lg text-secondary', props.valueClass)"
      >
        <template v-if="isComplete">
          <slot name="icon">
            <i :class="progressCompletionIconClass[props.variant]" />
          </slot>
        </template>
        <template v-else>{{ progressText }}</template>
      </span>
    </div>
    <div :class="cn('w-full', hasLabel && !isInline ? 'mt-2' : '')">
      <div v-if="isInline" class="flex items-center gap-2">
        <span
          v-if="hasLabel"
          :data-cy="`${props.dataCy}-label`"
          :data-testid="`${props.dataTestid ?? props.dataCy}-label`"
          :class="cn('shrink-0 text-label-lg font-normal text-main', props.labelClass)"
        >
          <slot name="label">{{ props.label }}</slot>
        </span>
        <div class="min-w-0 flex-1">
          <ProgressRoot
            :model-value="normalizedValue"
            :max="PROGRESS_MAX"
            :disabled="props.disabled"
            :aria-label="props.ariaLabel"
            :aria-valuemin="PROGRESS_MIN"
            :aria-valuemax="PROGRESS_MAX"
            :aria-valuenow="normalizedValue"
            :aria-valuetext="progressText"
            :class="cn('relative w-full overflow-hidden rounded-full', props.disabled ? 'bg-disabled' : progressBarTrackBackgroundClass)"
            :style="{ height: props.size }"
            :data-cy="props.dataCy"
            :data-testid="props.dataTestid ?? props.dataCy"
          >
            <ProgressIndicator
              :data-cy="`${props.dataCy}-indicator`"
              :data-testid="`${props.dataTestid ?? props.dataCy}-indicator`"
              :style="indicatorStyle"
              :class="cn('relative h-full rounded-full transition-[width] duration-400 ease-in-out motion-reduce:duration-100', progressBarVariantBackgroundClass[props.variant])"
            >
              <Tooltip v-if="props.showTooltip" :open="true">
                <template #trigger>
                  <span :data-cy="`${props.dataCy}-tooltip-trigger`" :data-testid="`${props.dataTestid ?? props.dataCy}-tooltip-trigger`" class="absolute right-0 top-1/2 h-px w-px -translate-y-1/2" />
                </template>
                <TooltipContent :data-cy="`${props.dataCy}-tooltip`" :data-testid="`${props.dataTestid ?? props.dataCy}-tooltip`" variant="white">
                  <slot name="tooltip-content">{{ progressText }}</slot>
                </TooltipContent>
              </Tooltip>
            </ProgressIndicator>
          </ProgressRoot>
        </div>
        <span
          :data-cy="`${props.dataCy}-value`"
          :data-testid="`${props.dataTestid ?? props.dataCy}-value`"
          :class="cn('shrink-0 text-label-lg text-secondary', props.valueClass)"
        >
          <template v-if="isComplete">
            <slot name="icon"><i :class="progressCompletionIconClass[props.variant]" /></slot>
          </template>
          <template v-else>{{ progressText }}</template>
        </span>
      </div>
      <ProgressRoot
        v-else
        :model-value="normalizedValue"
        :max="PROGRESS_MAX"
        :disabled="props.disabled"
        :aria-label="props.ariaLabel"
        :aria-valuemin="PROGRESS_MIN"
        :aria-valuemax="PROGRESS_MAX"
        :aria-valuenow="normalizedValue"
        :aria-valuetext="progressText"
        :class="cn('relative w-full overflow-hidden rounded-full', props.disabled ? 'bg-disabled' : progressBarTrackBackgroundClass)"
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
              'relative h-full rounded-full transition-[width] duration-400 ease-in-out motion-reduce:duration-100',
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
    <div v-if="props.hint || slots.hint" class="mt-2">
      <span
        :data-cy="`${props.dataCy}-hint`"
        :data-testid="`${props.dataTestid ?? props.dataCy}-hint`"
        :class="cn('text-label-md text-secondary', props.hintClass)"
      >
        <slot name="hint">{{ props.hint }}</slot>
      </span>
    </div>
  </div>
</template>
