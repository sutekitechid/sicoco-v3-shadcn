# DataTable Sorting Feature

The DataTable component now supports sorting functionality with the following features:

## Features

1. **Column-Level Sort Controls**: Each column can individually enable sorting via the `sortable` prop
2. **Multiple Sort**: Support for sorting by multiple columns simultaneously
3. **Event Emission**: Emits sort changes as arrays of sort objects

## Props

### DataTable Props

- `multipleSort` (Boolean, default: `false`): Allow multiple column sorting

### DataTableColumn Props

- `sortable` (Boolean, default: `false`): Enable sorting for this specific column

## Events

### sort-change

Emitted when sort state changes. The event payload format depends on the `multipleSort` prop:

**Single Sort Mode** (`multipleSort: false`):
```javascript
// Array with single sort object or empty array
[{ id: 'columnField', desc: false }] // ascending
[{ id: 'columnField', desc: true }]  // descending
[]                                   // no sort
```

**Multiple Sort Mode** (`multipleSort: true`):
```javascript
// Array with multiple sort objects
[
  { id: 'field1', desc: false },
  { id: 'field2', desc: true },
  { id: 'field3', desc: false }
]
```

## Usage Examples

### Basic Sorting (Single Column)

```vue
<template>
  <DataTable
    :data="tableData"
    @sort-change="handleSortChange"
  >
    <DataTableColumn field="name" label="Name" :sortable="true" />
    <DataTableColumn field="age" label="Age" :sortable="true" />
    <DataTableColumn field="description" label="Description" />
  </DataTable>
</template>

<script setup>
const handleSortChange = (sortArray) => {
  console.log('Sort changed:', sortArray)
  // sortArray will be: [{ id: 'name', desc: false }] for ascending name sort
}
</script>
```

### Multiple Column Sorting

```vue
<template>
  <DataTable
    :data="tableData"
    :multiple-sort="true"
    @sort-change="handleSortChange"
  >
    <DataTableColumn field="name" label="Name" :sortable="true" />
    <DataTableColumn field="age" label="Age" :sortable="true" />
    <DataTableColumn field="city" label="City" :sortable="true" />
    <DataTableColumn field="description" label="Description" />
  </DataTable>
</template>

<script setup>
const handleSortChange = (sortArray) => {
  console.log('Sort changed:', sortArray)
  // sortArray might be: [{ id: 'name', desc: false }, { id: 'age', desc: true }]
}
</script>
```

### With Sorting Only

```vue
<template>
  <DataTable
    :data="tableData"
    @sort-change="handleSortChange"
  >
    <DataTableColumn field="name" label="Name" :sortable="true" />
    <DataTableColumn field="age" label="Age" :sortable="true" />
    <DataTableColumn field="notes" label="Notes" />
  </DataTable>
</template>

<script setup>
const handleSortChange = (sortArray) => {
  // Handle sorting
}
</script>
```

## Exposed Methods

The DataTable component exposes the following sorting methods via template refs:

```vue
<template>
  <DataTable ref="tableRef" />
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()

// Available methods:
// tableRef.value.toggleSort('fieldId') - Toggle sort for a specific field
// tableRef.value.getSortState('fieldId') - Get sort state: 'asc', 'desc', or null
// tableRef.value.getSortIndex('fieldId') - Get sort index (1-based) for multiple sort
// tableRef.value.clearSort() - Clear all sorting
// tableRef.value.setSortState([...]) - Set sort state programmatically
// tableRef.value.sortValue - Readonly reactive ref to current sort state
```

## Visual Indicators

The sort controls show different icons based on state:

- **Unsorted**: `si-sort` icon (gray)
- **Ascending**: `si-sort-ascending` icon (blue)
- **Descending**: `si-sort-descending` icon (blue)
- **Multiple Sort Index**: Number indicator showing sort priority

## Styling

Sort controls automatically inherit the theme and can be styled via CSS classes. The component uses:

- `si-sort`, `si-sort-ascending`, `si-sort-descending` icons for sort states
- Blue color (`text-blue-600`) for active states
- Gray color (`text-gray-400`) for inactive states

## Integration Notes

1. **Column-Level Control**: Sort controls only appear on columns with `sorting: true` prop
2. **Grouped Columns**: Sort controls are hidden for columns that are part of grouped headers
3. **Accessibility**: All sort buttons include proper hover states and click handling
4. **Performance**: Sort state changes are emitted immediately without debouncing - implement debouncing in your handler if needed

## Complete Example

See `src/pages/SortableTableExample.vue` for a complete working example with grouped columns and sort state visualization.
