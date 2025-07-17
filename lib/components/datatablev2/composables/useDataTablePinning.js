import { ref, computed, watch, nextTick } from 'vue'

/**
 * Composable for managing column pinning functionality in DataTable
 *
 * @param {Object} props - DataTable props
 * @param {Array} allLeafColumns - Ref containing all leaf columns
 * @param {Array} groups - Ref containing group definitions
 * @param {Array} columns - Ref containing column definitions
 * @returns {Object} Pinning API
 */
export function useDataTablePinning(
	props,
	allLeafColumns,
	groups,
	columns,
	tree
) {
	// ============================
	// REACTIVE STATE
	// ============================
	const pinnedLeft = ref([]) // Array of field/group names pinned to left
	const pinnedRight = ref([]) // Array of field/group names pinned to right
	const stickyOffsets = ref({}) // Cache for sticky offset calculations

	// ============================
	// COMPUTED PROPERTIES
	// ============================

	/**
	 * Get all pinned left leaf fields in display order
	 */
	const getPinnedLeftLeafFieldsInOrder = computed(() => {
		console.log('Calculating pinned left leaf fields...') // DEBUG
		return getPinnedLeafFieldsForSide(pinnedLeft.value)
	})

	/**
	 * Get all pinned right leaf fields in display order
	 */
	const getPinnedRightLeafFieldsInOrder = computed(() => {
		return getPinnedLeafFieldsForSide(pinnedRight.value)
	})

	/**
	 * Helper function to get pinned items for a specific side (returns tree structure)
	 */
	function getPinnedLeafFieldsForSide(pinnedArray) {
		const pinnedItems = []

		pinnedArray.forEach(pinnedItem => {
			pinnedItems.push(...getLeafFieldsForGroup(pinnedItem))
		})

		return pinnedItems
	}

	// ============================
	// UTILITY FUNCTIONS
	// ============================

	/**
	 * Cari node dari tree berdasarkan field atau group name
	 * @param {Array} tree - Tree array
	 * @param {string} name - Field atau group name yang dicari
	 * @returns {Object|null} - Node yang ditemukan atau null jika tidak ada
	 */
	function findNodeInTree(tree, name) {
		for (const node of tree) {
			if (node.compositeFieldId === name) {
				return node
			}
			if (Array.isArray(node.children)) {
				const found = findNodeInTree(node.children, name)
				if (found) return found
			}
		}
		return null
	}

	/**
	 * Recursively get tree structure of all items that belong to a group (including nested groups)
	 * Returns a tree structure with children arrays for proper hierarchy
	 */
	function getLeafFieldsForGroup(name) {
		const node = findNodeInTree(tree.value, name)

		return [node]
	}

	/**
	 * Check if a field or group is currently pinned to left
	 */
	function isPinnedLeft(fieldOrGroupName) {
		return pinnedLeft.value.includes(fieldOrGroupName)
	}

	/**
	 * Check if a field or group is currently pinned to right
	 */
	function isPinnedRight(fieldOrGroupName) {
		return pinnedRight.value.includes(fieldOrGroupName)
	}

	/**
	 * Check if a field or group is currently pinned (either left or right)
	 */
	function isPinned(fieldOrGroupName) {
		return isPinnedLeft(fieldOrGroupName) || isPinnedRight(fieldOrGroupName)
	}

	/**
	 * Check if a column is valid for pinning
	 */
	function isValidForPinning(column) {
		// Only leaf columns that are not subheaders can be pinned individually
		if (column.field && !column.group) {
			return true
		}
		return false
	}

	/**
	 * Check if a group is valid for pinning (root groups only)
	 */
	function isGroupValidForPinning(groupName) {
		const group = groups.find(g => g.name === groupName)
		if (!group) return false

		// Root groups don't have field and don't have group property
		return !group.field && !group.group
	}

	/**
	 * Get actual column width from DOM
	 */
	function getActualColumnWidth(fieldId) {
		try {
			const headerCell = document.querySelector(`[data-field="${fieldId}"]`)
			if (headerCell) {
				const rect = headerCell.getBoundingClientRect()
				return rect.width
			}
		} catch (error) {
			console.warn('Failed to get column width:', error)
		}
		return 120 // fallback width
	}

	/**
	 * Calculate sticky offsets for all pinned columns (left and right)
	 */
	function calculateStickyOffsets() {
		const offsets = {}
		// Process left pinned tree structure
		function processPinnedTree(tree, offset, side = 'left') {
			let currentOffset = offset
			const isRight = side === 'right'

			// Untuk right, proses dari belakang
			const items = isRight ? [...tree].reverse() : tree

			items.forEach(item => {
				console.log('item:', item)

				// Set offset for group header
				offsets[item.compositeFieldId || item.field] = {
					[side]: `${currentOffset}px`,
					position: 'sticky',
					zIndex: 21,
					backgroundColor: 'white',
				}

				if (item.isLeaf) {
					const columnWidth = getActualColumnWidth(item.field)
					currentOffset += columnWidth
				} else if (!item.isLeaf && item.children) {
					// Recursively process group children
					currentOffset = processPinnedTree(item.children, currentOffset, side)
				}
			})
			return currentOffset
		}

		// Calculate left pinned offsets
		// TODO: BENERIN ORDERING
		const pinnedLeftTree = getPinnedLeftLeafFieldsInOrder.value
		let leftCumulativeOffset = 0

		// Add base offset for selection column if present
		if (props.selectable) {
			leftCumulativeOffset += 60 // Selection column width
		}
		// Penggunaan di calculateStickyOffsets:
		processPinnedTree(pinnedLeftTree, leftCumulativeOffset, 'left')

		// Calculate right pinned offsets
		const pinnedRightTree = getPinnedRightLeafFieldsInOrder.value
		let rightCumulativeOffset = 0
		processPinnedTree(pinnedRightTree, rightCumulativeOffset, 'right')

		console.log('Sticky offsets:', offsets)

		return offsets
	}

	/**
	 * Get sticky offsets (cached)
	 */
	function getStickyOffsets() {
		return stickyOffsets.value
	}

	/**
	 * Update sticky offsets cache
	 */
	function updateStickyOffsets() {
		nextTick(() => {
			stickyOffsets.value = calculateStickyOffsets()
		})
	}

	// ============================
	// PINNING OPERATIONS
	// ============================

	/**
	 * Pin a field or group to the left
	 */
	function pinLeft(fieldOrGroupName) {
		// Remove from right if exists
		const rightIndex = pinnedRight.value.indexOf(fieldOrGroupName)
		if (rightIndex >= 0) {
			pinnedRight.value.splice(rightIndex, 1)
		}

		// Add to left if not already there
		if (!pinnedLeft.value.includes(fieldOrGroupName)) {
			pinnedLeft.value.push(fieldOrGroupName)
		}

		updateStickyOffsets()
		savePinningStateToLocalStorage()
	}

	/**
	 * Pin a field or group to the right
	 */
	function pinRight(fieldOrGroupName) {
		// Remove from left if exists
		const leftIndex = pinnedLeft.value.indexOf(fieldOrGroupName)
		if (leftIndex >= 0) {
			pinnedLeft.value.splice(leftIndex, 1)
		}

		// Add to right if not already there
		if (!pinnedRight.value.includes(fieldOrGroupName)) {
			pinnedRight.value.push(fieldOrGroupName)
		}

		updateStickyOffsets()
		savePinningStateToLocalStorage()
	}

	/**
	 * Unpin a field or group (remove from both left and right)
	 */
	function unpin(fieldOrGroupName) {
		// Remove from left
		const leftIndex = pinnedLeft.value.indexOf(fieldOrGroupName)
		if (leftIndex >= 0) {
			pinnedLeft.value.splice(leftIndex, 1)
		}

		// Remove from right
		const rightIndex = pinnedRight.value.indexOf(fieldOrGroupName)
		if (rightIndex >= 0) {
			pinnedRight.value.splice(rightIndex, 1)
		}

		updateStickyOffsets()
		savePinningStateToLocalStorage()
	}

	/**
	 * Toggle pin state for a field or group (legacy function for backward compatibility)
	 */
	function togglePin(fieldOrGroupName) {
		if (isPinned(fieldOrGroupName)) {
			unpin(fieldOrGroupName)
		} else {
			pinLeft(fieldOrGroupName) // Default to left pinning
		}
	}

	// ============================
	// PERSISTENCE
	// ============================

	/**
	 * Save pinning state to localStorage
	 */
	function savePinningStateToLocalStorage() {
		if (!props.persistState || !props.id) return

		try {
			const leftKey = `datatable-pinning-left-${props.id}`
			const rightKey = `datatable-pinning-right-${props.id}`

			localStorage.setItem(leftKey, JSON.stringify(pinnedLeft.value))
			localStorage.setItem(rightKey, JSON.stringify(pinnedRight.value))
		} catch (error) {
			console.warn('Failed to save pinning state:', error)
		}
	}

	/**
	 * Restore pinning state from localStorage
	 */
	function restorePinningStateFromLocalStorage() {
		if (!props.persistState || !props.id) return

		try {
			const leftKey = `datatable-pinning-left-${props.id}`
			const rightKey = `datatable-pinning-right-${props.id}`

			const savedLeft = localStorage.getItem(leftKey)
			const savedRight = localStorage.getItem(rightKey)

			if (savedLeft) {
				const parsedLeft = JSON.parse(savedLeft)
				if (Array.isArray(parsedLeft)) {
					pinnedLeft.value = parsedLeft.filter(item => {
						// Validate that saved items still exist
						const isValidGroup = groups.some(g => g.name === item)
						const isValidField = allLeafColumns.value.some(
							col => col.field === item
						)
						return isValidGroup || isValidField
					})
				}
			}

			if (savedRight) {
				const parsedRight = JSON.parse(savedRight)
				if (Array.isArray(parsedRight)) {
					pinnedRight.value = parsedRight.filter(item => {
						// Validate that saved items still exist
						const isValidGroup = groups.some(g => g.name === item)
						const isValidField = allLeafColumns.value.some(
							col => col.field === item
						)
						return isValidGroup || isValidField
					})
				}
			}
		} catch (error) {
			console.warn('Failed to restore pinning state:', error)
			pinnedLeft.value = []
			pinnedRight.value = []
		}
	}

	// ============================
	// WATCHERS
	// ============================

	// Watch for changes that require sticky offset recalculation
	watch(
		[() => props.data, pinnedLeft, pinnedRight, allLeafColumns],
		() => {
			updateStickyOffsets()
		},
		{ deep: true, flush: 'post' }
	)

	// Watch for column visibility changes (if available)
	watch(
		() => allLeafColumns?.value?.length,
		() => {
			updateStickyOffsets()
		}
	)

	// ============================
	// INITIALIZATION
	// ============================

	// Restore state on mount
	restorePinningStateFromLocalStorage()

	// ============================
	// PUBLIC API
	// ============================
	return {
		// State
		pinnedLeft,
		pinnedRight,

		// Computed
		getPinnedLeftLeafFieldsInOrder,
		getPinnedRightLeafFieldsInOrder,

		// Methods
		isPinned,
		isPinnedLeft,
		isPinnedRight,
		isValidForPinning,
		isGroupValidForPinning,
		pinLeft,
		pinRight,
		unpin,
		togglePin, // Legacy support
		getStickyOffsets,
		savePinningStateToLocalStorage,
		restorePinningStateFromLocalStorage,
		updateStickyOffsets,
	}
}
