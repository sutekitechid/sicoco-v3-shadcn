<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import { computed, ref, type HTMLAttributes } from 'vue'

import { useBreakpoint } from '../../composables/useBreakpoint'
import { useLibraryI18n } from '../../i18n'
import { cn } from '../../utils/tw-merge'
import BaseInput from '../base-input/BaseInput.vue'
import { Button } from '../button'
import { DrawerClose, DrawerTitle } from '../drawer'
import PickerDesktopContainer from '../picker-container/PickerDesktopContainer.vue'
import PickerMobileContainer from '../picker-container/PickerMobileContainer.vue'
import YearPickerContent from '../yearpicker/YearPickerContent.vue'

const props = withDefaults(defineProps<{
	modelValue?: DateValue | null
	yearsRange?: [number, number]
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
const currentYear = new Date().getFullYear()
const range = computed(() => props.yearsRange ?? [currentYear - 5, currentYear + 5])
const minValue = computed(() => new CalendarDate(range.value[0], 1, 1))
const maxValue = computed(() => new CalendarDate(range.value[1], 12, 31))
const container = computed(() => isMobile.value ? PickerMobileContainer : PickerDesktopContainer)
const placeholder = computed(() => props.modelValue ?? new CalendarDate(currentYear, 1, 1))
const validationRules = { modelValue: { valid: () => true } }

function updateYear(value: DateValue | DateValue[] | undefined) {
	if (!value || Array.isArray(value)) return
	if (value.year < range.value[0] || value.year > range.value[1]) return
	emit('update:modelValue', new CalendarDate(value.year, 1, 1))
	open.value = false
}
</script>

<template>
	<component
		:is="container"
		v-model:open="open"
		:disabled="props.disabled"
		:model-value="props.modelValue"
	>
		<template #trigger>
			<BaseInput v-if="isMobile" :model-value="props.modelValue ?? undefined" :validation-rules="validationRules">
				<template #default>
					<Button type="button" variant="neutral" outlined :disabled="props.disabled" :class="cn('w-full justify-between', props.class)" :data-cy="props.dataCy" :data-testid="props.dataTestid ?? props.dataCy" :aria-label="t('yearPicker.openPicker')">
						{{ props.modelValue?.year ?? t('yearPicker.openPicker') }}
						<template #icon-right><i class="si-heroicon-outline-chevron-down" /></template>
					</Button>
				</template>
			</BaseInput>
			<Button v-else type="button" variant="neutral" outlined :disabled="props.disabled" :class="cn('w-full justify-between', props.class)" :data-cy="props.dataCy" :data-testid="props.dataTestid ?? props.dataCy" :aria-label="t('yearPicker.openPicker')">
				{{ props.modelValue?.year ?? t('yearPicker.openPicker') }}
				<template #icon-right><i class="si-heroicon-outline-chevron-down" /></template>
			</Button>
		</template>
		<template #header>
			<DrawerClose :aria-label="t('yearPicker.closeDrawer')" />
			<DrawerTitle>{{ t('yearPicker.drawerTitle') }}</DrawerTitle>
		</template>
		<YearPickerContent
			:model-value="props.modelValue ?? undefined"
			:placeholder="placeholder"
			:min-value="minValue"
			:max-value="maxValue"
			:locale="props.locale"
			@update:model-value="updateYear"
		/>
	</component>
</template>
