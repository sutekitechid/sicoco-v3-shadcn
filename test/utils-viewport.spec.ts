import { test, expect, beforeEach } from 'vitest'
import {
	isMobile,
	isTablet,
	isDesktop,
	isWideScreen,
	isFullHD,
	isMobileOrTablet,
	isTabletOrDesktop,
	Breakpoint,
} from '../lib/utils/viewport'

function setWindowWidth(width: number) {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	})
}

beforeEach(() => {
	setWindowWidth(1024)
})

test('isMobile returns true when width is below MD breakpoint', () => {
	setWindowWidth(Breakpoint.MD - 1)
	expect(isMobile()).toBe(true)
})

test('isMobile returns false when width is at MD breakpoint', () => {
	setWindowWidth(Breakpoint.MD)
	expect(isMobile()).toBe(false)
})

test('isTablet returns true when width is between MD and LG', () => {
	setWindowWidth(Breakpoint.MD)
	expect(isTablet()).toBe(true)
})

test('isTablet returns false when width is below MD', () => {
	setWindowWidth(Breakpoint.MD - 1)
	expect(isTablet()).toBe(false)
})

test('isTablet returns false when width is at LG', () => {
	setWindowWidth(Breakpoint.LG)
	expect(isTablet()).toBe(false)
})

test('isDesktop returns true when width is at LG or above', () => {
	setWindowWidth(Breakpoint.LG)
	expect(isDesktop()).toBe(true)
})

test('isDesktop returns false when width is below LG', () => {
	setWindowWidth(Breakpoint.LG - 1)
	expect(isDesktop()).toBe(false)
})

test('isWideScreen returns true when width is at XL or above', () => {
	setWindowWidth(Breakpoint.XL)
	expect(isWideScreen()).toBe(true)
})

test('isWideScreen returns false when width is below XL', () => {
	setWindowWidth(Breakpoint.XL - 1)
	expect(isWideScreen()).toBe(false)
})

test('isFullHD returns true when width is at 2XL or above', () => {
	setWindowWidth(Breakpoint['2XL'])
	expect(isFullHD()).toBe(true)
})

test('isFullHD returns false when width is below 2XL', () => {
	setWindowWidth(Breakpoint['2XL'] - 1)
	expect(isFullHD()).toBe(false)
})

test('isMobileOrTablet returns true when width is below LG', () => {
	setWindowWidth(Breakpoint.LG - 1)
	expect(isMobileOrTablet()).toBe(true)
})

test('isMobileOrTablet returns false when width is at LG or above', () => {
	setWindowWidth(Breakpoint.LG)
	expect(isMobileOrTablet()).toBe(false)
})

test('isTabletOrDesktop returns true when width is at MD or above', () => {
	setWindowWidth(Breakpoint.MD)
	expect(isTabletOrDesktop()).toBe(true)
})

test('isTabletOrDesktop returns false when width is below MD', () => {
	setWindowWidth(Breakpoint.MD - 1)
	expect(isTabletOrDesktop()).toBe(false)
})
