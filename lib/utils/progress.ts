const PROGRESS_MIN = 0
const PROGRESS_MAX = 100

export function normalizeProgressValue(value?: number | string): number {
	const currentValue = Number(value ?? 0)

	if (Number.isNaN(currentValue)) {
		return PROGRESS_MIN
	}

	if (currentValue <= PROGRESS_MIN) {
		return PROGRESS_MIN
	}

	if (currentValue >= PROGRESS_MAX) {
		return PROGRESS_MAX
	}

	return Math.round(currentValue)
}

export { PROGRESS_MIN, PROGRESS_MAX }
