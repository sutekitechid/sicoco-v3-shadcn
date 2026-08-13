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
			<h3 class="font-semibold text-main">Dialog dengan input</h3>
			<p class="text-sm text-main">
				Gunakan input dengan lebar penuh agar tetap responsif di dalam dialog.
			</p>
			<Button outlined @click="isFormOpen = true">Ubah nama proyek</Button>

			<Dialog v-model:open="isFormOpen" size="sm">
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Ubah nama proyek</DialogTitle>
							Masukkan nama yang akan ditampilkan untuk proyek ini.
						</DialogHeader>
						
						<SFormInput @submit="isFormOpen = false">
						<DialogDescription>
							<div class="space-y-4">
								<div>
									<label for="project-name" class="mb-2 block text-sm font-medium text-main">
										Nama proyek
									</label>
									<Textarea
										id="project-name"
										v-model="projectName"
										required
										placeholder="Contoh: Website perusahaan"
									/>
								</div>
								<div>
									<label for="project-code" class="mb-2 block text-sm font-medium text-main">
										Kode proyek
									</label>
									<Input id="project-code" v-model="projectCode" placeholder="PRJ-001" />
								</div>
								<div>
									<label for="project-owner" class="mb-2 block text-sm font-medium text-main">
										Penanggung jawab
									</label>
									<Input id="project-owner" v-model="projectOwner" placeholder="Nama penanggung jawab" />
								</div>
								<div>
									<label for="project-email" class="mb-2 block text-sm font-medium text-main">
										Email penanggung jawab
									</label>
									<Input id="project-email" v-model="projectEmail" placeholder="nama@perusahaan.com" type="email" />
								</div>
								<div>
									<label for="project-phone" class="mb-2 block text-sm font-medium text-main">
										Nomor telepon
									</label>
									<Input id="project-phone" v-model="projectPhone" placeholder="08xxxxxxxxxx" />
								</div>
								<div>
									<label for="project-url" class="mb-2 block text-sm font-medium text-main">
										URL proyek
									</label>
									<Input id="project-url" v-model="projectUrl" placeholder="https://example.com" type="url" />
								</div>
								<div>
									<label for="project-department" class="mb-2 block text-sm font-medium text-main">
										Departemen
									</label>
									<Input id="project-department" v-model="projectDepartment" placeholder="Contoh: Produk" />
								</div>
							</div>
						</DialogDescription>
						<DialogFooter>
							<Button outlined @click="isFormOpen = false">Batal</Button>
							<Button type="submit">Simpan</Button>
						</DialogFooter>
						</SFormInput>
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

			<Dialog v-model:open="isDismissibleOpen" :close-on-click-outside="true" show-close>
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
import { FormInput as SFormInput } from '@/components/form-input'
import { Input } from '@/components/input'
import { Textarea } from '@/components/text-area'
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
const isFormOpen = ref(false)
const isLongContentOpen = ref(false)
const isDismissibleOpen = ref(false)
const isConfirmOpen = ref(false)
const isLegacyOpen = ref(false)
const isDeleted = ref(false)
const projectName = ref('')
const projectCode = ref('')
const projectOwner = ref('')
const projectEmail = ref('')
const projectPhone = ref('')
const projectUrl = ref('')
const projectDepartment = ref('')

const deleteProject = () => {
	isDeleted.value = true
	isConfirmOpen.value = false
}
</script>
