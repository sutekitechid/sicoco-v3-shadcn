<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	RangeCalendarRoot,
	type RangeCalendarRootEmits,
	type RangeCalendarRootProps,
	useForwardPropsEmits,
} from 'radix-vue'
import { computed, useSlots, provide, type HTMLAttributes } from 'vue'
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
import { getColorDate, getTooltipDate } from '../../utils/date-picker'

import { ImportantDate } from '../../utils/date-picker-types'
import { type PageChangeEmits } from '../calendar'

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

const props = withDefaults(
	defineProps<
		RangeCalendarRootProps & { class?: HTMLAttributes['class'] } & {
			importantDates?: ImportantDate[]
			yearsRange?: number[]
			dataCy?: string
		}
	>(),
	{
		locale: 'id',
	}
)

const emits = defineEmits<RangeCalendarRootEmits & PageChangeEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const slots = useSlots()

const calendarContext = {
	props: delegatedProps.value,
}

provide('RangeCalendarContext', calendarContext)
</script>

<template>
	<RangeCalendarRoot
		v-slot="{ grid, weekDays }"
		:class="cn('p-3', props.class)"
		v-bind="forwarded"
	>
		<RangeCalendarHeader>
			<RangeCalendarPrevButton />
			<RangeCalendarHeading />
			<RangeCalendarNextButton />
		</RangeCalendarHeader>

		<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
			<RangeCalendarGrid v-for="month in grid" :key="month.value.toString()">
				<RangeCalendarGridHead>
					<RangeCalendarGridRow>
						<RangeCalendarHeadCell v-for="day in weekDays" :key="day">
							{{ day }}
						</RangeCalendarHeadCell>
					</RangeCalendarGridRow>
				</RangeCalendarGridHead>
				<RangeCalendarGridBody>
					<RangeCalendarGridRow
						v-for="(weekDates, index) in month.rows"
						:key="`weekDate-${index}`"
						class="mt-2 w-full"
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
							/>
						</RangeCalendarCell>
					</RangeCalendarGridRow>
				</RangeCalendarGridBody>
			</RangeCalendarGrid>
		</div>
	</RangeCalendarRoot>
</template>
