# Dropdown Performance Optimization

## Overview

Optimasi ini mengurangi waktu pembukaan `Dropdown` yang memiliki banyak item,
terutama ketika nilai item berupa object nested yang memiliki properti `id`.

## Masalah

Setiap `DropdownItem` melakukan registrasi saat mount. Sebelumnya, setiap
registrasi langsung menjalankan sinkronisasi seluruh daftar opsi. Jika terdapat
banyak item dalam satu render, daftar yang sama diproses ulang berkali-kali.

Nilai item juga disimpan ke atribut `data-dropdown-item` menggunakan
`JSON.stringify()`. Untuk object parent yang membawa seluruh child dalam
properti `items`, atribut DOM yang dihasilkan menjadi sangat panjang.

## Perubahan

### Registrasi Opsi Dibatch

Pemanggilan sinkronisasi dari `addOption()` dan `removeOption()` sekarang
dijadwalkan menggunakan `queueMicrotask()`:

```ts
function scheduleRegisteredOptionsSync() {
	if (syncRegisteredOptionsPending) return
	syncRegisteredOptionsPending = true
	queueMicrotask(() => {
		syncRegisteredOptionsPending = false
		syncRegisteredOptions()
	})
}
```

`queueMicrotask()` adalah API global JavaScript yang disediakan browser dan
Node.js modern, bukan API Vue. Callback dijalankan setelah call stack saat ini
selesai dan sebelum task berikutnya diproses.

Seluruh item umumnya mount dalam call stack yang sama. Flag
`syncRegisteredOptionsPending` memastikan banyak perubahan registrasi hanya
memicu satu sinkronisasi pada akhir proses mount tersebut.

Alur sebelumnya:

```text
add item 1 -> sinkronisasi
add item 2 -> sinkronisasi
add item 3 -> sinkronisasi
```

Alur sekarang:

```text
add item 1 -> jadwalkan sinkronisasi
add item 2 -> lewati, sudah dijadwalkan
add item 3 -> lewati, sudah dijadwalkan
microtask  -> sinkronisasi sekali
```

### Key DOM Ringkas

Object yang memiliki `id` sekarang memakai key ringkas:

```ts
function getDropdownOptionKey(option: Option): string {
	if (option && !Array.isArray(option) && typeof option === 'object') {
		const id = option.id
		if (typeof id === 'string' || typeof id === 'number') return `id:${id}`
	}
	return JSON.stringify(option) ?? String(option)
}
```

Sebelumnya:

```html
<div data-dropdown-item='{"id":"unit-1","name":"Unit 1","items":[...]}'></div>
```

Sekarang:

```html
<div data-dropdown-item="id:unit-1"></div>
```

Object tanpa `id` dan nilai primitive tetap menggunakan representasi lama agar
perilakunya tidak berubah.

## Dampak

- Sinkronisasi daftar opsi tidak lagi berjalan untuk setiap item dalam satu batch render.
- Browser tidak perlu membuat dan menyimpan atribut JSON panjang untuk object ber-ID.
- Pencarian elemen terpilih menggunakan key yang sama dengan item yang dirender.
- Nilai `v-model` tetap berupa object lengkap; key ringkas hanya digunakan secara internal.

## Catatan Penggunaan

- Gunakan `id` string atau number yang unik dan stabil untuk setiap opsi object.
- Jika dua opsi menggunakan `id` yang sama, key DOM dan label internalnya dapat bertabrakan.
- Optimasi ini belum melakukan virtualisasi. Seluruh komponen item masih dibuat saat isi dropdown dirender.

## Verifikasi

Perubahan dilindungi oleh tes key object ber-ID dan seluruh rangkaian tes
`Dropdown` serta `DropdownItem`.
