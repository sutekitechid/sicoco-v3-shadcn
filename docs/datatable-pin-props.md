# DataTable Pin Props Feature

## Overview

DataTable sekarang mendukung automatic pinning menggunakan props `pin` pada `DataTableColumn` dan `DataTableGroupColumn`. Kolom atau grup yang memiliki props `pin` akan otomatis di-pin ke localStorage dan ditampilkan sesuai dengan nilai pin yang ditentukan.

## Features

### 1. Column Pin Props
- Kolom individual dapat di-pin menggunakan props `pin`
- Mendukung nilai: `"left"`, `"right"`, atau `null`
- Otomatis disimpan ke localStorage jika `persistState` enabled

### 2. Group Pin Props
- Grup kolom dapat di-pin menggunakan props `pin`
- Semua kolom dalam grup akan ikut ter-pin
- Mendukung nested groups

### 3. Auto-detection
- Props `pin` otomatis terdeteksi saat komponen mount
- Kolom/grup dengan pin props ditambahkan ke pinning arrays
- Kombinasi dengan localStorage state restoration

## Usage

### Basic Column Pinning

```vue
<template>
  <DataTable :data="tableData" id="my-table" :persist-state="true">
    <!-- Pin to left -->
    <DataTableColumn field="id" pin="left">
      <template #header>ID</template>
      <template #default="{ row }">{{ row.id }}</template>
    </DataTableColumn>

    <!-- Pin to right -->
    <DataTableColumn field="actions" pin="right">
      <template #header>Actions</template>
      <template #default="{ row }">
        <button @click="edit(row)">Edit</button>
      </template>
    </DataTableColumn>

    <!-- Regular column (no pin) -->
    <DataTableColumn field="name">
      <template #header>Name</template>
      <template #default="{ row }">{{ row.name }}</template>
    </DataTableColumn>
  </DataTable>
</template>
```

### Group Column Pinning

```vue
<template>
  <DataTable :data="tableData" id="my-table" :persist-state="true">
    <!-- Pin entire group to left -->
    <DataTableGroupColumn name="user_info" pin="left">
      <template #header>User Information</template>
      
      <DataTableColumn field="name">
        <template #header>Name</template>
        <template #default="{ row }">{{ row.name }}</template>
      </DataTableColumn>
      
      <DataTableColumn field="email">
        <template #header>Email</template>
        <template #default="{ row }">{{ row.email }}</template>
      </DataTableColumn>
    </DataTableGroupColumn>

    <!-- Pin entire group to right -->
    <DataTableGroupColumn name="actions" pin="right">
      <template #header>Actions</template>
      
      <DataTableColumn field="edit">
        <template #header>Edit</template>
        <template #default="{ row }">
          <button @click="edit(row)">Edit</button>
        </template>
      </DataTableColumn>
      
      <DataTableColumn field="delete">
        <template #header>Delete</template>
        <template #default="{ row }">
          <button @click="delete(row)">Delete</button>
        </template>
      </DataTableColumn>
    </DataTableGroupColumn>
  </DataTable>
</template>
```

## Technical Implementation

### 1. Props Registration

**DataTableColumn.vue:**
```javascript
props: {
  pin: {
    type: String, // 'left', 'right', or null
    default: null,
  }
  // ... other props
}

// Registration includes pin prop
register({
  // ... other properties
  pin: props.pin
})
```

**DataTableGroupColumn.vue:**
```javascript
props: {
  pin: {
    type: String, // 'left', 'right', or null
    default: null,
  }
  // ... other props
}

// Registration includes pin prop
register({
  // ... other properties
  pin: props.pin
})
```

### 2. Auto-detection Logic

**useDataTablePinning.js:**
```javascript
function processColumnsPinProps() {
  // Process columns with pin props
  allLeafColumns.value.forEach(column => {
    if (column.pin) {
      const columnId = column.compositeFieldId || column.field
      if (columnId) {
        if (column.pin === 'left' && !isPinnedLeft(columnId)) {
          pinLeft(columnId)
        } else if (column.pin === 'right' && !isPinnedRight(columnId)) {
          pinRight(columnId)
        }
      }
    }
  })

  // Process groups with pin props
  groups.forEach(group => {
    if (group.pin) {
      const groupId = group.name
      if (groupId) {
        if (group.pin === 'left' && !isPinnedLeft(groupId)) {
          pinLeft(groupId)
        } else if (group.pin === 'right' && !isPinnedRight(groupId)) {
          pinRight(groupId)
        }
      }
    }
  })
}
```

### 3. Integration with localStorage

- Props `pin` diproses setelah restoration dari localStorage
- Tidak akan override setting yang sudah ada di localStorage
- Hanya menambahkan kolom/grup yang belum ada di pinning arrays

### 4. Watchers

```javascript
// Watch for changes in columns or groups to process pin props
watch(
  [allLeafColumns, () => groups.length],
  () => {
    processColumnsPinProps()
  },
  { deep: true, flush: 'post' }
)
```

## Benefits

1. **Declarative**: Pin state didefinisikan langsung di template
2. **Persistent**: Otomatis tersimpan ke localStorage
3. **Flexible**: Bisa dikombinasi dengan manual pinning
4. **Performance**: Tidak impact performance existing functionality
5. **Backward Compatible**: Tidak breaking existing code

## Example Use Cases

1. **ID Columns**: Selalu pin ID ke kiri untuk referensi
2. **Action Columns**: Pin actions ke kanan untuk easy access
3. **Important Groups**: Pin critical information groups
4. **User Preferences**: Kombinasi dengan user-defined pinning

## Notes

- Pin props hanya berfungsi jika `persistState="true"`
- Pin props tidak akan override manual user pinning via UI
- Jika ada conflict, localStorage state akan diprioritaskan
- Pin props diproses setiap kali ada perubahan kolom/grup
