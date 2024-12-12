import { test, expect } from 'vitest'
import { jsonToValidSelector, validSelectorToJson } from '../lib/utils/string'

test('jsonToValidSelector: escapes quotes correctly', () => {
	const jsonObject = {
		label: 'Search',
		value: 'option1',
		icons: 'si-search',
	}
	const result = jsonToValidSelector(jsonObject)

	const expectedPattern = "{\\\"label\\\":\\\"Search\\\",\\\"value\\\":\\\"option1\\\",\\\"icons\\\":\\\"si-search\\\"}"
	expect(result).toMatch(expectedPattern)
})

test('validSelectorToJson: parses JSON object correctly', () => {
	const selector = '{\\"label\\":\\"Search\\",\\"value\\":\\"option1\\",\\"icons\\":\\"si-search\\"}'
	const result = validSelectorToJson(selector)

	const expectedObject = {
		label: 'Search',
		value: 'option1',
		icons: 'si-search',
	}
	expect(result).toEqual(expectedObject)
})