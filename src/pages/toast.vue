<script setup lang="ts">
import Button from '@/components/button/Button.vue'
import { Toaster, toast, type ToastProps } from '@/components/toast'

const toastExamples: Array<{
	variant: NonNullable<ToastProps['variant']>
	title: string
	description: string
}> = [
	{
		variant: 'primary',
		title: 'Informasi diperbarui',
		description: 'Perubahan Anda telah disimpan sebagai draf.',
	},
	{
		variant: 'success',
		title: 'Berhasil disimpan',
		description: 'Data berhasil diperbarui.',
	},
	{
		variant: 'warning',
		title: 'Perlu perhatian',
		description: 'Beberapa bidang belum diisi.',
	},
	{
		variant: 'danger',
		title: 'Gagal menyimpan',
		description: 'Terjadi kesalahan. Silakan coba lagi.',
	},
	{
		variant: 'neutral',
		title: 'Informasi umum',
		description: 'Notifikasi dengan tampilan netral.',
	},
]

function showToast(example: (typeof toastExamples)[number]) {
	toast(example)
}

const descriptionOnlyExamples = [
	{
		label: '1 row description',
		description: 'Templat belum tersedia.',
	},
	{
		label: '2 row description',
		description: 'Templat belum tersedia. Silakan hubungi admin.',
	},
	{
		label: '3 row description',
		description:
			'Templat belum tersedia. Silakan hubungi admin untuk mengunggah templat terlebih dahulu. Pastikan yaa !!!!',
	},
] as const

function showDescriptionOnlyToast(description: string) {
	toast({
		variant: 'danger',
		description,
	})
}
</script>

<template>
	<div class="mx-auto flex max-w-5xl flex-col gap-8 p-4 tablet:p-8">
		<header>
			<h1 class="text-heading-sm font-semibold text-main">Toast</h1>
			<p class="mt-2 text-body-md text-neutral-600">
				Notifikasi singkat untuk memberi umpan balik atas tindakan pengguna.
			</p>
		</header>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-lg font-semibold text-main">Variants</h2>
			<p class="mt-1 text-body-md text-neutral-600">
				Klik tombol untuk menampilkan toast di pojok kanan atas layar.
			</p>
			<div class="mt-5 flex flex-wrap gap-3">
				<Button
					v-for="example in toastExamples"
					:key="example.variant"
					:variant="example.variant"
					@click="showToast(example)"
				>
					Show {{ example.variant }}
				</Button>
			</div>
		</section>

		<section class="rounded-lg border border-main bg-white p-5">
			<h2 class="text-title-lg font-semibold text-main">Description only</h2>
			<p class="mt-1 text-body-md text-neutral-600">
				Toast dapat ditampilkan hanya dengan deskripsi tanpa judul.
			</p>
			<div class="mt-5 flex flex-wrap gap-3">
				<Button
					v-for="example in descriptionOnlyExamples"
					:key="example.label"
					variant="danger"
					@click="showDescriptionOnlyToast(example.description)"
				>
					{{ example.label }}
				</Button>
			</div>
		</section>
	</div>
	<Toaster />
</template>
