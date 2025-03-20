import { useDebounceFn } from '@vueuse/core'
import { DEBOUNCE_DURATION } from './constants'

export function debounceInput(
	func: (...args: any[]) => void,
	duration: number = DEBOUNCE_DURATION
) {
	return useDebounceFn(func, duration)
}
