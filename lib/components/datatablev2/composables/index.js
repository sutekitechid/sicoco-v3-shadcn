// Export all composables for easy importing
export { useTreeOperations } from './useTreeOperations.js'
export { useColumnSorting } from './useColumnSorting.js'
export { useDataTablePinning } from './useDataTablePinning.js'
export { useDataTableStyle } from './useDataTableStyle.js'
export { useSelectRow } from './useSelectRow.js'

/**
 * Resolves a colspan/rowspan value that may be a static number or a callback.
 * When value is a function it is called with the remaining arguments (row/rowIndex for
 * body cells, footerKey for footer cells). Returns 1 when value is falsy.
 *
 * @param {number|Function} value - Static span or per-row/per-footer callback
 * @param {...*} args - Arguments forwarded to value() when it is a function
 * @returns {number}
 */
export function resolveSpan(value, ...args) {
	if (typeof value === 'function') return value(...args)
	return value || 1
}
