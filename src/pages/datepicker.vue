<template>
	<div class="flex flex-col gap-8 p-4">
		<section>
			<h3 class="font-semibold text-lg mb-1">Basic</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Trigger adalah <code>DatepickerEditableTrigger</code> — ketik tanggal
				pada field DD/MM/YYYY. Setiap segmen auto-advance ke segmen berikutnya
				ketika sudah penuh. Klik ikon kalender untuk memilih tanggal dari
				kalender visual.
			</p>
			<div class="max-w-sm">
				<DatePicker
					v-model="basicDate"
					placeholder="Pilih tanggal"
					data-cy="datepicker-basic"
					data-testid="datepicker-basic"
				/>
				<p
					class="text-xs text-neutral-500 mt-2"
					data-cy="datepicker-basic-value"
					data-testid="datepicker-basic-value"
				>
					modelValue: {{ basicDate ? formatDate(basicDate) : 'null' }}
				</p>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">Sizes</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Ukuran trigger mengikuti <code>InputVariants</code> yang sama dengan
				<code>Input</code>.
			</p>
			<FormInput class="flex flex-col gap-3 max-w-sm">
				<DatePicker
					v-model="sizeSm"
					size="sm"
					placeholder="Small"
					data-cy="datepicker-size-sm"
				>
					<template #errors="{ validation }">
						<p v-if="validation.isValidDate.$invalid">
							Tanggal tidak valid
						</p>
					</template>
				</DatePicker>
				<DatePicker
					v-model="sizeDefault"
					placeholder="Default"
					data-cy="datepicker-size-default"
				/>
				<DatePicker
					v-model="sizeMd"
					size="md"
					placeholder="Medium"
					data-cy="datepicker-size-md"
				/>
				<DatePicker
					v-model="sizeLg"
					size="lg"
					placeholder="Large"
					data-cy="datepicker-size-lg"
				/>
			</FormInput>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">States</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gabungan state <code>disabled</code>, <code>required</code>, dan
				<code>yearsRange</code>.
			</p>
			<div class="grid gap-3 max-w-md sm:grid-cols-2">
				<div>
					<p class="text-xs text-neutral-500 mb-1">Disabled (with value)</p>
					<DatePicker
						v-model="disabledDate"
						disabled
						data-cy="datepicker-disabled"
					/>
				</div>
				<div>
					<p class="text-xs text-neutral-500 mb-1">Required</p>
					<DatePicker
						v-model="requiredDate"
						required
						data-cy="datepicker-required"
					>
						<template #required>
							<p class="text-danger-default text-sm mt-1">
								Tanggal wajib diisi
							</p>
						</template>
					</DatePicker>
				</div>
				<div class="sm:col-span-2">
					<p class="text-xs text-neutral-500 mb-1">
						yearsRange: [2000, 2030]
					</p>
					<DatePicker
						v-model="rangeDate"
						:years-range="[2000, 2030]"
						data-cy="datepicker-range-years"
					/>
				</div>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">Format & Locale</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Gunakan prop <code>formatDate</code> untuk mengubah format tanggal yang
				ditampilkan pada trigger. Tanpa prop ini, trigger menggunakan format
				bawaan. Pada mobile, format juga diterapkan ke native date input.
			</p>
			<div class="overflow-x-auto mb-4">
				<table class="text-sm w-full max-w-2xl">
					<thead>
						<tr class="border-b border-neutral-200 dark:border-neutral-700">
							<th class="text-left py-2 pr-4">Enum</th>
							<th class="text-left py-2 pr-4">Value</th>
							<th class="text-left py-2">Contoh Output (id-ID)</th>
						</tr>
					</thead>
					<tbody class="text-neutral-600 dark:text-neutral-400">
						<tr class="border-b border-neutral-100 dark:border-neutral-800">
							<td class="py-2 pr-4"><code>STANDARD</code></td>
							<td class="py-2 pr-4"><code>'standard'</code></td>
							<td class="py-2">02-12-2024</td>
						</tr>
						<tr class="border-b border-neutral-100 dark:border-neutral-800">
							<td class="py-2 pr-4"><code>SHORT</code></td>
							<td class="py-2 pr-4"><code>'short'</code></td>
							<td class="py-2">02/12/2024</td>
						</tr>
						<tr class="border-b border-neutral-100 dark:border-neutral-800">
							<td class="py-2 pr-4"><code>WITH_MONTH_NAME</code></td>
							<td class="py-2 pr-4"><code>'with-month-name'</code></td>
							<td class="py-2">2 Desember 2024</td>
						</tr>
						<tr class="border-b border-neutral-100 dark:border-neutral-800">
							<td class="py-2 pr-4"><code>WITH_SHORT_MONTH_NAME</code></td>
							<td class="py-2 pr-4"><code>'with-short-month-name'</code></td>
							<td class="py-2">2 Des 2024</td>
						</tr>
						<tr>
							<td class="py-2 pr-4"><code>FULL</code></td>
							<td class="py-2 pr-4"><code>'full'</code></td>
							<td class="py-2">Senin, 2 Desember 2024</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="grid gap-3 max-w-md sm:grid-cols-2">
				<div>
					<p class="text-xs text-neutral-500 mb-1">STANDARD (DD-MM-YYYY)</p>
					<DatePicker
						v-model="formatStandardDate"
						:format-date="DateFormatEnum.STANDARD"
						data-cy="datepicker-format-standard"
					/>
				</div>
				<div>
					<p class="text-xs text-neutral-500 mb-1">SHORT (DD/MM/YYYY)</p>
					<DatePicker
						v-model="formatShortDate"
						:format-date="DateFormatEnum.SHORT"
						data-cy="datepicker-format-short"
					/>
				</div>
				<div>
					<p class="text-xs text-neutral-500 mb-1">WITH_MONTH_NAME</p>
					<DatePicker
						v-model="formatMonthDate"
						:format-date="DateFormatEnum.WITH_MONTH_NAME"
						data-cy="datepicker-format-month"
					/>
				</div>
				<div>
					<p class="text-xs text-neutral-500 mb-1">WITH_SHORT_MONTH_NAME</p>
					<DatePicker
						v-model="formatShortMonthDate"
						:format-date="DateFormatEnum.WITH_SHORT_MONTH_NAME"
						data-cy="datepicker-format-short-month"
					/>
				</div>
				<div>
					<p class="text-xs text-neutral-500 mb-1">FULL</p>
					<DatePicker
						v-model="formatFullDate"
						:format-date="DateFormatEnum.FULL"
						data-cy="datepicker-format-full"
					/>
				</div>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">Custom Validators</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Pada contoh ini, validator menolak tanggal yang jatuh di hari Minggu
				(0). Pesan error ditampilkan lewat slot <code>#errors</code>.
			</p>
			<div class="max-w-sm">
				<DatePicker
					v-model="validatedDate"
					required
					:custom-validators="{ notSunday: notSundayValidator }"
					data-cy="datepicker-validators"
				>
					<template #required>
						<p class="text-danger-default text-sm mt-1">
							Tanggal wajib diisi
						</p>
					</template>
					<template #errors="{ validation }">
						<p
							v-if="validation.notSunday?.$invalid"
							class="text-danger-default text-sm mt-1"
						>
							Tanggal tidak boleh hari Minggu
						</p>
					</template>
				</DatePicker>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">Date Range</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Mode <code>:dateRange="true"</code> merender dua trigger
				<code>DatepickerEditableTrigger</code> inline, dipisah dengan tanda
				<code>—</code>. Klik ikon kalender di salah satu trigger membuka
				<code>RangeCalendar</code>.
			</p>
			<div class="max-w-2xl">
				<DatePicker
					v-model:start="rangeStart"
					v-model:end="rangeEnd"
					:date-range="true"
					placeholder="Pilih rentang tanggal"
					data-cy="datepicker-range"
					data-testid="datepicker-range"
				/>
				<p
					class="text-xs text-neutral-500 mt-2"
					data-cy="datepicker-range-value"
					data-testid="datepicker-range-value"
				>
					start: {{ rangeStart ? formatDate(rangeStart) : 'null' }} — end:
					{{ rangeEnd ? formatDate(rangeEnd) : 'null' }}
				</p>
			</div>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">In a form</h3>
			<p class="text-sm text-neutral-500 mb-3">
				Submit form untuk memicu validasi. Field wajib harus terisi dan
				tanggal harus valid agar submit dianggap sukses.
			</p>
			<FormInput @submit="onSubmit">
				<div class="max-w-sm flex flex-col gap-8">
					<DatePicker
						v-model="formDate"
						required
						data-cy="datepicker-form"
					>
						<template #required>
							<p data-cy="datepicker-form-required-error">
								Tanggal wajib diisi
							</p>
						</template>
					</DatePicker>
					<Button
						type="submit"
						data-cy="datepicker-form-submit"
						data-testid="datepicker-form-submit"
					>
						Submit
					</Button>
				</div>
			</FormInput>
			<p
				v-if="lastSubmitMessage"
				class="text-sm mt-3"
				:class="lastSubmitValid ? 'text-success-700' : 'text-danger-default'"
				data-cy="datepicker-form-result"
				data-testid="datepicker-form-result"
			>
				{{ lastSubmitMessage }}
			</p>
		</section>

		<section>
			<h3 class="font-semibold text-lg mb-1">
				DatepickerEditableTrigger (standalone)
			</h3>
			<p class="text-sm text-neutral-500 mb-3">
				<code>DatepickerEditableTrigger</code> bisa dipakai di luar
				<code>DatePicker</code>, misalnya di dalam <code>Dropdown</code> custom.
				Trigger ini tidak punya Calendar built-in; parent yang menyediakan
				Dropdown + Calendar.
			</p>
			<div class="max-w-sm">
				<DatepickerEditableTrigger
					v-model="standaloneDate"
					data-cy="datepicker-standalone"
				/>
				<p class="text-xs text-neutral-500 mt-2">
					(Ikon kalender tidak akan membuka popover di sini karena tidak ada
					parent Dropdown.)
				</p>
			</div>
		</section>
		<MonthPicker />
		<YearPicker v-model="year" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
	CalendarDate,
	getLocalTimeZone,
	today,
	type DateValue,
} from '@internationalized/date'
import Button from '@/components/button/Button.vue'
import {
	DatePicker,
	DatepickerEditableTrigger,
	DateFormatEnum,
} from '@/components/date-picker'

import FormInput from '@/components/form-input/FormInput.vue'
import MonthPicker from '@/components/monthpicker/Monthpicker.vue'
import YearPicker from '@/components/yearpicker/Yearpicker.vue'

// Using `any` to side-step a known issue where Vue's `ref<T>` generic combined
// with the `#private` field of `CalendarDate` produces a structural type that
// TypeScript cannot narrow against the `DateValue` union in v-model bindings.
// The runtime value is still a `CalendarDate | null`.
const basicDate = ref<any>(new CalendarDate(2024, 12, 20))
const sizeSm = ref<any>(null)
const sizeDefault = ref<any>(null)
const sizeMd = ref<any>(null)
const sizeLg = ref<any>(null)
const disabledDate = ref<any>(new CalendarDate(2024, 1, 15))
const requiredDate = ref<any>(null)
const rangeDate = ref<any>(null)
const formatStandardDate = ref<any>(new CalendarDate(2024, 8, 17))
const formatShortDate = ref<any>(new CalendarDate(2024, 8, 17))
const formatMonthDate = ref<any>(new CalendarDate(2024, 8, 17))
const formatShortMonthDate = ref<any>(new CalendarDate(2024, 8, 17))
const formatFullDate = ref<any>(new CalendarDate(2024, 8, 17))
const validatedDate = ref<any>(null)
const rangeStart = ref<any>(new CalendarDate(2024, 1, 1))
const rangeEnd = ref<any>(new CalendarDate(2026, 12, 1))
const formDate = ref<any>(null)
const standaloneDate = ref<any>(null)
const lastSubmitMessage = ref('')
const lastSubmitValid = ref(false)

function formatDate(value: DateValue) {
	const date = value.toDate(getLocalTimeZone())
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	return `${day}-${month}-${year}`
}

function notSundayValidator(value: DateValue | null) {
	if (!value) return true
	const dayOfWeek = value.toDate(getLocalTimeZone()).getDay()
	return dayOfWeek !== 0
}

function onSubmit(valid: boolean) {
	if (valid && formDate.value) {
		lastSubmitValid.value = true
		lastSubmitMessage.value = `Form valid! Tanggal: ${formatDate(formDate.value)}`
	} else {
		lastSubmitValid.value = false
		lastSubmitMessage.value = 'Form invalid, lengkapi field yang ditandai merah'
	}
}

const now = ref(today(getLocalTimeZone()))
const year = new CalendarDate(now.value.year, now.value.month, now.value.day)
</script>
