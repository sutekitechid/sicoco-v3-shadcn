<script lang="ts" setup>
import {
	RangeCalendarRoot,
	RangeCalendarPrev,
	type RangeCalendarRootEmits,
	type RangeCalendarRootProps,
	useForwardPropsEmits,
} from 'reka-ui'

import { computed, provide, ref, type HTMLAttributes } from 'vue'

import { DateValue } from '@internationalized/date'

import {
	RangeCalendarCell,
	RangeCalendarCellTrigger,
	RangeCalendarGrid,
	RangeCalendarGridBody,
	RangeCalendarGridHead,
	RangeCalendarGridRow,
	RangeCalendarHeadCell,
	RangeCalendarHeader,
	RangeCalendarNextButton,
	RangeCalendarPrevButton,
	RangeCalendarHeading,
} from '.'

import { cn } from '../../utils/tw-merge'
import {
	getColorDate,
	getTooltipDate,
	datePagingFunction,
} from '../../utils/date-picker'

import { ImportantDate } from '../../utils/date-picker-types'
import { type PageChangeEmits } from '../calendar'

import Monthpicker from '../monthpicker/Monthpicker.vue'

/**
 * Calendar component for displaying a monthly calendar view with day selection.
 *
 * This component supports single date selection and highlighting of important dates.
 *
 * @example
 * <!-- Single Date Picker -->
 * <RangeCalendar
 * 	v-model="selectedDate"
 * 	placeholder="Select some date"
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

type MonthPickerMode = 'month' | 'year'

type NumberOfMonthsEmit = {
	'update:number-of-months': [value: number]
}

const props = withDefaults(
	defineProps<
		RangeCalendarRootProps & { class?: HTMLAttributes['class'] } & {
			importantDates?: ImportantDate[]
			yearsRange?: number[]
			dataCy?: string
			dataTestid?: string
		}
	>(),
	{
		locale: 'id',
	}
)

const emits = defineEmits<RangeCalendarRootEmits & PageChangeEmits & NumberOfMonthsEmit>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const pickerMode = ref(PICKER_MODE_ENUM.DATE)
const monthPickerMode = ref<MonthPickerMode>('month')

const selectedLeftCalendarPlaceholderDate = ref()
const selectedRightCalendarPlaceholderDate = ref()

const numberOfMonths = computed(() => props.numberOfMonths ?? 2)

const isSingleMonth = computed(() => numberOfMonths.value === 1)

function isCalendarVisible() {
	return pickerMode.value === PICKER_MODE_ENUM.DATE
}

function initializePlaceholderDate(date: DateValue) {
	if (!selectedLeftCalendarPlaceholderDate.value) {
		selectedLeftCalendarPlaceholderDate.value = date
	}
	if (!selectedRightCalendarPlaceholderDate.value) {
		if (!props.numberOfMonths) return
		selectedRightCalendarPlaceholderDate.value = selectedLeftCalendarPlaceholderDate.value.add({ months: props.numberOfMonths - 1 })
	}
}

function monthRangeLabels(value: string) {
	const parts = value.split(/\s*-\s*/)

	// Bukan rentang
	if (parts.length === 1) {
		return [parts[0], parts[0]]
	}

	if (parts.length !== 2) {
		throw new Error('Format rentang bulan tidak valid')
	}

	const [start, end] = parts

	// Jika bagian awal belum memiliki tahun, gunakan tahun dari bagian akhir
	if (!/\d{4}$/.test(start)) {
		const year = end.match(/\d{4}$/)?.[0]

		if (!year) {
			throw new Error('Tahun tidak ditemukan')
		}

		return [`${start} ${year}`, end]
	}

	return [start, end]
}

function isLeftMonthDisabled(date: DateValue) {
	if (!selectedRightCalendarPlaceholderDate.value) return false
	return date.compare(selectedRightCalendarPlaceholderDate.value) > 0
}

function isLeftYearDisabled(date: DateValue) {
    if (!selectedRightCalendarPlaceholderDate.value) return false
    return date.compare(selectedRightCalendarPlaceholderDate.value) > 0
}

function isRightMonthDisabled(date: DateValue) {
	if (!selectedLeftCalendarPlaceholderDate.value) return false
	return date.compare(selectedLeftCalendarPlaceholderDate.value) <= 0
}

function isRightYearDisabled(date: DateValue) {
    if (!selectedLeftCalendarPlaceholderDate.value) return false
	return date.year < selectedLeftCalendarPlaceholderDate.value.year
}

const calendarContext = {
	props: delegatedProps.value,
}

provide('RangeCalendarContext', calendarContext)
</script>

<template>
	<RangeCalendarRoot
		v-slot="{ grid, weekDays, date }"
		:class="cn('w-full max-w-full tablet:w-fit', props.class)"
		v-bind="forwarded"
        :week-starts-on="1"
		:number-of-months="numberOfMonths"
        weekday-format="short"
		class="relative overflow-x-hidden"
	>
		<Monthpicker
			v-if="pickerMode === PICKER_MODE_ENUM.MONTH && !isSingleMonth"
			v-model:picker-mode="monthPickerMode"
			:model-value="selectedLeftCalendarPlaceholderDate || date"
			:locale="props.locale"
			:is-month-disabled="isLeftMonthDisabled"
			:is-year-disabled="isLeftYearDisabled"
			class="absolute top-0 left-0 z-10 bg-neutral-50"
			@update:model-value="selectedLeftCalendarPlaceholderDate = $event"
			@month-change="pickerMode = PICKER_MODE_ENUM.DATE"
		>
			<template #default="{ date: destDate, monthValue }">
				<RangeCalendarPrev
					:prev-page="(date: DateValue) => datePagingFunction(date, destDate)"
					class="px-9 py-3"
				>
					{{ monthValue }}
				</RangeCalendarPrev>
			</template>
		</Monthpicker>
		<Monthpicker
			v-if="pickerMode === PICKER_MODE_ENUM.MONTH"
			v-model:picker-mode="monthPickerMode"
			:model-value="selectedRightCalendarPlaceholderDate"
			:locale="props.locale"
			:is-month-disabled="isRightMonthDisabled"
			:is-year-disabled="isRightYearDisabled"
			class="absolute top-0 right-0 z-10 bg-neutral-50"
			@update:model-value="selectedRightCalendarPlaceholderDate = $event"
			@month-change="pickerMode = PICKER_MODE_ENUM.DATE"
		>
			<template #default="{ monthValue }">
				<div class="px-9 py-3">
					{{ monthValue }}
				</div>
			</template>
		</Monthpicker>
		<div :class="cn('border-b border-main p-5', isSingleMonth ? '' : 'grid grid-cols-2')">
			<RangeCalendarHeader>
				<div class="flex gap-1">
					<RangeCalendarPrevButton :months="-12" icon="si-heroicon-solid-chevron-double-left" />
					<RangeCalendarPrevButton />
				</div>
				<RangeCalendarHeading
					class="mx-auto cursor-pointer"
					@click="pickerMode = PICKER_MODE_ENUM.MONTH"
				>
					<template #default="{ headingValue }">
						<div class="flex gap-1 items-center">
							{{ monthRangeLabels(headingValue)[0] }}
							<i class="si-heroicon-outline-chevron-down"></i>
						</div>
					</template>
				</RangeCalendarHeading>
				{{ initializePlaceholderDate(date) }}
				<div v-if="isSingleMonth" class="flex gap-1">
					<RangeCalendarNextButton />
					<RangeCalendarNextButton :months="12" icon="si-heroicon-solid-chevron-double-right" />
				</div>
			</RangeCalendarHeader>
			
			<div v-if="!isSingleMonth" class="ml-auto w-full">
				<RangeCalendarHeader class="justify-end">
					<RangeCalendarHeading
						class="mx-auto cursor-pointer"
						@click="pickerMode = PICKER_MODE_ENUM.MONTH"
					>
						<template #default="{ headingValue }">
							<div class="flex gap-1 items-center">
								{{ monthRangeLabels(headingValue)[1] }}
								<i class="si-heroicon-outline-chevron-down"></i>
							</div>
						</template>
					</RangeCalendarHeading>
					<div class="flex gap-1">
						<RangeCalendarNextButton />
						<RangeCalendarNextButton :months="12" icon="si-heroicon-solid-chevron-double-right" />
					</div>
				</RangeCalendarHeader>
			</div>
		</div>

		<div :class="cn('calendar-grid-container flex w-full max-w-full flex-col gap-y-4 p-5 tablet:w-fit tablet:flex-row tablet:gap-x-4 tablet:gap-y-0', isSingleMonth ? '' : 'tablet:w-[48rem]')">
			<template v-for="(month, index) in grid" :key="month.value.toString()">
				<!-- Show only the first and the last calendar -->
				<RangeCalendarGrid
				v-if="isSingleMonth ? index === 0 : index === 0 || index === grid.length - 1"
					:class="[{ invisible: !isCalendarVisible() }, 'w-full table-fixed tablet:w-fit tablet:table-auto']"
				>
					<RangeCalendarGridHead>
						<RangeCalendarGridRow>
							<RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="font-medium">
								{{ day }}
							</RangeCalendarHeadCell>
						</RangeCalendarGridRow>
					</RangeCalendarGridHead>
					<RangeCalendarGridBody class="w-full tablet:w-96">
						<RangeCalendarGridRow
							v-for="(weekDates, index) in month.rows"
							:key="`weekDate-${index}`"
							class="w-full"
						>
							<RangeCalendarCell
								v-for="weekDate in weekDates"
								:key="weekDate.toString()"
								:date="weekDate"
							>
								<RangeCalendarCellTrigger
									:day="weekDate"
									:month="month.value"
									:color="getColorDate(props.importantDates, weekDate)"
									:tooltip="getTooltipDate(props.importantDates, weekDate)"
									class="p-3"
								/>
							</RangeCalendarCell>
						</RangeCalendarGridRow>
					</RangeCalendarGridBody>
				</RangeCalendarGrid>
			</template>
		</div>
	</RangeCalendarRoot>
</template>

<style scoped>
	@reference "../../config/tailwind.css";

	table {
		@apply w-full table-fixed tablet:w-96 tablet:table-auto;
	}
</style>
