export { default as Calendar } from './Calendar.vue'
export { default as CalendarCell } from './CalendarCell.vue'
export { default as CalendarCellTrigger } from './CalendarCellTrigger.vue'
export { default as CalendarGrid } from './CalendarGrid.vue'
export { default as CalendarGridBody } from './CalendarGridBody.vue'
export { default as CalendarGridHead } from './CalendarGridHead.vue'
export { default as CalendarGridRow } from './CalendarGridRow.vue'
export { default as CalendarHeadCell } from './CalendarHeadCell.vue'
export { default as CalendarHeader } from './CalendarHeader.vue'
export { default as CalendarHeading } from './CalendarHeading.vue'
export { default as CalendarNextButton } from './CalendarNextButton.vue'
export { default as CalendarPrevButton } from './CalendarPrevButton.vue'

import { cva } from 'class-variance-authority'
import type { DateValue } from '@internationalized/date'

export const datePickerClasses = cva('', {
	variants: {
		readonly: {
			true: '!bg-transparent !text-neutral-100 !cursor-default',
		},
		important: {
			true: 'font-bold',
		},
	},
})

export function getMonthNames(locale: string): string[] {
	const months = []
	for (let i = 0; i < 12; i++) {
		months.push(
			new Date(2020, i, 1).toLocaleString(locale || 'id', { month: 'long' })
		)
	}
	return months
}

export function monthPagingFunction(date: DateValue, selectedMonth) {
	const currentMonth = date.month

	if (currentMonth === selectedMonth) {
		return date
	}

	return date.set({ month: selectedMonth })
}

export function getMonthName(monthYearStr) {
	return monthYearStr.split(' ')[0]
}

export function getStartYear(yearsRange: number[], currentYear: number) {
	if (yearsRange?.length) {
		return yearsRange[0]
	}

	return currentYear - 10
}

export function getEndYear(yearsRange: number[], currentYear: number) {
	if (yearsRange?.length > 1) {
		return yearsRange[1]
	}

	return currentYear + 2
}

export function getYears(startYear: number, endYear: number) {
	const result = []
	for (let i = startYear; i <= endYear; i++) {
		result.push(i)
	}

	return result
}

export function yearPagingFunction(date: DateValue, selectedYear) {
	const currentYear = date.year

	if (currentYear === selectedYear) {
		return date
	}

	if (currentYear < selectedYear) {
		return date.add({ years: selectedYear - currentYear })
	}

	return date.subtract({ years: currentYear - selectedYear })
}
