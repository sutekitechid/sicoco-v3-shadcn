<script setup lang="ts">
import { getLocalTimeZone, isEqualDay, today, type DateValue } from '@internationalized/date'
import type { DateRange } from 'reka-ui'
import { computed,  onMounted, ref, watch, type HTMLAttributes } from 'vue'
import BaseInput from '../base-input/BaseInput.vue'
import BaseInputErrorMessage from '../base-input-error-message/BaseInputErrorMessage.vue'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { DrawerClose, DrawerTitle } from '../drawer'
import { RangeCalendar } from '../range-calendar'
import { useBreakpoint } from '../../composables/useBreakpoint'
import { useLibraryI18n } from '../../i18n'
import type { ImportantDate } from '../../utils/date-picker-types'
import DatepickerEditableTrigger from './DatepickerEditableTrigger.vue'
import DatePickerDesktopContainer from './DatePickerDesktopContainer.vue'
import DatePickerMobileContainer from './DatePickerMobileContainer.vue'

const props = withDefaults(defineProps<{
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
	maximumDays?: number
	minValue?: DateValue | null
	maxValue?: DateValue | null
	dataCy?: string
	dataTestid?: string
	customValidators?: Record<string, unknown>
}>(), {
	class: '', start: null, end: null, modelValue: null, placeholder: 'Pick a date',
	dateRange: false, importantDates: () => [] as ImportantDate[], formatDate: 'standard',
	locale: 'id-ID', required: false, disabled: false, customValidators: null,
})

const emits = defineEmits<{
	(event: 'update:start', value: DateValue | null): void
	(event: 'update:end', value: DateValue | null): void
	(event: 'update:modelValue', value: DateValue | null): void
}>()

const { isMobile } = useBreakpoint()
const { t } = useLibraryI18n()
const isDateRange = computed(() => props.dateRange)
const locale = computed(() => props.locale)
const numberOfMonths = computed(() => isMobile.value ? 1 : 2)
const datepickerContainer = computed(() => isMobile.value ? DatePickerMobileContainer : DatePickerDesktopContainer)
const drawerOpen = ref(false)
const isApplyingRange = ref(false)
const isCalendarClick = ref(false)
const dropdownRef = ref<{ closeDropdown: () => void } | null>(null)
const baseInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
const editableTriggerRef = ref<InstanceType<typeof DatepickerEditableTrigger> | null>(null)
const localRange = ref<{ start: DateValue | null; end: DateValue | null }>({ start: props.start, end: props.end })
const calendarPlaceholder = ref<DateValue>()
const touchStart = ref<{ x: number; y: number } | null>(null)
const slideDirection = ref<'next' | 'previous' | null>(null)
const drawerTitle = computed(() => t('datePicker.drawerTitle'))
const resetLabel = computed(() => t('common.reset'))
const rangeLabel = computed(() => t('datePicker.range'))
const cancelLabel = computed(() => t('common.cancel'))
const applyLabel = computed(() => t('common.apply'))
const invalidDateLabel = computed(() => t('datePicker.invalidDate'))
const invalidRangeLabel = computed(() => t('datePicker.invalidRange'))
const openCalendarLabel = computed(() => t('datePicker.openCalendar'))
const clearDateLabel = computed(() => t('datePicker.clearDate'))
const closeDrawerLabel = computed(() => t('datePicker.closeDrawer'))

const computedDateRange = computed<DateRange>({
	get() { return localRange.value as DateRange },
	set(value) {
		if (!value) return
		localRange.value = { start: value.start as DateValue | null, end: value.end as DateValue | null }
	},
})

const isRangeComplete = computed(() => localRange.value.start && localRange.value.end)
const isRangeValid = computed(() => {
	if (!props.maximumDays) return true
	if (!isRangeComplete.value) return true
	// `maximumDays` is an inclusive day count, so the allowed day gap is N - 1.
	const gap = Math.abs((localRange.value.end as DateValue).compare(localRange.value.start as DateValue))
	return gap <= props.maximumDays - 1
})
const isApplyDisabled = computed(() => !isRangeComplete.value || !isRangeValid.value)
const isResetButtonDisabled = computed(() => isDateRange.value
	? !localRange.value.start && !localRange.value.end
	: !props.modelValue)
const computedModelValue = computed({
	get() { return props.modelValue },
	set(value: DateValue | null) {
		emits('update:modelValue', value)
		closePanel()
	},
})
const baseInputModelValue = computed(() => isDateRange.value ? { start: props.start, end: props.end } : props.modelValue)
const useValidation = computed(() => !props.disabled && (props.required || props.customValidators !== null
	|| props.maximumDays !== undefined || props.minValue !== undefined || props.maxValue !== undefined))
const rules = computed(() => ({
	modelValue: {
		required: () => !props.required || (isDateRange.value ? props.start !== null && props.end !== null : props.modelValue !== null),
		isValidDate: () => {
			const trigger = editableTriggerRef.value
			if (!trigger) return !props.required
			if (isDateRange.value) return !props.required && !trigger.hasAnyInput1 && !trigger.hasAnyInput2 || trigger.isValid
			return !props.required && !trigger.hasAnyInput1 || trigger.isValid
		},
		isValidRange: () => isRangeValid.value,
		...props.customValidators,
	},
}))

const OPEN_EVENT = 'datepicker:open'
const instanceId = Symbol('datepicker-instance')

watch(() => [props.start, props.end], ([start, end]) => { localRange.value = { start, end } })

function syncRangeFromProps() { localRange.value = { start: props.start, end: props.end } }
function handlePanelOpenChange(open: boolean) {
	if (open) {
		syncRangeFromProps()
		window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: { id: instanceId } }))
		return
	}
	if (isApplyingRange.value) {
		isApplyingRange.value = false
		return
	}
	if (isDateRange.value) syncRangeFromProps()
}
function handleSlotBlur(validateFn: () => boolean) {
	if (isCalendarClick.value) {
		isCalendarClick.value = false
		return
	}
	validateFn()
}
function closePanel() {
	if (isMobile.value) {
		drawerOpen.value = false
		return
	}
	dropdownRef.value?.closeDropdown()
}
function applyRange() {
	if (!isRangeComplete.value || !isRangeValid.value) return
	isApplyingRange.value = true
	emits('update:start', localRange.value.start as DateValue)
	emits('update:end', localRange.value.end as DateValue)
	baseInputRef.value?.validate()
	closePanel()
}
function cancelRange() { syncRangeFromProps(); closePanel() }
/**
 * Clear the range and commit the cleared state to the parent. Used by the
 * trigger X clear button and the mobile header Reset so a committed range
 * can be cleared without going through Terapkan (which requires a complete
 * draft). Mirrors how single mode emits `update:modelValue(null)` on clear.
 */
function clearRange() {
	const hasDraft = !!(localRange.value.start || localRange.value.end)
	localRange.value = { start: null, end: null }
	if (!hasDraft) return
	emits('update:start', null)
	emits('update:end', null)
	baseInputRef.value?.reset()
}
function resetSingle() { emits('update:modelValue', null); baseInputRef.value?.reset() }
function resetMobileSelection() { if (isDateRange.value) clearRange(); else resetSingle() }
function updateRangeStart(value: DateValue | null) {
	if (isMobile.value) return
	if (value === null) return clearRange()
	const isNewRange = value && localRange.value.start && localRange.value.end
		&& !isEqualDay(value, localRange.value.start as DateValue)
	if (isNewRange) {
		// Editing the start of a complete range begins a new range.
		localRange.value = { start: value, end: null }
		return
	}
	localRange.value = { ...localRange.value, start: value }
}
function updateRangeEnd(value: DateValue | null) {
	if (isMobile.value) return
	if (value === null) return clearRange()
	localRange.value = { ...localRange.value, end: value }
}
function resetInput() { baseInputRef.value?.reset() }
function focusEditableTrigger() { editableTriggerRef.value?.focus() }
function handleCalendarTouchStart(event: TouchEvent) {
	if (!isMobile.value || event.touches.length !== 1) return
	const touch = event.touches[0]
	touchStart.value = { x: touch.clientX, y: touch.clientY }
}
function handleCalendarTouchEnd(event: TouchEvent) {
	const start = touchStart.value
	touchStart.value = null
	if (!isMobile.value || !start || event.changedTouches.length !== 1) return

	const touch = event.changedTouches[0]
	const horizontalDistance = touch.clientX - start.x
	const verticalDistance = touch.clientY - start.y
	if (Math.abs(horizontalDistance) < 50 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return

	const placeholder = calendarPlaceholder.value ?? (isDateRange.value
		? localRange.value.start ?? localRange.value.end
		: props.modelValue) ?? today(getLocalTimeZone())
	slideDirection.value = horizontalDistance < 0 ? 'next' : 'previous'
	calendarPlaceholder.value = placeholder.add({ months: horizontalDistance < 0 ? 1 : -1 })
}
function clearSlideAnimation() { slideDirection.value = null }

onMounted(() => {
	window.addEventListener(OPEN_EVENT, (event: Event) => {
		const custom = event as CustomEvent<{ id: symbol }>
		if (custom.detail?.id === instanceId) return
		if (isMobile.value) drawerOpen.value = false
		else dropdownRef.value?.closeDropdown()
	})
})
</script>

<template>
	<component
		:is="datepickerContainer"
		ref="dropdownRef"
		v-model:open="drawerOpen"
		:disabled="props.disabled"
		:data-cy="props.dataCy"
		:data-testid="props.dataTestid ?? props.dataCy"
		@update:open="handlePanelOpenChange"
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
					<DatepickerEditableTrigger
						v-if="isDateRange"
						ref="editableTriggerRef"
						mode="range"
						:start="(isMobile ? props.start : localRange.start) as DateValue | null"
						:end="(isMobile ? props.end : localRange.end) as DateValue | null"
						:dirty="dirty"
						:invalid="invalid"
						:years-range="props.yearsRange"
						:min-value="props.minValue"
						:max-value="props.maxValue"
						:locale="locale"
						:format-date="props.formatDate"
						:open-calendar-label="openCalendarLabel"
						:clear-date-label="clearDateLabel"
						:disabled="props.disabled"
						:readonly="isMobile"
						:hide-clear="isMobile"
						:data-cy="props.dataCy"
						:data-testid="props.dataTestid ?? props.dataCy"
						:class="props.class"
						@update:start="updateRangeStart"
						@update:end="updateRangeEnd"
						@blur="handleSlotBlur(validate)"
						@complete="validate"
						@reset="resetInput"
					/>
					<DatepickerEditableTrigger
						v-else ref="editableTriggerRef" v-model="computedModelValue"
						:dirty="dirty"
						:invalid="invalid"
						:years-range="props.yearsRange"
						:min-value="props.minValue"
						:max-value="props.maxValue"
						:locale="locale"
						:format-date="props.formatDate"
						:open-calendar-label="openCalendarLabel"
						:clear-date-label="clearDateLabel"
						:disabled="props.disabled"
						:readonly="isMobile"
						:hide-clear="isMobile"
						:data-cy="props.dataCy"
						:data-testid="props.dataTestid ?? props.dataCy"
						:class="props.class"
						@blur="handleSlotBlur(validate)"
						@complete="validate"
						@reset="resetInput"
					/>
				</template>
				<template #errors="{ validation }">
					<BaseInputErrorMessage :invalid="validation.$invalid">
						<div v-if="validation.required?.$invalid"><slot name="required" /></div>
						<div v-else-if="validation.isValidDate?.$invalid"><slot name="invalid-date">{{ invalidDateLabel }}</slot></div>
						<div v-else-if="validation.isValidRange?.$invalid"><slot name="invalid-range">{{ invalidRangeLabel }}</slot></div>
						<div v-else-if="validation.$invalid"><slot name="errors" :validation="validation" /></div>
					</BaseInputErrorMessage>
				</template>
			</BaseInput>
		</template>
		<template #header>
			<DrawerClose :aria-label="closeDrawerLabel" class="static mr-2" />
			<DrawerTitle>{{ drawerTitle }}</DrawerTitle>
			<Button
				:disabled="isResetButtonDisabled"
				class="ml-auto bg-white"
				variant="tertiary-primary"
				size="md"
				@click="resetMobileSelection"
			>{{ resetLabel }}</Button>
		</template>
		<template v-if="isDateRange" #range-display>
			<div class="px-5 py-2">
				<p class="mb-2 text-label-lg font-semibold">{{ rangeLabel }}</p>
				<DatepickerEditableTrigger
					mode="range"
					:start="localRange.start as DateValue | null" :end="localRange.end as DateValue | null"
					:years-range="props.yearsRange"
					:min-value="props.minValue"
					:max-value="props.maxValue"
					:locale="locale"
					:format-date="props.formatDate"
					:open-calendar-label="openCalendarLabel"
					:clear-date-label="clearDateLabel"
					:disabled="props.disabled"
					:readonly="true" :hide-clear="true"
					:data-cy="props.dataCy ? `${props.dataCy}-drawer` : undefined"
					:data-testid="props.dataTestid ? `${props.dataTestid}-drawer` : undefined"
				/>
			</div>
		</template>
		<RangeCalendar
			v-if="isDateRange"
			v-model="computedDateRange"
			v-model:placeholder="calendarPlaceholder"
			:number-of-months="numberOfMonths"
			:important-dates="props.importantDates"
			:locale="locale"
			:years-range="props.yearsRange"
			:maximum-days="props.maximumDays"
			:min-value="props.minValue"
			:max-value="props.maxValue"
			:data-cy="props.dataCy"
			:data-testid="props.dataTestid ?? props.dataCy"
			:class="slideDirection && `datepicker-slide-${slideDirection}`"
			class="range-calendar"
			prevent-deselect
			@mousedown="isCalendarClick = true"
			@touchstart.passive="handleCalendarTouchStart"
			@touchend="handleCalendarTouchEnd"
			@animationend="clearSlideAnimation"
		/>
		<Calendar
			v-else
			v-model="computedModelValue"
			v-model:placeholder="calendarPlaceholder"
			:important-dates="props.importantDates"
			:locale="locale"
			:years-range="props.yearsRange"
			:min-value="props.minValue"
			:max-value="props.maxValue"
			:data-cy="props.dataCy"
			:data-testid="props.dataTestid ?? props.dataCy"
			:class="slideDirection && `datepicker-slide-${slideDirection}`"
			prevent-deselect
			@mousedown="isCalendarClick = true"
			@touchstart.passive="handleCalendarTouchStart"
			@touchend="handleCalendarTouchEnd"
			@animationend="clearSlideAnimation"
		/>
		<template v-if="isDateRange" #footer>
			<Button
				variant="primary"
				size="md"
				outlined
				:class="isMobile && 'w-full'"
				@click="cancelRange"
			>{{ cancelLabel }}</Button>
			<Button
				variant="primary"
				size="md"
				:disabled="isApplyDisabled"
				:class="isMobile && 'w-full'"
				@mousedown="isCalendarClick = true"
				@click="applyRange"
			>{{ applyLabel }}</Button>
		</template>
	</component>
</template>

<style scoped>
.datepicker-slide-next :deep(.calendar-grid-container) {
	animation: datepicker-slide-next 180ms ease-out;
}

.datepicker-slide-previous :deep(.calendar-grid-container) {
	animation: datepicker-slide-previous 180ms ease-out;
}

@keyframes datepicker-slide-next {
	from { opacity: 0; transform: translateX(1rem); }
	to { opacity: 1; transform: translateX(0); }
}

@keyframes datepicker-slide-previous {
	from { opacity: 0; transform: translateX(-1rem); }
	to { opacity: 1; transform: translateX(0); }
}
</style>
