/**
 * Toggles the presence of a value in an array. If the value exists in the array, it is removed.
 * If the value does not exist, it is added.
 *
 * This function uses `JSON.stringify` to compare values, making it suitable for arrays of objects
 * or complex data types. Note that this approach may not handle all edge cases, such as circular references.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to modify.
 * @param {T} value - The value to toggle in the array.
 * @returns {T[]} - The modified array.
 *
 * @example
 * // Adding a value
 * const array = [1, 2, 3];
 * toggleArrayValue(array, 4); // [1, 2, 3, 4]
 *
 * @example
 * // Removing a value
 * const array = [1, 2, 3];
 * toggleArrayValue(array, 2); // [1, 3]
 *
 * @example
 * // Working with objects
 * const array = [{ id: 1 }, { id: 2 }];
 * toggleArrayValue(array, { id: 2 }); // [{ id: 1 }]
 */
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
