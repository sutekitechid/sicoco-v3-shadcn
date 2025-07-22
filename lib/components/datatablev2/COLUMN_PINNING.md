## Column Pinning/Freezing Feature

### 🎯 **Overview:**

Fitur Column Pinning memungkinkan user untuk "membekukan" kolom di sisi kiri atau kanan table. Kolom yang di-pin akan tetap terlihat saat user scroll horizontal, memberikan akses cepat ke data penting.

### 🚀 **Features:**

1. **Pin Left**: Kolom akan stick di sisi kiri table
2. **Pin Right**: Kolom akan stick di sisi kanan table  
3. **Multiple Pinning**: Bisa pin lebih dari 1 kolom di setiap sisi
4. **Persistent State**: Pinning state tersimpan di localStorage
5. **Visual Feedback**: Pinned columns memiliki styling khusus

### 📋 **API Methods:**

```javascript
// Pin column to left
pinColumnLeft(fieldId)

// Pin column to right  
pinColumnRight(fieldId)

// Unpin column
unpinColumn(fieldId)

// Check pinning status
isColumnPinnedLeft(fieldId)   // returns boolean
isColumnPinnedRight(fieldId)  // returns boolean  
isColumnPinned(fieldId)       // returns boolean

// Access pinned arrays (readonly)
pinnedLeft.value   // Array of left pinned field IDs
pinnedRight.value  // Array of right pinned field IDs
```

### 🎨 **UI Controls:**

Melalui dropdown settings di setiap column header:
- **📌 Pin Left** - Pin column ke sisi kiri
- **📌 Pin Right** - Pin column ke sisi kanan  
- **📌 Unpin** - Remove pin dari column

### 🔧 **How It Works:**

1. **State Management**:
   ```javascript
   pinnedLeft: ['field1', 'field2']    // Left-to-right order
   pinnedRight: ['field3', 'field4']   // Right-to-left order
   ```

2. **Column Organization**:
   - Columns diorganisir: `[leftPinned] + [unpinned] + [rightPinned]`
   - Order dalam group ditentukan oleh registration/pin order

3. **Sticky Positioning**:
   - Left pinned: `position: sticky; left: [calculated]px`
   - Right pinned: `position: sticky; right: [calculated]px`
   - Z-index tinggi untuk stay on top

4. **Persistence**:
   - Auto-save ke `localStorage` dengan key per table ID
   - State di-restore saat component mount

### 💡 **Usage Examples:**

```vue
<template>
  <DataTable :data="tableData" id="my-table">
    <DataTableColumn field="id" header="ID" />
    <DataTableColumn field="name" header="Name" />
    <DataTableColumn field="email" header="Email" />
    <DataTableColumn field="status" header="Status" />
  </DataTable>
</template>
```

**User Actions:**
1. Click dropdown di "ID" column → Pin Left
2. Click dropdown di "Status" column → Pin Right  
3. Scroll horizontal → ID dan Status tetap terlihat

**Result:**
```
[ID] | [scrollable content: Name, Email] | [Status]
```

### 🎯 **Benefits:**

- ✅ **Always Visible**: Important columns selalu terlihat
- ✅ **Context Preservation**: User tidak kehilangan context saat scroll
- ✅ **Flexible**: Bisa pin multiple columns sesuai kebutuhan
- ✅ **Persistent**: Setting tersimpan antar session
- ✅ **Intuitive**: UI controls yang mudah dipahami

### ⚡ **Performance:**

- Menggunakan CSS `position: sticky` (native browser optimization)
- Minimal re-renders dengan computed properties
- Efficient positioning calculation
- Lightweight state management

### 🔄 **State Persistence:**

Data disimpan di localStorage dengan keys:
- `datatable-pinned-left-{tableId}`
- `datatable-pinned-right-{tableId}`

Format: `["field1", "field2"]` (array of field IDs)

### 🎨 **Styling:**

Pinned columns mendapat:
- `position: sticky`
- `z-index: 20` (above normal content)  
- `bg-background` (consistent background)
- Border separators untuk visual distinction
- Calculated left/right positioning

Column pinning memberikan UX yang sangat baik untuk tables dengan data lebar! 🎉
