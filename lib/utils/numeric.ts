const NUMERIC_RE = /^[0-9]+$/
export const isNumeric = (value: string) => {
  return value ? NUMERIC_RE.test(value) : null
}
