/**
 * Composable for handling tree operations and column organization.
 * Provides functions to build, filter, and calculate properties of tree structures.
 * 
 * @returns {Object} An object containing tree operation functions.
 */
export function useTreeOperations() {
  
  // ============================
  // TREE BUILDING
  // ============================
  /**
   * Builds a hierarchical tree structure from groups and columns.
   * 
   * @param {Array} groups - An array of group objects, each containing a `name` and optional `group` (parent group name).
   * @param {Array} columns - An array of column objects, each containing a `field` and optional `group` (parent group name).
   * @returns {Array} An array of root group objects, each containing nested children.
   */
  const buildTree = (groups, columns) => {
    const map = new Map()
    
    groups.forEach((group, index) => {
      // Build the full group path for compositeFieldId
      let groupPath = [];
      let currentGroup = group;
      while (currentGroup && currentGroup.group) {
        groupPath.unshift(currentGroup.group);
        currentGroup = groups.find(g => g.name === currentGroup.group);
      }
      const compositeFieldId = [...groupPath, group.name].join('.');

      map.set(group.name, { 
        ...group, 
        children: [], 
        registrationOrder: index,
        isLeaf: false,
        compositeFieldId
      });
    });
    
    columns.forEach((col, index) => {
      if (col.group && map.has(col.group)) {
        // Build the full group path for compositeFieldId
        let groupPath = [];
        let currentGroup = map.get(col.group);
        while (currentGroup) {
          groupPath.unshift(currentGroup.name);
          currentGroup = currentGroup.group && map.has(currentGroup.group) ? map.get(currentGroup.group) : null;
        }
        const compositeFieldId = [...groupPath, col.field].join('.');
        const parent = map.get(col.group);
        parent.children.push({ 
          ...col, 
          isLeaf: true, 
          registrationOrder: index,
          children: [],
          compositeFieldId
        });
      }
    });
    
    map.forEach(group => {
      if (group.children && group.children.length > 0) {
        group.children.sort((a, b) => a.registrationOrder - b.registrationOrder)
      }
    })
    
    const sortedGroups = [...groups].sort((a, b) => groups.indexOf(a) - groups.indexOf(b))
    
    sortedGroups.forEach(group => {
      if (group.group && map.has(group.group) && map.has(group.name)) {
        const parent = map.get(group.group)
        const child = map.get(group.name)
        
        const childRegistrationOrder = groups.indexOf(group)
        parent.children = parent.children.filter(c => c.name !== child.name)
        child.registrationOrder = childRegistrationOrder
        parent.children.push(child)
        parent.children.sort((a, b) => a.registrationOrder - b.registrationOrder)
      }
    })
    
    const rootGroups = Array.from(map.values()).filter(g => !g.group)
    return rootGroups.sort((a, b) => a.registrationOrder - b.registrationOrder)
  }

  // ============================
  // TREE FILTERING
  // ============================
  const filterTreeByVisibility = (tree) => {
    return tree.map(node => filterNodeByVisibility(node)).filter(Boolean)
  }

  const filterNodeByVisibility = (node, hasParent, index) => {
    if (!node) return null

    if (!node.isLeaf && node.children.length > 0) {
      node.hasSubheader = true
    
      // Group node - filter children
      const filteredChildren = node.children
        .map((child, childIndex) => filterNodeByVisibility(child, true, childIndex))
        .filter(Boolean)
      
      // If no children are visible, hide group
      if (filteredChildren.length === 0) return null

      // Add border properties to first visible child
      if (filteredChildren.length > 0) {
        filteredChildren[0] = { ...filteredChildren[0], hasBorderLeft: true }
      }

      return {
        ...node,
        children: filteredChildren
      }
    }
    
    // Add left border for first child
    if (hasParent && index === 0) {
      return { ...node, hasBorderLeft: true }
    }

    return node
  }

  // ============================
  // DEPTH CALCULATION
  // ============================
  const calculateDepth = (node) => {
    if (!node) return 0
    if (!node.children || node.children.length === 0) return 1
    return 1 + Math.max(...node.children.map(c => calculateDepth(c)))
  }

  // ============================
  // TREE TO ROWS CONVERSION
  // ============================
  const flattenTreeToRows = (tree, depth = null) => {
    const rows = []

    function walk(nodes, level, hasBorderRight = false) {
      rows[level] ??= []
      nodes.forEach((node, index) => {
        /**
         * Add border right to each node if it was the last node and the root node which has subheader
         */
        const mHasBorderRight = node.hasBorderRight || hasBorderRight
        
        const col = {
          header: node.header,
          colspan: countLeafColumns(node),
          rowspan: node.isLeaf ? depth - level : 1,
          hasSubheader: node.hasSubheader || false,
          hasBorderLeft: node.hasBorderLeft || false,
          hasBorderRight: node.hasBorderRight || (index === nodes.length - 1 && mHasBorderRight),
          compositeFieldId: node.compositeFieldId || node.field || node.name,
          width: node.width,
        }
        if (node.field) {
          col.field = node.field
        } else if (node.name && !node.isLeaf) {
          col.field = node.name
        }
        rows[level].push(col)
        if (node.children?.length) walk(node.children, level + 1, col.hasBorderRight)
      })
    }

    walk(tree, 0, false)
    return rows
  }

  /**
   * Sets hasBorderRight on root-level nodes: true when a group node with a subheader
   * is followed by a node without a subheader (signals a column-group boundary).
   */
  function applyBorderRight(nodes) {
    nodes.forEach((node, index) => {
      const nextNode = nodes[index + 1]
      const nextHasSubheader = nextNode && nextNode.hasSubheader
      node.hasBorderRight = Boolean(node.hasSubheader && !node.group && !nextHasSubheader)
    })
  }

  const countLeafColumns = (node) => {
    if (!node) return 0
    if (node.isLeaf || !node.children || node.children.length === 0) return 1
    return node.children.reduce((sum, c) => sum + countLeafColumns(c), 0)
  }

  // ============================
  // COLUMN COLLECTION
  // ============================
  const collectLeafColumns = (nodes) => {
    const leafColumns = []

    const collectFromNodes = (nodeList, parentHasBorderRight = false) => {
      nodeList.forEach((node, index) => {
        const isLastChild = index === nodeList.length - 1
        // A group's hasBorderRight propagates to its last leaf descendant
        const effectiveBorderRight = node.hasBorderRight || (isLastChild && parentHasBorderRight)

        if (node.isLeaf && node.field) {
          leafColumns.push({ ...node, hasBorderRight: effectiveBorderRight })
        } else if (node.children && node.children.length > 0) {
          collectFromNodes(node.children, effectiveBorderRight)
        }
      })
    }

    collectFromNodes(nodes)
    return leafColumns
  }

  // ============================
  // SORTING UTILITIES
  // ============================
  const sortColumns = (cols) => cols.sort((a, b) => {
    if (typeof a.order === 'number' && typeof b.order === 'number') {
      return a.order - b.order
    }
    return (a.registrationOrder || 0) - (b.registrationOrder || 0)
  })

  const sortNodes = (nodes) => {
    const sorted = nodes.sort((a, b) => {
      if (typeof a.order === 'number' && typeof b.order === 'number') {
        return a.order - b.order
      }
      return a.registrationOrder - b.registrationOrder
    })
    // Set hasBorderRight on root-level nodes now that sort order is known.
    // Both collectLeafColumns and flattenTreeToRows depend on these values.
    applyBorderRight(sorted)
    return sorted
  }

  return {
    buildTree,
    filterTreeByVisibility,
    filterNodeByVisibility,
    calculateDepth,
    flattenTreeToRows,
    countLeafColumns,
    collectLeafColumns,
    sortColumns,
    sortNodes
  }
}
