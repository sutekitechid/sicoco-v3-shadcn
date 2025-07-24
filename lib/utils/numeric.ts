const NUMERIC_RE = /^\d+$/
export const isNumeric = (value: string) => {
	return value ? NUMERIC_RE.test(value) : null
}

export const convertToNumber = (value: string | number) => {
	if (value === undefined || value === null || value === '') {
		return undefined
	}
	if (typeof value === 'string') {
		value = Number(value.replace(/,/g, '.'))
	}
	return isNaN(value) ? 0 : value
}
