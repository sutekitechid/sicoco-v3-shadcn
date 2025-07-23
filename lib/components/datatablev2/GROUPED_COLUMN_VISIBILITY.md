## Column Visibility with Grouped Columns

### 🎯 **Problem Solved:**

Ketika columns memiliki group yang sama dan field name yang sama, sistem column visibility tidak bisa membedakan antara columns tersebut. Misalnya:

```vue
<!-- Group 1 -->
<DataTableGroup name="group1">
  <DataTableColumn field="name" header="Name in Group 1" />
</DataTableGroup>

<!-- Group 2 -->  
<DataTableGroup name="group2">
  <DataTableColumn field="name" header="Name in Group 2" />
</DataTableGroup>
```

Kedua column memiliki `field="name"` yang sama, sehingga visibility system tidak bisa membedakan mana yang harus di-hide/show.

### ✅ **Solution Implemented:**

1. **Unique Field ID Generation**:
   ```javascript
   const getUniqueFieldId = (field, group = null) => {
     if (group) {
       return `${group}.${field}` // "group1.name", "group2.name"
     }
     return field // "name" untuk ungrouped columns
   }
   ```

2. **Enhanced Column Objects**:
   - `uniqueFieldId`: ID unik untuk visibility tracking
   - `displayField`: Field name asli untuk display purposes
   - `field`: Digunakan sebagai `uniqueFieldId` untuk visibility

3. **Updated Visibility Logic**:
   - `buildTree()`: Menambahkan `uniqueFieldId` ke setiap column
   - `filterNodeByVisibility()`: Menggunakan `uniqueFieldId` untuk filtering
   - `allLeafColumns`: Menyediakan unique field IDs untuk dropdown
   - `flattenTreeToRows()`: Menggunakan `uniqueFieldId` di header cells

### 🔧 **How It Works:**

**Before (Broken):**
```javascript
columnVisibility: ["name"] 
// Hide/show semua columns dengan field="name"
```

**After (Fixed):**
```javascript
columnVisibility: ["group1.name", "group2.name", "ungrouped_field"]
// Bisa hide/show individual columns even with same field name
```

### 💡 **Usage:**

Tidak ada perubahan di API - sistem akan otomatis generate unique IDs:

```vue
<!-- Tetap sama seperti sebelumnya -->
<DataTableGroup name="personal">
  <DataTableColumn field="name" header="Personal Name" />
</DataTableGroup>

<DataTableGroup name="business">  
  <DataTableColumn field="name" header="Business Name" />
</DataTableGroup>

<DataTableColumn field="name" header="General Name" />
```

**Generated Field IDs:**
- `personal.name`
- `business.name` 
- `name`

### 🎯 **Benefits:**

- ✅ Columns dengan field name sama tapi group berbeda bisa di-manage independently
- ✅ Backward compatible dengan existing ungrouped columns
- ✅ Persistence tetap bekerja dengan field IDs yang unique
- ✅ Dropdown visibility controls menampilkan semua columns dengan benar
