export function generateTimeUnits(max: number): string[] {
	return Array.from({ length: max }, (_, i) => i.toString().padStart(2, '0'))
}
