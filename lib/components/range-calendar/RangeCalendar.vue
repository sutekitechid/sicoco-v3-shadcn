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
import { getColorDate, getTooltipDate, datePagingFunction } from '../../utils/date-picker'

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

const pickerModeLeft = ref(PICKER_MODE_ENUM.DATE)
const pickerModeRight = ref(PICKER_MODE_ENUM.DATE)

const selectedLeftCalendarPlaceholderDate = ref()
const selectedRightCalendarPlaceholderDate = ref()

const numberOfMonths = computed(() => {
	if (!selectedLeftCalendarPlaceholderDate.value || !selectedRightCalendarPlaceholderDate.value) {
		return props.numberOfMonths
	}

	const result =
		(selectedRightCalendarPlaceholderDate.value.year - selectedLeftCalendarPlaceholderDate.value.year) * 12 +
		(selectedRightCalendarPlaceholderDate.value.month - selectedLeftCalendarPlaceholderDate.value.month) + 1
	
	emits('update:number-of-months', result)

	return result
})

function isCalendarVisible(index: number) {
	if (index === 0 && pickerModeLeft.value === PICKER_MODE_ENUM.DATE) {
		return true
	}

	return index > 0 && pickerModeRight.value === PICKER_MODE_ENUM.DATE
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
		:class="cn(props.class)"
		v-bind="forwarded"
        :week-starts-on="1"
		:number-of-months="numberOfMonths"
        weekday-format="short"
		class="relative"
	>
		<Monthpicker
			v-if="pickerModeLeft === PICKER_MODE_ENUM.MONTH"
			:model-value="selectedLeftCalendarPlaceholderDate || date"
			:locale="props.locale"
			:is-month-disabled="isLeftMonthDisabled"
			:is-year-disabled="isLeftYearDisabled"
			class="absolute top-0 left-0 z-10 bg-neutral-50"
			@update:placeholder="selectedLeftCalendarPlaceholderDate = $event"
			@update:model-value="selectedLeftCalendarPlaceholderDate = $event"
			@month-change="pickerModeLeft = PICKER_MODE_ENUM.DATE"
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
			v-if="pickerModeRight === PICKER_MODE_ENUM.MONTH"
			:model-value="selectedRightCalendarPlaceholderDate"
			:locale="props.locale"
			:is-month-disabled="isRightMonthDisabled"
			:is-year-disabled="isRightYearDisabled"
			class="absolute top-0 right-0 z-10 bg-neutral-50"
			@update:placeholder="selectedRightCalendarPlaceholderDate = $event"
			@update:model-value="selectedRightCalendarPlaceholderDate = $event"
			@month-change="pickerModeRight = PICKER_MODE_ENUM.DATE"
		>
			<template #default="{ monthValue }">
				<div class="px-9 py-3">
					{{ monthValue }}
				</div>
			</template>
		</Monthpicker>
		<div class="border-b border-main grid grid-cols-2 p-2 tablet:p-5">
			<RangeCalendarHeader>
				<RangeCalendarPrevButton />
				<RangeCalendarHeading
					class="mx-auto cursor-pointer"
					@click="pickerModeLeft = PICKER_MODE_ENUM.MONTH"
				>
					<template #default="{ headingValue }">
						<div class="flex gap-1 items-center">
							{{ monthRangeLabels(headingValue)[0] }}
							<i class="si-heroicon-outline-chevron-down"></i>
						</div>
					</template>
				</RangeCalendarHeading>
				{{ initializePlaceholderDate(date) }}
			</RangeCalendarHeader>
			
			<div class="ml-auto w-full">
				<RangeCalendarHeader class="justify-end">
					<RangeCalendarHeading
						class="mx-auto cursor-pointer"
						@click="pickerModeRight = PICKER_MODE_ENUM.MONTH"
					>
						<template #default="{ headingValue }">
							<div class="flex gap-1 items-center">
								{{ monthRangeLabels(headingValue)[1] }}
								<i class="si-heroicon-outline-chevron-down"></i>
							</div>
						</template>
					</RangeCalendarHeading>
					<RangeCalendarNextButton />
				</RangeCalendarHeader>
			</div>
		</div>

		<div class="flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0 p-2 tablet:p-5 w-fit tablet:w-[48rem]">
			<template v-for="(month, index) in grid" :key="month.value.toString()">
				<!-- Show only the first and the last calendar -->
				<RangeCalendarGrid
					v-if="index === 0 || index === grid.length - 1"
					:class="[{ invisible: !isCalendarVisible(index) }, 'w-fit table:w-[22.25rem]']"
				>
					<RangeCalendarGridHead>
						<RangeCalendarGridRow>
							<RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="font-medium">
								{{ day }}
							</RangeCalendarHeadCell>
						</RangeCalendarGridRow>
					</RangeCalendarGridHead>
					<RangeCalendarGridBody class="w-fit tablet:w-96">
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
									class="p-3 h-full"
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
table {
	@apply w-96;
}
</style>
