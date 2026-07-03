# DataTable v2

Komponen tabel data enterprise dengan dukungan sorting, pagination, column pinning, infinite scroll, footer, selectable rows, dan grouped columns.

---

## Instalasi & Import

Komponen yang didokumentasikan dan diekspor untuk penggunaan consumer adalah `DataTable`, `DataTableColumn`, dan `DataTableGroupColumn`.

```ts
import { DataTable, DataTableColumn, DataTableGroupColumn } from '@sutekitechid/sicoco-v3-next'
```

---

## Contoh Dasar

```vue
<DataTable id="my-table" :data="rows" :total="200">
  <DataTableColumn field="name">
    <template #header>Nama</template>
    <template #default="{ row }">{{ row.name }}</template>
  </DataTableColumn>

  <DataTableColumn field="email">
    <template #header>Email</template>
    <template #default="{ row }">{{ row.email }}</template>
  </DataTableColumn>
</DataTable>
```

---

## Props DataTable

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `id` | `String` | `'datatable'` | ID unik elemen table |
| `data` | `Array` | — | Data baris yang ditampilkan |
| `total` | `Number` | `0` | Total data untuk server-side pagination |
| `page` | `Number` | `1` | Halaman aktif (`v-model:page`) |
| `perPage` | `Number\|String` | `20` | Jumlah baris per halaman (`v-model:per-page`) |
| `paginated` | `Boolean\|undefined` | `undefined` | `true` = selalu tampilkan pagination; `false` = tidak pernah; `undefined` = auto (tampil jika data > 100 baris, dan lakukan client-side pagination) |
| `loading` | `Boolean` | `false` | Tampilkan skeleton loading |
| `selectable` | `Boolean` | `false` | Aktifkan checkbox seleksi baris |
| `modelValue` | `Array` | `[]` | Baris yang dipilih (`v-model`) |
| `rowKey` | `String` | `'id'` | Key unik untuk setiap baris |
| `isRowSelectable` | `Function` | `() => true` | Fungsi penentu apakah baris bisa dipilih: `(row, index) => boolean` |
| `rowClass` | `String\|Function` | `''` | Class tambahan per baris. Bisa string atau `(row, index) => string` |
| `rowSize` | `String` | `''` | Ukuran baris: `'sm'`, `'md'`, `'lg'` |
| `showNumbering` | `Boolean` | `true` | Tampilkan kolom nomor urut |
| `showFooter` | `Boolean` | `false` | Tampilkan baris footer |
| `stickyFooter` | `Boolean` | `true` | Footer sticky di bawah scroll container |
| `stickyHeaders` | `Boolean` | `true` | Header sticky di atas scroll container |
| `scrollY` | `String` | `'40rem'` | Tinggi maksimal scroll area (CSS value). Kosongkan untuk tanpa batas |
| `multipleSort` | `Boolean` | `false` | Aktifkan multi-kolom sorting |
| `infiniteScroll` | `Boolean` | `false` | Aktifkan mode infinite scroll (pagination diganti dengan load-more otomatis) |
| `dataCy` | `String` | `''` | Prefix untuk atribut `data-cy` (testing) |
| `dataTestid` | `String` | `''` | Prefix untuk atribut `data-testid` (testing). Fallback ke `dataCy` bila tidak diisi |

---

## Events DataTable

| Event | Payload | Keterangan |
|-------|---------|------------|
| `update:page` | `number` | Emitted saat halaman berubah |
| `update:perPage` | `number\|string` | Emitted saat perPage berubah |
| `update:modelValue` | `Array` | Emitted saat seleksi baris berubah |
| `sort` | `Array<{ field, direction }>` | Emitted saat sorting berubah |

---

## Slots DataTable

| Slot | Keterangan |
|------|------------|
| `empty` | Konten saat data kosong |
| `default` | Tempat menaruh `DataTableColumn` / `DataTableGroupColumn` |

---

## Exposed Methods

Dapat diakses via template ref:

```vue
<DataTable ref="tableRef" ... />
```

| Method / Property | Keterangan |
|-------------------|------------|
| `allLeafColumns` | Semua kolom leaf yang terdaftar |
| `resetTable()` | Reset row size ke default |
| `toggleSort(field)` | Toggle sort kolom |
| `getSortState(field)` | State sort kolom: `'asc'`, `'desc'`, atau `''` |
| `getSortIndex(field)` | Urutan sort (multi-sort) |
| `clearSort()` | Hapus semua sorting |
| `setSortState(field, direction)` | Set sort secara programatik |
| `initializeDefaultSorting()` | Inisialisasi default sort dari prop `defaultSort` |
| `sortValue` | Readonly ref array sort aktif |
| `refreshPinnedOffsets()` | Paksa recalculate offset sticky column |

---

## DataTableColumn

Komponen renderless untuk mendaftarkan kolom ke DataTable.

```vue
<DataTableColumn
  field="name"
  :sortable="true"
  :order="1"
  pin="left"
>
  <template #header>Nama</template>
  <template #default="{ row, index }">{{ row.name }}</template>
  <template #footer="{ data }">Total: {{ data.length }}</template>
</DataTableColumn>
```

### Props DataTableColumn

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `field` | `String` | `''` | Identifier unik kolom. Digunakan untuk sorting, visibility, dan pinning |
| `group` | `String` | `''` | Nama grup kolom (untuk `DataTableGroupColumn`) |
| `order` | `Number` | `null` | Urutan tampil kolom. Tanpa `order`, urutan mengikuti registrasi |
| `sortable` | `Boolean` | `false` | Tampilkan tombol sort pada header |
| `defaultSort` | `String` | `''` | Arah sort default: `'asc'` atau `'desc'` |
| `pin` | `String` | `''` | Pin kolom: `'left'` atau `'right'` |
| `colspan` | `Number` | `1` | Header colspan |
| `rowspan` | `Number` | `1` | Header rowspan |
| `bodyColspan` | `Number\|Function` | `1` | Body colspan. Fungsi menerima `(row, rowIndex)` |
| `bodyRowspan` | `Number\|Function` | `1` | Body rowspan. Fungsi menerima `(row, rowIndex)` |
| `footerColspan` | `Number\|Function` | `1` | Footer colspan. Fungsi menerima `(footerKey)` |
| `footerRowspan` | `Number\|Function` | `1` | Footer rowspan. Fungsi menerima `(footerKey)` |
| `width` | `Number\|String` | `null` | Lebar kolom (px atau CSS value) |

### Slots DataTableColumn

| Slot | Props | Keterangan |
|------|-------|------------|
| `header` | — | Konten header kolom |
| `default` | `{ row, index }` | Konten cell baris data |
| `footer` | `{ data, footerRow }` | Footer baris pertama |
| `footer2`, `footer3`, ... | `{ data, footerRow }` | Footer baris ke-N (untuk multi-row footer) |

---

## DataTableGroupColumn

Mengelompokkan beberapa `DataTableColumn` di bawah satu header grup.

```vue
<DataTableGroupColumn name="info" :order="1" pin="left">
  <template #header>Informasi Pribadi</template>

  <DataTableColumn field="name" :order="1">
    <template #header>Nama</template>
    <template #default="{ row }">{{ row.name }}</template>
  </DataTableColumn>

  <DataTableColumn field="age" :order="2">
    <template #header>Umur</template>
    <template #default="{ row }">{{ row.age }}</template>
  </DataTableColumn>
</DataTableGroupColumn>
```

### Props DataTableGroupColumn

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `name` | `String` | — | Identifier unik grup |
| `order` | `Number` | `null` | Urutan tampil grup |
| `pin` | `String` | `''` | Pin seluruh kolom dalam grup: `'left'` atau `'right'`. Diwariskan ke kolom anak yang tidak punya pin sendiri |

---

## Column Pinning

Kolom dapat di-pin ke sisi kiri atau kanan menggunakan CSS `position: sticky`. Offset dihitung otomatis berdasarkan lebar kolom di DOM.

```vue
<!-- Pin single column -->
<DataTableColumn field="id" pin="left">...</DataTableColumn>

<!-- Pin seluruh group -->
<DataTableGroupColumn name="actions" pin="right">
  <DataTableColumn field="edit">...</DataTableColumn>
  <DataTableColumn field="delete">...</DataTableColumn>
</DataTableGroupColumn>
```

- Kolom seleksi (`selectable`) selalu sticky `left-0`.
- Offset kolom pinned dihitung ulang otomatis saat: mount, resize, data berubah, visibility berubah.
- Untuk paksa recalculate: `tableRef.value.refreshPinnedOffsets()`.

---

## Sorting

```vue
<DataTableColumn field="name" :sortable="true" default-sort="asc">
  <template #header>Nama</template>
</DataTableColumn>
```

- `multipleSort` pada DataTable mengaktifkan sort multi-kolom.
- Event `@sort` membawa array `[{ field: 'name', direction: 'asc' }]`.
- Sort bisa dikontrol secara programatik via `tableRef.value.toggleSort(field)`.

---

## Pagination

### Client-side (default)

Saat `paginated` tidak di-set (atau `undefined`) dan `infinite-scroll` tidak aktif, DataTable otomatis melakukan slice pada `data`:

```vue
<DataTable
  v-model:page="page"
  v-model:per-page="perPage"
  :data="allRows"
/>
```

DataTable akan menampilkan pagination jika `data.length > 100`. Tidak perlu prop `total` karena total dihitung dari panjang array.

### Server-side

Set `paginated="true"` dan sediakan prop `total`:

```vue
<DataTable
  :paginated="true"
  v-model:page="page"
  v-model:per-page="perPage"
  :data="pageRows"
  :total="500"
/>
```

### Nonaktifkan

```vue
<DataTable :paginated="false" :data="rows" />
```

---

## Infinite Scroll

Saat `infinite-scroll` aktif, pagination disembunyikan. DataTable akan increment `page` secara otomatis saat pengguna scroll ke bawah, dan parent cukup append data baru ke array.

```vue
<DataTable
  v-model:page="page"
  :data="rows"
  :loading="loading"
  infinite-scroll
>
  ...
</DataTable>
```

```ts
// Parent logic
watch(page, async (newPage) => {
  loading.value = true
  const newRows = await fetchPage(newPage)
  rows.value = [...rows.value, ...newRows] // append, bukan replace
  loading.value = false
})
```

- Saat `loading = true` dan sudah ada data, skeleton ditampilkan **setelah** baris yang sudah ada (bukan menggantikan).
- Saat `loading = true` dan data masih kosong (halaman pertama), skeleton menggantikan baris.

---

## Footer

Footer mendukung multi-baris menggunakan slot bernama `footer`, `footer2`, `footer3`, dst.

```vue
<DataTable :show-footer="true">
  <DataTableColumn field="name">
    <template #header>Nama</template>
    <template #default="{ row }">{{ row.name }}</template>
    <template #footer="{ data }">Total: {{ data.length }}</template>
  </DataTableColumn>

  <DataTableColumn field="amount">
    <template #header>Jumlah</template>
    <template #default="{ row }">{{ row.amount }}</template>
    <template #footer="{ data }">
      {{ data.reduce((s, r) => s + r.amount, 0) }}
    </template>
    <template #footer2="{ data }">
      Avg: {{ (data.reduce((s, r) => s + r.amount, 0) / data.length).toFixed(2) }}
    </template>
  </DataTableColumn>
</DataTable>
```

- Footer sticky secara default (`sticky-footer` default `true`).
- Untuk nonaktifkan: `:sticky-footer="false"`.

---

## Selectable Rows

```vue
<DataTable
  v-model="selected"
  :selectable="true"
  :is-row-selectable="(row) => row.status !== 'locked'"
>
  ...
</DataTable>
```

- `v-model` menyimpan array baris yang dipilih.
- `is-row-selectable` menerima fungsi `(row) => boolean` untuk menonaktifkan baris tertentu.

---

## Grouped Columns

```vue
<DataTable :data="rows">
  <DataTableGroupColumn name="personal" :order="1">
    <template #header>Data Pribadi</template>
    <DataTableColumn field="name" :order="1">
      <template #header>Nama</template>
      <template #default="{ row }">{{ row.name }}</template>
    </DataTableColumn>
    <DataTableColumn field="dob" :order="2">
      <template #header>Tanggal Lahir</template>
      <template #default="{ row }">{{ row.dob }}</template>
    </DataTableColumn>
  </DataTableGroupColumn>

  <DataTableColumn field="email" :order="2">
    <template #header>Email</template>
    <template #default="{ row }">{{ row.email }}</template>
  </DataTableColumn>
</DataTable>
```

---

## Row Size

```vue
<DataTable row-size="sm" :data="rows">...</DataTable>
```

| Value | Keterangan |
|-------|------------|
| `'sm'` | Baris compact |
| `'md'` | Baris sedang (default) |
| `'lg'` | Baris besar |

Gunakan `COLUMN_SIZE` constant:

```ts
import { COLUMN_SIZE } from '@sutekitechid/sicoco-v3-next'
// COLUMN_SIZE.Small = 'sm'
// COLUMN_SIZE.Medium = 'md'
// COLUMN_SIZE.Large = 'lg'
```

---

## Arsitektur

```
datatablev2/
  DataTable.vue              # Komponen utama
  DataTableColumn.vue        # Renderless — mendaftarkan kolom
  DataTableGroupColumn.vue   # Renderless — mendaftarkan grup kolom
  DataTableFooter.vue        # Render <tfoot> rows
  DataTableLoading.vue       # Skeleton loading rows
  DataTableSortButton.vue    # Tombol sort di header
  index.ts                   # Export publik + CVA variants
  composables/
    useColumnSorting.js      # Sort state management
    useDataTablePinning.js   # CSS sticky offset calculation
    useDataTableStyle.js     # Class helpers untuk header/body cell & row
    useSelectRow.js          # Checkbox selection logic
    useTreeOperations.js     # Build, flatten, sort column tree
    index.js                 # Re-export semua composable
```
