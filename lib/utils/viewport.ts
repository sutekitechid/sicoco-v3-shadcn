export enum Breakpoint {
	SM = 640,
	MD = 768,
	LG = 1024,
	XL = 1280,
	'2XL' = 1536,
}

export function isMobile() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth < Breakpoint.MD
}

export function isTablet() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth >= Breakpoint.MD && globalThis.innerWidth < Breakpoint.LG
}

export function isDesktop() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth >= Breakpoint.LG
}

export function isWideScreen() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth >= Breakpoint.XL
}

export function isFullHD() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth >= Breakpoint['2XL']
}

export function isMobileOrTablet() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth < Breakpoint.LG
}

export function isTabletOrDesktop() {
	if (typeof window === 'undefined') {
		return false
	}
	return globalThis.innerWidth >= Breakpoint.MD
}
