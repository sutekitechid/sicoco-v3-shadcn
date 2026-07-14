<script setup lang="ts">
import { computed, HTMLAttributes } from 'vue'
import { type DateValue } from '@internationalized/date'

import { Field } from '../field/index'
import NativeDatePicker from './NativeDatePicker.vue'
import { cn } from '../../utils/tw-merge'

import { DateFormatEnum } from '.'

/**
 * NativeDatePickerRange is a range date picker that renders two separate
 * `NativeDatePicker` triggers (start + end), one per date. Each trigger keeps
 * a full-width tap target on mobile and gets its own label and validation.
 *
 * Layout (mobile-first, stacked):
 *
 *   ┌────────────────────────┐
 *   │ Tanggal mulai *        │
 *   │ ┌────────────────────┐ │
 *   │ │ 📅 [ start ]  [X]  │ │
 *   │ └────────────────────┘ │
 *   │ Tanggal akhir *        │
 *   │ ┌────────────────────┐ │
 *   │ │ 📅 [ end ]    [X]  │ │
 *   │ └────────────────────┘ │
 *   └────────────────────────┘
 *
 * Cross-field validation (start must be on or before end) is exposed to each
 * child `NativeDatePicker` as a `customValidator`. Each child has its own
 * `BaseInput`, so the error is shown directly under the relevant field.
 *
 * @example
 * <NativeDatePickerRange
 *   v-model:start="startDate"
 *   v-model:end="endDate"
 *   placeholder="Pick a date"
 * />
 */

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		start?: DateValue | null
		end?: DateValue | null
		placeholder?: string
		formatDate?: string
		locale?: string
		required?: boolean
		disabled?: boolean
		yearsRange?: number[]
		customValidators?: Record<string, unknown>
		dataCy?: string
		dataTestid?: string
	}>(),
	{
		class: '',
		start: null,
		end: null,
		placeholder: 'Pick a date',
		formatDate: DateFormatEnum?.STANDARD,
		locale: 'id-ID',
		required: false,
		disabled: false,
		customValidators: null,
	}
)

const emits = defineEmits<{
	(event: 'update:start', value: DateValue | null): void
	(event: 'update:end', value: DateValue | null): void
}>()

defineSlots<{
	required?: unknown
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()

/* -------------------------------------------------------------------------- */
/*                              v-model proxy                                 */
/* -------------------------------------------------------------------------- */

/**
 * Proxy computeds allow the child `NativeDatePicker` (which uses
 * `v-model:modelValue`) to bind against the parent's `start` / `end` props.
 */
const startProxy = computed<DateValue | null>({
	get: () => props.start,
	set: value => emits('update:start', value),
})

const endProxy = computed<DateValue | null>({
	get: () => props.end,
	set: value => emits('update:end', value),
})

function onStartChange(value: DateValue | null) {
	emits('update:start', value)
}

function onEndChange(value: DateValue | null) {
	emits('update:end', value)
}

/* -------------------------------------------------------------------------- */
/*                          Cross-field validation                            */
/* -------------------------------------------------------------------------- */

/**
 * Validator passed to the start picker: start must be on or before end.
 * Returns `true` when the sibling value is not yet set so the rule does not
 * fail while the user is still typing the second date.
 */
function isBeforeEnd(value: DateValue | null): boolean {
	if (!value || !props.end) return true
	return value.compare(props.end) <= 0
}

/**
 * Validator passed to the end picker: end must be on or after start.
 */
function isAfterStart(value: DateValue | null): boolean {
	if (!value || !props.start) return true
	return value.compare(props.start) >= 0
}

/* -------------------------------------------------------------------------- */
/*                            Per-field validators                            */
/* -------------------------------------------------------------------------- */

const startValidators = computed(() => ({
	isBeforeEnd,
	...props.customValidators,
}))

const endValidators = computed(() => ({
	isAfterStart,
	...props.customValidators,
}))

/* -------------------------------------------------------------------------- */
/*                              Test attributes                               */
/* -------------------------------------------------------------------------- */

function dataAttr(suffix: string) {
	return {
		'data-cy': props.dataCy ? `${props.dataCy}-${suffix}` : undefined,
		'data-testid': props.dataTestid ?? props.dataCy
			? `${props.dataTestid ?? props.dataCy}-${suffix}`
			: undefined,
	}
}
</script>

<template>
	<div :class="cn('flex flex-col gap-1', props.class)">
		<Field label="Tanggal mulai" :required="props.required">
			<NativeDatePicker
				v-model="startProxy"
				:placeholder="props.placeholder"
				:format-date="props.formatDate"
				:locale="props.locale"
				:required="props.required"
				:disabled="props.disabled"
				:years-range="props.yearsRange"
				:custom-validators="startValidators"
				v-bind="dataAttr('start')"
				@update:model-value="onStartChange"
			>
				<template v-if="$slots.required" #required>
					<slot name="required" />
				</template>
				<template v-if="$slots.errors" #errors="slotProps">
					<slot name="errors" v-bind="slotProps" />
				</template>
			</NativeDatePicker>
		</Field>

		<Field label="Tanggal akhir" :required="props.required">
			<NativeDatePicker
				v-model="endProxy"
				:placeholder="props.placeholder"
				:format-date="props.formatDate"
				:locale="props.locale"
				:required="props.required"
				:disabled="props.disabled"
				:years-range="props.yearsRange"
				:custom-validators="endValidators"
				v-bind="dataAttr('end')"
				@update:model-value="onEndChange"
			>
				<template v-if="$slots.required" #required>
					<slot name="required" />
				</template>
				<template v-if="$slots.errors" #errors="slotProps">
					<slot name="errors" v-bind="slotProps" />
				</template>
			</NativeDatePicker>
		</Field>
	</div>
</template>
