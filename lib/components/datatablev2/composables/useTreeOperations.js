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
  const filterTreeByVisibility = (tree, isColumnVisible) => {
    return tree.map(node => filterNodeByVisibility(node, isColumnVisible)).filter(Boolean)
  }

  const filterNodeByVisibility = (node, isColumnVisible, hasParent, index, length) => {
    if (!node) return null

    if (!node.isLeaf && node.children.length > 0) {
      node.hasSubheader = true
    
      // Group node - filter children
      const filteredChildren = node.children
        .map((child, childIndex) => filterNodeByVisibility(child, isColumnVisible, true, childIndex, node.children.length))
        .filter(Boolean)
      
      // If no children are visible, hide group
      if (filteredChildren.length === 0) return null

      return {
        ...node,
        children: filteredChildren
      }
    }
    
    // Leaf node - check visibility by unique field ID
    const fieldId = node.compositeFieldId || node.field
    const isVisible = isColumnVisible(fieldId)
    if (hasParent) {
      if (index === 0) {
        return isVisible ? { ...node, hasBorderLeft: true } : null
      }
      if (index === length - 1) {
        return isVisible ? { ...node, hasBorderRight: true } : null
      }
    }
    return isVisible ? node : null
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

    function walk(nodes, level) {
      rows[level] ??= []
      nodes.forEach(node => {
        const col = {
          header: node.header,
          colspan: countLeafColumns(node),
          rowspan: node.isLeaf ? depth - level : 1,
          hasSubheader: node.hasSubheader || false,
          hasBorderLeft: node.hasBorderLeft || false,
          hasBorderRight: node.hasBorderRight || false,
          compositeFieldId: node.compositeFieldId || node.field || node.name,
        }
        if (node.field) {
          col.field = node.field
        } else if (node.name && !node.isLeaf) {
          col.field = node.name
        }
        rows[level].push(col)
        if (node.children?.length) walk(node.children, level + 1)
      })
    }

    walk(tree, 0)
    return rows
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
    
    const collectFromNodes = (nodeList) => {
      nodeList.forEach(node => {
        if (node.isLeaf && node.field) {
          const leafColumn = {
            ...node,
            field: node.field
          }
          leafColumns.push(leafColumn)
        } else if (node.children && node.children.length > 0) {
          collectFromNodes(node.children)
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
    return nodes.sort((a, b) => {
      if (typeof a.order === 'number' && typeof b.order === 'number') {
        return a.order - b.order
      }
      return a.registrationOrder - b.registrationOrder
    })
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
