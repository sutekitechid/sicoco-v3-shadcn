import { useDebounceFn } from '@vueuse/core'

export function debounceInput(
	func: (...args: any[]) => void,
	duration: number
) {
	return useDebounceFn(func, duration)
}
