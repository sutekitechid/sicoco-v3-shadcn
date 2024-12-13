<script setup lang="ts">
import { Button } from '../button/index'
import { Calendar } from '../calendar/index'
import { RangeCalendar } from '../range-calendar/index'
import { Dropdown } from '../dropdown/index'
import { cn } from '../../utils/tw-merge'
import {
	DateFormatter,
	type DateValue,
	getLocalTimeZone,
	CalendarDate,
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { ref, HTMLAttributes, watch, computed, Ref } from 'vue'
import type { DateRange } from 'radix-vue'

/**
 * Props for the DatePicker component.
 * - `class`: Additional CSS classes to style the component.
 * - `modelValue`: Current value of the selected date or date range.
 * - `placeholder`: Placeholder text for the input field.
 * - `dateRange`: Indicates if the component supports date ranges.
 */
const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		modelValue?: DateValue | DateRange | null
		placeholder?: string
		dateRange?: boolean
	}>(),
	{
		class: '',
		modelValue: null,
		placeholder: 'Pick a date',
		dateRange: false,
	}
)

/**
 * Emits events from the DatePicker component.
 * - `update:modelValue`: Emits the selected date or date range when updated.
 */
const emits = defineEmits<{
	(event: 'update:modelValue', value: DateValue | DateRange | null): void
}>()

/** Formatter for displaying dates in the desired format. */
const df = new DateFormatter('en-US', {
	dateStyle: 'long',
})

/** Dropdown reference to control open/close behavior. */
const dropdownRef = ref(null)

/** Determines the type of `computedModelValue` based on `props.dateRange`. */
const computedModelValue = ref(
	props.dateRange
		? {
				start: new CalendarDate(2022, 1, 20),
				end: new CalendarDate(2022, 1, 20).add({ days: 20 }),
		  }
		: null
) as Ref<DateValue | DateRange | null>

/** Computed property to determine if the component is in range mode. */
const isDateRange = computed(() => props.dateRange)

/** Watcher to emit changes in the date or date range and close the dropdown if necessary. */
watch(computedModelValue, val => {
	console.log('val', val)
	emits('update:modelValue', val)
	if (val && !isDateRange.value) {
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
						!computedModelValue && 'text-muted-foreground'
					)
				"
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				<span>
					{{
						computedModelValue
							? typeof computedModelValue === 'object' &&
							  'start' in computedModelValue
								? `${df.format(
										computedModelValue?.start?.toDate(getLocalTimeZone())
								  )} - ${df.format(
										computedModelValue?.end?.toDate(getLocalTimeZone())
								  )}`
								: df.format(
										(computedModelValue as DateValue).toDate(getLocalTimeZone())
								  )
							: props.placeholder
					}}
				</span>
			</Button>
		</template>
		<RangeCalendar v-model="computedModelValue" v-if="isDateRange" />
		<Calendar v-model="computedModelValue" initial-focus v-else />
	</Dropdown>
</template>
