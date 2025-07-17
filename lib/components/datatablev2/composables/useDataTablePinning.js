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
export function useDataTablePinning(props, allLeafColumns, groups, columns) {
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
   * Helper function to flatten tree structure into ordered leaf field array
   */
  function flattenTreeToLeafFields(tree) {
    const leafFields = []
    
    tree.forEach(node => {
      if (node.type === 'leaf') {
        leafFields.push(node.field)
      } else if (node.type === 'group' && node.children) {
        // Recursively flatten children
        const childLeafFields = flattenTreeToLeafFields(node.children)
        leafFields.push(...childLeafFields)
      }
    })
    
    return leafFields
  }

  /**
   * Helper function to get pinned items for a specific side (returns tree structure)
   */
  function getPinnedLeafFieldsForSide(pinnedArray) {
    const pinnedItems = []
    
    pinnedArray.forEach(pinnedItem => {
      // Check if it's a group
      const group = groups.find(g => g.name === pinnedItem)
      console.log('Processing pinned item:', pinnedItem, 'Is group:', !!group) // DEBUG
      if (group) {
        // Get tree structure for this group
        const groupTree = getLeafFieldsForGroup(group.name)
        console.log('Group tree:', groupTree, 'for group:', group.name) // DEBUG
        // Add the group as a tree structure
        pinnedItems.push({
          type: 'group',
          name: group.name,
          children: groupTree
        })
        console.log('Pinned items after group processing:', pinnedItems) // DEBUG
      } else {
        // It's a leaf column
        if (allLeafColumns.value.some(col => col.field === pinnedItem)) {
          pinnedItems.push({
            type: 'leaf',
            field: pinnedItem,
            children: null
          })
        }
      }
    })
    
    return pinnedItems
  }

  // ============================
  // UTILITY FUNCTIONS
  // ============================
  
  /**
   * Recursively get tree structure of all items that belong to a group (including nested groups)
   * Returns a tree structure with children arrays for proper hierarchy
   */
  function getLeafFieldsForGroup(groupName) {
    const result = []
    
    // Get all direct children of this group (both leaf columns and nested groups)
    const directLeafColumns = columns.filter(c => c.group === groupName && c.field)
    const nestedGroups = groups.filter(g => g.group === groupName)

    console.log('getLeafFieldsForGroup', groupName, directLeafColumns, nestedGroups)
    
    // Combine and sort by registration order
    const allChildren = [
      ...directLeafColumns.map(col => ({ 
        type: 'leaf', 
        field: col.field, 
        registrationOrder: col.registrationOrder || 0,
        ...col 
      })),
      ...nestedGroups.map(group => ({ 
        type: 'group', 
        name: group.name, 
        registrationOrder: group.registrationOrder || 0,
        ...group
      }))
    ].sort((a, b) => a.registrationOrder - b.registrationOrder)
    
    // Process each child in order to build tree structure
    allChildren.forEach(child => {
      if (child.type === 'leaf') {
        // Add leaf node
        result.push({
          type: 'leaf',
          field: child.field,
          group: groupName, // Include group for context
          registrationOrder: child.registrationOrder,
          children: null
        })
      } else if (child.type === 'group') {
        // Add group node with recursive children
        const groupNode = {
          type: 'group',
          name: child.name,
          group: groupName, // Include parent group context
          registrationOrder: child.registrationOrder,
          children: getLeafFieldsForGroup(child.name) // Recursive call
        }
        result.push(groupNode)
      }
    })
    
    return result
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
    
    // Calculate left pinned offsets
    // TODO: BENERIN ORDERING
    const pinnedLeftTree = getPinnedLeftLeafFieldsInOrder.value
    // eslint-disable-next-line
    const pinnedLeftTree1 = [
    {
        "type": "leaf",
        "field": "status",
        "children": null
    },
    {
        "type": "group",
        "name": "cpmk_1",
        "children": [
            {
                "type": "group",
                "name": "sub_cpmk_1_1",
                "group": "cpmk_1",
                "registrationOrder": 0,
                "children": [
                    {
                        "type": "leaf",
                        "field": "tugas",
                        "group": "sub_cpmk_1_1",
                        "registrationOrder": 0,
                        "children": null
                    },
                    {
                        "type": "leaf",
                        "field": "kuis",
                        "group": "sub_cpmk_1_1",
                        "registrationOrder": 0,
                        "children": null
                    }
                ]
            },
            {
                "type": "group",
                "name": "sub_cpmk_1_2",
                "group": "cpmk_1",
                "registrationOrder": 0,
                "children": [
                    {
                        "type": "leaf",
                        "field": "tugas",
                        "group": "sub_cpmk_1_2",
                        "registrationOrder": 0,
                        "children": null
                    },
                    {
                        "type": "leaf",
                        "field": "kuis",
                        "group": "sub_cpmk_1_2",
                        "registrationOrder": 0,
                        "children": null
                    }
                ]
            }
        ]
    }
]
    console.log(pinnedLeftTree)
    let leftCumulativeOffset = 0

    // Add base offset for selection column if present
    if (props.selectable) {
      leftCumulativeOffset += 60 // Selection column width
    }

    // Process left pinned tree structure
    function processLeftTree(tree, offset, parentGroupName = '') {
      let currentOffset = offset
      tree.forEach(item => {
      // Build offsetKey: if inside a group, prefix with group name(s)
      let offsetKey = parentGroupName
      if (item.type === 'group') {
        offsetKey = offsetKey ? `${offsetKey}.${item.name}` : item.name
      } else if (item.type === 'leaf') {
        offsetKey = offsetKey ? `${offsetKey}.${item.field}` : item.field
      }

      if (item.type === 'leaf') {
        console.log('offsetKey', offsetKey)
        // Set offset for leaf column
        offsets[offsetKey] = { 
          left: `${currentOffset - 10}px`,
          position: 'sticky',
          zIndex: 20,
          backgroundColor: 'white'
        }
        // Add current column width to cumulative offset
        const columnWidth = getActualColumnWidth(item.field)
        currentOffset += columnWidth
      } else if (item.type === 'group' && item.children) {
        // Set offset for group header
        offsets[offsetKey] = { 
          left: `${currentOffset}px`,
          position: 'sticky',
          zIndex: 21, // Higher z-index for group headers
          backgroundColor: 'white'
        }
        // Recursively process group children, passing down the group name chain
        currentOffset = processLeftTree(item.children, currentOffset, offsetKey)
      }
      })
      return currentOffset
    }
    
    processLeftTree(pinnedLeftTree, leftCumulativeOffset, '')

    // Calculate right pinned offsets
    const pinnedRightTree = getPinnedRightLeafFieldsInOrder.value
    let rightCumulativeOffset = 0

    // Process right pinned tree structure (in reverse order)
    function processRightTree(tree, offset) {
      let currentOffset = offset
      // Process in reverse order for right positioning
      for (let i = tree.length - 1; i >= 0; i--) {
        const item = tree[i]
        if (item.type === 'leaf') {
          // Set offset for leaf column
          offsets[item.field] = {
            right: `${currentOffset}px`,
            position: 'sticky',
            zIndex: 20,
            backgroundColor: 'white'
          }
          // Add current column width to cumulative offset
          const columnWidth = getActualColumnWidth(item.field)
          currentOffset += columnWidth - 100
        } else if (item.type === 'group' && item.children) {
          // Set offset for group header (calculate total width of children first)
          const groupStartOffset = currentOffset
          // Recursively process group children (also in reverse)
          currentOffset = processRightTree([...item.children].reverse(), currentOffset)
          // Set group header offset at the rightmost position of its children
          offsets[item.name] = {
            right: `${groupStartOffset}px`,
            position: 'sticky',
            zIndex: 21, // Higher z-index for group headers
            backgroundColor: 'white'
          }
        }
      }
      return currentOffset
    }
    
    processRightTree(pinnedRightTree, rightCumulativeOffset)

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
      const newPinnedLeft = [...pinnedLeft.value]
      const insertIndex = findInsertPosition(newPinnedLeft, fieldOrGroupName)
      newPinnedLeft.splice(insertIndex, 0, fieldOrGroupName)
      pinnedLeft.value = newPinnedLeft
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
      const newPinnedRight = [...pinnedRight.value]
      const insertIndex = findInsertPosition(newPinnedRight, fieldOrGroupName)
      newPinnedRight.splice(insertIndex, 0, fieldOrGroupName)
      pinnedRight.value = newPinnedRight
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

  /**
   * Find the correct insert position to maintain column order
   */
  function findInsertPosition(currentPinnedArray, fieldOrGroupName) {
    // Get target order for the item to be inserted
    let targetOrder = Infinity
    
    // Check if it's a group
    const isGroup = groups.some(g => g.name === fieldOrGroupName)
    
    if (isGroup) {
      // For groups, find position based on first leaf column in group (including nested groups)
      const groupTree = getLeafFieldsForGroup(fieldOrGroupName)
      const groupLeafFields = flattenTreeToLeafFields(groupTree)
      const groupLeafColumns = allLeafColumns.value.filter(col => groupLeafFields.includes(col.field))
      if (groupLeafColumns.length > 0) {
        targetOrder = Math.min(...groupLeafColumns.map(col => col.registrationOrder))
      }
    } else {
      // For leaf columns, find position based on registration order
      const leafColumn = allLeafColumns.value.find(col => col.field === fieldOrGroupName)
      if (leafColumn) {
        targetOrder = leafColumn.registrationOrder
      }
    }
    
    // Find insertion point
    for (let i = 0; i < currentPinnedArray.length; i++) {
      const pinnedItem = currentPinnedArray[i]
      let pinnedOrder = Infinity
      
      // Check if current pinned item is a group
      const group = groups.find(g => g.name === pinnedItem)
      if (group) {
        // For groups, find position based on first leaf column in group (including nested groups)
        const groupTree = getLeafFieldsForGroup(group.name)
        const groupLeafFields = flattenTreeToLeafFields(groupTree)
        const groupLeafColumns = allLeafColumns.value.filter(col => groupLeafFields.includes(col.field))
        if (groupLeafColumns.length > 0) {
          pinnedOrder = Math.min(...groupLeafColumns.map(col => col.registrationOrder))
        }
      } else {
        const leafColumn = allLeafColumns.value.find(col => col.field === pinnedItem)
        if (leafColumn) {
          pinnedOrder = leafColumn.registrationOrder
        }
      }
      
      if (targetOrder < pinnedOrder) {
        return i
      }
    }
    
    return currentPinnedArray.length
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
            const isValidField = allLeafColumns.value.some(col => col.field === item)
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
            const isValidField = allLeafColumns.value.some(col => col.field === item)
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
    updateStickyOffsets
  }
}
