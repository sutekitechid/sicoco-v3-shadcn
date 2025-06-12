<script lang="ts" setup>
import { computed, inject, ref, watch } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { CalendarPrev, CalendarHeading } from 'radix-vue'
import type { DateValue } from '@internationalized/date'
import {
	getStartYear,
	getEndYear,
	getYears,
	parseYearFromMonthYearString,
	yearPagingFunction,
	generateDataCy,
} from '.'

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

const emits = defineEmits()

watch(selectedYear, () => {
	emits('year-change', selectedYear.value)
})
</script>

<template>
	<Dropdown :model-value="selectedYear" :data-cy="yearDropdownDataCy">
		<template #trigger="{ open }">
			<div
				class="inline-flex items-center w-full h-8 border-[1px] border-neutral-30 justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-3 bg-transparent dark:bg-neutral-10 hover:bg-neutral-10"
			>
				<CalendarHeading v-slot="{ headingValue }">
					{{ parseYearFromMonthYearString(headingValue) }}
					{{ setYear(headingValue) }}
				</CalendarHeading>

				<div
					:class="[
						'w-6 h-6 flex items-center justify-center transition-transform duration-200',
						open ? 'rotate-180' : 'rotate-0',
					]"
				>
					<i class="si-chevron-down text-neutral-100" />
				</div>
			</div>
		</template>
		<DropdownItem
			v-for="year in years"
			:key="year"
			:value="year"
			:data-cy="`${yearDropdownDataCy}-item-${year}`"
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
.calendar-year-dropdown__item div {
	@apply !p-0;
}
</style>
