export function generateTimeUnits(max: number): string[] {
	return Array.from({ length: max }, (_, i) => formatTimeUnit(i))
}

export function formatTimeUnit(value: number): string {
	return value.toString().padStart(2, '0')
}
