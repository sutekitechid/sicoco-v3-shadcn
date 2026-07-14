<script setup lang="ts">
import { Calendar } from '../calendar/index'
import { RangeCalendar } from '../range-calendar/index'
import { Dropdown } from '../dropdown/index'
import BaseInput from '../base-input/BaseInput.vue'
import BaseInputErrorMessage from '../base-input-error-message/BaseInputErrorMessage.vue'
import { type DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import { ref, HTMLAttributes, computed, onMounted, watch } from 'vue'
import { ImportantDate } from '../../utils/date-picker-types'
import DatepickerEditableTrigger from './DatepickerEditableTrigger.vue'
import NativeDatePicker from './NativeDatePicker.vue'
import NativeDatePickerRange from './NativeDatePickerRange.vue'
import { useBreakpoint } from '../../composables/useBreakpoint'

import { DateFormatEnum } from '.'

/**
 * DatePicker component is a versatile date selection component that supports both single date
 * selection and date range selection.
 *
 * The trigger is the `DatepickerEditableTrigger` component, which renders three segmented
 * inputs (DD / MM / YYYY) for single mode or six segmented inputs (DD/MM/YYYY — DD/MM/YYYY)
 * for range mode. Clicking the calendar icon opens the dropdown with a visual calendar.
 *
 * Validation is handled by `BaseInput` rendered inside this component; the trigger itself is
 * validation-agnostic and only reports `blur`, `complete`, and `reset` events so the parent
 * `BaseInput` can run vuelidate at the right time.
 *
 * @example
 * <!-- Single Date Picker -->
 * <DatePicker v-model="selectedDate" placeholder="Select a date" />
 *
 * <!-- Range Date Picker (6 inputs in 1 trigger) -->
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
 * @props {boolean} [useNativeOnMobile] - When `true` and the viewport is below
 *   the `md` breakpoint (< 768px) the component renders a native
 *   `<input type="date" />` instead of the popover-based calendar. Defaults to
 *   `false` (always use the popover).
 *
 * @emits {DateValue | null} update:modelValue - Emitted when the selected date is updated in single date mode.
 *
 * @slots
 * - `required`: Slot for the required field message.
 * - `errors`: Slot for a custom error message.
 */

const DEFAULT_NUMBER_OF_MONTHS = 2

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
		dataTestid?: string
		customValidators?: Record<string, unknown>
		useNativeOnMobile?: boolean
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
		customValidators: null,
		useNativeOnMobile: true,
	}
)

/** Emits events from the DatePicker component. */
const emits = defineEmits<{
	(event: 'update:start', value: DateValue | null): void
	(event: 'update:end', value: DateValue | null): void
	(event: 'update:modelValue', value: DateValue | null): void
}>()

defineSlots<{
	required?: unknown
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
}>()

/** Computed property for single date selection with getter/setter */
const computedModelValue = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emits('update:modelValue', value)
		dropdownRef.value?.closeDropdown()
	},
})

/**
 * Local state for the range calendar's v-model.
 * We keep this separate from the props so the calendar remembers partial
 * selections (start selected, end still null) while the user is picking.
 */
const localRange = ref<{ start: DateValue | null; end: DateValue | null }>({
	start: props.start,
	end: props.end,
})

/** Sync local range when the parent updates the props. */
watch(
	() => [props.start, props.end],
	([newStart, newEnd]) => {
		localRange.value = { start: newStart, end: newEnd }
	}
)

/** Computed property for range calendar with getter/setter */
const computedDateRange = computed<DateRange>({
	get() {
		return (localRange.value ?? { start: null, end: null }) as DateRange
	},
	set(value: DateRange) {
		if (!value) return
		localRange.value = {
			start: value.start ?? null,
			end: value.end ?? null,
		}
		if (value.start && value.end) {
			emits('update:start', value.start)
			emits('update:end', value.end)
			dropdownRef.value?.closeDropdown()
		}
	},
})

/** Dropdown reference to control open/close behavior. */
const dropdownRef = ref(null)

/** BaseInput reference for validation control. */
const baseInputRef = ref<InstanceType<typeof BaseInput> | null>(null)

/** Reference to the editable trigger for focus management. */
const editableTriggerRef = ref<InstanceType<typeof DatepickerEditableTrigger> | null>(null)

/** Ensure only one DatePicker dropdown is open at a time */
const OPEN_EVENT = 'datepicker:open'
const instanceId = Symbol('datepicker-instance')

function handleTriggerClick() {
	// Notify other DatePicker instances to close
	window.dispatchEvent(
		new CustomEvent(OPEN_EVENT, { detail: { id: instanceId } })
	)
}

// Listen for open events from other instances and close this one if open
onMounted(() => {
	window.addEventListener(OPEN_EVENT, (e: Event) => {
		const custom = e as CustomEvent<{ id: symbol }>
		if (custom.detail?.id !== instanceId) {
			dropdownRef.value?.closeDropdown()
		}
	})
})

/** Locale to control date language from props. */
const locale = computed(() => props.locale)

/** Computed property to determine if the component is in range mode. */
const isDateRange = computed(() => props.dateRange)

/** Reactive viewport detection for auto-switching to the native input on mobile. */
const { isMobile } = useBreakpoint()

/**
 * Whether the native (mobile) variant should be rendered.
 * True only when the consumer opted in via `useNativeOnMobile` and the
 * viewport is below the `md` breakpoint.
 */
const useNative = computed(() => props.useNativeOnMobile && isMobile.value)

/** Value passed to BaseInput for vuelidate state. */
const baseInputModelValue = computed(() => {
	if (isDateRange.value) {
		return { start: props.start, end: props.end }
	}
	return props.modelValue
})

/** Vuelidate rules for the date value. */
const rules = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const base: Record<string, any> = {
		modelValue: {
			required: () => {
				if (!props.required) return true
				return isDateRange.value
					? props.start !== null && props.end !== null
					: props.modelValue !== null
			},
			isValidDate: () => {
				const trigger = editableTriggerRef.value
				if (!trigger) return !props.required
				if (isDateRange.value) {
					if (!props.required && !trigger.hasAnyInput1 && !trigger.hasAnyInput2) {
						return true
					}
					return trigger.isValid
				}
				if (!props.required && !trigger.hasAnyInput1) return true
				return trigger.isValid
			},
			...props.customValidators,
		},
	}
	return base
})

/** Whether BaseInput should run validation. */
const useValidation = computed(() => {
	if (props.disabled) return false
	return props.required || props.customValidators !== null
})

/** Reset validation state (called when the user clears the value). */
function resetInput() {
	baseInputRef.value?.reset()
}

/** Focus the editable trigger when BaseInput requests focus (e.g. on error). */
function focusEditableTrigger() {
	editableTriggerRef.value?.focus()
}

const numberOfMonths = ref<number>()
watch([() => props.start, () => props.end], () => {
	if (numberOfMonths.value !== undefined) return
	if (!props.start || !props.end) {
		numberOfMonths.value = DEFAULT_NUMBER_OF_MONTHS
		return
	}
	
	const result =
		(props.end.year - props.start.year) * 12 +
		(props.end.month - props.start.month) + 1
	numberOfMonths.value = result
}, { immediate: true })
</script>

<template>
	<NativeDatePicker
		v-if="useNative && !isDateRange"
		:model-value="props.modelValue"
		:placeholder="props.placeholder"
		:format-date="props.formatDate"
		:locale="locale"
		:required="props.required"
		:disabled="props.disabled"
		:years-range="props.yearsRange"
		:custom-validators="props.customValidators"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
		:class="props.class"
		@update:model-value="(v) => emits('update:modelValue', v)"
	>
		<template v-if="$slots.required" #required>
			<slot name="required" />
		</template>
		<template v-if="$slots.errors" #errors="slotProps">
			<slot name="errors" v-bind="slotProps" />
		</template>
		<template v-if="$slots.invalidDate" #invalid-date>
			<slot name="invalid-date" />
		</template>
	</NativeDatePicker>
	<NativeDatePickerRange
		v-else-if="useNative && isDateRange"
		:start="props.start"
		:end="props.end"
		:placeholder="props.placeholder"
		:format-date="props.formatDate"
		:locale="locale"
		:required="props.required"
		:disabled="props.disabled"
		:years-range="props.yearsRange"
		:custom-validators="props.customValidators"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
		:class="props.class"
		@update:start="(v) => emits('update:start', v)"
		@update:end="(v) => emits('update:end', v)"
	>
		<template v-if="$slots.required" #required>
			<slot name="required" />
		</template>
		<template v-if="$slots.errors" #errors="slotProps">
			<slot name="errors" v-bind="slotProps" />
		</template>
		<template v-if="$slots.invalidDate" #invalid-date>
			<slot name="invalid-date" />
		</template>
	</NativeDatePickerRange>
	<Dropdown
		v-else
		ref="dropdownRef"
		class="w-full"
		:model-value="null"
		:scrollable="false"
		:fit-content="true"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
		:disabled="disabled"
		align="start"
		@update:model-value="handleTriggerClick"
	>
		<template #trigger>
			<BaseInput
				ref="baseInputRef"
				:model-value="baseInputModelValue"
				:validation-rules="rules"
				:use-validation="useValidation"
				:focus-function="focusEditableTrigger"
			>
				<template #default="{ dirty, invalid, validate }">
					<div class="mb-1">
						<DatepickerEditableTrigger
							v-if="isDateRange"
							ref="editableTriggerRef"
							mode="range"
							:start="props.start"
							:end="props.end"
							:dirty="dirty"
							:invalid="invalid"
							:years-range="props.yearsRange"
							:locale="locale"
							:disabled="disabled"
							:data-cy="props.dataCy"
							:data-testid="props.dataTestid ?? props.dataCy"
							:class="props.class"
							@update:start="(v) => emits('update:start', v)"
							@update:end="(v) => emits('update:end', v)"
							@blur="validate"
							@complete="validate"
							@reset="resetInput"
						/>
						<DatepickerEditableTrigger
							v-else
							ref="editableTriggerRef"
							v-model="computedModelValue"
							:dirty="dirty"
							:invalid="invalid"
							:years-range="props.yearsRange"
							:locale="locale"
							:disabled="disabled"
							:data-cy="props.dataCy"
							:data-testid="props.dataTestid ?? props.dataCy"
							:class="props.class"
							@blur="validate"
							@complete="validate"
							@reset="resetInput"
						/>
					</div>
				</template>
			<template #errors="{ validation }">
				<BaseInputErrorMessage :invalid="validation.$invalid">
					<div v-if="validation.required?.$invalid">
						<slot name="required" />
					</div>
					<div v-else-if="validation.isValidDate?.$invalid">
						<slot name="invalid-date">
							<span class="text-danger-default text-sm">Tanggal tidak valid</span>
						</slot>
					</div>
					<div v-else-if="validation.$invalid">
						<slot name="errors" :validation="validation" />
					</div>
				</BaseInputErrorMessage>
			</template>
			</BaseInput>
		</template>
		<RangeCalendar
			v-if="isDateRange"
			v-model="computedDateRange"
			v-model:number-of-months="numberOfMonths"
			:importantDates="props.importantDates"
			:locale="locale"
			:years-range="props.yearsRange"
			:data-cy="props.dataCy"
			:data-testid="props.dataTestid ?? props.dataCy"
			class="overflow-hidden range-calendar"
			prevent-deselect
		/>
		<Calendar
			v-else
			v-model="computedModelValue"
			:importantDates="props.importantDates"
			:locale="locale"
			:years-range="props.yearsRange"
			:data-cy="props.dataCy"
			:data-testid="props.dataTestid ?? props.dataCy"
			class="tablet:w-96"
			prevent-deselect
		/>
	</Dropdown>
</template>
