import { test, expect } from 'vitest'
import { jsonToValidSelector, validSelectorToJson, getDataCyWithPrefix } from '../lib/utils/string'

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

test('getDataCyWithPrefix: returns prefixed data-cy value', () => {
	expect(getDataCyWithPrefix('button', 'submit')).toBe('submit-button')
})

test('getDataCyWithPrefix: returns dataCy unchanged when prefix is empty', () => {
	expect(getDataCyWithPrefix('button', '')).toBe('button')
})

test('getDataCyWithPrefix: handles multi-word prefix and dataCy', () => {
	expect(getDataCyWithPrefix('close-icon', 'modal')).toBe('modal-close-icon')
})