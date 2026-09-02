<script lang="ts" setup>
import { type HTMLAttributes, computed, ref } from 'vue'
import { useForwardPropsEmits } from 'reka-ui'
import type {
  MonthPickerRootProps,
  MonthPickerRootEmits,
} from 'reka-ui'

import MonthpickerComponent from './MonthpickerComponent.vue'
import Yearpicker from '../yearpicker/Yearpicker.vue'

const PICKER_MODE_ENUM = {
    MONTH: 'month',
    YEAR: 'year'
}

const COMPONENT_ENUM = {
    [PICKER_MODE_ENUM.MONTH]: MonthpickerComponent,
    [PICKER_MODE_ENUM.YEAR]: Yearpicker
}

type PickerMode = (typeof PICKER_MODE_ENUM)[keyof typeof PICKER_MODE_ENUM]

type MonthPickerEmits = {
  'month-change': [event: number]
  'update:pickerMode': [value: PickerMode]
}

const props = defineProps<
  MonthPickerRootProps & { class?: HTMLAttributes['class']; pickerMode?: PickerMode }
>()

const emits = defineEmits<MonthPickerRootEmits & MonthPickerEmits>()

const delegatedProps = computed(() => {
	const { ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const localPickerMode = ref<PickerMode>(PICKER_MODE_ENUM.MONTH)
const pickerMode = computed({
  get() {
    return props.pickerMode ?? localPickerMode.value
  },
  set(value: PickerMode) {
    localPickerMode.value = value
    emits('update:pickerMode', value)
  }
})
</script>

<template>
    <component
        :is="COMPONENT_ENUM[pickerMode]"
        class="hover:cursor-pointer"
        v-bind="forwarded"
        @year-click="pickerMode = PICKER_MODE_ENUM.YEAR"
        @select-year="pickerMode = PICKER_MODE_ENUM.MONTH"
        @month-change="emits('month-change', $event)"
    >
        <template #default="{ date, monthValue }">
            <slot :date="date" :monthValue="monthValue"></slot>
        </template>
    </component>
</template>
