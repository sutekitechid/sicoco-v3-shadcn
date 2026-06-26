<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarRoot,
	type CalendarRootEmits,
	type CalendarRootProps,
	useForwardPropsEmits,
} from 'reka-ui'
import { computed, useSlots, provide, type HTMLAttributes } from 'vue'
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
	type PageChangeEmits,
} from '.'

import { getColorDate, getTooltipDate } from '../../utils/date-picker'

import { ImportantDate } from '../../utils/date-picker-types'

import CalendarMonthDropdown from './CalendarMonthDropdown.vue'
import CalendarYearDropdown from './CalendarYearDropdown.vue'

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

provide('CalendarContext', calendarContext)
</script>

<template>
	<CalendarRoot
		v-slot="{ grid, weekDays }"
		:class="cn('p-3', props.class)"
		v-bind="forwarded"
		:data-cy="props.dataCy"
	>
		<CalendarHeader
			class="border-b border-neutral-400 pb-4 flex items-center justify-between w-full gap-2"
		>
			<slot name="header" />
			<template v-if="!slots.header?.()">
				<CalendarPrevButton />
				<CalendarMonthDropdown @month-change="emits('month-change', $event)" />
				<CalendarYearDropdown @year-change="emits('year-change', $event)" />
				<CalendarNextButton />
			</template>
		</CalendarHeader>

		<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
			<CalendarGrid v-for="month in grid" :key="month.value.toString()">
				<CalendarGridHead>
					<CalendarGridRow>
						<CalendarHeadCell v-for="day in weekDays" :key="day">
							{{ day }}
						</CalendarHeadCell>
					</CalendarGridRow>
				</CalendarGridHead>
				<CalendarGridBody>
					<CalendarGridRow
						v-for="(weekDates, index) in month.rows"
						:key="`weekDate-${index}`"
						class="mt-2 w-full"
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
							/>
						</CalendarCell>
					</CalendarGridRow>
				</CalendarGridBody>
			</CalendarGrid>
		</div>
	</CalendarRoot>
</template>
