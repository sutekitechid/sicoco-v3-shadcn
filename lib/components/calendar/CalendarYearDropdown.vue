<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { CalendarPrev, CalendarHeading } from 'radix-vue'
import type { DateValue } from '@internationalized/date'

const calendarContext = inject('CalendarContext', null)

const currentYear = computed(() => {
	return new Date().getFullYear()
})

const startYear = computed(() => {
	const yearsRange = calendarContext.props.yearsRange
	if (yearsRange && yearsRange.length) {
		return yearsRange[0]
	}

	return currentYear.value - 10
})

const endYear = computed(() => {
	const yearsRange = calendarContext.props.yearRange
	if (yearsRange && yearsRange.length > 1) {
		return yearsRange[1]
	}

	return currentYear.value + 2
})

const years = computed(() => {
	const result = []
	for (let i = startYear.value; i <= endYear.value; i++) {
		result.push(i)
	}

	return result
})

function pagingFunction(date: DateValue, selectedYear) {
	const currentYear = date.year

	if (currentYear === selectedYear) {
		return date
	}

	if (currentYear < selectedYear) {
		return date.add({ years: selectedYear - currentYear })
	}

	return date.subtract({ years: currentYear - selectedYear })
}

function getYear(monthYearStr) {
	return monthYearStr.split(' ')[1]
}

const selectedYear = ref(currentYear.value)
function setYear(monthYearStr) {
	selectedYear.value = Number(getYear(monthYearStr))
}
</script>

<template>
	<Dropdown :model-value="selectedYear">
		<template #trigger="{ open }">
			<div
				class="inline-flex items-center w-full h-8 border-[1px] border-neutral-30 justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-3 bg-transparent dark:bg-neutral-10 hover:bg-neutral-10"
			>
				<CalendarHeading v-slot="{ headingValue }">
					{{ getYear(headingValue) }}
					{{ setYear(headingValue) }}
				</CalendarHeading>

				<div
					class="w-6 h-6 flex items-center justify-center"
					:class="open ? 'rotate-180' : ''"
				>
					<i class="si-chevron-down text-neutral-100" />
				</div>
			</div>
		</template>
		<DropdownItem
			v-for="year in years"
			:key="year"
			:value="year"
			class="calendar-year-dropdown__item p-0"
		>
			<CalendarPrev
				:prev-page="(date: DateValue) => pagingFunction(date, year)"
				class="py-2 w-full"
			>
				{{ year }}
			</CalendarPrev>
		</DropdownItem>
	</Dropdown>
</template>

<style>
.calendar-year-dropdown__item div {
	@apply !p-0;
}
</style>
