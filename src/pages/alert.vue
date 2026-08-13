<template>
	<div class="flex flex-col gap-6 p-4">
		<section>
			<h3 class="mb-3 text-lg font-semibold">Alert Variants</h3>
			<div class="flex flex-col gap-3">
				<Alert variant="primary">
					<AlertTitle>Informasi</AlertTitle>
					<AlertDescription>
						Profil Anda berhasil diperbarui.
					</AlertDescription>
				</Alert>
				<Alert variant="success">
					<AlertTitle>Berhasil</AlertTitle>
					<AlertDescription>
						Perubahan telah disimpan dengan aman.
					</AlertDescription>
				</Alert>
				<Alert variant="warning">
					<AlertTitle>Perhatian</AlertTitle>
					<AlertDescription>
						Masa berlaku sesi Anda akan segera berakhir.
					</AlertDescription>
				</Alert>
				<Alert variant="danger">
					<AlertTitle>Terjadi kesalahan</AlertTitle>
					<AlertDescription>
						Data tidak dapat diproses. Silakan coba lagi.
					</AlertDescription>
				</Alert>
				<Alert variant="info">
					<AlertTitle>Catatan</AlertTitle>
					<AlertDescription>
						Pemeliharaan sistem dijadwalkan malam ini.
					</AlertDescription>
				</Alert>
			</div>
		</section>

		<section>
			<h3 class="mb-3 text-lg font-semibold">Alert Options</h3>
			<div class="flex flex-col gap-3">
				<Alert variant="success" bordered :closable="false">
					<AlertTitle>Bordered dan non-closable</AlertTitle>
					<AlertDescription>
						Alert ini selalu terlihat dan menggunakan border di sisi kiri.
					</AlertDescription>
				</Alert>
				<Alert variant="warning" outlined>
					<AlertTitle>Outlined</AlertTitle>
					<AlertDescription>
						Gunakan outlined untuk tampilan yang lebih ringan.
					</AlertDescription>
				</Alert>
				<Alert variant="info" :has-icon="false">
					<AlertTitle>Tanpa icon</AlertTitle>
					<AlertDescription>
						Konten alert tetap dapat digunakan tanpa icon bawaan.
					</AlertDescription>
				</Alert>
				<Alert variant="info">
					<AlertDescription>
						Konten alert tetap dapat digunakan tanpa title.
					</AlertDescription>
				</Alert>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@/components/alert'
</script>
