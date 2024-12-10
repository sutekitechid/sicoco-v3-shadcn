import { test, expect } from 'vitest'
import { jsonToValidSelector } from '../lib/utils/string'

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