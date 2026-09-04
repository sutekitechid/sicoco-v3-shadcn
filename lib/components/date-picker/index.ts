export { default as DatePicker } from './DatePicker.vue'
export { default as DatepickerEditableTrigger } from './DatepickerEditableTrigger.vue'
import {
	formatStandard,
	formatFull,
	formatShort,
	formatWithMonthName,
	formatWithShortMonthName,
} from '../../utils/format-date'
import { CalendarDate } from '@internationalized/date'

export enum DateFormatEnum {
	STANDARD = 'standard',
	SHORT = 'short',
	WITH_MONTH_NAME = 'with-month-name',
	WITH_SHORT_MONTH_NAME = 'with-short-month-name',
	FULL = 'full',
}

export function useFormatDate(
	formatDate: string,
	value: CalendarDate,
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
