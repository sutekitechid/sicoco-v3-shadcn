const NUMERIC_RE = /^\d+$/
export const isNumeric = (value: string) => {
	return value ? NUMERIC_RE.test(value) : null
}

export const convertToNumber = (value: string | number) => {
	if (!value) {
		return 0
	}
	if (typeof value === 'string') {
		value = Number(value.replace(/,/g, '.'))
	}
	return isNaN(value) ? 0 : value
}
