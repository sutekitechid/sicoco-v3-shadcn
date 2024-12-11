export type JsonObjectType =
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
export function jsonToValidSelector(jsonObject: JsonObjectType): string {
	return JSON.stringify(jsonObject)?.replace(/"/g, '\\"') // Escape quotes
}

/**
 * Convert a valid CSS selector string into a JSON object.
 * 
 * @param {string} selector - The CSS selector string to convert.
 * @returns {object} - The JSON object.
 * 
 * @example
 * validSelectorToJson('{"foo": "bar"}')
 * // => { foo: 'bar' }
 * 
*/
export function validSelectorToJson(selector: string): JsonObjectType {
	const escaped = selector.replace(/\\"/g, '"') // Unescape quotes
	return JSON.parse(escaped)
}