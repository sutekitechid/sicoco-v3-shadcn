<template>
	<div class="mx-auto flex max-w-5xl flex-col gap-8 p-4 tablet:p-8">
		<header>
			<h1 class="text-heading-sm font-semibold text-main">Calendar</h1>
			<p class="mt-2 text-body-md text-neutral-600">
				Contoh kalender dengan penanda dan tooltip pada tanggal penting.
			</p>
		</header>

		<section class="w-fit rounded-lg border border-main bg-white p-4">
			<h2 class="mb-4 text-title-lg font-semibold text-main">
				Important Dates
			</h2>
			<Calendar
				v-model="selectedDate"
				:placeholder="todayDate"
				:important-dates="importantDates"
			/>
		</section>

		<section class="w-fit rounded-lg border border-main bg-white p-4">
			<h2 class="mb-4 text-title-lg font-semibold text-main">
				Range Calendar
			</h2>
			<RangeCalendar :number-of-months="2" />
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getLocalTimeZone, today } from '@internationalized/date'

import Calendar from '../../lib/components/calendar/Calendar.vue'
import RangeCalendar from '../../lib/components/range-calendar/RangeCalendar.vue'
import type { ImportantDate } from '../../lib/utils/date-picker-types'

const todayDate = today(getLocalTimeZone())
const selectedDate = ref(todayDate)

const importantDates: ImportantDate[] = [
	{
		date: todayDate.add({ days: 2 }),
		color: '#4178d4',
		tooltip: 'Rapat perencanaan',
	},
	{
		date: todayDate.add({ days: 5 }),
		color: ['#16a66a', '#f2a900'],
		tooltip: ['Peluncuran fitur', 'Batas pengumpulan laporan'],
	},
	{
		date: todayDate.add({ days: 8 }),
		color: '#d63c3c',
		tooltip: 'Pemeliharaan sistem',
	},
]
</script>
