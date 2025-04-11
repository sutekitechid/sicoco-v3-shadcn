<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import Dropdown from '../dropdown/Dropdown.vue'
import Input from '../input/Input.vue'
import DropdownItem from '../dropdown/DropdownItem.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
	modelValue: { type: String, default: '' },
	required: { type: Boolean, default: false },
	disabled: { type: Boolean, default: false },
	placeholder: { type: String, default: 'Select time' },
	dataCy: { type: String, default: 'time-picker' },
})

const emit = defineEmits(['update:modelValue'])

const hours = Array.from({ length: 24 }, (_, i) =>
	i.toString().padStart(2, '0')
)
const minutes = Array.from({ length: 60 }, (_, i) =>
	i.toString().padStart(2, '0')
)

const selectedHour = ref('00')
const selectedMinute = ref('00')

const formattedTime = useVModel(props, 'modelValue', emit)

watch([selectedHour, selectedMinute], ([hour, minute]) => {
	formattedTime.value = `${hour}:${minute}`
})

watch(
	() => formattedTime.value,
	newValue => {
		if (newValue) {
			const [hour, minute] = newValue.split(':')
			selectedHour.value = hour || '00'
			selectedMinute.value = minute || '00'
		}
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
					:data-cy="`select-minute${minute}`"
				>
					<span>
						{{ minute }}
					</span>
				</DropdownItem>
			</Dropdown>
		</div>
	</Dropdown>
</template>
