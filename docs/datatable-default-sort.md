# DataTable Default Sort Feature

## Overview

The DataTable component now supports default sorting through the `defaultSort` prop on `DataTableColumn` components. This allows you to specify which columns should be sorted by default when the table first loads.

## Usage

### Basic Default Sort

```vue
<DataTable :data="tableData">
  <DataTableColumn
    field="name"
    :sortable="true"
    default-sort="asc"
  >
    <template #header>Name</template>
    <template #default="{ row }">{{ row.name }}</template>
  </DataTableColumn>
  
  <DataTableColumn
    field="created_at"
    :sortable="true"
    default-sort="desc"
  >
    <template #header>Created Date</template>
    <template #default="{ row }">{{ row.created_at }}</template>
  </DataTableColumn>
</DataTable>
```

### Multiple Default Sorts

When `multiple-sort` is enabled on the DataTable, you can specify multiple columns with default sorts. Use the `order` prop to control the sort priority:

```vue
<DataTable 
  :data="tableData" 
  :multiple-sort="true"
>
  <!-- Primary sort: Name ascending -->
  <DataTableColumn
    field="name"
    :sortable="true"
    :order="1"
    default-sort="asc"
  >
    <template #header>Name (Primary Sort)</template>
    <template #default="{ row }">{{ row.name }}</template>
  </DataTableColumn>
  
  <!-- Secondary sort: Department descending -->
  <DataTableColumn
    field="department"
    :sortable="true"
    :order="2"
    default-sort="desc"
  >
    <template #header>Department (Secondary Sort)</template>
    <template #default="{ row }">{{ row.department }}</template>
  </DataTableColumn>
  
  <!-- Tertiary sort: Salary descending -->
  <DataTableColumn
    field="salary"
    :sortable="true"
    :order="3"
    default-sort="desc"
  >
    <template #header>Salary (Tertiary Sort)</template>
    <template #default="{ row }">{{ row.salary }}</template>
  </DataTableColumn>
</DataTable>
```

## Props

### DataTableColumn Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultSort` | `String` | `''` | Sets the default sort direction for this column. Accepts `'asc'` for ascending or `'desc'` for descending. |
| `order` | `Number` | `null` | Defines the sort priority when multiple default sorts are specified. Lower numbers have higher priority. |
| `sortable` | `Boolean` | `false` | Must be `true` for the column to support sorting (including default sort). |

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multipleSort` | `Boolean` | `false` | Enables multiple column sorting. Required to use multiple default sorts. |

## Behavior

1. **Initialization**: Default sorting is applied when the table first loads and no existing sort state is present.

2. **Single Sort Mode**: Only the first column with `defaultSort` (by `order` priority) will be applied.

3. **Multiple Sort Mode**: All columns with `defaultSort` will be applied, ordered by their `order` prop value.

4. **Priority**: Columns with lower `order` values have higher sort priority.

5. **Requirements**: A column must have `sortable="true"` for `defaultSort` to take effect.

6. **State Override**: If the table has existing sort state (e.g., from user interaction or persistence), default sorts will not override it.

## Example

See `examples/DefaultSortExample.vue` for a complete working example with both single and multiple sort modes.

## Events

The default sorting will trigger the normal `@sort` event when initialized, allowing parent components to react to the initial sort state.

```vue
<DataTable 
  :data="tableData"
  @sort="handleSortChange"
>
  <!-- columns with defaultSort -->
</DataTable>
```

```javascript
function handleSortChange(sortState) {
  // sortState will contain the default sort configuration
  // Example: [{ id: 'name', desc: false }, { id: 'department', desc: true }]
  console.log('Current sort:', sortState)
}
```
