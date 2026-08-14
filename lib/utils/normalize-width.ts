export function normalizeWidth(width: string | number | undefined): string | undefined {
	if (typeof width === 'number') return `${width}px`
	return width
}
