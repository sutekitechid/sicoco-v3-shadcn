<script lang="ts" setup>
import { cn } from '../../utils/tw-merge'
import {
	CalendarRoot,
	type CalendarRootEmits,
	type CalendarRootProps,
	useForwardPropsEmits,
} from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'
import {
	CalendarCell,
	CalendarCellTrigger,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHead,
	CalendarGridRow,
	CalendarHeadCell,
	CalendarHeader,
	CalendarHeading,
	CalendarNextButton,
	CalendarPrevButton,
} from '.'

import { getColorDate, getTooltipDate } from '../../utils/date-picker'

import { ImportantDate } from '../../utils/date-picker-types'

const props = defineProps<
	CalendarRootProps & { class?: HTMLAttributes['class'] } & {
		importantDates?: ImportantDate[]
	}
>()

const emits = defineEmits<CalendarRootEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<CalendarRoot
		v-slot="{ grid, weekDays }"
		:class="cn('p-3', props.class)"
		v-bind="forwarded"
	>
		<CalendarHeader class="border-b border-neutral-20 pb-4">
			<CalendarPrevButton />
			<CalendarHeading />
			<CalendarNextButton />
		</CalendarHeader>

		<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
			<CalendarGrid v-for="month in grid" :key="month.value.toString()">
				<CalendarGridHead>
					<CalendarGridRow>
						<CalendarHeadCell v-for="day in weekDays" :key="day">
							{{ day }}
						</CalendarHeadCell>
					</CalendarGridRow>
				</CalendarGridHead>
				<CalendarGridBody>
					<CalendarGridRow
						v-for="(weekDates, index) in month.rows"
						:key="`weekDate-${index}`"
						class="mt-2 w-full"
					>
						<CalendarCell
							v-for="weekDate in weekDates"
							:key="weekDate.toString()"
							:date="weekDate"
						>
							<CalendarCellTrigger
								:day="weekDate"
								:month="month.value"
								:color="getColorDate(props.importantDates, weekDate)"
								:tooltip="getTooltipDate(props.importantDates, weekDate)"
							/>
						</CalendarCell>
					</CalendarGridRow>
				</CalendarGridBody>
			</CalendarGrid>
		</div>
	</CalendarRoot>
</template>
