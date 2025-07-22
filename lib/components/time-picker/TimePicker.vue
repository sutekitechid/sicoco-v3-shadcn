<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, PropType } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import Input from '../input/Input.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { useVModel } from '@vueuse/core'
import {
	CalendarDate,
	CalendarDateTime,
	DateValue,
} from '@internationalized/date'
import { MAX_HOURS, MAX_MINUTES } from './constans'
import { generateTimeUnits, formatTimeUnit } from '.'

const props = defineProps({
	modelValue: {
		type: [Object, String] as PropType<DateValue | string | null>,
		required: true,
	},
	required: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	placeholder: { type: String, default: 'Select time' },
	dataCy: { type: String, default: 'time-picker' },
	customValidators: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue'])

defineSlots<{
	validation?: string
	required?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()

const hours = generateTimeUnits(MAX_HOURS)
const minutes = generateTimeUnits(MAX_MINUTES)

const now = new Date()
const defaultDateTime = new CalendarDateTime(
	now.getFullYear(),
	now.getMonth() + 1,
	now.getDate(),
	0,
	0
)

const modelValue = useVModel(props, 'modelValue', emit)

const parsedModelValue = parseModelValue(modelValue.value)

const selectedHour = ref(formatTimeUnit(parsedModelValue.hour))
const selectedMinute = ref(formatTimeUnit(parsedModelValue.minute))

const formattedTime = ref(`${selectedHour.value}:${selectedMinute.value}`)

watch([selectedHour, selectedMinute], ([hour, minute]) => {
	formattedTime.value = `${hour}:${minute}`

	const currentDateTime = parseModelValue(modelValue.value)
	const updatedDateTime = currentDateTime.set({
		year: currentDateTime.year,
		month: currentDateTime.month,
		day: currentDateTime.day,
		hour: parseInt(hour, 10),
		minute: parseInt(minute, 10),
	})
	emit('update:modelValue', updatedDateTime)
})

watch(
	() => modelValue.value,
	newValue => {
		updateSelectedTime(parseModelValue(newValue))
	},
	{ immediate: true }
)

function updateSelectedTime(newValue: CalendarDateTime | null) {
	selectedHour.value = formatTimeUnit(newValue.hour)
	selectedMinute.value = formatTimeUnit(newValue.minute)
	formattedTime.value = `${selectedHour.value}:${selectedMinute.value}`
}

/**
 * Custom type guard to check if a value is a CalendarDateTime.
 * This is used instead of `instanceof` because `instanceof` can fail
 * if the object comes from a different module or package, even if it has
 * the same structure. This function ensures compatibility by checking
 * the presence of required properties.
 */
function isCalendarDateTime(value: unknown): value is CalendarDateTime {
	return (
		value &&
		typeof value === 'object' &&
		'year' in value &&
		'month' in value &&
		'day' in value &&
		'hour' in value &&
		'minute' in value &&
		'second' in value &&
		'millisecond' in value
	)
}

function parseModelValue(value: DateValue | string | null): CalendarDateTime {
	if (isCalendarDateTime(value)) {
		return value
	} else if (value instanceof CalendarDate) {
		const year = value.year
		const month = value.month
		const day = value.day

		return new CalendarDateTime(year, month, day, 0, 0)
	}
	return defaultDateTime
}
</script>

<template>
	<Dropdown
		ref="dropdownRef"
		class="w-full"
		:scrollable="false"
		:fit-content="true"
		:data-cy="dataCy"
		align="start"
	>
		<template #trigger>
			<Input
				v-model="formattedTime"
				readonly
				variant="primary"
				outlined
				:required="required"
				:disabled="disabled"
				:placeholder="placeholder"
				:custom-validators="props.customValidators"
			>
				<template #prefix>
					<i class="!mt-[0.8px] mr-[0.5px] h-4 w-4 si-clock" />
				</template>
				<template #required>
					<slot name="required" />
				</template>
				<template #errors="{ validation }">
					<slot name="errors" :validation="validation" />
				</template>
			</Input>
		</template>
		<div
			class="flex items-center w-min-content h-min-content overflow-y-hidden bg-white p-2 rounded-md"
		>
			<Dropdown
				v-model="selectedHour"
				:disabled="disabled"
				data-cy="select-hour"
			>
				<DropdownItem
					v-for="hour in hours"
					:key="hour"
					:value="hour"
					:data-cy="`select-hour-${hour}`"
				>
					<span> {{ hour }}</span>
				</DropdownItem>
			</Dropdown>
			<span class="mx-4">:</span>
			<Dropdown
				v-model="selectedMinute"
				:disabled="disabled"
				data-cy="select-minute"
			>
				<DropdownItem
					v-for="minute in minutes"
					:key="minute"
					:value="minute"
					:data-cy="`select-minute-${minute}`"
				>
					<span>
						{{ minute }}
					</span>
				</DropdownItem>
			</Dropdown>
		</div>
	</Dropdown>
</template>
