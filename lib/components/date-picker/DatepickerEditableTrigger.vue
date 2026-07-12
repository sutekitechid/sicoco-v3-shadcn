<script setup lang="ts">
import { cn } from '../../utils/tw-merge'
import { type DateValue, getLocalTimeZone } from '@internationalized/date'
import {
	ref,
	HTMLAttributes,
	computed,
	watch,
	nextTick,
	inject,
} from 'vue'
import InputPrefix from '../input/InputPrefix.vue'
import InputSuffix from '../input/InputSuffix.vue'
import { inputVariants, type InputVariants } from '../input/index'
import {
	buildCalendarDate,
	isValidDateParts,
	partsFromModelValue,
	type DateParts,
} from '../../utils/editable-date-picker'
import DatepickerEditableInput from './DatepickerEditableInput.vue'

/**
 * DatepickerEditableTrigger is the editable trigger for `DatePicker`.
 * It renders three (single mode) or six (range mode) segmented inputs for
 * day / month / year entry. After the user blurs with a valid value, the
 * trigger collapses into a formatted text (e.g. "Rabu, 15 Agt 2024") that
 * can be clicked to re-enter edit mode.
 *
 * It is meant to be placed inside the `trigger` slot of a `Dropdown`; the
 * calendar icon in the prefix is left clickable so the click bubbles up to
 * open the parent popover, while the inputs and the clear (X) icon stop
 * propagation so they do not open the popover.
 *
 * Validation is intentionally handled by the parent (usually via `BaseInput`
 * inside `DatePicker`). This component only receives `dirty` and `invalid`
 * states for visual feedback and emits `blur`, `complete`, and `reset` so the
 * parent can run validation at the right time.
 *
 * @example
 * <Dropdown>
 *   <template #trigger>
 *     <BaseInput ...>
 *       <DatepickerEditableTrigger v-model="date" />
 *     </BaseInput>
 *   </template>
 *   <Calendar v-model="date" />
 * </Dropdown>
 *
 * @props {'single' | 'range'} mode - Single (default) or range input layout.
 * @props {DateValue | null} modelValue - Selected date (single mode).
 * @props {DateValue | null} start - Start date (range mode).
 * @props {DateValue | null} end - End date (range mode).
 * @props {string} class - Additional custom CSS classes.
 * @props {boolean} disabled - Whether the field is disabled.
 * @props {boolean} dirty - Whether the parent validation is dirty.
 * @props {boolean} invalid - Whether the parent validation is invalid.
 * @props {string} locale - Locale for the visual calendar.
 * @props {number[]} yearsRange - Allowed year range `[start, end]`.
 * @props {'default' | 'sm' | 'md' | 'lg'} size - Visual size of the inputs.
 * @props {string} dataCy - Testing data-cy attribute.
 * @props {string} dataTestid - Testing data-testid attribute.
 *
 * @emits {DateValue | null} update:modelValue - Single mode emit.
 * @emits {DateValue | null} update:start - Range mode start emit.
 * @emits {DateValue | null} update:end - Range mode end emit.
 * @emits blur - Focus left the entire trigger.
 * @emits complete - A date group has been fully typed.
 * @emits reset - The clear button was clicked.
 */

const props = withDefaults(
	defineProps<{
		mode?: 'single' | 'range'
		class?: HTMLAttributes['class']
		modelValue?: DateValue | null
		start?: DateValue | null
		end?: DateValue | null
		disabled?: boolean
		dirty?: boolean
		invalid?: boolean
		locale?: string
		yearsRange?: number[]
		size?: InputVariants['size']
		dataCy?: string
		dataTestid?: string
	}>(),
	{
		mode: 'single',
		class: '',
		modelValue: null,
		start: null,
		end: null,
		disabled: false,
		dirty: false,
		invalid: false,
		locale: 'id-ID',
		yearsRange: () => [1900, 2100],
		size: 'default',
	}
)

/** Emits events from the DatepickerEditableTrigger component. */
const emits = defineEmits<{
	(event: 'update:modelValue', value: DateValue | null): void
	(event: 'update:start', value: DateValue | null): void
	(event: 'update:end', value: DateValue | null): void
	(event: 'blur'): void
	(event: 'complete'): void
	(event: 'reset'): void
}>()

/* -------------------------------------------------------------------------- */
/*                                  State                                     */
/* -------------------------------------------------------------------------- */

const isRange = computed(() => props.mode === 'range')

type Group = 1 | 2
type SegmentName = 'day' | 'month' | 'year' | 'endDay' | 'endMonth' | 'endYear'

// Group 1 (or single mode) refs.
const day1 = ref<string>('')
const month1 = ref<string>('')
const year1 = ref<string>('')

// Group 2 (only used in range mode).
const day2 = ref<string>('')
const month2 = ref<string>('')
const year2 = ref<string>('')

const dayRef = ref<InstanceType<typeof DatepickerEditableInput> | null>(null)
const monthRef = ref<InstanceType<typeof DatepickerEditableInput> | null>(null)
const yearRef = ref<InstanceType<typeof DatepickerEditableInput> | null>(null)
const endDayRef = ref<InstanceType<typeof DatepickerEditableInput> | null>(null)
const endMonthRef = ref<InstanceType<typeof DatepickerEditableInput> | null>(null)
const endYearRef = ref<InstanceType<typeof DatepickerEditableInput> | null>(null)

const segmentRefs: Record<SegmentName, typeof dayRef> = {
	day: dayRef,
	month: monthRef,
	year: yearRef,
	endDay: endDayRef,
	endMonth: endMonthRef,
	endYear: endYearRef,
}

/** Reference to the outer wrapper used for focus-out detection. */
const wrapperRef = ref<HTMLElement | null>(null)

/** When true, render a single formatted text instead of the inputs. */
const isDisplayMode = ref(true)

/**
 * Flag used to distinguish value changes produced by this component's own
 * emits from changes coming from the parent (e.g. calendar selection).
 * When the user finishes typing we stay in edit mode until blur; when the
 * user picks a date from the calendar we switch to display mode immediately.
 */
const isInternalEmit = ref(false)

/** Detect whether this trigger is rendered inside a parent Dropdown. */
const uniqueIdDropdown = inject<string | undefined>('uniqueIdDropdown', undefined)
const isInsideDropdown = computed(() => !!uniqueIdDropdown)

/* -------------------------------------------------------------------------- */
/*                              Sync helpers                                  */
/* -------------------------------------------------------------------------- */

function getGroupParts(group: Group): DateParts {
	if (group === 1) {
		return { day: day1.value, month: month1.value, year: year1.value }
	}
	return { day: day2.value, month: month2.value, year: year2.value }
}

function setGroupParts(group: Group, parts: DateParts) {
	if (group === 1) {
		day1.value = parts.day
		month1.value = parts.month
		year1.value = parts.year
	} else {
		day2.value = parts.day
		month2.value = parts.month
		year2.value = parts.year
	}
}

/** Sync the segmented inputs from external value changes. */
function syncFromModel() {
	if (isRange.value) {
		if (props.start) {
			setGroupParts(1, partsFromModelValue(props.start))
		}
		if (props.end) {
			setGroupParts(2, partsFromModelValue(props.end))
		}
	} else {
		setGroupParts(1, partsFromModelValue(props.modelValue))
	}
}

/** Build a CalendarDate from the given group parts (or null if invalid). */
function buildDateFromGroup(group: Group): DateValue | null {
	return buildCalendarDate(getGroupParts(group), props.yearsRange)
}

/* -------------------------------------------------------------------------- */
/*                              Computed                                      */
/* -------------------------------------------------------------------------- */

const parts1 = computed<DateParts>(() => ({
	day: day1.value,
	month: month1.value,
	year: year1.value,
}))

const parts2 = computed<DateParts>(() => ({
	day: day2.value,
	month: month2.value,
	year: year2.value,
}))

const isComplete1 = computed(
	() =>
		day1.value.length === 2 &&
		month1.value.length === 2 &&
		year1.value.length === 4
)
const isComplete2 = computed(
	() =>
		day2.value.length === 2 &&
		month2.value.length === 2 &&
		year2.value.length === 4
)

const isValid1 = computed(() =>
	isValidDateParts(parts1.value, props.yearsRange)
)
const isValid2 = computed(() =>
	isValidDateParts(parts2.value, props.yearsRange)
)

const hasAnyInput1 = computed(
	() => day1.value !== '' || month1.value !== '' || year1.value !== ''
)
const hasAnyInput2 = computed(
	() => day2.value !== '' || month2.value !== '' || year2.value !== ''
)

/**
 * True when the current trigger content is valid. Empty input is considered
 * valid so optional fields are not flagged; partial or invalid dates are
 * invalid.
 */
const isValid = computed(() => {
	if (isRange.value) {
		if (!hasAnyInput1.value && !hasAnyInput2.value) return true
		if (!isComplete1.value || !isValid1.value) return false
		if (!isComplete2.value || !isValid2.value) return false
		return true
	}
	if (!hasAnyInput1.value) return true
	return isComplete1.value && isValid1.value
})

/** True when the trigger currently holds a value worth displaying. */
const hasValue = computed(() => {
	if (isRange.value) {
		return (
			props.start !== null ||
			props.end !== null ||
			isComplete1.value ||
			isComplete2.value
		)
	}
	// Also consider the local state, not just the prop, so the UI updates
	// immediately after the user types (before the parent has had a chance
	// to update the prop via v-model).
	return props.modelValue !== null || isComplete1.value
})

/* -------------------------------------------------------------------------- */
/*                          Focus management                                  */
/* -------------------------------------------------------------------------- */

function focusSegment(segment: SegmentName) {
	segmentRefs[segment].value?.focus()
}

function anySegmentHasFocus() {
	return Object.values(segmentRefs).some((ref) => ref.value?.hasFocus())
}

/** Switch back to edit mode and focus the first segment. */
function enterEditMode() {
	if (props.disabled) return
	isDisplayMode.value = false
	nextTick(() => {
		if (!anySegmentHasFocus()) {
			focusSegment('day')
		}
	})
}

/**
 * Handle clicking the display text. This must enter edit mode, but when the
 * trigger lives inside a Dropdown we avoid focusing the segmented input
 * immediately. Focusing too early pulls focus back to the trigger while reka-ui
 * is opening the popover, which causes the dropdown to close right after it
 * opens. The user can click the segmented inputs once they appear.
 */
function onDisplayClick() {
	if (props.disabled) return
	isDisplayMode.value = false
	if (!isInsideDropdown.value) {
		nextTick(() => {
			if (!anySegmentHasFocus()) {
				focusSegment('day')
			}
		})
	}
}

/**
 * Handle blur of a segmented input. We only emit `blur` and toggle display mode
 * when focus truly leaves the trigger (relatedTarget is outside the wrapper).
 * Auto-advance between segments moves focus to another input inside the
 * wrapper, so those blurs are ignored.
 */
function handleSegmentBlur(event: FocusEvent) {
	if (props.disabled) return
	// Auto-pad single-digit day/month segments so the date remains valid when
	// the user tabs/auto-advances out of the segment.
	if (day1.value.length === 1) day1.value = `0${day1.value}`
	if (month1.value.length === 1) month1.value = `0${month1.value}`
	if (day2.value.length === 1) day2.value = `0${day2.value}`
	if (month2.value.length === 1) month2.value = `0${month2.value}`

	const nextTarget = event.relatedTarget as Node | null
	const movingInside =
		wrapperRef.value && nextTarget && wrapperRef.value.contains(nextTarget)
	if (movingInside) return
	emits('blur')
	handleBlur()
}

/** Handle paste of a full or partial date into any segment. */
function handleSegmentPaste(rawText: string) {
	const digits = rawText.replace(/\D/g, '').slice(0, 16)
	if (digits.length === 0) return

	if (digits.length >= 2) day1.value = digits.slice(0, 2)
	if (digits.length >= 4) month1.value = digits.slice(2, 4)
	if (digits.length >= 8) year1.value = digits.slice(4, 8)
	else year1.value = ''

	if (isRange.value) {
		if (digits.length >= 10) day2.value = digits.slice(8, 10)
		else day2.value = ''
		if (digits.length >= 12) month2.value = digits.slice(10, 12)
		else month2.value = ''
		if (digits.length >= 16) year2.value = digits.slice(12, 16)
		else year2.value = ''
	}

	emitIfValid()

	nextTick(() => {
		if (isRange.value && digits.length >= 16) {
			focusSegment('endYear')
		} else if (digits.length >= 8) {
			focusSegment('year')
		} else if (digits.length >= 4) {
			focusSegment('month')
		} else {
			focusSegment('day')
		}
	})
}

function handleBlur() {
	if (props.disabled) return
	// If the parent reports the value as invalid, stay in edit mode so the
	// user can see and fix the error.
	if (props.invalid) {
		isDisplayMode.value = false
		return
	}
	if (isRange.value) {
		const leftReady = isComplete1.value && isValid1.value
		const rightReady = isComplete2.value && isValid2.value
		// Only collapse to display mode when the whole range is filled and valid.
		if (leftReady && rightReady) {
			isDisplayMode.value = true
		} else {
			isDisplayMode.value = false
		}
		return
	}
	if (isComplete1.value && isValid1.value) {
		isDisplayMode.value = true
	} else {
		isDisplayMode.value = false
	}
}

function clearEditable() {
	if (isRange.value) {
		day1.value = ''
		month1.value = ''
		year1.value = ''
		day2.value = ''
		month2.value = ''
		year2.value = ''
		emits('update:start', null)
		emits('update:end', null)
	} else {
		day1.value = ''
		month1.value = ''
		year1.value = ''
		emits('update:modelValue', null)
	}
	// After clearing, collapse back to display mode showing the placeholder.
	isDisplayMode.value = true
	emits('reset')
}

/* -------------------------------------------------------------------------- */
/*                              Emit helpers                                  */
/* -------------------------------------------------------------------------- */

function emitIfValid() {
	if (isRange.value) {
		const sComplete =
			day1.value.length === 2 &&
			month1.value.length === 2 &&
			year1.value.length === 4
		const eComplete =
			day2.value.length === 2 &&
			month2.value.length === 2 &&
			year2.value.length === 4
		if (sComplete) {
			isInternalEmit.value = true
			emits('update:start', buildDateFromGroup(1))
		}
		if (eComplete) {
			isInternalEmit.value = true
			emits('update:end', buildDateFromGroup(2))
		}
		return
	}
	if (!isComplete1.value) {
		if (!hasValue.value && props.modelValue !== null) {
			isInternalEmit.value = true
			emits('update:modelValue', null)
		}
		return
	}
	const built = buildDateFromGroup(1)
	if (built) {
		isInternalEmit.value = true
		emits('update:modelValue', built)
	}
}

/* -------------------------------------------------------------------------- */
/*                              Display formatter                             */
/* -------------------------------------------------------------------------- */

function formatDisplay(value: DateValue): string {
	return new Intl.DateTimeFormat(props.locale, {
		weekday: 'long',
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(value.toDate(getLocalTimeZone()))
}

const displayText = computed(() => {
	if (isRange.value) {
		const left = props.start ? formatDisplay(props.start) : ''
		const right = props.end ? formatDisplay(props.end) : ''
		if (left && right) return `${left} — ${right}`
		return left || right || 'DD/MM/YYYY — DD/MM/YYYY'
	}
	// Prefer the local refs (so display mode shows typed value even before
	// the parent updates the prop) and fall back to the prop value.
	if (
		isComplete1.value &&
		isValid1.value &&
		day1.value.length === 2 &&
		month1.value.length === 2 &&
		year1.value.length === 4
	) {
		const built = buildDateFromGroup(1)
		if (built) return formatDisplay(built)
	}
	return props.modelValue ? formatDisplay(props.modelValue) : 'DD/MM/YYYY'
})

/** True when the display text is showing the placeholder. */
const isPlaceholder = computed(() => {
	if (isRange.value) {
		return props.start === null && props.end === null
	}
	return props.modelValue === null && !isComplete1.value
})

/* -------------------------------------------------------------------------- */
/*                              Watchers                                      */
/* -------------------------------------------------------------------------- */

// Sync segmented inputs from external prop changes. When the change comes
// from outside (calendar selection, parent update, prefilled value) and the
// resulting value is complete, switch to display mode automatically.
watch(
	() => [props.modelValue, props.start, props.end],
	() => {
		syncFromModel()
		if (isInternalEmit.value) {
			isInternalEmit.value = false
			return
		}
		if (props.disabled) return
		if (isRange.value) {
			if (props.start !== null && props.end !== null) {
				isDisplayMode.value = true
			}
		} else if (props.modelValue !== null) {
			isDisplayMode.value = true
		}
	}
)

// Auto-emit when user types and the relevant group is complete.
watch([day1, month1, year1, day2, month2, year2], () => {
	emitIfValid()
})

// Notify the parent once the user has finished typing a complete date,
// so the parent can run validation without waiting for blur.
watch(isComplete1, (complete, wasComplete) => {
	if (isRange.value) {
		return
	}
	if (complete && !wasComplete) {
		emits('complete')
	}
})
watch(isComplete2, (complete, wasComplete) => {
	if (complete && !wasComplete) {
		emits('complete')
	}
})

/** Initialise the segmented inputs from the initial model value. */
syncFromModel()

/* -------------------------------------------------------------------------- */
/*                              Imperative API                                */
/* -------------------------------------------------------------------------- */

function focus() {
	if (isDisplayMode.value) enterEditMode()
	else focusSegment('day')
}

defineExpose({
	focus,
	isValid,
	hasAnyInput1,
	hasAnyInput2,
})

/* -------------------------------------------------------------------------- */
/*                              Helpers for template                          */
/* -------------------------------------------------------------------------- */

function attr(suffix: string) {
	return {
		'data-cy': props.dataCy ? `${props.dataCy}-${suffix}` : `datepicker-editable-${suffix}`,
		'data-testid': props.dataTestid
			? `${props.dataTestid}-${suffix}`
			: `datepicker-editable-${suffix}`,
		name: props.dataCy ? `${props.dataCy}-${suffix}` : `datepicker-editable-${suffix}`,
	}
}
</script>

<template>
	<div ref="wrapperRef" :class="cn('h-fit relative')">
		<InputPrefix @width-change="() => {}">
			<button
				type="button"
				tabindex="-1"
				class="text-neutral-600 hover:text-main disabled:cursor-not-allowed disabled:opacity-50 pointer-events-auto"
				:disabled="disabled"
				aria-label="Open calendar"
				v-bind="attr('calendar-icon')"
			>
				<i class="si-heroicon-outline-calendar"></i>
			</button>
		</InputPrefix>
		<div
			v-if="!isDisplayMode"
			:class="
				cn(
					inputVariants({ size, disabled }),
					props.class,
					'flex items-center pl-10',
					{
						'focus-within:shadow-primary focus-within:border-primary-default': !(dirty && invalid),
						'border-danger-default shadow-danger': dirty && invalid,
					}
				)
			"
		>
			<DatepickerEditableInput
				ref="dayRef"
				v-model="day1"
				placeholder="DD"
				:max-length="2"
				width-class="w-6"
				:disabled="disabled"
				v-bind="attr('day')"
				@next="focusSegment('month')"
				@paste="handleSegmentPaste"
				@blur="handleSegmentBlur"
			/>
			<span class="text-neutral-500 select-none">/</span>
			<DatepickerEditableInput
				ref="monthRef"
				v-model="month1"
				placeholder="MM"
				:max-length="2"
				width-class="w-7"
				:disabled="disabled"
				v-bind="attr('month')"
				@prev="focusSegment('day')"
				@next="focusSegment('year')"
				@paste="handleSegmentPaste"
				@blur="handleSegmentBlur"
			/>
			<span class="text-neutral-500 select-none">/</span>
			<DatepickerEditableInput
				ref="yearRef"
				v-model="year1"
				placeholder="YYYY"
				:max-length="4"
				width-class="w-9"
				:disabled="disabled"
				v-bind="attr('year')"
				@prev="focusSegment('month')"
				@next="isRange ? focusSegment('endDay') : undefined"
				@paste="handleSegmentPaste"
				@blur="handleSegmentBlur"
			/>
			<template v-if="isRange">
				<span class="text-neutral-500 select-none mx-1">—</span>
				<DatepickerEditableInput
					ref="endDayRef"
					v-model="day2"
					placeholder="DD"
					:max-length="2"
					width-class="w-6"
					:disabled="disabled"
					v-bind="attr('end-day')"
					@prev="focusSegment('year')"
					@next="focusSegment('endMonth')"
					@paste="handleSegmentPaste"
					@blur="handleSegmentBlur"
				/>
				<span class="text-neutral-500 select-none">/</span>
				<DatepickerEditableInput
					ref="endMonthRef"
					v-model="month2"
					placeholder="MM"
					:max-length="2"
					width-class="w-7"
					:disabled="disabled"
					v-bind="attr('end-month')"
					@prev="focusSegment('endDay')"
					@next="focusSegment('endYear')"
					@paste="handleSegmentPaste"
					@blur="handleSegmentBlur"
				/>
				<span class="text-neutral-500 select-none">/</span>
				<DatepickerEditableInput
					ref="endYearRef"
					v-model="year2"
					placeholder="YYYY"
					:max-length="4"
					width-class="w-9"
					:disabled="disabled"
					v-bind="attr('end-year')"
					@prev="focusSegment('endMonth')"
					@paste="handleSegmentPaste"
					@blur="handleSegmentBlur"
				/>
			</template>
		</div>
		<div
			v-else
			:class="
				cn(
					inputVariants({ size, disabled }),
					props.class,
					'flex items-center cursor-text pl-10 pr-10',
					{}
				)
			"
			tabindex="0"
			role="button"
			v-bind="attr('display')"
			@mousedown.prevent
			@click="onDisplayClick"
			@keydown.enter="enterEditMode"
		>
			<span
				:class="
					isPlaceholder
						? 'text-neutral-500'
						: 'text-main dark:text-neutral-500'
				"
			>
				{{ displayText }}
			</span>
		</div>
		<InputSuffix>
			<i
				v-if="!isDisplayMode && dirty && invalid"
				class="text-danger-default si-alert-circle mr-2"
			></i>
			<button
				v-if="hasValue && !(dirty && invalid)"
				type="button"
				tabindex="-1"
				class="text-neutral-600 hover:text-main disabled:cursor-not-allowed disabled:opacity-50"
				:disabled="disabled"
				aria-label="Clear date"
				v-bind="attr('clear-button')"
				@mousedown.prevent
				@click.stop="clearEditable"
			>
				<i class="si-heroicon-solid-x-mark"></i>
			</button>
		</InputSuffix>
	</div>
</template>
