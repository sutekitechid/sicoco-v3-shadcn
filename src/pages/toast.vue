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
		variant: 'danger',
		title: '',
		description: 'No Title.',
	},
]

function showToast(example: (typeof toastExamples)[number]) {
	toast(example)
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
				Klik tombol untuk menampilkan toast di bagian atas tengah layar.
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
	</div>
	<Toaster position="top-center" />
</template>
