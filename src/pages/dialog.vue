<template>
	<div class="flex max-w-4xl flex-col gap-8 p-4 sm:p-6">
		<div>
			<h2 class="text-2xl font-semibold text-main">Dialog</h2>
			<p class="text-main">
				Gunakan dialog untuk meminta konfirmasi atau menampilkan informasi tanpa
				meninggalkan halaman saat ini.
			</p>
		</div>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Dialog standar</h3>
			<p class="text-sm text-main">
				Dialog ini hanya dapat ditutup melalui tombol yang tersedia.
			</p>
			<Button @click="isInfoOpen = true">Buka dialog</Button>

			<Dialog v-model:open="isInfoOpen">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Perubahan tersimpan</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						Data profil Anda berhasil diperbarui.
					</DialogDescription>
					<DialogFooter>
						<Button  @click="isInfoOpen = false">Mengerti</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Konten panjang</h3>
			<p class="text-sm text-main">
				Area <code>DialogDescription</code> akan memiliki scroll saat kontennya
				melebihi tinggi maksimum.
			</p>
			<Button outlined @click="isLongContentOpen = true">
				Buka dialog konten panjang
			</Button>

			<Dialog v-model:open="isLongContentOpen" size="md">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ketentuan penggunaan</DialogTitle>
					</DialogHeader>
					<DialogDescription class="space-y-3 pr-3">
						<span v-for="index in 12" :key="index" class="block">
							{{ index }}. Dengan melanjutkan, Anda menyetujui ketentuan penggunaan
							dan kebijakan privasi yang berlaku pada layanan ini.
						</span>
					</DialogDescription>
					<DialogFooter class="border-t-1 border-main">
						<Button  @click="isLongContentOpen = false">
							Saya mengerti
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Dialog Header dan Footer</h3>
			<p class="text-sm text-main">
				Gunakan <code>DialogHeader</code> untuk judul dan
				<code>DialogFooter</code> untuk mengelompokkan aksi dialog.
			</p>
			<Button outlined @click="isHeaderFooterOpen = true">
				Buka dialog dengan header dan footer
			</Button>

			<Dialog v-model:open="isHeaderFooterOpen" size="md">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Pengaturan notifikasi</DialogTitle>
						<span class="text-sm text-neutral-500">Email mingguan</span>
					</DialogHeader>
					<DialogDescription>
						Anda akan menerima rangkuman aktivitas setiap hari Senin.
					</DialogDescription>
					<DialogFooter>
						<Button  outlined @click="isHeaderFooterOpen = false">
							Batal
						</Button>
						<Button  @click="isHeaderFooterOpen = false">
							Simpan pengaturan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Klik di luar dialog</h3>
			<p class="text-sm text-main">
				Aktifkan <code>close-on-click-outside</code> untuk menutup dialog saat
				pengguna mengklik overlay.
			</p>
			<Button outlined @click="isDismissibleOpen = true">
				Buka dialog dismissible
			</Button>

			<Dialog v-model:open="isDismissibleOpen" :close-on-click-outside="true">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Informasi tambahan</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						Klik area gelap di luar dialog atau tombol berikut untuk menutupnya.
					</DialogDescription>
					<DialogFooter>
						<Button  outlined @click="isDismissibleOpen = false">
							Tutup
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Konfirmasi aksi</h3>
			<p class="text-sm text-main">
				Gunakan aksi destruktif dengan dialog konfirmasi untuk mencegah tindakan
				tidak disengaja.
			</p>
			<Button variant="danger" @click="isConfirmOpen = true">
				Hapus proyek
			</Button>
			<p v-if="isDeleted" class="text-sm text-success-default">
				Proyek telah dihapus.
			</p>

			<Dialog v-model:open="isConfirmOpen">
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Hapus proyek?</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						Aksi ini tidak dapat dibatalkan. Semua data proyek akan dihapus secara
						permanen.
					</DialogDescription>
					<DialogFooter>
						<Button  outlined @click="isConfirmOpen = false">
							Batal
						</Button>
						<Button  variant="danger" @click="deleteProject">
							Hapus proyek
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>

		<section class="rounded-lg border border-neutral-200 p-5">
			<h3 class="font-semibold text-main">Kompatibilitas slot lama</h3>
			<p class="text-sm text-main">
				Dialog tetap dapat digunakan hanya dengan <code>Dialog</code> dan
				<code>DialogContent</code>.
			</p>
			<Button outlined @click="isLegacyOpen = true">
				Buka dialog legacy
			</Button>

			<Dialog v-model:open="isLegacyOpen">
				<DialogContent class="w-[calc(100%-2rem)] max-w-md">
					<h4 class="font-semibold text-main">Dialog legacy</h4>
					<p class="text-sm text-main">
						Konten slot langsung tetap ditampilkan tanpa memakai subkomponen baru.
					</p>
					<Button  @click="isLegacyOpen = false">
						Tutup
					</Button>
				</DialogContent>
			</Dialog>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/button/Button.vue'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/dialog'

const isInfoOpen = ref(false)
const isHeaderFooterOpen = ref(false)
const isLongContentOpen = ref(false)
const isDismissibleOpen = ref(false)
const isConfirmOpen = ref(false)
const isLegacyOpen = ref(false)
const isDeleted = ref(false)

const deleteProject = () => {
	isDeleted.value = true
	isConfirmOpen.value = false
}
</script>
