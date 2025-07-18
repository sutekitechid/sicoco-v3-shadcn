import { ref, computed, watch, nextTick } from 'vue'

/**
 * Composable for managing column pinning functionality in DataTable
 * Supports pinning of all column types: fields, headers, subheaders, and leaf columns
 *
 * @param {Object} props - DataTable props
 * @param {Array} allLeafColumns - Ref containing all leaf columns
 * @param {Array} groups - Ref containing group definitions
 * @param {Array} tree - Ref containing column tree structure
 * @returns {Object} Pinning API
 */
export function useDataTablePinning(props, allLeafColumns, groups, tree) {
	// ============================
	// REACTIVE STATE
	// ============================
	const pinnedLeft = ref([]) // Array of column/group identifiers pinned to left
	const pinnedRight = ref([]) // Array of column/group identifiers pinned to right
	const stickyOffsets = ref({}) // Cache for sticky offset calculations

	// ============================
	// UTILITY FUNCTIONS (LOWEST LEVEL)
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
	 * Get actual column width from DOM
	 */
	function getActualColumnWidth(columnId) {
		try {
			const headerCell = document.querySelector(`[data-field="${columnId}"]`)
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
	 * Generate object berisi index/posisi setiap column/group dari tree
	 * @returns {Object} - { [columnOrGroupName]: index }
	 */
	function generateFieldOrGroupIndexes() {
		const indexes = {}
		let currentIndex = 0

		function traverse(node) {
			const key = node.compositeFieldId || node.field || node.name
			indexes[key] = currentIndex
			currentIndex++
			if (node.children && Array.isArray(node.children)) {
				node.children.forEach(child => traverse(child))
			}
		}

		tree.value.forEach(node => traverse(node))
		return indexes
	}

	// ============================
	// HELPER FUNCTIONS (LEVEL 2)
	// ============================

	/**
	 * Recursively get tree structure of all items that belong to a group (including nested groups)
	 * Returns a tree structure with children arrays for proper hierarchy
	 */
	function getColumnsForGroup(name) {
		const node = findNodeInTree(tree.value, name)

		return [node]
	}

	/**
	 * Helper function to get pinned items for a specific side (returns tree structure)
	 */
	function getPinnedColumnsForSide(pinnedArray) {
		const pinnedItems = []

		pinnedArray.forEach(pinnedItem => {
			pinnedItems.push(...getColumnsForGroup(pinnedItem))
		})

		return pinnedItems
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
		const pinnedLeftTree = getPinnedLeftColumnsInOrder.value
		let leftCumulativeOffset = 0

		// Add base offset for selection column if present
		if (props.selectable) {
			leftCumulativeOffset += 60 // Selection column width
		}
		// Process left pinned tree
		processPinnedTree(pinnedLeftTree, leftCumulativeOffset, 'left')

		// Calculate right pinned offsets
		const pinnedRightTree = getPinnedRightColumnsInOrder.value
		let rightCumulativeOffset = 0
		processPinnedTree(pinnedRightTree, rightCumulativeOffset, 'right')

		return offsets
	}

	/**
	 * Update sticky offsets cache
	 */
	function updateStickyOffsets() {
		nextTick(() => {
			stickyOffsets.value = calculateStickyOffsets()
		})
	}

	/**
	 * Insert column/group name to pinned array sorted by columnPositions order
	 * @param {Array} pinnedArray - pinnedLeft.value atau pinnedRight.value
	 * @param {string} columnOrGroupName - nama column/group yang akan ditambahkan
	 * @param {Object} columnPositions - hasil dari computed columnPositions
	 */
	function insertPinnedSorted(pinnedArray, columnOrGroupName, columnPositions) {
		if (pinnedArray.includes(columnOrGroupName)) return

		// Ambil semua column/group yang sudah ada + yang baru
		const allPinned = [...pinnedArray, columnOrGroupName]

		// Urutkan berdasarkan posisi di columnPositions
		allPinned.sort((a, b) => {
			const posA = columnPositions[a]
			const posB = columnPositions[b]
			return posA - posB
		})

		// Update array
		pinnedArray.splice(0, pinnedArray.length, ...allPinned)
	}

	// ============================
	// COMPUTED PROPERTIES (LEVEL 3)
	// ============================

	/**
	 * Get all pinned left columns in display order
	 */
	const getPinnedLeftColumnsInOrder = computed(() => {
		return getPinnedColumnsForSide(pinnedLeft.value)
	})

	/**
	 * Get all pinned right columns in display order
	 */
	const getPinnedRightColumnsInOrder = computed(() => {
		return getPinnedColumnsForSide(pinnedRight.value)
	})

	// ============================
	// Column Positions
	// ============================
	const columnPositions = computed(() => {
		return generateFieldOrGroupIndexes()
	})

	// ============================
	// VALIDATION FUNCTIONS
	// ============================

	/**
	 * Check if a column or group is currently pinned to left
	 */
	function isPinnedLeft(columnOrGroupName) {
		return pinnedLeft.value.includes(columnOrGroupName)
	}

	/**
	 * Check if a column or group is currently pinned to right
	 */
	function isPinnedRight(columnOrGroupName) {
		return pinnedRight.value.includes(columnOrGroupName)
	}

	/**
	 * Check if a column or group is currently pinned (either left or right)
	 */
	function isPinned(columnOrGroupName) {
		return isPinnedLeft(columnOrGroupName) || isPinnedRight(columnOrGroupName)
	}

	/**
	 * Check if a column is valid for pinning
	 */
	function isValidForPinning(column) {
		// All types of columns can be pinned (field, header, subheader, leaf)
		if (column.field || column.name) {
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
	 * Get sticky offsets (cached)
	 */
	function getStickyOffsets() {
		return stickyOffsets.value
	}

	// ============================
	// PERSISTENCE FUNCTIONS
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
					pinnedLeft.value = parsedLeft
				}
			}

			if (savedRight) {
				const parsedRight = JSON.parse(savedRight)
				if (Array.isArray(parsedRight)) {
					pinnedRight.value = parsedRight
				}
			}
		} catch (error) {
			console.warn('Failed to restore pinning state:', error)
			pinnedLeft.value = []
			pinnedRight.value = []
		}
	}

	// ============================
	// PINNING OPERATIONS (HIGH LEVEL)
	// ============================

	/**
	 * Pin a column or group to the left
	 */
	function pinLeft(columnOrGroupName) {
		// Remove from right if exists
		const rightIndex = pinnedRight.value.indexOf(columnOrGroupName)
		if (rightIndex >= 0) {
			pinnedRight.value.splice(rightIndex, 1)
		}

		// Add to left if not already there
		insertPinnedSorted(
			pinnedLeft.value,
			columnOrGroupName,
			columnPositions.value
		)

		updateStickyOffsets()
		savePinningStateToLocalStorage()
	}

	/**
	 * Pin a column or group to the right
	 */
	function pinRight(columnOrGroupName) {
		// Remove from left if exists
		const leftIndex = pinnedLeft.value.indexOf(columnOrGroupName)
		if (leftIndex >= 0) {
			pinnedLeft.value.splice(leftIndex, 1)
		}

		// Add to right if not already there
		insertPinnedSorted(
			pinnedRight.value,
			columnOrGroupName,
			columnPositions.value
		)

		updateStickyOffsets()
		savePinningStateToLocalStorage()
	}

	/**
	 * Unpin a column or group (remove from both left and right)
	 */
	function unpin(columnOrGroupName) {
		// Remove from left
		const leftIndex = pinnedLeft.value.indexOf(columnOrGroupName)
		if (leftIndex >= 0) {
			pinnedLeft.value.splice(leftIndex, 1)
		}

		// Remove from right
		const rightIndex = pinnedRight.value.indexOf(columnOrGroupName)
		if (rightIndex >= 0) {
			pinnedRight.value.splice(rightIndex, 1)
		}

		updateStickyOffsets()
		savePinningStateToLocalStorage()
	}

	/**
	 * Toggle pin state for a column or group (legacy function for backward compatibility)
	 */
	function togglePin(columnOrGroupName) {
		if (isPinned(columnOrGroupName)) {
			unpin(columnOrGroupName)
		} else {
			pinLeft(columnOrGroupName) // Default to left pinning
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
		getPinnedLeftColumnsInOrder,
		getPinnedRightColumnsInOrder,

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
