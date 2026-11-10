<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { CalendarDate, type DateValue } from '@internationalized/date'
import flatten from 'lodash/flatten'
import {
  YearPickerCell,
  YearPickerCellTrigger,
  YearPickerGrid,
  YearPickerGridBody,
  YearPickerGridRow,
  YearPickerHeader,
  YearPickerHeading,
  YearPickerNext,
  YearPickerPrev,
  YearPickerRoot,
  useForwardPropsEmits
} from 'reka-ui'


import type {
  YearPickerRootProps,
  YearPickerRootEmits
} from 'reka-ui'

import Button from '../button/Button.vue'

const DEFAULT_YEARS_PER_PAGE = 12

type YearPickerComponentEmit = {
	'select-year': [value: DateValue]
}

interface Props extends Omit<YearPickerRootProps, 'modelValue' | 'multiple'> {
  class?: HTMLAttributes['class']
  modelValue?: DateValue | null
}

const props = defineProps<Props>()

const emits = defineEmits<YearPickerRootEmits & YearPickerComponentEmit>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const defaultDate = computed(() => props.modelValue ?? undefined)
const fixedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder
  if (!props.minValue || !props.maxValue) return undefined

  const yearsInRange = props.maxValue.year - props.minValue.year + 1
  if (yearsInRange > DEFAULT_YEARS_PER_PAGE) return undefined

  const currentYear = new Date().getFullYear()
  const anchorYear = Math.min(Math.max(currentYear, props.minValue.year), props.maxValue.year)
  return new CalendarDate(anchorYear, 1, 1)
})
const canNavigate = computed(() => {
  if (!props.minValue || !props.maxValue) return true

  const yearsInRange = props.maxValue.year - props.minValue.year + 1
  return yearsInRange > DEFAULT_YEARS_PER_PAGE
})

function selectYear(year: DateValue) {
  if (props.minValue && year.year < props.minValue.year) return
  if (props.maxValue && year.year > props.maxValue.year) return
  emits('select-year', year)
}

// Saat disabled, tanpa `border-main` dan tanpa hover classes supaya `OUTLINED_DISABLED`
// yang mengendalikan penuh (border & teks konstan neutral-500, tidak ada feedback hover).
const arrowClassBase = 'min-w-7 w-7! h-7! p-0!'
const arrowClassEnabled = arrowClassBase + ' border-main hover:border-primary-main!'

function onSelectYear(event: Event, disabled: boolean) {
  if (!disabled) return
  event.stopPropagation()
  event.preventDefault()
}
</script>

<template>
  <YearPickerRoot v-slot="{ grid }" v-bind="forwarded" :default-value="defaultDate" :placeholder="fixedPlaceholder" class="tablet:w-96 rounded-sm text-label-lg">
    <YearPickerHeader class="flex justify-between p-2 tablet:p-5 border-b border-b-neutral-400">
      <YearPickerPrev v-slot="{ disabled }" as-child>
        <Button
          :disabled="disabled || !canNavigate"
          size="sm"
          outlined
          variant="primary"
          type="button"
          :class="disabled || !canNavigate ? arrowClassBase : arrowClassEnabled"
        >
          <i class="si-heroicon-outline-chevron-left text-label-lg"></i>
        </Button>
      </YearPickerPrev>
      <div class="flex gap-1 items-center">
        <YearPickerHeading />
      </div>
      <YearPickerNext v-slot="{ disabled }" as-child>
        <Button
          :disabled="disabled || !canNavigate"
          size="sm"
          outlined
          variant="primary"
          type="button"
          :class="disabled || !canNavigate ? arrowClassBase : arrowClassEnabled"
        >
          <i class="si-heroicon-outline-chevron-right text-label-lg"></i>
        </Button>
      </YearPickerNext>
    </YearPickerHeader>
    <YearPickerGrid>
      <YearPickerGridBody>
        <YearPickerGridRow class="grid grid-cols-3 gap-x-4 gap-y-3 w-fit p-5">
          <YearPickerCell
              v-for="(year, index) in flatten(grid.rows)"
              :key="`year-${index}`"
              :date="year"
              class="relative text-center"
          >
            <YearPickerCellTrigger
              :year="year"
               class="rounded-sm hover:cursor-pointer hover:bg-primary-subtle hover:text-primary-default data-selected:bg-primary-default data-selected:text-neutral-50 data-disabled:text-disabled data-disabled:cursor-not-allowed"
              @click.stop="selectYear(year)"
            >
              <template #default="{ yearValue, disabled }">
                <div @click="onSelectYear($event, disabled)">
                  <slot :date="year" :monthValue="yearValue">
                    <div class="py-3 px-8 cursor-pointer">
                      {{ yearValue }}
                    </div>
                  </slot>
                </div>
              </template>
            </YearPickerCellTrigger>
          </YearPickerCell>
        </YearPickerGridRow>
      </YearPickerGridBody>
    </YearPickerGrid>
  </YearPickerRoot>
</template>
