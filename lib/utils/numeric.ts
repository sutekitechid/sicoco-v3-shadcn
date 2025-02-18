const NUMERIC_RE = /^\d+$/
export const isNumeric = (value: string) => {
	return value ? NUMERIC_RE.test(value) : null
}
