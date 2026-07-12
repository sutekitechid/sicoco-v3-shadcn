<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue'
import { today, getLocalTimeZone } from '@internationalized/date'
import flatten from 'lodash/flatten'
import {
  MonthPickerCell,
  MonthPickerCellTrigger,
  MonthPickerGrid,
  MonthPickerGridBody,
  MonthPickerGridRow,
  MonthPickerHeader,
  MonthPickerHeading,
  MonthPickerNext,
  MonthPickerPrev,
  MonthPickerRoot,
  useForwardPropsEmits
} from 'reka-ui'

import type {
  MonthPickerRootProps,
  MonthPickerRootEmits
} from 'reka-ui'

import Button from '../button/Button.vue'

type MonthPickerComponentEmit = {
	'year-click': [event: Event]
  'month-change': [event: number]
}

const props = defineProps<
  MonthPickerRootProps & { class?: HTMLAttributes['class'] }
>()

const emits = defineEmits<MonthPickerRootEmits & MonthPickerComponentEmit>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const defaultDate = computed(() => {
  return props.modelValue || today(getLocalTimeZone())
})

function onSelectMonth(event: Event, disabled: boolean) {
  if (disabled) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <MonthPickerRoot v-bind="forwarded" v-slot="{ grid }" :default-value="defaultDate" class="w-96 rounded text-label-lg">
    <MonthPickerHeader class="flex justify-between p-5 border-b-1 border-b-neutral-400">
      <Button as-child size="sm" outlined variant="neutral">
        <MonthPickerPrev>
          <i class="si-heroicon-outline-chevron-left"></i>
        </MonthPickerPrev>
      </Button>
      <div class="flex gap-1 items-center cursor-pointer" @click.stop="emits('year-click', $event)">
        <MonthPickerHeading />
        <i class="si-heroicon-outline-chevron-down"></i>
      </div>
      <Button as-child size="sm" outlined variant="neutral">
        <MonthPickerNext>
          <i class="si-heroicon-outline-chevron-right"></i>
        </MonthPickerNext>
      </Button>
    </MonthPickerHeader>
    <MonthPickerGrid>
      <MonthPickerGridBody>
        <MonthPickerGridRow class="grid grid-cols-3 gap-x-4 gap-y-3 w-fit p-5">
          <MonthPickerCell
              v-for="(month, index) in flatten(grid.rows)"
              :key="`month-${index}`"
              :date="month"
              class="relative text-center"
          >
            <div @click.stop="emits('month-change', month)">
              <MonthPickerCellTrigger
                :month="month"
                class="rounded hover:bg-primary-50 hover:text-primary-500 data-[selected]:bg-primary-500 data-[selected]:text-neutral-50 data-[disabled]:text-disabled data-[disabled]:cursor-not-allowed"
              >
                <template #default="{ monthValue, disabled }">
                  <div @click="onSelectMonth($event, disabled)">
                    <slot :date="month" :monthValue="monthValue">
                      <div class="px-9 py-3">
                        {{ monthValue }}
                      </div>
                    </slot>
                  </div>
                </template>
              </MonthPickerCellTrigger>
            </div>
          </MonthPickerCell>
        </MonthPickerGridRow>
      </MonthPickerGridBody>
    </MonthPickerGrid>
  </MonthPickerRoot>
</template>