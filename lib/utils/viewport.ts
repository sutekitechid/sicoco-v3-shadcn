export enum Breakpoint {
	SM = 640,
	MD = 768,
	LG = 1024,
	XL = 1280,
	'2XL' = 1536,
}

export function isMobile() {
	console.log(window.innerWidth, Breakpoint.MD)
	return window.innerWidth < Breakpoint.MD
}

export function isTablet() {
	return window.innerWidth >= Breakpoint.MD && window.innerWidth < Breakpoint.LG
}

export function isDesktop() {
	return window.innerWidth >= Breakpoint.LG
}

export function isWideScreen() {
	return window.innerWidth >= Breakpoint.XL
}

export function isFullHD() {
	return window.innerWidth >= Breakpoint['2XL']
}

export function isMobileOrTablet() {
	return window.innerWidth < Breakpoint.LG
}

export function isTabletOrDesktop() {
	return window.innerWidth >= Breakpoint.MD
}
