<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import Input from '../input/Input.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { useVModel } from '@vueuse/core'
import { CalendarDateTime } from '@internationalized/date'
import { MAX_HOURS, MAX_MINUTES } from './constans'
import { generateTimeUnits } from '.'

const props = defineProps({
	modelValue: {
		type: Object as () => CalendarDateTime | null,
		required: true,
	},
	required: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	placeholder: { type: String, default: 'Select time' },
	dataCy: { type: String, default: 'time-picker' },
})

const emit = defineEmits(['update:modelValue'])

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
const modelValue = useVModel(props, 'modelValue', emit, {
	defaultValue: defaultDateTime,
})

const selectedHour = ref()
const selectedMinute = ref()

const formattedTime = ref(`${selectedHour.value}:${selectedMinute.value}`)

watch([selectedHour, selectedMinute], ([hour, minute]) => {
	formattedTime.value = `${hour}:${minute}`

	const updatedDateTime =
		modelValue.value?.set({
			hour: parseInt(hour, 10),
			minute: parseInt(minute, 10),
		}) || defaultDateTime
	emit('update:modelValue', updatedDateTime)
})

function updateSelectedTime(newValue: CalendarDateTime | null) {
	selectedHour.value =
		newValue?.hour.toString().padStart(2, '0') ||
		defaultDateTime.hour.toString().padStart(2, '0')
	selectedMinute.value =
		newValue?.minute.toString().padStart(2, '0') ||
		defaultDateTime.minute.toString().padStart(2, '0')
	formattedTime.value = `${selectedHour.value}:${selectedMinute.value}`
}

watch(
	() => modelValue.value,
	newValue => {
		updateSelectedTime(newValue)
	},
	{ immediate: true }
)
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
			>
				<template #prefix>
					<i class="!mt-[0.8px] mr-[0.5px] h-4 w-4 si-clock" />
				</template>
				<template #required>
					<slot name="required" />
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
