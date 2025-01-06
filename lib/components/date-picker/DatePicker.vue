<script setup lang="ts">
import { Button } from '../button/index'
import { Calendar } from '../calendar/index'
import { RangeCalendar } from '../range-calendar/index'
import { Dropdown } from '../dropdown/index'
import { cn } from '../../utils/tw-merge'
import { type DateValue, CalendarDate } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { ref, HTMLAttributes, watch, computed, Ref } from 'vue'
import type { DateRange } from 'radix-vue'
import { useVModel } from '@vueuse/core'
import { ImportantDate } from '../../utils/date-picker-types'

import { useFormatDate, DateFormatEnum } from '.'

/**
 * DatePicker component is a versatile date selection component that supports both single date
 * selection and date range selection.
 *
 * @example
 * <!-- Single Date Picker -->
 * <DatePicker v-model="selectedDate" placeholder="Select a date" />
 *
 * <!-- Range Date Picker -->
 * <DatePicker
 *   v-model:start="startDate"
 *   v-model:end="endDate"
 *   placeholder="Select a date range"
 *   :dateRange="true"
 * />
 *
 * @props {string} class - Additional custom CSS classes.
 * @props {DateValue | null} start - The start value of the selected date range.
 * @props {DateValue | null} end - The end value of the selected date range.
 * @props {DateValue | null} modelValue - The selected date when not in range mode.
 * @props {string} placeholder - Placeholder text for the input field.
 * @props {boolean} dateRange - Indicates whether the component supports date range selection.
 * @props {formatDate} DateFormat - Enum type defining the format of the date.
 * @props {string} locale - String type defining the locale
 *
 * @emits {DateValue | null} update:modelValue - Emitted when the selected date is updated in single date mode.
 *
 * @slots
 * - `trigger`: Slot for customizing the dropdown trigger button.
 * - `default`: Slot for providing a custom calendar UI.
 */

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		start?: DateValue | null
		end?: DateValue | null
		modelValue?: DateValue | null
		placeholder?: string
		dateRange?: boolean
		importantDates?: ImportantDate[]
		formatDate?: string
		locale?: string
	}>(),
	{
		class: '',
		start: null,
		end: null,
		modelValue: null,
		placeholder: 'Pick a date',
		dateRange: false,
		importantDates: () => [] as ImportantDate[],
		formatDate: DateFormatEnum?.STANDARD,
		locale: 'id-ID',
	}
)

/** Emits events from the DatePicker component. */
const emits = defineEmits<{
	(event: 'update:start', value: DateValue | null): void
	(event: 'update:end', value: DateValue | null): void
	(event: 'update:modelValue', value: DateValue | null): void
}>()

/** Use `useVModel` to create reactive variables synced with props. */
const modelValue = useVModel(props, 'modelValue', emits)

/** Reactive variable to store the selected date range. */
const modelValueStartEnd = ref({
	start: props.start,
	end: props.end,
}) as Ref<DateRange>

/** Dropdown reference to control open/close behavior. */
const dropdownRef = ref(null)

/** Locale to control date language from props. */
const locale = computed(() => props.locale)

/** Computed property to determine if the component is in range mode. */
const isDateRange = computed(() => props.dateRange)

/** Computed property to determine the format date component. */
const formatDate = computed(() => props.formatDate)

/** Computed property to determine the formatted date or date range display. */
const formattedDateDisplay = computed(() => {
	if (isDateRange.value) {
		return props.start && props.end
			? `${useFormatDate(
					formatDate.value,
					props.start as CalendarDate,
					locale.value
			  )} - ${useFormatDate(
					formatDate.value,
					props.end as CalendarDate,
					locale.value
			  )}`
			: props.placeholder
	}
	return props.modelValue
		? useFormatDate(
				formatDate.value,
				props.modelValue as CalendarDate,
				locale.value
		  )
		: props.placeholder
})

/** Watched property for date range mode */
watch(modelValueStartEnd, val => {
	if (val && val.start && val.end) {
		emits('update:start', val.start)
		emits('update:end', val.end)
		dropdownRef.value?.closeDropdown()
	}
})

/** Watched property for single date mode. */
watch(modelValue, val => {
	if (!isDateRange.value) {
		emits('update:modelValue', val)
		dropdownRef.value?.closeDropdown()
	}
})
</script>

<template>
	<Dropdown ref="dropdownRef">
		<template #trigger>
			<Button
				variant="primary"
				:class="
					cn(
						'justify-start text-left font-normal !text-white',
						!isDateRange
							? !props.modelValue && 'text-muted-foreground'
							: (!props.start || !props.end) && 'text-muted-foreground',
						props.class
					)
				"
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				<span>{{ formattedDateDisplay }}</span>
			</Button>
		</template>
		<RangeCalendar
			v-if="isDateRange"
			v-model="modelValueStartEnd"
			:importantDates="props.importantDates"
		/>
		<Calendar
			v-else
			v-model="modelValue"
			:importantDates="props.importantDates"
		/>
	</Dropdown>
</template>
