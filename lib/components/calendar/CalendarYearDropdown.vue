<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { CalendarPrev, CalendarHeading } from 'reka-ui'
import type { DateValue } from '@internationalized/date'
import {
	getStartYear,
	getEndYear,
	getYears,
	parseYearFromMonthYearString,
	yearPagingFunction,
	generateDataCy,
} from '.'
import DropdownChevron from '../dropdown/DropdownChevron.vue'

const calendarContext = inject('CalendarContext', null)

const currentYear = computed(() => {
	return new Date().getFullYear()
})

const years = computed(() => {
	const startYear = getStartYear(
		calendarContext.props.yearsRange,
		currentYear.value
	)
	const endYear = getEndYear(
		calendarContext.props.yearsRange,
		currentYear.value
	)
	return getYears(startYear, endYear)
})

const selectedYear = ref<number>(currentYear.value)
function setYear(monthYearStr: string) {
	selectedYear.value = Number(parseYearFromMonthYearString(monthYearStr))
}

const yearDropdownDataCy = computed(() => {
	return generateDataCy(
		calendarContext?.props?.dataCy,
		'calendar-year-dropdown'
	)
})

const yearDropdownDataTestid = computed(() => {
	return generateDataCy(
		calendarContext?.props?.dataTestid ?? calendarContext?.props?.dataCy,
		'calendar-year-dropdown'
	)
})

const emits = defineEmits()

watch(selectedYear, () => {
	emits('year-change', selectedYear.value)
})
</script>

<template>
	<Dropdown :model-value="selectedYear" :data-cy="yearDropdownDataCy" :data-testid="yearDropdownDataTestid">
		<template #trigger="{ open }">
			<div
				class="inline-flex items-center w-full h-8 border-[1px] border-main justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-xs transition duration-150 ease-in-out focus:border-primary-200 focus:ring-2 focus:ring-primary-50 bg-transparent dark:bg-neutral-100 hover:bg-neutral-100"
			>
				<CalendarHeading v-slot="{ headingValue }">
					{{ parseYearFromMonthYearString(headingValue) }}
					{{ setYear(headingValue) }}
				</CalendarHeading>

				<DropdownChevron :open="open" />
			</div>
		</template>
		<DropdownItem
			v-for="year in years"
			:key="year"
			:value="year"
			:data-cy="`${yearDropdownDataCy}-item-${year}`"
			:data-testid="`${yearDropdownDataTestid}-item-${year}`"
			class="calendar-year-dropdown__item p-0"
		>
			<CalendarPrev
				:prev-page="(date: DateValue) => yearPagingFunction(date, year)"
				class="py-2 w-full"
			>
				{{ year }}
			</CalendarPrev>
		</DropdownItem>
	</Dropdown>
</template>

<style>
	@reference "../../config/tailwind.css";

.calendar-year-dropdown__item div {
	@apply !p-0;
}
</style>
