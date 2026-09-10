export { default as DatePicker } from './DatePicker.vue'
export { default as DatepickerEditableTrigger } from './DatepickerEditableTrigger.vue'
import {
	formatStandard,
	formatFull,
	formatShort,
	formatWithMonthName,
	formatWithShortMonthName,
} from '../../utils/format-date'
import { type DateValue } from '@internationalized/date'
import { cva } from 'class-variance-authority'

export const datepickerValidationVariants = cva('', {
	variants: {
		invalid: {
			true: 'border-danger-default shadow-danger focus-visible:border-danger-default focus-visible:shadow-danger dark:focus-visible:border-danger-default',
			false: 'focus-within:shadow-primary focus-within:border-primary-default',
		},
	},
})

export enum DateFormatEnum {
	STANDARD = 'standard',
	SHORT = 'short',
	WITH_MONTH_NAME = 'with-month-name',
	WITH_SHORT_MONTH_NAME = 'with-short-month-name',
	FULL = 'full',
}

export function useFormatDate(
	formatDate: string,
	value: DateValue,
	locale: string = 'id-ID'
) {
	switch (formatDate) {
		case DateFormatEnum.STANDARD:
			return formatStandard(value)
		case DateFormatEnum.SHORT:
			return formatShort(value, locale)
		case DateFormatEnum.WITH_MONTH_NAME:
			return formatWithMonthName(value, locale)
		case DateFormatEnum.WITH_SHORT_MONTH_NAME:
			return formatWithShortMonthName(value, locale)
		case DateFormatEnum.FULL:
			return formatFull(value, locale)
		default:
			return formatStandard(value)
	}
}
