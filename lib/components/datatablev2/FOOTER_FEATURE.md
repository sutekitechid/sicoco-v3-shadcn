# DataTable Footer Feature

DataTable sekarang mendukung footer yang memiliki fitur yang sama dengan table cell. Footer dapat digunakan untuk menampilkan ringkasan data, perhitungan, atau informasi tambahan lainnya.

## Cara Menggunakan Footer

### 1. Mengaktifkan Footer

Tambahkan prop `show-footer="true"` pada komponen DataTable:

```vue
<DataTable :data="tableData" :show-footer="true">
  <!-- columns -->
</DataTable>
```

### 2. Menambahkan Footer Content

Pada setiap DataTableColumn, tambahkan slot `#footer` untuk menampilkan konten footer:

```vue
<DataTableColumn field="name">
  <template #header>
    <span>Name</span>
  </template>
  <template #default="{ row }">
    <span>{{ row.name }}</span>
  </template>
  <template #footer="{ data }">
    <span class="font-semibold">Total: {{ data.length }} records</span>
  </template>
</DataTableColumn>
```

### 3. Footer dengan Perhitungan

Footer mendapat akses ke seluruh data melalui parameter `data`:

```vue
<DataTableColumn field="salary">
  <template #header>
    <span>Salary</span>
  </template>
  <template #default="{ row }">
    <span>${{ row.salary.toLocaleString() }}</span>
  </template>
  <template #footer="{ data }">
    <span class="font-semibold">
      Total: ${{ data.reduce((sum, item) => sum + item.salary, 0).toLocaleString() }}
    </span>
  </template>
</DataTableColumn>
```

### 4. Footer Colspan/Rowspan Terpisah

Footer dapat memiliki pengaturan colspan dan rowspan yang berbeda dari body:

```vue
<DataTableColumn 
  field="name" 
  :body-colspan="1" 
  :footer-colspan="2"
  :body-rowspan="1"
  :footer-rowspan="1"
>
  <template #header>Name</template>
  <template #default="{ row }">{{ row.name }}</template>
  <template #footer="{ data }">
    <span>Summary spanning 2 columns</span>
  </template>
</DataTableColumn>

<!-- Column kedua tidak akan menampilkan footer karena di-span oleh column pertama -->
<DataTableColumn 
  field="age" 
  :body-colspan="1" 
  :footer-colspan="0"
>
  <template #header>Age</template>
  <template #default="{ row }">{{ row.age }}</template>
  <!-- Tidak ada footer template karena di-handle oleh column sebelumnya -->
</DataTableColumn>
```

## Fitur Footer

### 1. **Pinned Columns Support**
Footer mengikuti pengaturan pinned columns seperti halnya cell biasa.

### 2. **Responsive Design**
Footer memiliki responsive behavior yang sama dengan table cells.

### 3. **Sticky Positioning**
Footer mendukung sticky positioning untuk kolom yang di-pin.

### 4. **Styling Consistency**
Footer menggunakan styling yang konsisten dengan table cells, dengan tambahan background `bg-muted/50` dan `font-medium`.

### 5. **Selectable & Numbering Support**
Footer otomatis menyesuaikan dengan pengaturan `selectable` dan `showNumbering`.

## Contoh Lengkap dengan Colspan/Rowspan

```vue
<template>
  <DataTable 
    :data="employees" 
    :show-footer="true"
    :selectable="true"
    :show-numbering="true"
  >
    <!-- Footer yang span 2 kolom -->
    <DataTableColumn 
      field="name" 
      :body-colspan="1" 
      :footer-colspan="2"
    >
      <template #header>Name</template>
      <template #default="{ row }">{{ row.name }}</template>
      <template #footer="{ data }">
        <strong>{{ data.length }} Employees Total</strong>
      </template>
    </DataTableColumn>
    
    <!-- Column ini tidak akan menampilkan footer karena di-span -->
    <DataTableColumn 
      field="department" 
      :body-colspan="1" 
      :footer-colspan="0"
    >
      <template #header>Department</template>
      <template #default="{ row }">{{ row.department }}</template>
    </DataTableColumn>
    
    <!-- Footer dengan rowspan -->
    <DataTableColumn 
      field="salary" 
      :body-colspan="1" 
      :footer-rowspan="2"
    >
      <template #header>Salary</template>
      <template #default="{ row }">${{ row.salary.toLocaleString() }}</template>
      <template #footer="{ data }">
        <div class="space-y-1">
          <div><strong>Total: ${{ calculateTotal(data) }}</strong></div>
          <div class="text-sm">Multi-row footer</div>
        </div>
      </template>
    </DataTableColumn>
    
    <!-- Footer normal -->
    <DataTableColumn field="status">
      <template #header>Status</template>
      <template #default="{ row }">{{ row.status }}</template>
      <template #footer="{ data }">
        <strong>{{ getActiveCount(data) }} Active</strong>
      </template>
    </DataTableColumn>
  </DataTable>
</template>
```

## Perbedaan Body vs Footer Colspan/Rowspan

| Aspek | Body | Footer |
|-------|------|--------|
| **Colspan** | `bodyColspan` | `footerColspan` |
| **Rowspan** | `bodyRowspan` | `footerRowspan` |
| **Penggunaan** | Menggabungkan cell data dalam baris | Menggabungkan cell footer untuk summary |
| **Independen** | ✅ Ya | ✅ Ya |
| **Nilai Default** | 1 | 1 |

### Contoh Skenario:

1. **Body normal, Footer span**: Body menampilkan data individual, footer menampilkan summary yang span multiple columns
2. **Body span, Footer normal**: Body menggabungkan beberapa kolom untuk data, footer tetap terpisah per kolom  
3. **Keduanya span**: Baik body maupun footer memiliki pengaturan span yang berbeda sesuai kebutuhan


## Props Baru

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showFooter` | Boolean | `false` | Menampilkan atau menyembunyikan footer table |

### DataTableColumn Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bodyColspan` | Number | `1` | Colspan untuk body cells |
| `bodyRowspan` | Number | `1` | Rowspan untuk body cells |
| `footerColspan` | Number | `1` | Colspan untuk footer cells (terpisah dari body) |
| `footerRowspan` | Number | `1` | Rowspan untuk footer cells (terpisah dari body) |

## Slot Baru

### DataTableColumn Footer Slot

```vue
<template #footer="{ data }">
  <!-- Footer content dengan akses ke seluruh data -->
</template>
```

**Parameters:**
- `data`: Array berisi seluruh data table

## Styling

Footer menggunakan class berikut:
- `font-medium`: Memberikan font weight medium
- `bg-muted/50`: Background dengan opacity 50%
- Sama dengan cell styling untuk border, padding, dll.

Footer juga mendukung semua fitur styling yang ada pada table cells seperti pinned column styling dan responsive behavior.
