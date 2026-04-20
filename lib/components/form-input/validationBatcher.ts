import type { ValidateFunctionObject, ValidationRegistry } from './index'
type BatcherState = {
	// Map<registry, Map<validationId, func>> for true deduplication
	// If same validationId registered multiple times, only keep latest
	queue: Map<ValidationRegistry, Map<string, ValidateFunctionObject>>
	rafId: number | null
	isProcessing: boolean
	processingThreshold: number
}

// Global batcher state (shared across all form instances)
const batcherState: BatcherState = {
	queue: new Map(),
	rafId: null,
	isProcessing: false,
	processingThreshold: 50, // Auto-enable for >50 inputs
}

/**
 * Process queued registrations in a batch
 */
function processQueue() {
	if (batcherState.isProcessing) {
		return
	}

	batcherState.isProcessing = true
	batcherState.rafId = null

	// Process each registry's batch
	// queue is already grouped by registry → Map<validationId, func>
	batcherState.queue.forEach((validationMap, registry) => {
		validationMap.forEach((func, validationId) => {
			// ⚠️ RE-CHECK DOM EXISTENCE: Component may have unmounted since queueing
			// This prevents re-adding validators after removeValidateFunc() was called
			if (typeof window !== 'undefined') {
				const el = document.querySelector(validationId)
				if (!el) {
					// Element gone (unmounted) - skip this registration
					return
				}
			}

			const existing = registry.map.get(validationId)
			if (existing) {
				// Replace existing in list
				const index = registry.list.indexOf(existing)
				if (index !== -1) {
					// Found in list - replace it
					registry.list.splice(index, 1, func)
				} else {
					// ⚠️ DESYNC DETECTED: existing in map but not in list!
					// Defensive fix: Add to list to repair registry
					registry.list.push(func)
				}
				// Always update map (whether found in list or not)
				registry.map.set(validationId, func)
			} else {
				// Add new
				registry.list.push(func)
				registry.map.set(validationId, func)
			}
		})
		// Mark as dirty once per batch
		registry.isDirty = true
	})

	// Clear queue
	batcherState.queue.clear()
	batcherState.isProcessing = false
}

/**
 * Schedule RAF processing if not already scheduled
 */
function scheduleProcessing() {
	if (batcherState.rafId === null && typeof requestAnimationFrame !== 'undefined') {
		batcherState.rafId = requestAnimationFrame(processQueue)
	}
}

/**
 * Queue a validation function for batched registration
 * @param func - Validation function object
 * @param registry - Validation registry
 */
export function queueRegistration(
	func: ValidateFunctionObject,
	registry: ValidationRegistry
): void {
	// Check if element exists before queueing
	if (func.validationId && typeof window !== 'undefined') {
		const el = document.querySelector(func.validationId)
		if (!el) {
			return
		}
	}

	// Get or create registry map
	let registryMap = batcherState.queue.get(registry)
	if (!registryMap) {
		registryMap = new Map()
		batcherState.queue.set(registry, registryMap)
	}

	// Add/overwrite validation function by validationId
	// This ensures TRUE deduplication - same validationId = single entry
	registryMap.set(func.validationId, func)

	scheduleProcessing()
}

/**
 * Immediately flush the queue (useful for testing or forced sync)
 */
export function flushQueue(): void {
	if (batcherState.rafId !== null) {
		if (typeof cancelAnimationFrame !== 'undefined') {
			cancelAnimationFrame(batcherState.rafId)
		}
		batcherState.rafId = null
	}
	processQueue()
}

/**
 * Cancel any pending queue processing
 */
export function cancelQueue(): void {
	if (batcherState.rafId !== null) {
		if (typeof cancelAnimationFrame !== 'undefined') {
			cancelAnimationFrame(batcherState.rafId)
		}
		batcherState.rafId = null
	}
	batcherState.queue.clear()
}

/**
 * Remove a pending registration from the queue (called when component unmounts)
 * @param validationId - Validation ID to remove from queue
 * @param registry - Validation registry
 */
export function removePendingRegistration(
	validationId: string,
	registry: ValidationRegistry
): void {
	const registryMap = batcherState.queue.get(registry)
	if (registryMap) {
		registryMap.delete(validationId)
		// If registry map is empty, remove it from queue
		if (registryMap.size === 0) {
			batcherState.queue.delete(registry)
		}
	}
}

/**
 * Check if batching should be enabled based on input count
 * @param registry - Validation registry
 * @returns true if batching recommended
 */
export function shouldEnableBatching(registry: ValidationRegistry): boolean {
	return registry.list.length >= batcherState.processingThreshold
}

/**
 * Set the threshold for auto-enabling batching
 * @param threshold - Number of inputs to trigger batching
 */
export function setProcessingThreshold(threshold: number): void {
	batcherState.processingThreshold = Math.max(1, threshold)
}

/**
 * Get current batcher stats (for debugging/monitoring)
 * @returns Batcher statistics
 */
export function getBatcherStats() {
	// Calculate total queue size across all registries
	let queueSize = 0
	batcherState.queue.forEach(registryMap => {
		queueSize += registryMap.size
	})

	return {
		queueSize,
		registryCount: batcherState.queue.size,
		isProcessing: batcherState.isProcessing,
		hasPendingRaf: batcherState.rafId !== null,
		threshold: batcherState.processingThreshold,
	}
}
