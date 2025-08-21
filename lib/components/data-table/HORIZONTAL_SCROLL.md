## DataTable Horizontal Scroll

DataTable sekarang mendukung horizontal scroll dengan fitur-fitur berikut:

### 🎯 **Fitur Utama:**

1. **Scroll Horizontal Otomatis** - Table akan otomatis scroll horizontal jika content lebih lebar dari container
2. **Visual Indicators** - Gradient shadow di kiri/kanan untuk menunjukkan ada content yang bisa di-scroll
3. **Responsive Design** - Bekerja dengan baik di semua ukuran layar
4. **Configurable** - Bisa di-customize sesuai kebutuhan

### 📋 **Props untuk Horizontal Scroll:**

```vue
<DataTable
  :data="tableData"
  :enable-horizontal-scroll="true"      // Default: true
  min-column-width="150px"              // Default: "120px"
  table-min-width="full"                // Default: "full" | "1200px" | etc
/>
```

### 🔧 **Pengaturan Props:**

- **`enableHorizontalScroll`** (Boolean, default: `true`)
  - Mengaktifkan/menonaktifkan horizontal scroll
  - Jika `false`, table akan menggunakan layout normal

- **`minColumnWidth`** (String, default: `"120px"`)
  - Minimum width untuk setiap kolom
  - Mencegah kolom terlalu kecil dan tidak readable

- **`tableMinWidth`** (String, default: `"full"`)
  - Minimum width untuk seluruh table
  - `"full"` = `min-w-full` (menggunakan full width container)
  - Bisa juga custom value seperti `"1200px"`, `"800px"`, dll

### 💡 **Cara Kerja:**

1. **Auto-Detection**: System otomatis deteksi apakah table perlu scroll
2. **Visual Feedback**: Gradient shadow muncul di sisi yang bisa di-scroll
3. **Smooth Scrolling**: User bisa scroll dengan mouse wheel atau touch gesture
4. **Responsive**: Indikator akan update sesuai posisi scroll

### 🎨 **Styling:**

Table menggunakan:
- `overflow-x-auto` untuk horizontal scroll
- `min-w-[120px]` untuk minimum column width
- `whitespace-nowrap` untuk mencegah text wrapping
- Gradient shadows untuk visual indicators

### 📱 **Mobile Support:**

- Touch scroll support
- Responsive indicators
- Optimized untuk mobile experience

### 🔄 **State Persistence:**

Horizontal scroll bekerja dengan fitur persistence yang sudah ada:
- Column visibility tetap tersimpan
- Row size tetap tersimpan
- Scroll position akan reset saat refresh (by design)
