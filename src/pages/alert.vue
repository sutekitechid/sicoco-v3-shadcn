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

		<section>
			<h3 class="mb-3 text-lg font-semibold">Custom Icon</h3>
			<div class="mb-3 flex flex-wrap gap-2">
				<button
					v-for="icon in customIcons"
					:key="icon.class"
					type="button"
					:class="[
						'rounded-md border px-3 py-2 text-body-sm',
						selectedIcon === icon.class
							? 'border-primary-500 bg-primary-50 text-primary-700'
							: 'border-neutral-400 bg-white text-main',
					]"
					@click="selectedIcon = icon.class"
				>
					<i :class="icon.class" class="mr-1 inline-flex" />
					{{ icon.label }}
				</button>
			</div>
			<Alert variant="primary">
				<template #icon>
					<i :class="selectedIcon" />
				</template>
				<AlertTitle>Icon custom</AlertTitle>
				<AlertDescription>
					Pilih icon di atas untuk mengganti icon alert ini.
				</AlertDescription>
			</Alert>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@/components/alert'

const customIcons = [
	{ label: 'Info', class: 'si-heroicon-solid-information-circle' },
	{ label: 'Bell', class: 'si-heroicon-solid-bell-alert' },
	{ label: 'Shield', class: 'si-heroicon-solid-shield-check' },
]

const selectedIcon = ref(customIcons[0].class)
</script>
