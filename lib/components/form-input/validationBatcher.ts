import type { Ref } from 'vue'
import type { ValidateFunctionObject, ValidationRegistry } from './index'
type BatcherState = {
	queue: Set<{
		func: ValidateFunctionObject
		registry: ValidationRegistry
	}>
	rafId: number | null
	isProcessing: boolean
	processingThreshold: number
}

// Global batcher state (shared across all form instances)
const batcherState: BatcherState = {
	queue: new Set(),
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

	// Group by registry to batch operations per form
	const registryMap = new Map<ValidationRegistry, ValidateFunctionObject[]>()

	batcherState.queue.forEach(item => {
		const existing = registryMap.get(item.registry)
		if (existing) {
			existing.push(item.func)
		} else {
			registryMap.set(item.registry, [item.func])
		}
	})

	// Process each registry's batch
	registryMap.forEach((funcs, registry) => {
		funcs.forEach(func => {
			const existing = registry.map.get(func.validationId)
			if (existing) {
				// Replace existing
				const index = registry.list.indexOf(existing)
				if (index !== -1) {
					registry.list.splice(index, 1, func)
					registry.map.set(func.validationId, func)
				}
			} else {
				// Add new
				registry.list.push(func)
				registry.map.set(func.validationId, func)
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

	batcherState.queue.add({ func, registry })
	scheduleProcessing()
}

/**
 * Immediately flush the queue (useful for testing or forced sync)
 */
export function flushQueue(): void {
	if (batcherState.rafId !== null) {
		cancelAnimationFrame(batcherState.rafId)
		batcherState.rafId = null
	}
	processQueue()
}

/**
 * Cancel any pending queue processing
 */
export function cancelQueue(): void {
	if (batcherState.rafId !== null) {
		cancelAnimationFrame(batcherState.rafId)
		batcherState.rafId = null
	}
	batcherState.queue.clear()
}

/**
 * Check if batching should be enabled based on input count
 * @param registry - Validation registry
 * @returns true if batching recommended
 */
export function shouldEnableBatching(
	registry: ValidationRegistry | Ref<ValidateFunctionObject[]>
): boolean {
	const isLegacy = 'value' in registry
	const list = isLegacy
		? (registry as Ref<ValidateFunctionObject[]>).value
		: (registry as ValidationRegistry).list

	return list.length >= batcherState.processingThreshold
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
	return {
		queueSize: batcherState.queue.size,
		isProcessing: batcherState.isProcessing,
		hasPendingRaf: batcherState.rafId !== null,
		threshold: batcherState.processingThreshold,
	}
}
