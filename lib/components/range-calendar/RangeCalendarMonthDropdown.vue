<script lang="ts" setup>
import { inject, computed, ref } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { RangeCalendarPrev, RangeCalendarHeading } from 'radix-vue'
import type { DateValue } from '@internationalized/date'

const calendarContext = inject('RangeCalendarContext', null)

const locale = computed(() => {
	return calendarContext.props.locale
})

const monthNames = computed(() => {
	const result = []
	for (let i = 1; i <= 12; i++) {
		const objDate = new Date()
		objDate.setDate(1)
		objDate.setMonth(i - 1)

		const month = objDate.toLocaleString(locale.value, { month: 'long' })
		result.push(month)
	}

	return result
})

const pagingFunction = (date: DateValue, selectedMonth) => {
	const currentMonth = date.month

	if (currentMonth === selectedMonth) {
		return date
	}

	return date.set({ month: selectedMonth })
}

const getMonthName = monthYearStr => {
	return monthYearStr.split(' ')[0]
}

const selectedMonth = ref()
function setMonth(monthYearStr) {
	const monthName = getMonthName(monthYearStr)
	const monthIndex = monthNames.value.indexOf(monthName)
	selectedMonth.value = monthIndex + 1
}
</script>

<template>
	<Dropdown :model-value="selectedMonth">
		<template #trigger="{ open }">
			<div
				class="flex items-center w-28 h-8 border-[1px] border-neutral-30 justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-3 bg-transparent dark:bg-neutral-10 hover:bg-neutral-10"
			>
				<RangeCalendarHeading v-slot="{ headingValue }">
					{{ getMonthName(headingValue) }}
					{{ setMonth(headingValue) }}
				</RangeCalendarHeading>

				<div
					class="w-6 h-6 flex items-center justify-center"
					:class="open ? 'rotate-180' : ''"
				>
					<i class="si-chevron-down text-neutral-100" />
				</div>
			</div>
		</template>
		<DropdownItem
			v-for="(month, index) in monthNames"
			:key="index"
			:value="index + 1"
			class="range-calendar-month-dropdown__item p-0"
		>
			<RangeCalendarPrev
				:prev-page="(date: DateValue) => pagingFunction(date, index + 1)"
				class="py-2 w-full"
			>
				{{ month }}
			</RangeCalendarPrev>
		</DropdownItem>
	</Dropdown>
</template>

<style>
.range-calendar-month-dropdown__item div {
	@apply !p-0;
}
</style>
