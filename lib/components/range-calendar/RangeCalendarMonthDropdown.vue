<script lang="ts" setup>
import { inject, computed, ref, watch } from 'vue'
import { RangeCalendarPrev, RangeCalendarHeading } from 'reka-ui'
import { type DateValue } from '@internationalized/date'
import Dropdown from '../dropdown/Dropdown.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import {
	getMonthNames,
	parseMonthNameFromMonthYearString,
	monthPagingFunction,
	generateDataCy,
} from '../calendar'
import DropdownChevron from '../dropdown/DropdownChevron.vue'

const calendarContext = inject('RangeCalendarContext', null)

const locale = computed(() => {
	return calendarContext.props.locale
})

const monthNames = computed(() => {
	return getMonthNames(locale.value)
})

const selectedMonth = ref()
function setMonth(monthYearStr) {
	const monthName = parseMonthNameFromMonthYearString(monthYearStr)
	const monthIndex = monthNames.value.indexOf(monthName)
	selectedMonth.value = monthIndex + 1
}

const monthDropdownDataCy = computed(() => {
	return generateDataCy(
		calendarContext?.props?.dataCy,
		'range-calendar-month-dropdown'
	)
})

const emits = defineEmits()
watch(selectedMonth, () => {
	emits('month-change', selectedMonth.value)
})
</script>

<template>
	<Dropdown :model-value="selectedMonth" :data-cy="monthDropdownDataCy">
		<template #trigger="{ open }">
			<div
				class="flex items-center w-28 h-8 border-[1px] border-neutral-30 justify-between gap-x-1.5 rounded-md px-2 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-primary-50 focus:ring-2 focus:ring-primary-3 bg-transparent dark:bg-neutral-10 hover:bg-neutral-10"
			>
				<RangeCalendarHeading v-slot="{ headingValue }">
					{{ parseMonthNameFromMonthYearString(headingValue) }}
					{{ setMonth(headingValue) }}
				</RangeCalendarHeading>

				<DropdownChevron :open="open" />
			</div>
		</template>
		<DropdownItem
			v-for="(month, index) in monthNames"
			:key="index"
			:value="index + 1"
			:data-cy="`${monthDropdownDataCy}-item-${index + 1}`"
			class="calendar-month-dropdown__item p-0"
		>
			<RangeCalendarPrev
				:prev-page="(date: DateValue) => monthPagingFunction(date, index + 1)"
				class="py-2 w-full"
			>
				{{ month }}
			</RangeCalendarPrev>
		</DropdownItem>
	</Dropdown>
</template>

<style>
.calendar-month-dropdown__item div {
	@apply !p-0;
}
</style>
