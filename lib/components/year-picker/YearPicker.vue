<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { computed, ref, type HTMLAttributes } from 'vue'

import { useBreakpoint } from '../../composables/useBreakpoint'
import { useLibraryI18n } from '../../i18n'
import { cn } from '../../utils/tw-merge'
import BaseInput from '../base-input/BaseInput.vue'
import { DrawerClose, DrawerTitle } from '../drawer'
import { inputVariants } from '../input'
import PickerDesktopContainer from '../picker-container/PickerDesktopContainer.vue'
import PickerMobileContainer from '../picker-container/PickerMobileContainer.vue'
import YearPickerContent from '../yearpicker/YearPickerContent.vue'

const props = withDefaults(defineProps<{
	modelValue?: DateValue | null
	yearsRange?: [number, number]
	placeholder?: string
	locale?: string
	disabled?: boolean
	class?: HTMLAttributes['class']
	dataCy?: string
	dataTestid?: string
}>(), { locale: 'id-ID', disabled: false })

const emit = defineEmits<{
	'update:modelValue': [value: DateValue]
}>()

const { isMobile } = useBreakpoint()
const { t } = useLibraryI18n()
const open = ref(false)
const pickerRef = ref<{ closeDropdown?: () => void } | null>(null)
const currentYear = new Date().getFullYear()
const range = computed(() => props.yearsRange ?? [currentYear - 5, currentYear + 5])
const minValue = computed(() => new CalendarDate(range.value[0], 1, 1))
const maxValue = computed(() => new CalendarDate(range.value[1], 12, 31))
const container = computed(() => isMobile.value ? PickerMobileContainer : PickerDesktopContainer)
// Grid anchor only, captured once on mount so selecting a year does not shift the page.
const placeholderDate = props.modelValue ?? new CalendarDate(currentYear, 1, 1)
const triggerLabel = computed(() => props.modelValue?.year ?? props.placeholder ?? t('yearPicker.openPicker'))
const validationRules = { modelValue: { valid: () => true } }

function updateYear(value: DateValue | DateValue[] | undefined) {
	if (!value || Array.isArray(value)) return
	if (value.year < range.value[0] || value.year > range.value[1]) return
	emit('update:modelValue', new CalendarDate(value.year, 1, 1))
	closePicker()
}

function closePicker() {
	open.value = false
	pickerRef.value?.closeDropdown?.()
}
</script>

<template>
	<component
		:is="container"
		ref="pickerRef"
		v-model:open="open"
		:disabled="props.disabled"
		:model-value="props.modelValue"
	>
		<template #trigger>
			<BaseInput v-if="isMobile" :model-value="props.modelValue ?? undefined" :validation-rules="validationRules">
				<template #default>
					<button type="button" :disabled="props.disabled" :class="cn(inputVariants({ disabled: props.disabled }), 'flex items-center gap-2 text-left cursor-pointer', props.class)" :data-cy="props.dataCy" :data-testid="props.dataTestid ?? props.dataCy" :aria-label="t('yearPicker.openPicker')">
						<i class="si-heroicon-outline-calendar text-neutral-600" />
						<span :class="!props.modelValue && 'text-placeholder'">{{ triggerLabel }}</span>
					</button>
				</template>
			</BaseInput>
			<button v-else type="button" :disabled="props.disabled" :class="cn(inputVariants({ disabled: props.disabled }), 'flex items-center gap-2 text-left cursor-pointer', props.class)" :data-cy="props.dataCy" :data-testid="props.dataTestid ?? props.dataCy" :aria-label="t('yearPicker.openPicker')">
				<i class="si-heroicon-outline-calendar text-neutral-600" />
				<span :class="!props.modelValue && 'text-placeholder'">{{ triggerLabel }}</span>
			</button>
		</template>
		<template #header>
			<DrawerClose :aria-label="t('yearPicker.closeDrawer')" />
			<DrawerTitle>{{ t('yearPicker.drawerTitle') }}</DrawerTitle>
		</template>
		<YearPickerContent
			:model-value="props.modelValue ?? undefined"
			:placeholder="placeholderDate"
			:min-value="minValue"
			:max-value="maxValue"
			:locale="props.locale"
			@select-year="updateYear"
			@update:model-value="updateYear"
		/>
	</component>
</template>
