export function toggleArrayValue<T>(array: T[], value: T): T[] {
	const index = array.findIndex(
		item => JSON.stringify(item) === JSON.stringify(value)
	)

	if (index !== -1) {
		array.splice(index, 1)
	} else {
		array.push(value)
	}

	return array
}
