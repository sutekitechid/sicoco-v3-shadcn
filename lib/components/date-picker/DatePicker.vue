<script setup lang="ts">
import { Calendar } from '../calendar/index'
import { RangeCalendar } from '../range-calendar/index'
import { Dropdown } from '../dropdown/index'
import { cn } from '../../utils/tw-merge'
import { type DateValue, CalendarDate } from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { ref, HTMLAttributes, watch, computed, Ref, onMounted } from 'vue'
import type { DateRange } from 'radix-vue'
import { useVModel } from '@vueuse/core'
import { ImportantDate } from '../../utils/date-picker-types'
import Input from '../input/Input.vue'

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
 * @props {boolean} [required] - Whether the datepicker selection is required.
 * @props {boolean} [disabled] - Whether the datepicker selection is disabled.
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
		required?: boolean
		disabled?: boolean
		yearsRange?: number[]
		dataCy?: string
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
		required: false,
		disabled: false,
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

/** Local model value to handle date changes without immediately affecting time */
const localModelValue = ref<DateValue | null>(null)

/** Reactive variable to store the selected date range. */
const modelValueStartEnd = ref({
	start: props.start,
	end: props.end,
}) as Ref<DateRange>

// Flag to prevent recursive update cycles
const preventModelValueWatch = ref(false)
const preventRangeWatch = ref(false)

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
			: null
	}
	return props.modelValue
		? useFormatDate(
				formatDate.value,
				props.modelValue as CalendarDate,
				locale.value
		  )
		: null
})

onMounted(() => {
	// Initialize local model values with just the date parts
	localModelValue.value = extractDatePart(props.modelValue)
})

// Watch for props changes to update local models - fix recursion by adding proper equality checks
watch(
	() => props.modelValue,
	newValue => {
		const extractedDate = extractDatePart(newValue)
		// Only update if actually different to prevent loops
		if (
			JSON.stringify(localModelValue.value) !== JSON.stringify(extractedDate)
		) {
			preventModelValueWatch.value = true
			localModelValue.value = extractedDate
			setTimeout(() => {
				preventModelValueWatch.value = false
			}, 0)
		}
	},
	{ deep: true }
)

// Update modelValueStartEnd when props.start or props.end change
watch(
	[() => props.start, () => props.end],
	([newStart, newEnd]) => {
		if (!preventRangeWatch.value) {
			modelValueStartEnd.value = {
				start: extractDatePart(newStart),
				end: extractDatePart(newEnd),
			}
		}
	},
	{ deep: true }
)

/**
 * Extract date components from a DateValue to create a new CalendarDate
 * This preserves just the date portion
 */
function extractDatePart(date: DateValue | null): DateValue | null {
	if (!date) return null
	if (date instanceof CalendarDate) return date
	return new CalendarDate(date.year, date.month, date.day)
}

/** Watched property for date range mode */
watch(modelValueStartEnd, val => {
	if (val && val.start && val.end && !preventRangeWatch.value) {
		preventRangeWatch.value = true

		const newStart = preserveTimeWhenUpdating(val.start, props.start)
		const newEnd = preserveTimeWhenUpdating(val.end, props.end)

		emits('update:start', newStart)
		emits('update:end', newEnd)
		dropdownRef.value?.closeDropdown()

		setTimeout(() => {
			preventRangeWatch.value = false
		}, 0)
	}
})

/** Watched property for single date mode. */
watch(localModelValue, (val: DateValue) => {
	if (
		!isDateRange.value &&
		val !== undefined &&
		!preventModelValueWatch.value
	) {
		preventModelValueWatch.value = true

		const updatedValue = preserveTimeWhenUpdating(val, props.modelValue)
		emits('update:modelValue', updatedValue)
		dropdownRef.value?.closeDropdown()

		setTimeout(() => {
			preventModelValueWatch.value = false
		}, 0)
	}
})

/**
 * Preserve time from original date when updating with new date
 */
function preserveTimeWhenUpdating(
	newDate: DateValue | null,
	originalDate: DateValue | null
): DateValue | null {
	if (!newDate || !originalDate) return newDate

	// If original date has time component (it's not a CalendarDate)
	if (!(originalDate instanceof CalendarDate) && 'hour' in originalDate) {
		const originalTime = {
			hour: originalDate.hour,
			minute: originalDate.minute,
			second: originalDate.second,
			millisecond: originalDate.millisecond,
		}

		// Create a new date with original time but new date components
		return originalDate.set({
			year: newDate.year,
			month: newDate.month,
			day: newDate.day,
		})
	}

	return newDate
}
</script>

<template>
	<Dropdown
		ref="dropdownRef"
		class="w-full"
		:scrollable="false"
		:fit-content="true"
		:data-cy="props.dataCy"
		align="start"
	>
		<template #trigger>
			<Input
				v-model="formattedDateDisplay"
				readonly
				variant="primary"
				outlined
				:required="required"
				:disabled="disabled"
				:placeholder="placeholder"
				:class="
					cn(
						'justify-start text-left font-normal text-neutral-100 cursor-pointer',
						!isDateRange
							? !props.modelValue && 'text-muted-foreground'
							: (!props.start || !props.end) && 'text-muted-foreground',
						props.class
					)
				"
			>
				<template #prefix>
					<CalendarIcon class="mr-2 h-4 w-4" />
				</template>
				<span>{{ formattedDateDisplay }}</span>
				<template #required>
					<slot name="required" />
				</template>
			</Input>
		</template>
		<RangeCalendar
			v-if="isDateRange"
			v-model="modelValueStartEnd"
			:importantDates="props.importantDates"
			:locale="locale"
			:years-range="props.yearsRange"
			:data-cy="props.dataCy"
			class="overflow-hidden"
		/>
		<Calendar
			v-else
			v-model="localModelValue"
			:importantDates="props.importantDates"
			:locale="locale"
			:years-range="props.yearsRange"
			:data-cy="props.dataCy"
			class="overflow-hidden"
		/>
	</Dropdown>
</template>
