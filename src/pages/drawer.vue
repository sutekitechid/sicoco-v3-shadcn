<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/button'
import { Checkbox } from '@/components/checkbox'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/drawer'
import { Dropdown, DropdownItem } from '@/components/dropdown'
import { FormFilter } from '@/components/form-filter'

const bottomOpen = ref(false)
const protectedDrawerOpen = ref(false)
const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)
const pageFilterDrawerOpen = ref(false)

const pageFilterInitial = {
	year: '2024',
	unit: 'S2 Sistem Informasi',
	status: [] as string[],
}
const pageFilterApplied = ref({
	...pageFilterInitial,
	status: [...pageFilterInitial.status],
})

function formatStatuses(status: string[]) {
	if (status.length === 0) return '-'
	return status.join(', ')
}

function handlePageFilterApply(filters: Record<string, unknown>) {
	pageFilterApplied.value = {
		year: String(filters.year ?? ''),
		unit: String(filters.unit ?? ''),
		status: Array.isArray(filters.status) ? filters.status.map(String) : [],
	}
}

function handlePageFilterReset() {
	pageFilterApplied.value = {
		...pageFilterInitial,
		status: [...pageFilterInitial.status],
	}
}
</script>

<template>
	<div class="flex max-w-4xl flex-col gap-8 p-4 sm:p-6">
		<div>
			<h2 class="text-heading-md font-semibold text-main">Drawer</h2>
			<p class="text-body-md text-secondary">
				Panel modal yang dapat ditutup dengan Escape, klik luar, tombol, atau swipe.
			</p>
		</div>

		<section class="space-y-3 rounded-lg border border-main p-5">
			<h3 class="text-title-md font-semibold text-main">Drawer bawah</h3>
			<p class="text-body-md text-secondary">
				Gunakan header, konten, dan footer untuk susunan aksi yang konsisten.
			</p>
			<Drawer v-model:open="bottomOpen">
				<DrawerTrigger as-child>
					<Button>Buka drawer</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Perubahan tersimpan</DrawerTitle>
						<DrawerDescription>Data profil Anda berhasil diperbarui.</DrawerDescription>
					</DrawerHeader>
					<div class="p-4 text-body-md text-main">
						Anda dapat melanjutkan menggunakan aplikasi.
					</div>
					<DrawerFooter>
						<Button @click="bottomOpen = false">Mengerti</Button>
						<DrawerClose />
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</section>

		<section class="space-y-3 rounded-lg border border-main p-5">
			<h3 class="text-title-md font-semibold text-main">Drawer tanpa tutup klik luar</h3>
			<p class="text-body-md text-secondary">
				Klik overlay tidak menutup drawer. Tutup melalui aksi yang tersedia atau ubah state secara programatis.
			</p>
			<Drawer v-model:open="protectedDrawerOpen" :close-on-click-outside="false" swipe-direction="right">
				<DrawerTrigger as-child>
					<Button outlined>Buka drawer terlindungi</Button>
				</DrawerTrigger>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Konfirmasi tindakan</DrawerTitle>
						<DrawerDescription>Gunakan tombol di bawah untuk menutup drawer ini.</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<Button @click="protectedDrawerOpen = false">Tutup drawer</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</section>

		<section class="space-y-3 rounded-lg border border-main p-5">
			<h3 class="text-title-md font-semibold text-main">Drawer sisi layar</h3>
			<p class="text-body-md text-secondary">
				Drawer kiri dan kanan tampil sebagai panel penuh setinggi viewport.
			</p>
			<div class="flex flex-wrap gap-3">
				<Drawer v-model:open="leftDrawerOpen" swipe-direction="left">
					<DrawerTrigger as-child>
						<Button outlined>Buka dari kiri</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Panel kiri</DrawerTitle>
							<DrawerDescription>Contoh panel navigasi atau detail dari sisi kiri.</DrawerDescription>
						</DrawerHeader>
						<DrawerClose />
						<div class="flex-1 space-y-3 overflow-y-auto px-6 pb-6">
							<p v-for="index in 10" :key="index" class="border-b border-main pb-3 text-body-md text-main">
								Item panel kiri {{ index }}
							</p>
						</div>
						<DrawerFooter>
							<Button @click="leftDrawerOpen = false">Tutup panel</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>

				<Drawer v-model:open="rightDrawerOpen" swipe-direction="right">
					<DrawerTrigger as-child>
						<Button outlined>Buka dari kanan</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Panel kanan</DrawerTitle>
							<DrawerDescription>Contoh panel pengaturan atau filter dari sisi kanan.</DrawerDescription>
						</DrawerHeader>
						<DrawerClose />
						<div class="flex-1 space-y-3 overflow-y-auto px-6 pb-6">
							<p v-for="index in 10" :key="index" class="border-b border-main pb-3 text-body-md text-main">
								Item panel kanan {{ index }}
							</p>
						</div>
						<DrawerFooter>
							<Button @click="rightDrawerOpen = false">Tutup panel</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>
		</section>

		<FormFilter
			:initial-filter="pageFilterInitial"
			:current-filter="pageFilterApplied"
			@apply="handlePageFilterApply"
			@reset="handlePageFilterReset"
		>
			<template #default="{ filters, dirty, apply, reset }">
				<section class="space-y-4 rounded-lg border border-main p-5">
					<div>
						<h3 class="text-title-md font-semibold text-main">Filter halaman dengan drawer</h3>
						<p class="text-body-md text-secondary">
							Terapkan filter dari halaman. Drawer hanya menampilkan field filter tambahan.
						</p>
					</div>
					<div class="flex flex-wrap items-end gap-2">
						<div class="w-full sm:w-32">
							<label class="mb-1 block text-label-md font-medium text-main">Tahun</label>
							<Dropdown v-model="filters.year" placeholder="Pilih tahun" size="sm">
								<DropdownItem value="2024">2024</DropdownItem>
								<DropdownItem value="2025">2025</DropdownItem>
								<DropdownItem value="2026">2026</DropdownItem>
							</Dropdown>
						</div>
						<div class="w-full sm:w-64">
							<label class="mb-1 block text-label-md font-medium text-main">Unit</label>
							<Dropdown v-model="filters.unit" placeholder="Pilih unit" size="sm">
								<DropdownItem value="S2 Sistem Informasi">S2 Sistem Informasi</DropdownItem>
								<DropdownItem value="S1 Informatika">S1 Informatika</DropdownItem>
								<DropdownItem value="S1 Sistem Informasi">S1 Sistem Informasi</DropdownItem>
							</Dropdown>
						</div>
						<Drawer v-model:open="pageFilterDrawerOpen" swipe-direction="right">
							<DrawerTrigger as-child>
								<Button outlined size="sm">Filter lainnya</Button>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>Filter Lainnya</DrawerTitle>
									<DrawerDescription>Ubah filter tambahan, lalu terapkan dari halaman.</DrawerDescription>
								</DrawerHeader>
								<DrawerClose />
								<div class="flex-1 space-y-3 overflow-y-auto px-6 pb-6">
									<p class="text-label-lg font-medium text-main">Status</p>
									<Checkbox v-model="filters.status" value="active">Aktif</Checkbox>
									<Checkbox v-model="filters.status" value="draft">Draf</Checkbox>
									<Checkbox v-model="filters.status" value="archived">Diarsipkan</Checkbox>
								</div>
							</DrawerContent>
						</Drawer>
						<div class="flex items-center gap-1">
							<Button :disabled="!dirty" size="sm" @click="apply">Tampilkan Hasil</Button>
							<Button variant="link-primary" size="sm" @click="reset">Reset</Button>
						</div>
					</div>
					<div class="grid gap-3 border-t border-main pt-4 sm:grid-cols-2">
						<div class="space-y-2 rounded-lg bg-neutral-50 p-3">
							<p class="text-label-lg font-semibold text-main">Initial filter</p>
							<dl class="space-y-1 text-body-sm text-secondary">
								<div class="flex justify-between gap-3"><dt>Tahun</dt><dd class="text-main">{{ pageFilterInitial.year }}</dd></div>
								<div class="flex justify-between gap-3"><dt>Unit</dt><dd class="text-right text-main">{{ pageFilterInitial.unit }}</dd></div>
								<div class="flex justify-between gap-3"><dt>Status</dt><dd class="text-main">{{ formatStatuses(pageFilterInitial.status) }}</dd></div>
							</dl>
						</div>
						<div class="space-y-2 rounded-lg bg-primary-subtle p-3">
							<p class="text-label-lg font-semibold text-main">Applied filter</p>
							<dl class="space-y-1 text-body-sm text-secondary">
								<div class="flex justify-between gap-3"><dt>Tahun</dt><dd class="text-main">{{ pageFilterApplied.year }}</dd></div>
								<div class="flex justify-between gap-3"><dt>Unit</dt><dd class="text-right text-main">{{ pageFilterApplied.unit }}</dd></div>
								<div class="flex justify-between gap-3"><dt>Status</dt><dd class="text-main">{{ formatStatuses(pageFilterApplied.status) }}</dd></div>
							</dl>
						</div>
					</div>
				</section>
			</template>
		</FormFilter>
	</div>
</template>
