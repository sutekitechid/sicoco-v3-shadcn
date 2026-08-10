<script setup lang="ts">
import { ref, computed, HTMLAttributes } from 'vue'
import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { requiredIf } from '@vuelidate/validators'

import BaseInput from '../base-input/BaseInput.vue'
import BaseInputErrorMessage from '../base-input-error-message/BaseInputErrorMessage.vue'
import { InputPrefix } from '../input/index'
import { InputSuffix } from '../input/index'
import { dropdownVariants } from '../dropdown/index'
import { cn } from '../../utils/tw-merge'

import { DateFormatEnum } from '.'

/**
 * NativeDatePicker is a single-date picker that uses the browser's native
 * `<input type="date" />` instead of a popover calendar. It is intended for
 * mobile views where the OS-native picker (wheel on iOS, dialog on Android)
 * gives the best UX.
 *
 * The trigger visual is intentionally identical to the existing Dropdown
 * trigger (height 44px, `border-main`, `rounded`, focus ring primary,
 * error state danger, disabled state netral, dark mode support) so the two
 * are interchangeable from a design-system point of view.
 *
 * Validation is handled by `BaseInput` exactly like the regular `DatePicker`.
 *
 * @example
 * <NativeDatePicker v-model="selectedDate" placeholder="Pick a date" />
 */

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		modelValue?: DateValue | null
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
		modelValue: null,
		placeholder: 'Pick a date',
		formatDate: DateFormatEnum?.STANDARD,
		locale: 'id-ID',
		required: false,
		disabled: false,
		customValidators: null,
	}
)

const emits = defineEmits<{
	(event: 'update:modelValue', value: DateValue | null): void
}>()

defineSlots<{
	required?: unknown
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errors?: (props: { validation: any }) => unknown
	hint?: unknown
}>()

/* -------------------------------------------------------------------------- */
/*                              Date conversion                               */
/* -------------------------------------------------------------------------- */

function toIso(value: DateValue | null | undefined): string {
	if (!value) return ''
	const tz = getLocalTimeZone()
	const d = value.toDate(tz)
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${y}-${m}-${day}`
}

function fromIso(iso: string): DateValue | null {
	if (!iso) return null
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
	if (!match) return null
	const year = Number(match[1])
	const month = Number(match[2])
	const day = Number(match[3])
	if (!year || !month || !day) return null
	return new CalendarDate(year, month, day)
}

const isoValue = computed(() => toIso(props.modelValue))

/* -------------------------------------------------------------------------- */
/*                                Min / Max                                   */
/* -------------------------------------------------------------------------- */

const minDate = computed(() => {
	if (props.yearsRange && props.yearsRange[0]) {
		return `${props.yearsRange[0]}-01-01`
	}
	return undefined
})

const maxDate = computed(() => {
	if (props.yearsRange && props.yearsRange[1]) {
		return `${props.yearsRange[1]}-12-31`
	}
	return undefined
})

/* -------------------------------------------------------------------------- */
/*                                  State                                     */
/* -------------------------------------------------------------------------- */

const baseInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const hasValue = computed(() => props.modelValue !== null)

/* -------------------------------------------------------------------------- */
/*                              Trigger state                                 */
/* -------------------------------------------------------------------------- */

const DropdownType = Object.freeze({
	DISABLED: 'disabled',
	SELECTED: 'selected',
	DEFAULT: 'default',
})

const typeButton = computed(() => {
	if (props.disabled) return DropdownType.DISABLED
	if (hasValue.value) return DropdownType.SELECTED
	return DropdownType.DEFAULT
})

/* -------------------------------------------------------------------------- */
/*                              Validation                                    */
/* -------------------------------------------------------------------------- */

const rules = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const base: Record<string, any> = {
		modelValue: {
			required: requiredIf(() => props.required),
			isValidDate: () => {
				if (!props.required && props.modelValue === null) return true
				return props.modelValue !== null
			},
			...props.customValidators,
		},
	}
	return base
})

const useValidation = computed(() => {
	if (props.disabled) return false
	return props.required || props.customValidators !== null
})

/* -------------------------------------------------------------------------- */
/*                                Handlers                                    */
/* -------------------------------------------------------------------------- */

function onInput(event: Event) {
	const target = event.target as HTMLInputElement
	const value = fromIso(target.value)
	emits('update:modelValue', value)
}

function clear() {
	emits('update:modelValue', null)
	inputRef.value?.focus()
	baseInputRef.value?.reset()
}

function validate() {
	if (useValidation.value) {
		baseInputRef.value?.validate()
	}
}

function focus() {
	inputRef.value?.focus()
}
</script>

<template>
	<BaseInput
		ref="baseInputRef"
		:model-value="modelValue"
		:validation-rules="rules"
		:use-validation="useValidation"
		:focus-function="focus"
		class="w-full"
	>
		<template #default>
			<div
				:class="
					cn(
						dropdownVariants({ type: typeButton }),
						'native-date-picker__trigger relative',
						'focus-within:outline-hidden',
						'focus-within:shadow-primary',
						'focus-within:ring-offset-0 focus-within:border-primary-main',
						'dark:focus-within:border-primary-700',
						props.class
					)
				"
			>
				<InputPrefix>
					<i class="si-heroicon-outline-calendar text-neutral-600" />
				</InputPrefix>
				<input
					ref="inputRef"
					type="date"
					:value="isoValue"
					:disabled="disabled"
					:min="minDate"
					:max="maxDate"
					:placeholder="placeholder"
					:data-cy="dataCy ? `${dataCy}-native-input` : 'native-date-picker-input'"
					:data-testid="dataTestid ?? dataCy
						? `${dataTestid ?? dataCy}-native-input`
						: 'native-date-picker-input'"
					class="w-full min-w-0 bg-transparent border-0 outline-hidden
						h-full pl-6 pr-6 mx-4 text-main dark:text-neutral-500
						disabled:cursor-not-allowed disabled:text-neutral-500
						native-date-picker__input"
					@input="onInput"
					@blur="validate"
				/>
				<InputSuffix>
					<button
						v-if="hasValue && !disabled"
						type="button"
						tabindex="-1"
						aria-label="Clear date"
						class="text-neutral-600 hover:text-main"
						:data-cy="dataCy ? `${dataCy}-clear` : 'native-date-picker-clear'"
						:data-testid="dataTestid ?? dataCy
							? `${dataTestid ?? dataCy}-clear`
							: 'native-date-picker-clear'"
						@mousedown.prevent
						@click.stop="clear"
					>
						<i class="si-heroicon-solid-x-mark"></i>
					</button>
				</InputSuffix>
			</div>
		</template>
		<template #errors="{ validation }">
			<BaseInputErrorMessage :invalid="validation.$invalid">
				<div v-if="validation.required?.$invalid">
					<slot name="required" />
				</div>
				<div v-else-if="validation.isValidDate?.$invalid">
					<slot name="invalid-date">
						<span class="text-danger-default">Tanggal tidak valid</span>
					</slot>
				</div>
				<div v-else-if="validation.$invalid">
					<slot name="errors" :validation="validation" />
				</div>
			</BaseInputErrorMessage>
		</template>
		<template v-if="$slots.hint" #hint>
			<slot name="hint" />
		</template>
	</BaseInput>
</template>

<style scoped>
	@reference "../../config/tailwind.css";

.native-date-picker__input {
	color: inherit;
}
.native-date-picker__input::-webkit-calendar-picker-indicator {
	opacity: 0;
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
}
.native-date-picker__input::-webkit-datetime-edit {
	color: inherit;
	padding: 0;
}
.native-date-picker__input::-webkit-datetime-edit-fields-wrapper {
	color: inherit;
}
.native-date-picker__input::-webkit-datetime-edit-text {
	color: inherit;
	padding: 0 0.1em;
}
.native-date-picker__input::-webkit-datetime-edit-month-field,
.native-date-picker__input::-webkit-datetime-edit-day-field,
.native-date-picker__input::-webkit-datetime-edit-year-field {
	color: inherit;
}

.input__has-error .native-date-picker__trigger {
	@apply border-danger-500 shadow-danger;
}
</style>
