type Option =
	| string
	| number
	| boolean
	| Record<string, unknown>
	| Array<unknown>
	| null
	| undefined

/**
 * Convert a JSON object into a valid CSS selector string.
 *
 * @param {object} jsonObject - The JSON object to convert.
 * @returns {string} - A string safe for use in a CSS selector.
 */
export function jsonToValidSelector(jsonObject: Option): string {
	return JSON.stringify(jsonObject).replace(/"/g, '\\"') // Escape quotes
}

/**
 * Convert a valid CSS selector string back into a JSON object.
 *
 * @param {string} selectorString - The string to parse back into JSON.
 * @returns {object} - The resulting JSON object.
 */
export function selectorToJson(selectorString: string): object {
	const unescapedString = selectorString.replace(/\\"/g, '"') // Unescape quotes
	return JSON.parse(unescapedString)
}
