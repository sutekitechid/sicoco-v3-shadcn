<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarRoot,
    CalendarPrev,
	type CalendarRootEmits,
	type CalendarRootProps,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, useSlots, provide, ref, type HTMLAttributes } from 'vue'
import { type DateValue } from '@internationalized/date'
import {
	CalendarCell,
	CalendarCellTrigger,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHead,
	CalendarGridRow,
	CalendarHeadCell,
	CalendarHeader,
	CalendarNextButton,
	CalendarPrevButton,
    formatDate,
	type PageChangeEmits,
} from '.'

import { getColorDate, getTooltipDate, datePagingFunction } from '../../utils/date-picker'

import { ImportantDate } from '../../utils/date-picker-types'

import Monthpicker from '../monthpicker/Monthpicker.vue'

/**
 * Calendar component for displaying a monthly calendar view with day selection.
 *
 * This component supports single date selection and highlighting of important dates.
 *
 * @example
 * <!-- Single Date Picker -->
 * <Calendar
 * 	v-model="selectedDate"
 * 	placeholder="Select a date"
 * 	:importantDates="importantDates"
 * />
 *
 * @props {string} class - Additional custom CSS classes.
 * @props {ImportantDate[]} [importantDates] - Array of important dates to highlight on the calendar.
 * @props {Date | null} modelValue - The currently selected date when not in range mode.
 * @props {boolean} [dateRange] - Indicates whether the calendar supports selecting a range of dates.
 *
 * @emits {Date | null} update:modelValue - Emitted when the selected date changes in single date mode.
 *
 */

const PICKER_MODE_ENUM = {
    DATE: 'date',
    MONTH: 'month'
}

const props = withDefaults(
	defineProps<
		CalendarRootProps & { class?: HTMLAttributes['class'] } & {
			importantDates?: ImportantDate[]
			showOutsideViewDates?: boolean
		} & {
			readonly?: boolean
			yearsRange?: number[]
			locale?: string
			dataCy?: string
			dataTestid?: string
		}
	>(),
	{
		locale: 'id',
		showOutsideViewDates: true,
	}
)

const emits = defineEmits<CalendarRootEmits & PageChangeEmits>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const slots = useSlots()

const calendarContext = {
	props: delegatedProps.value,
}

const pickerMode = ref(PICKER_MODE_ENUM.DATE)

provide('CalendarContext', calendarContext)

const selectedCalendarPlaceholderDate = ref()
</script>

<template>
	<CalendarRoot
		v-slot="{ grid, weekDays, date }"
		:class="cn('w-fit tablet:w-full', props.class)"
		v-bind="forwarded"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
        :week-starts-on="1"
        weekday-format="short"
	>
        <div v-if="pickerMode === PICKER_MODE_ENUM.DATE" class="w-fit tablet:w-full">
            <CalendarHeader
                class="border-b border-main flex items-center justify-between w-full gap-2 p-2 tablet:p-5"
            >
                <slot name="header" />
                <template v-if="!slots.header?.()">
                    <CalendarPrevButton />
                    <div
                        class="flex tablet:gap-1 items-center cursor-pointer"
                        @click.stop="pickerMode = PICKER_MODE_ENUM.MONTH"
                    >
                        {{ formatDate(date, props.locale) }}
                        <i class="si-heroicon-outline-chevron-down"></i>
                    </div>
                    <CalendarNextButton />
                </template>
            </CalendarHeader>
    
            <div class="flex flex-col gap-y-4 sm:flex-row sm:gap-y-0 p-2 tablet:p-5">
                <CalendarGrid v-for="month in grid" :key="month.value.toString()">
                    <CalendarGridHead>
                        <CalendarGridRow class="flex">
                            <CalendarHeadCell v-for="day in weekDays" :key="day" class="text-label-lg mx-auto">
                                {{ day }}
                            </CalendarHeadCell>
                        </CalendarGridRow>
                    </CalendarGridHead>
                    <CalendarGridBody>
                        <CalendarGridRow
                            v-for="(weekDates, index) in month.rows"
                            :key="`weekDate-${index}`"
                            class="w-full"
                        >
                            <CalendarCell
                                v-for="weekDate in weekDates"
                                :key="weekDate.toString()"
                                :date="weekDate"
                                :readonly="props.readonly"
                            >
                                <CalendarCellTrigger
                                    :day="weekDate"
                                    :month="month.value"
                                    :color="getColorDate(props.importantDates, weekDate)"
                                    :tooltip="getTooltipDate(props.importantDates, weekDate)"
                                    :readonly="props.readonly"
                                    class="text-label-lg p-3"
                                />
                            </CalendarCell>
                        </CalendarGridRow>
                    </CalendarGridBody>
                </CalendarGrid>
            </div>
        </div>
        <CalendarHeader v-else>
            <Monthpicker
                :model-value="selectedCalendarPlaceholderDate || date"
                :locale="props.locale"
                @update:model-value="selectedCalendarPlaceholderDate = $event"
                @month-change="pickerMode = PICKER_MODE_ENUM.DATE"
            >
                <template #default="{ date: destDate, monthValue }">
                    <CalendarPrev
                        :prev-page="(date: DateValue) => datePagingFunction(date, destDate)"
                        class="px-9 py-3"
                    >
                        {{ monthValue }}
                    </CalendarPrev>
                </template>
            </Monthpicker>
        </CalendarHeader>
	</CalendarRoot>
</template>
