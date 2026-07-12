import { type DateValue } from '@internationalized/date'

export function datePagingFunction(currentDate: DateValue, destDate: DateValue | DateValue[] | undefined | null) {
	console.log('date pagination func', currentDate, destDate)
	if (!destDate) return currentDate
	return currentDate.set({ month: destDate.month, year: destDate.year })
}