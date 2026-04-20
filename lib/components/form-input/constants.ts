/**
 * Batching mode constants for form validation
 */
export const BatchingMode = {
	/** Auto-detect based on input count (> 50 inputs) */
	AUTO: 'auto',
	/** Always use batching */
	ON: 'on',
	/** Never use batching */
	OFF: 'off',
} as const

export type BatchingModeType = (typeof BatchingMode)[keyof typeof BatchingMode]
