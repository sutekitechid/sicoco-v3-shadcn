Kamu adalah AI frontend engineer yang bekerja di project berbasis Nuxt (Vue 3).

## 🎯 Tujuan
[DESKRIPSI SINGKAT TASK]
Contoh: Membuat component table untuk menampilkan data grade conversion.

## 📐 Spesifikasi Feature
[TULIS DETAIL SPEK DI SINI]

Contoh:
- Menampilkan list grade conversion
- Kolom: Grade, Score Range, Description
- Ada loading state
- Ada empty state
- Responsive (mobile + desktop)

---

## 📁 Target Implementation Location

Tentukan di mana implementasi dilakukan:

### 1. Page
- Path: [contoh: apps/.../pages/academic/index.vue]

### 2. Component
- Path: [contoh: apps/.../components/GradeTable.vue]

### 3. Jika tidak disebutkan:
- Tentukan lokasi yang paling sesuai berdasarkan struktur project

---

### ⚠️ Rules:
- Jika file SUDAH ADA → WAJIB edit file tersebut
- Jangan membuat file baru tanpa alasan kuat
- Ikuti struktur folder existing

---

## 🧱 Components to Use (DEFINED BY USER)

Gunakan component berikut (WAJIB):

- [LIST COMPONENT DARI USER]

---

### ⚠️ Rules:
- JANGAN mengganti component
- JANGAN membuat component baru
- Gunakan props sesuai kebutuhan

---

## 📐 UI Specification

### Layout
- Page terdiri dari:
  - Header
  - Filter section
  - Table

---

### Filter Section 
- 3 field:
  1. Periode (select)
  2. Prodi (select)
  3. Konsentrasi (select)

- Ada tombol:
  - "Cari"
  - "Reset"

---

### Table
- Kolom:
  - Nama
  - NIM
  - Prodi
  - Status

- Ada:
  - loading state
  - empty state

---

## 🎯 API Target Definition

Isi salah satu atau keduanya:

### 1. Endpoint yang akan digunakan
- Method: [GET/POST/...]
- URL: [/v2/...]
- Module name: [contoh: academicCourse]
- Endpoint name: [contoh: fetchGradeConversion]

---

### 2. Target Repository File (jika sudah ditentukan)
- Path: [contoh: apps/revamp-portal-dosen/repository/modules/academic-calendar.ts]

---

### 3. Struktur response (jika endpoint sudah ada)
```json
{
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Item 1",
        ...
      },
      ...
    ]
  }
}
```

### 4. Keterangan tambahan (opsional)
- Apakah endpoint sudah ada / belum

---

## 🔄 State Management (useState)
- Composable path: [contoh: apps/revamp-portal-dosen/composables/useGradeConversion.ts]
- State name: [contoh: state-grade-conversion]
---