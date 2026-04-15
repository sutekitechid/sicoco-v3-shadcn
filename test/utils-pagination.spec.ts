import { test, expect, vi } from 'vitest'
import { getTotalPages, handleInfiniteScroll } from '../lib/utils/pagination'

test('getTotalPages calculates the correct total pages', () => {
	expect(getTotalPages(100, 10)).toBe(10)
})

test('getTotalPages rounds up when data does not divide evenly', () => {
	expect(getTotalPages(101, 10)).toBe(11)
})

test('getTotalPages works with a string perPage value', () => {
	expect(getTotalPages(50, '10')).toBe(5)
})

test('getTotalPages returns 1 when totalData equals perPage', () => {
	expect(getTotalPages(10, 10)).toBe(1)
})

test('getTotalPages returns 0 when totalData is 0', () => {
	expect(getTotalPages(0, 10)).toBe(0)
})

test('handleInfiniteScroll calls loadMoreFn when scrolled to bottom', () => {
	const loadMoreFn = vi.fn()
	const container = {
		scrollTop: 490,
		scrollHeight: 500,
		clientHeight: 10,
	} as HTMLElement

	handleInfiniteScroll(container, loadMoreFn)

	expect(loadMoreFn).toHaveBeenCalled()
})

test('handleInfiniteScroll does not call loadMoreFn when not at bottom', () => {
	const loadMoreFn = vi.fn()
	const container = {
		scrollTop: 100,
		scrollHeight: 500,
		clientHeight: 100,
	} as HTMLElement

	handleInfiniteScroll(container, loadMoreFn)

	expect(loadMoreFn).not.toHaveBeenCalled()
})

test('handleInfiniteScroll does nothing when container is null', () => {
	const loadMoreFn = vi.fn()
	handleInfiniteScroll(null as unknown as HTMLElement, loadMoreFn)
	expect(loadMoreFn).not.toHaveBeenCalled()
})
